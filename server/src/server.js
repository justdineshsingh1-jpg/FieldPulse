/**
 * FieldPulse High-Performance Standalone HTTP & Real-Time SSE Server
 * Zero-dependency native Node.js runtime for instant startup & maximum portability.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const db = require('./db');
const AIService = require('./aiService');
const GeofenceService = require('./geofenceService');
const ReportScorer = require('./reportScorer');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, '../../public');

// Active Real-Time SSE Clients
const sseClients = new Set();

function broadcastEvent(event, data) {
  const payload = JSON.stringify({ event, data, timestamp: new Date().toISOString() });
  for (const client of sseClients) {
    client.write(`data: ${payload}\n\n`);
  }
}

// MIME Types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Request Parser Helper
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  // --- 1. Real-Time SSE Stream Endpoint ---
  if (pathname === '/api/events/stream' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
    res.write(': connected\n\n');
    sseClients.add(res);
    req.on('close', () => {
      sseClients.delete(res);
    });
    return;
  }

  // --- 2. REST API Routes ---
  if (pathname.startsWith('/api/')) {
    try {
      if (pathname === '/api/projects' && req.method === 'GET') {
        return sendJson(res, 200, { success: true, projects: db.projects });
      }

      if (pathname === '/api/crew' && req.method === 'GET') {
        return sendJson(res, 200, { success: true, crew: db.crewMembers });
      }

      if (pathname.match(/^\/api\/crew\/[^\/]+\/route$/) && req.method === 'GET') {
        const id = pathname.split('/')[3];
        const member = db.crewMembers.find(c => c.id === id);
        if (!member) return sendJson(res, 404, { success: false, error: 'Crew member not found' });
        return sendJson(res, 200, {
          success: true,
          crewId: member.id,
          name: member.name,
          totalDistanceKm: member.totalDistanceKm || 0,
          totalSteps: member.totalSteps || 0,
          activeHours: member.activeHours || 0,
          routeColor: member.routeColor || '#f59e0b',
          breadcrumbs: member.breadcrumbs || []
        });
      }

      if (pathname === '/api/agent/profile' && req.method === 'GET') {
        return sendJson(res, 200, { success: true, profile: db.agentProfile });
      }

      if (pathname === '/api/agent/profile' && req.method === 'POST') {
        const payload = await parseJsonBody(req);
        if (payload.name) db.agentProfile.name = payload.name;
        if (payload.email) db.agentProfile.email = payload.email;
        if (payload.photoUrl) db.agentProfile.photoUrl = payload.photoUrl;
        if (payload.initial) db.agentProfile.initial = payload.initial;
        return sendJson(res, 200, { success: true, profile: db.agentProfile });
      }

      if (pathname === '/api/agent/routes' && req.method === 'GET') {
        const date = parsedUrl.query.date || '2026-08-30';
        const routeData = db.historicalRoutes[date] || {
          date: date,
          totalDistanceKm: 0,
          duration: "00:00:00",
          avgSpeed: "0.0 km/h",
          checkIns: [],
          breadcrumbs: []
        };
        return sendJson(res, 200, { success: true, route: routeData, availableDates: Object.keys(db.historicalRoutes) });
      }

      if (pathname === '/api/agent/routes' && req.method === 'POST') {
        const payload = await parseJsonBody(req);
        const date = payload.date || new Date().toISOString().split('T')[0];
        if (!db.historicalRoutes[date]) {
          db.historicalRoutes[date] = {
            date: date,
            totalDistanceKm: 0,
            duration: "00:00:00",
            avgSpeed: "0.0 km/h",
            checkIns: [],
            breadcrumbs: []
          };
        }
        if (payload.breadcrumbs) db.historicalRoutes[date].breadcrumbs = payload.breadcrumbs;
        if (payload.totalDistanceKm !== undefined) db.historicalRoutes[date].totalDistanceKm = payload.totalDistanceKm;
        if (payload.checkIns) db.historicalRoutes[date].checkIns = payload.checkIns;
        if (payload.duration) db.historicalRoutes[date].duration = payload.duration;
        return sendJson(res, 200, { success: true, route: db.historicalRoutes[date] });
      }

      if (pathname === '/api/equipment' && req.method === 'GET') {
        return sendJson(res, 200, { success: true, equipment: db.equipment });
      }

      if (pathname === '/api/telematics/events' && req.method === 'GET') {
        return sendJson(res, 200, { success: true, events: db.telematicsEvents });
      }

      if (pathname === '/api/safety' && req.method === 'GET') {
        return sendJson(res, 200, { success: true, audits: db.safetyAudits });
      }

      if (pathname === '/api/daily-logs' && req.method === 'GET') {
        return sendJson(res, 200, { success: true, logs: db.dailyLogs });
      }

      if (pathname.match(/^\/api\/daily-logs\/[^\/]+$/) && req.method === 'GET') {
        const id = pathname.split('/').pop();
        const log = db.dailyLogs.find(l => l.id === id);
        if (!log) return sendJson(res, 404, { success: false, error: 'Daily log not found' });
        return sendJson(res, 200, { success: true, log });
      }

      if (pathname === '/api/daily-logs' && req.method === 'POST') {
        const payload = await parseJsonBody(req);
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

        newLog.healthScore = ReportScorer.calculateHealthScore(newLog);
        db.dailyLogs.unshift(newLog);
        broadcastEvent('NEW_DAILY_LOG', newLog);
        return sendJson(res, 201, { success: true, log: newLog });
      }

      if (pathname.match(/^\/api\/daily-logs\/[^\/]+\/status$/) && req.method === 'PUT') {
        const parts = pathname.split('/');
        const id = parts[3];
        const payload = await parseJsonBody(req);
        const log = db.dailyLogs.find(l => l.id === id);
        if (!log) return sendJson(res, 404, { success: false, error: 'Daily log not found' });

        log.status = payload.status || 'approved';
        log.approvedBy = payload.approvedBy || 'Executive Reviewer';
        log.approvedAt = new Date().toLocaleString();
        log.reviewComment = payload.comment || 'Approved for project record and payroll export.';

        broadcastEvent('DAILY_LOG_STATUS_CHANGED', log);
        return sendJson(res, 200, { success: true, log });
      }

      if (pathname === '/api/ai/voice-parse' && req.method === 'POST') {
        const payload = await parseJsonBody(req);
        if (!payload.transcript) {
          return sendJson(res, 400, { success: false, error: 'Transcript required' });
        }
        const data = AIService.parseVoiceNoteToDailyReport(payload.transcript);
        return sendJson(res, 200, { success: true, data });
      }

      if (pathname === '/api/ai/vision-tag' && req.method === 'POST') {
        const payload = await parseJsonBody(req);
        const photo = AIService.analyzeSitePhoto(payload);
        return sendJson(res, 200, { success: true, photo });
      }

      if (pathname === '/api/geofence/ping' && req.method === 'POST') {
        const payload = await parseJsonBody(req);
        const result = GeofenceService.processLocationPing(
          {
            entityType: payload.entityType || 'crew',
            entityId: payload.entityId || 'crew-mobile',
            name: payload.name || 'Field Tech',
            lat: payload.lat,
            lng: payload.lng
          },
          db.projects
        );

        if (result.status === 'inside_geofence') {
          const eventRecord = {
            id: `tel-${Date.now()}`,
            timestamp: new Date().toLocaleString(),
            entityType: result.entityType,
            entityId: result.entityId,
            name: result.name,
            event: 'GEOFENCE_ACTIVE_PRESENCE',
            zone: result.project,
            lat: payload.lat,
            lng: payload.lng,
            action: 'Automated Shift Presence Verified'
          };
          db.telematicsEvents.unshift(eventRecord);
          broadcastEvent('TELEMATICS_EVENT', eventRecord);
        }

        return sendJson(res, 200, { success: true, result });
      }

      if (pathname === '/api/sync/batch' && req.method === 'POST') {
        const payload = await parseJsonBody(req);
        const queue = payload.queue || [];
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
        return sendJson(res, 200, { success: true, processedCount: processed.length, results: processed });
      }

      return sendJson(res, 404, { success: false, error: 'API route not found' });
    } catch (err) {
      console.error('API Error:', err);
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // --- 3. Static File Server ---
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(PUBLIC_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'text/plain';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` 🚀 FieldPulse Enterprise Platform Live on Port ${PORT}`);
  console.log(` 🌐 Web Command Center & Mobile App: http://localhost:${PORT}`);
  console.log(` 📡 Real-Time SSE Stream: http://localhost:${PORT}/api/events/stream`);
  console.log(`=======================================================`);
});
