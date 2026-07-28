import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import {
  isSheetsBackendConfigured,
  ensureSheetsDb,
  readSheetsState,
  writeSheetsState,
  flushSheetsDb,
  isSheetsDbActive,
  AppState
} from './sheetsDb';
import { PassTicket, EventRecord, ScannerLog } from './src/types';

// ─────────────────────────────────────────────────────────────────────────
// Local JSON-file fallback (used automatically whenever the Google Sheets
// service account isn't configured, or fails to connect). This keeps the
// app fully working out of the box with zero setup, exactly like before.
// ─────────────────────────────────────────────────────────────────────────
function getDbDir() {
  return process.env.DATA_DIR || path.join(process.cwd(), 'data');
}
function getDbPath() {
  return path.join(getDbDir(), 'database.json');
}

function defaultSeedState(): AppState {
  const now = new Date().toISOString();
  return {
    users: [
      {
        id: 'usr-owner-001',
        name: 'Courtside Owner / Super Admin',
        email: 'courtsideliberia@gmail.com',
        phone: '+231 88 000 4455',
        role: 'super_admin',
        passcode: '004455',
        status: 'active',
        createdBy: 'System Root',
        createdAt: now,
        permissions: {
          canCreateEvents: true,
          canIssueTickets: true,
          canScanTickets: true,
          canViewReports: true,
          canManageUsers: true
        }
      }
    ],
    events: [
      {
        id: 'evt-lba-001',
        name: 'LBA Championship 2026',
        venue: 'SKD Sports Complex',
        date: '2026-08-15',
        time: '18:00',
        capacity: 5000,
        ticketsSold: 0,
        totalRevenue: 0,
        attendanceCount: 0,
        status: 'upcoming',
        createdByUserId: 'usr-owner-001',
        createdByUserName: 'Courtside Owner / Super Admin',
        bannerGradient: 'from-blue-900 via-indigo-900 to-slate-900'
      },
      {
        id: 'evt-lba-002',
        name: 'LBA All-Star Showcase',
        venue: 'SKD Sports Complex',
        date: '2026-08-22',
        time: '19:30',
        capacity: 3500,
        ticketsSold: 0,
        totalRevenue: 0,
        attendanceCount: 0,
        status: 'upcoming',
        createdByUserId: 'usr-owner-001',
        createdByUserName: 'Courtside Owner / Super Admin',
        bannerGradient: 'from-amber-900 via-orange-900 to-slate-900'
      }
    ],
    tickets: [],
    orders: [],
    customers: [],
    scanners: [],
    scannerLogs: [],
    activities: [
      { id: 'act-seed', user: 'System', action: 'initialized the database', target: 'Courtside Liberia', timestamp: now, type: 'system' }
    ],
    notifications: [],
    customLogoUrl: undefined
  };
}

function ensureLocalDbExists() {
  if (!fs.existsSync(getDbDir())) {
    fs.mkdirSync(getDbDir(), { recursive: true });
  }
  if (!fs.existsSync(getDbPath())) {
    fs.writeFileSync(getDbPath(), JSON.stringify(defaultSeedState(), null, 2), 'utf-8');
  }
}

function readState(): AppState {
  let state: AppState;
  if (isSheetsBackendConfigured()) {
    state = readSheetsState();
  } else {
    ensureLocalDbExists();
    try {
      const data = fs.readFileSync(getDbPath(), 'utf-8');
      state = JSON.parse(data);
    } catch (err) {
      console.error('Error reading local JSON DB', err);
      state = defaultSeedState();
    }
  }

  if (!state.events || state.events.length === 0) {
    state.events = defaultSeedState().events;
  }
  return state;
}

function writeState(data: AppState) {
  if (isSheetsBackendConfigured()) {
    writeSheetsState(data);
    return;
  }
  try {
    fs.writeFileSync(getDbPath(), JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local JSON DB', err);
  }
}

async function ensureDbExists() {
  if (isSheetsBackendConfigured()) {
    try {
      await ensureSheetsDb();
      return;
    } catch {
      // Falls through to local-file fallback below.
    }
  }
  ensureLocalDbExists();
}

// ─────────────────────────────────────────────────────────────────────────
// App
// ─────────────────────────────────────────────────────────────────────────
export async function createApp() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));

  await ensureDbExists();

  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      storage: isSheetsBackendConfigured() && isSheetsDbActive() ? 'google-sheets' : 'local-json'
    });
  });

  // ── Single-blob state API ──
  // The frontend keeps the app's entire state (tickets, events, orders,
  // customers, scanners, scannerLogs, activities, notifications, users,
  // customLogoUrl) as one object in React state — exactly mirroring what
  // it previously split across separate localStorage keys. So the API
  // mirrors that shape: one GET to load everything on startup, one PUT
  // (debounced client-side) to persist it on every change. This is what
  // makes "auto save to Google Sheets" work.
  app.get('/api/state', (_req, res) => {
    try {
      const state = readState();
      res.json({ success: true, state });
    } catch (err) {
      console.error('GET /api/state error:', err);
      res.status(500).json({ success: false, error: 'Failed to load database.' });
    }
  });

  app.put('/api/state', (req, res) => {
    try {
      const incoming = req.body as Partial<AppState>;
      const current = readState();

      // Merge tickets intelligently by ID/code so offline or sync clients don't wipe out passes
      const ticketMap = new Map<string, PassTicket>();
      (current.tickets || []).forEach((t) => ticketMap.set(t.id || t.ticketCode, t));
      
      (incoming.tickets || []).forEach((t) => {
        const key = t.id || t.ticketCode;
        const existing = ticketMap.get(key);
        if (existing) {
          // If existing ticket on server was already used or scanned, preserve scan status
          const isScannedOnServer = existing.status === 'used' || (existing.status as string) === 'already_used' || !!existing.scannedAt;
          ticketMap.set(key, {
            ...t,
            status: isScannedOnServer ? existing.status : t.status,
            scannedAt: existing.scannedAt || t.scannedAt,
            scannedBy: existing.scannedBy || t.scannedBy,
            gateEntry: existing.gateEntry || t.gateEntry,
          });
        } else {
          ticketMap.set(key, t);
        }
      });

      // Merge events
      const eventMap = new Map<string, EventRecord>();
      (current.events || []).forEach((e) => eventMap.set(e.id, e));
      (incoming.events || []).forEach((e) => eventMap.set(e.id, e));

      // Merge scannerLogs
      const logMap = new Map<string, ScannerLog>();
      (current.scannerLogs || []).forEach((l) => logMap.set(l.id, l));
      (incoming.scannerLogs || []).forEach((l) => logMap.set(l.id, l));

      const merged: AppState = {
        users: incoming.users?.length ? incoming.users : current.users ?? [],
        events: Array.from(eventMap.values()),
        tickets: Array.from(ticketMap.values()),
        orders: incoming.orders ?? current.orders ?? [],
        customers: incoming.customers ?? current.customers ?? [],
        scanners: incoming.scanners ?? current.scanners ?? [],
        scannerLogs: Array.from(logMap.values()),
        activities: incoming.activities ?? current.activities ?? [],
        notifications: incoming.notifications ?? current.notifications ?? [],
        customLogoUrl: incoming.customLogoUrl !== undefined ? incoming.customLogoUrl : current.customLogoUrl
      };
      writeState(merged);
      res.json({ success: true, count: merged.tickets.length });
    } catch (err) {
      console.error('PUT /api/state error:', err);
      res.status(500).json({ success: false, error: 'Failed to save database.' });
    }
  });

  return app;
}

/**
 * Standalone Node server entrypoint (used by `npm run dev` / `npm start`,
 * and on hosts like Render that run this as a persistent process). Not
 * used by the Netlify Functions adapter, which calls createApp() directly
 * and lets Netlify's CDN serve the static frontend instead.
 */
async function startServer() {
  const app = await createApp();
  const PORT = Number(process.env.PORT) || 3000;

  if (process.env.NODE_ENV !== 'production') {
    // Dynamically imported so production/serverless bundles never need 'vite'.
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Courtside Ticket Server running on port ${PORT}`);
  });

  const shutdown = async () => {
    await flushSheetsDb();
    process.exit(0);
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

// Only auto-start when run directly (tsx server.ts / node dist/server.cjs) —
// not when imported by the Netlify Functions adapter.
if (process.env.NETLIFY !== 'true' && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}
