/**
 * FieldPulse Core Backend Server
 * Express REST API + WebSocket Real-Time Telematics & Sync Engine
 */

const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');

const db = require('./db');
const AIService = require('./aiService');
const GeofenceService = require('./geofenceService');
const ReportScorer = require('./reportScorer');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.static(path.join(__dirname, '../../public')));

// Simple In-memory WebSocket or Event Bus
const clients = new Set();

// Basic SSE / WebSocket-like live event emitter
function broadcastEvent(event, data) {
  const payload = JSON.stringify({ event, data, timestamp: new Date().toISOString() });
  for (const res of clients) {
    res.write(`data: ${payload}\n\n`);
  }
}

// Live SSE Stream endpoint
app.get('/api/events/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  clients.add(res);
  req.on('close', () => {
    clients.delete(res);
  });
});

/* =========================================================================
   REST API Endpoints
   ========================================================================= */

// 1. Projects & Geofences
app.get('/api/projects', (req, res) => {
  res.json({ success: true, projects: db.projects });
});

// 2. Crew & Attendance
app.get('/api/crew', (req, res) => {
  res.json({ success: true, crew: db.crewMembers });
});

// 3. Equipment & Telematics
app.get('/api/equipment', (req, res) => {
  res.json({ success: true, equipment: db.equipment });
});

app.get('/api/telematics/events', (req, res) => {
  res.json({ success: true, events: db.telematicsEvents });
});

// 4. Daily Logs & Health Scoring
app.get('/api/daily-logs', (req, res) => {
  res.json({ success: true, logs: db.dailyLogs });
});

app.get('/api/daily-logs/:id', (req, res) => {
  const log = db.dailyLogs.find(l => l.id === req.params.id);
  if (!log) return res.status(404).json({ success: false, error: 'Daily log not found' });
  res.json({ success: true, log });
});

app.post('/api/daily-logs', (req, res) => {
  const payload = req.body;
  const newLog = {
    id: `log-${Date.now()}`,
    projectId: payload.projectId || 'proj-101',
    date: payload.date || new Date().toISOString().split('T')[0],
    superintendent: payload.superintendent || 'Marcus Vance',
    status: 'pending_review',
    weather: payload.weather || {
      summary: 'Clear, 72°F',
      wind: '5 mph',
      precipitation: '0.0 in',
      impact: 'Optimal working conditions'
    },
    laborEntries: payload.laborEntries || [],
    equipmentEntries: payload.equipmentEntries || [],
    materials: payload.materials || [],
    delays: payload.delays || [],
    photos: payload.photos || [],
    notes: payload.notes || ''
  };

  // Calculate live health score
  newLog.healthScore = ReportScorer.calculateHealthScore(newLog);

  db.dailyLogs.unshift(newLog);
  broadcastEvent('NEW_DAILY_LOG', newLog);
  res.status(201).json({ success: true, log: newLog });
});

app.put('/api/daily-logs/:id/status', (req, res) => {
  const { status, approvedBy, comment } = req.body;
  const log = db.dailyLogs.find(l => l.id === req.params.id);
  if (!log) return res.status(404).json({ success: false, error: 'Daily log not found' });

  log.status = status;
  log.approvedBy = approvedBy || 'Executive Reviewer';
  log.approvedAt = new Date().toLocaleString();
  log.reviewComment = comment || 'Approved for project record and payroll export.';

  broadcastEvent('DAILY_LOG_STATUS_CHANGED', log);
  res.json({ success: true, log });
});

// 5. AI Services: Voice-to-Structured-Log
app.post('/api/ai/voice-parse', (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript) {
      return res.status(400).json({ success: false, error: 'Transcript required' });
    }
    const structuredResult = AIService.parseVoiceNoteToDailyReport(transcript);
    res.json({ success: true, data: structuredResult });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. AI Services: Computer Vision Site Photo Tagger
app.post('/api/ai/vision-tag', (req, res) => {
  try {
    const photoMetadata = AIService.analyzeSitePhoto(req.body);
    res.json({ success: true, photo: photoMetadata });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Geofence Location Ping & Auto Clock-in Trigger
app.post('/api/geofence/ping', (req, res) => {
  try {
    const { entityType, entityId, name, lat, lng } = req.body;
    const result = GeofenceService.processLocationPing(
      { entityType: entityType || 'crew', entityId: entityId || 'crew-mobile', name: name || 'Field Tech', lat, lng },
      db.projects
    );

    // If inside geofence, trigger event
    if (result.status === 'inside_geofence') {
      const eventRecord = {
        id: `tel-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        entityType: result.entityType,
        entityId: result.entityId,
        name: result.name,
        event: 'GEOFENCE_ACTIVE_PRESENCE',
        zone: result.project,
        lat,
        lng,
        action: 'Automated Shift Presence Verified'
      };
      db.telematicsEvents.unshift(eventRecord);
      broadcastEvent('TELEMATICS_EVENT', eventRecord);
    }

    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Offline Queue Batch Synchronization
app.post('/api/sync/batch', (req, res) => {
  const { queue } = req.body;
  if (!Array.isArray(queue)) {
    return res.status(400).json({ success: false, error: 'Queue must be an array' });
  }

  const processed = [];
  for (const item of queue) {
    if (item.type === 'DAILY_LOG') {
      const newLog = {
        id: `log-sync-${Date.now()}-${Math.floor(Math.random()*1000)}`,
        projectId: item.data.projectId || 'proj-101',
        date: item.data.date || new Date().toISOString().split('T')[0],
        superintendent: item.data.superintendent || 'Field Tech (Offline Sync)',
        status: 'pending_review',
        weather: item.data.weather || { summary: 'Auto-detected via location' },
        laborEntries: item.data.laborEntries || [],
        equipmentEntries: item.data.equipmentEntries || [],
        materials: item.data.materials || [],
        delays: item.data.delays || [],
        photos: item.data.photos || [],
        notes: item.data.notes || 'Submitted via Offline Field Sync'
      };
      newLog.healthScore = ReportScorer.calculateHealthScore(newLog);
      db.dailyLogs.unshift(newLog);
      processed.push({ id: item.id, status: 'synced', serverId: newLog.id });
    }
  }

  broadcastEvent('OFFLINE_BATCH_SYNCED', { count: processed.length });
  res.json({ success: true, processedCount: processed.length, results: processed });
});

// 9. Safety Audits
app.get('/api/safety', (req, res) => {
  res.json({ success: true, audits: db.safetyAudits });
});

// Default fallback to single page app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` FieldPulse Enterprise Server Running on port ${PORT}`);
  console.log(` Web Command Center: http://localhost:${PORT}`);
  console.log(` API & Real-Time Sync Stream: http://localhost:${PORT}/api/events/stream`);
  console.log(`=======================================================`);
});
