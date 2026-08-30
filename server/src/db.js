/**
 * FieldPulse Database - Guwahati, Assam Infrastructure & Telematics Data
 */

const db = {
  projects: [
    {
      id: "proj-ghy-01",
      name: "Guwahati Brahmaputra Riverfront Development",
      client: "Guwahati Smart City Limited (GSCL) / PWD Assam",
      code: "GSCL-BFR-2026",
      status: "active",
      location: {
        address: "MG Road, Panbazar to Fancy Bazar, Guwahati, Assam 781001",
        center: [26.1882, 91.7435],
        geofence: [
          [26.1915, 91.7375],
          [26.1920, 91.7490],
          [26.1850, 91.7495],
          [26.1845, 91.7370]
        ],
        radiusMeters: 450
      },
      headcountOnSite: 42,
      superintendent: "Bikash Sharma (Chief Resident Engineer)",
      budgetHours: 18500,
      spentHours: 7240
    },
    {
      id: "proj-ghy-02",
      name: "Guwahati-North Guwahati 6-Lane Brahmaputra Bridge Project",
      client: "Public Works Roads Department (PWRD), Assam",
      code: "AS-PWRD-BR-901",
      status: "active",
      location: {
        address: "Bharalumukh Bank to Majgaon Ghat, Guwahati, Assam",
        center: [26.1920, 91.7180],
        geofence: [
          [26.1980, 91.7110],
          [26.1990, 91.7260],
          [26.1850, 91.7250],
          [26.1840, 91.7100]
        ],
        radiusMeters: 550
      },
      headcountOnSite: 65,
      superintendent: "Anurag Barua (Project Director)",
      budgetHours: 28000,
      spentHours: 11420
    }
  ],

  agentProfile: {
    name: "Dinesh Kumar Singh",
    email: "dinesh.singh@dhanpurna.net",
    initial: "DS",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },

  historicalRoutes: {
    "2026-08-30": {
      date: "2026-08-30",
      totalDistanceKm: 0.0,
      duration: "00:00:00",
      avgSpeed: "0.0 km/h",
      breadcrumbs: []
    },
    "2026-08-29": {
      date: "2026-08-29",
      totalDistanceKm: 12.6,
      duration: "06:15:00",
      avgSpeed: "6.2 km/h",
      checkIns: [
        "09:15 AM - Guwahati High Court Road Site",
        "11:45 AM - Uzanbazar River Pier Section",
        "03:10 PM - Fancy Bazar Market Trenching"
      ],
      breadcrumbs: [
        { lat: 26.1840, lng: 91.7350, time: "06:45 AM", label: "Starting Point (Fancy Bazar Yard)", speedKmh: 2.0, isStationary: false },
        { lat: 26.1860, lng: 91.7390, time: "09:15 AM", label: "Guwahati High Court Road (3.8 km)", speedKmh: 6.5, isStationary: false },
        { lat: 26.1890, lng: 91.7460, time: "11:45 AM", label: "Uzanbazar River Pier (7.4 km)", speedKmh: 5.9, isStationary: false },
        { lat: 26.1870, lng: 91.7410, time: "03:10 PM", label: "Fancy Bazar Market Trenching (10.2 km)", speedKmh: 6.1, isStationary: false },
        { lat: 26.1850, lng: 91.7370, time: "05:00 PM", label: "Day End: Fancy Bazar Hub (12.6 km)", speedKmh: 3.2, isStationary: false }
      ]
    },
    "2026-08-28": {
      date: "2026-08-28",
      totalDistanceKm: 9.8,
      duration: "05:00:00",
      avgSpeed: "5.1 km/h",
      checkIns: [
        "10:00 AM - Bharalumukh Sluice Gate",
        "01:30 PM - Machkhowa Riverside Promenade",
        "04:15 PM - Panbazar Sector 4"
      ],
      breadcrumbs: [
        { lat: 26.1820, lng: 91.7300, time: "07:00 AM", label: "Starting Point (Bharalumukh Base)", speedKmh: 1.8, isStationary: false },
        { lat: 26.1845, lng: 91.7340, time: "10:00 AM", label: "Bharalumukh Sluice Gate (3.1 km)", speedKmh: 4.9, isStationary: false },
        { lat: 26.1870, lng: 91.7400, time: "01:30 PM", label: "Machkhowa Riverside Promenade (6.5 km)", speedKmh: 5.5, isStationary: false },
        { lat: 26.1885, lng: 91.7435, time: "04:15 PM", label: "Day End: Panbazar Sector 4 (9.8 km)", speedKmh: 4.8, isStationary: false }
      ]
    }
  },

  crewMembers: [
    {
      id: "crew-1",
      name: "Debojit Kalita (Lead QA/QC)",
      trade: "Quality Assurance & Marine Piling QA",
      company: "Larsen & Toubro / Assam Infra Consortium",
      status: "on_site",
      checkedInAt: "06:30 AM IST",
      coords: [26.1885, 91.7440],
      totalDistanceKm: 5.20,
      totalSteps: 6850,
      activeHours: 4.8,
      routeColor: "#f59e0b",
      breadcrumbs: [
        { lat: 26.1852, lng: 91.7380, time: "06:30 AM", label: "Gate 1 - Panbazar Entrance Check-in", speedKmh: 1.5 },
        { lat: 26.1865, lng: 91.7405, time: "07:15 AM", label: "RMC Batching Plant & Staging Area", speedKmh: 3.2 },
        { lat: 26.1880, lng: 91.7428, time: "08:30 AM", label: "Pier P-4 Diaphragm Wall Concrete Inspection", speedKmh: 2.0 },
        { lat: 26.1895, lng: 91.7450, time: "10:15 AM", label: "Riverfront Promenade Deck Slab Rebar Check", speedKmh: 1.8 },
        { lat: 26.1908, lng: 91.7475, time: "12:00 PM", label: "North Embankment Geotextile Slope Protection", speedKmh: 3.5 },
        { lat: 26.1888, lng: 91.7482, time: "01:30 PM", label: "Site Engineering Office & Technical Review", speedKmh: 0.0 },
        { lat: 26.1878, lng: 91.7445, time: "03:00 PM", label: "Sany Crane Rigging & Safety Perimeter Check", speedKmh: 2.4 },
        { lat: 26.1885, lng: 91.7440, time: "04:30 PM", label: "Current: Central Riverfront Jetty Deck", speedKmh: 1.2 }
      ]
    },
    {
      id: "crew-2",
      name: "Pranab Dutta (Steel Foreman)",
      trade: "Structural Steel & Deep Piling",
      company: "Brahmaputra Marine Works Ltd.",
      status: "on_site",
      checkedInAt: "07:00 AM IST",
      coords: [26.1878, 91.7430],
      totalDistanceKm: 3.45,
      totalSteps: 4600,
      activeHours: 3.9,
      routeColor: "#0284c7",
      breadcrumbs: [
        { lat: 26.1855, lng: 91.7385, time: "07:00 AM", label: "Gate 2 - Fancy Bazar Staging Yard", speedKmh: 2.1 },
        { lat: 26.1870, lng: 91.7410, time: "08:45 AM", label: "Piling Rig Sector 2 & Casing Alignment", speedKmh: 2.8 },
        { lat: 26.1885, lng: 91.7440, time: "11:30 AM", label: "Pier Cap Grouting & Anchor Bolts Torque", speedKmh: 1.4 },
        { lat: 26.1878, lng: 91.7430, time: "03:30 PM", label: "Current: Steel Girders Assembly Zone", speedKmh: 1.1 }
      ]
    },
    { id: "crew-3", name: "Nabajit Saikia", trade: "Electrical MEP & Riverfront Illumination", company: "Assam Power Tech Contractors", status: "on_site", checkedInAt: "07:15 AM IST", coords: [26.1890, 91.7460], totalDistanceKm: 2.30, totalSteps: 3100, activeHours: 2.8, routeColor: "#10b981", breadcrumbs: [] },
    { id: "crew-4", name: "Rupankar Das", trade: "Marine Hydraulics & Dewatering", company: "Jorhat Marine Services", status: "on_site", checkedInAt: "07:10 AM IST", coords: [26.1868, 91.7415], totalDistanceKm: 1.95, totalSteps: 2600, activeHours: 2.2, routeColor: "#8b5cf6", breadcrumbs: [] },
    { id: "crew-5", name: "Rakesh Bora", trade: "Roadway Paving & Finishes", company: "Kamrup Builders & Infra", status: "off_site", checkedInAt: null, coords: null, totalDistanceKm: 0, totalSteps: 0, activeHours: 0, breadcrumbs: [] }
  ],

  equipment: [
    {
      id: "eq-HITACHI210",
      name: "Tata Hitachi EX 210LC Excavator #04",
      type: "Heavy Excavator",
      projectId: "proj-ghy-01",
      status: "active_operating",
      engineHoursToday: 6.8,
      idleHoursToday: 0.6,
      fuelLevelPct: 82,
      telematicsDevice: "CAN-OBD-TH210",
      location: [26.1880, 91.7430],
      speedKmh: 3.8,
      lastTelemetryPing: "Just now"
    },
    {
      id: "eq-SANY800",
      name: "Sany SCC800TB Crawler Crane #01",
      type: "Telescopic Crawler Crane",
      projectId: "proj-ghy-01",
      status: "active_operating",
      engineHoursToday: 7.2,
      idleHoursToday: 0.9,
      fuelLevelPct: 90,
      telematicsDevice: "CAN-CRANE-SN800",
      location: [26.1890, 91.7445],
      speedKmh: 0,
      lastTelemetryPing: "1 min ago"
    },
    {
      id: "eq-JCB3DX",
      name: "JCB 3DX Plus Backhoe Loader #09",
      type: "Backhoe Loader",
      projectId: "proj-ghy-01",
      status: "active_operating",
      engineHoursToday: 5.4,
      idleHoursToday: 0.4,
      fuelLevelPct: 68,
      telematicsDevice: "CAN-JCB-3DX",
      location: [26.1865, 91.7405],
      speedKmh: 4.5,
      lastTelemetryPing: "3 mins ago"
    },
    {
      id: "eq-KIRLOSKAR125",
      name: "Kirloskar 125kVA Silent DG Generator",
      type: "Silent Generator",
      projectId: "proj-ghy-01",
      status: "idle",
      engineHoursToday: 8.0,
      idleHoursToday: 4.8,
      fuelLevelPct: 52,
      telematicsDevice: "BLE-GEN-KG125",
      location: [26.1858, 91.7390],
      speedKmh: 0,
      lastTelemetryPing: "4 mins ago"
    }
  ],

  dailyLogs: [
    {
      id: "log-ghy-2026-0830",
      projectId: "proj-ghy-01",
      date: "2026-08-30",
      superintendent: "Bikash Sharma (Chief Resident Engineer)",
      status: "pending_review",
      weather: {
        summary: "Partly Cloudy, High 32°C / Low 25°C, Humidity 78%",
        wind: "6 km/h SW",
        precipitation: "0.0 mm",
        impact: "Brahmaputra river water level stable; optimal piling and concreting weather"
      },
      laborEntries: [
        { trade: "Marine Concrete & Piling", crewSize: 18, regularHours: 144, overtimeHours: 12, costCode: "03-3000 Cast-in-Place Marine Concrete", workPerformed: "Poured Pier P-4 diaphragm wall cap (52 cu m M40 RMC). Vibrated and cured." },
        { trade: "Structural Steel Framing", crewSize: 14, regularHours: 112, overtimeHours: 8, costCode: "05-1200 Structural Steel Framing", workPerformed: "Erected promenade steel deck support girders between Grid 3 and 7." },
        { trade: "Electrical MEP & Riverfront Illumination", crewSize: 10, regularHours: 80, overtimeHours: 0, costCode: "26-0500 Electrical Distribution", workPerformed: "Underground armored HT/LT cabling conduit laying along MG Road embankment." }
      ],
      equipmentEntries: [
        { equipmentId: "eq-HITACHI210", name: "Tata Hitachi EX 210LC Excavator #04", operatingHours: 6.8, idleHours: 0.6, purpose: "Embankment slope grading & pier trenching" },
        { equipmentId: "eq-SANY800", name: "Sany SCC800TB Crawler Crane #01", operatingHours: 7.2, idleHours: 0.9, purpose: "Lifting rebar cages and heavy steel formwork" },
        { equipmentId: "eq-JCB3DX", name: "JCB 3DX Plus Backhoe Loader #09", operatingHours: 5.4, idleHours: 0.4, purpose: "Utility trench backfilling & material handling" }
      ],
      materials: [
        { material: "Ready-Mix Concrete M40 Grade", supplier: "UltraTech Concrete Guwahati", quantity: "52 cu meters", deliveryTicket: "TK-UT-84912", status: "Delivered, Slump Tested & Poured" },
        { material: "Tata Tiscon 550D TMT Steel Rebar", supplier: "Tata Steel Assam Direct", quantity: "8.5 Metric Tons", deliveryTicket: "TK-TS-99214", status: "Inspected & Staged" }
      ],
      delays: [
        { type: "Traffic / Logistics Delay", durationMinutes: 30, reason: "Peak morning traffic congestion on MG Road delayed 2 RMC transit mixers by 30 mins. Concrete slump verified within limits upon arrival.", costImpact: "None - schedule absorbed" }
      ],
      photos: [
        {
          id: "photo-ghy-1",
          url: "https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=800&auto=format&fit=crop",
          timestamp: "2026-08-30 10:15 AM IST",
          location: "Brahmaputra Riverfront Pier P-4",
          caption: "M40 concrete pour of Pier P-4 cap along MG Road Brahmaputra promenade.",
          aiTags: {
            tradeDetected: "Cast-in-Place Marine Concrete",
            ppeComplianceScore: 98,
            detectedPpe: ["Hard Hats: 6/6", "High-Vis Vests: 6/6", "Life Jackets (Marine Zone): Active", "Safety Boots: 6/6"],
            hazardsDetected: ["None detected - river barrier safety netting secure"],
            confidenceScore: 0.97
          }
        },
        {
          id: "photo-ghy-2",
          url: "https://images.unsplash.com/photo-1504307651554-6691fc9d0554?w=800&auto=format&fit=crop",
          timestamp: "2026-08-30 02:45 PM IST",
          location: "Panbazar Promenade Sector 3",
          caption: "Structural steel girder erection with Sany 80-ton crawler crane.",
          aiTags: {
            tradeDetected: "Heavy Structural Steel",
            ppeComplianceScore: 96,
            detectedPpe: ["Hard Hats: 4/4", "High-Vis Vests: 4/4", "Double Lanyard Harness: Secured"],
            hazardsDetected: ["Housekeeping check: Remove empty strapping bands from walkway"],
            confidenceScore: 0.94
          }
        }
      ],
      healthScore: {
        score: 96,
        grade: "A",
        status: "Ready for Executive Approval",
        breakdown: {
          laborLogged: 100,
          equipmentTelematicsSync: 95,
          photoEvidence: 95,
          safetyChecks: 95,
          delayDocumentation: 95
        },
        recommendations: [
          "Clear plastic strapping bands from Promenade Sector 3 walkway as flagged by AI Vision."
        ]
      }
    }
  ],

  safetyAudits: [
    {
      id: "saf-ghy-01",
      projectId: "proj-ghy-01",
      date: "2026-08-30",
      type: "Toolbox Talk & Riverfront Safety Audit",
      topic: "Riverfront Marine Safety, Life Jackets & Deep Piling Protocols",
      conductor: "Bikash Sharma (Chief Resident Engineer)",
      attendeeCount: 38,
      ppeComplianceRate: 98.4,
      incidentsReported: 0,
      nearMisses: 0,
      openHazards: [
        { id: "haz-ghy-1", location: "Promenade Sector 3", issue: "Loose packaging bands near pedestrian barrier", severity: "Low", status: "Resolved on-site" }
      ]
    }
  ],

  telematicsEvents: [
    { id: "tel-ghy-1", timestamp: "2026-08-30 06:30:15 IST", entityType: "crew", entityId: "crew-1", name: "Debojit Kalita", event: "GEOFENCE_ENTER", zone: "Guwahati Brahmaputra Riverfront", lat: 26.1852, lng: 91.7380, action: "Auto Clock-In: Panbazar Gate 1" },
    { id: "tel-ghy-2", timestamp: "2026-08-30 07:00:08 IST", entityType: "crew", entityId: "crew-2", name: "Pranab Dutta", event: "GEOFENCE_ENTER", zone: "Guwahati Brahmaputra Riverfront", lat: 26.1855, lng: 91.7385, action: "Auto Clock-In: Fancy Bazar Gate 2" },
    { id: "tel-ghy-3", timestamp: "2026-08-30 08:15:30 IST", entityType: "equipment", entityId: "eq-HITACHI210", name: "Tata Hitachi EX 210LC #04", event: "ENGINE_START", zone: "Guwahati Brahmaputra Riverfront", lat: 26.1880, lng: 91.7430, action: "Telematics Recording Active (OBD-II)" },
    { id: "tel-ghy-4", timestamp: "2026-08-30 11:45:00 IST", entityType: "equipment", entityId: "eq-KIRLOSKAR125", name: "Kirloskar 125kVA Generator", event: "EXCESSIVE_IDLE_ALERT", zone: "Guwahati Brahmaputra Riverfront", lat: 26.1858, lng: 91.7390, action: "High Idle Alert (>3.5 hrs idle) sent to Site Engineer" }
  ]
};

module.exports = db;
