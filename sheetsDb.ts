import { google } from 'googleapis';
import crypto from 'crypto';

/**
 * ── GOOGLE SHEETS AS THE PRIMARY DATABASE ──
 *
 * Authenticates via a Google Service Account (not an interactive OAuth
 * login), so the server can always read/write without a human needing to
 * be present — necessary since this needs to work the moment the app
 * loads, and needs to auto-save every change.
 *
 * This is a SEPARATE mechanism from the existing "Sync to Google Sheets"
 * feature (src/components/GoogleSheetsSync.tsx), which POSTs a one-way
 * mirror of the data to a Google Apps Script Web App URL you deploy
 * yourself from within a target sheet. That feature is untouched — it's
 * still there if you want a human-friendly mirror sheet. This module is
 * what makes a sheet the app's actual, load-on-start / save-on-change
 * database, using the official Sheets API.
 *
 * SETUP (see DEPLOYMENT.md):
 *   1. Create a Service Account in Google Cloud Console, enable the
 *      Google Sheets API, generate a JSON key.
 *   2. Create a Google Sheet, share it with the service account's email
 *      (the "client_email" field in the JSON key) as an Editor.
 *   3. Set three environment variables:
 *        GOOGLE_SHEET_ID
 *        GOOGLE_SERVICE_ACCOUNT_EMAIL
 *        GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
 *
 * If those three aren't set (or the key doesn't parse), the app falls
 * back to a local JSON file at data/database.json automatically.
 */

const TABS = [
  'Users', 'Events', 'Tickets', 'Orders', 'Customers',
  'Scanners', 'ScannerLogs', 'Activities', 'Notifications', 'Meta'
] as const;
type TabName = typeof TABS[number];

// Friendly columns per tab for browsing in Sheets. The LAST column is
// always "Data (JSON)" — the full, lossless record. Reads use ONLY that
// column; the earlier columns exist purely so the sheet is pleasant to
// open and skim.
const HEADERS: Record<TabName, string[]> = {
  Users: ['User ID', 'Name', 'Role', 'Email', 'Status', 'Created At', 'Data (JSON)'],
  Events: ['Event ID', 'Name', 'Venue', 'Date', 'Status', 'Tickets Sold', 'Revenue', 'Data (JSON)'],
  Tickets: ['Ticket ID', 'Ticket Code', 'Event Name', 'Holder Name', 'Category', 'Status', 'Issued At', 'Data (JSON)'],
  Orders: ['Order ID', 'Order Number', 'Customer Name', 'Event Name', 'Total', 'Status', 'Created At', 'Data (JSON)'],
  Customers: ['Customer ID', 'Name', 'Email', 'Total Orders', 'Total Spent', 'Data (JSON)'],
  Scanners: ['Scanner ID', 'Name', 'Gate', 'Venue', 'Online', 'Data (JSON)'],
  ScannerLogs: ['Log ID', 'Ticket Code', 'Holder Name', 'Status', 'Scanned At', 'Gate', 'Data (JSON)'],
  Activities: ['Activity ID', 'User', 'Action', 'Target', 'Timestamp', 'Data (JSON)'],
  Notifications: ['Notification ID', 'Title', 'Category', 'Timestamp', 'Read', 'Data (JSON)'],
  Meta: ['Key', 'Data (JSON)']
};

/** The exact shape of the app's persisted state — mirrors what App.tsx
 * used to split across separate localStorage keys. */
export interface AppState {
  users: any[];
  events: any[];
  tickets: any[];
  orders: any[];
  customers: any[];
  scanners: any[];
  scannerLogs: any[];
  activities: any[];
  notifications: any[];
  customLogoUrl?: string;
}

function emptyState(): AppState {
  return {
    users: [], events: [], tickets: [], orders: [], customers: [],
    scanners: [], scannerLogs: [], activities: [], notifications: [],
    customLogoUrl: undefined
  };
}

let cachedState: AppState | null = null;
let sheetsClient: ReturnType<typeof google.sheets> | null = null;
let spreadsheetId: string | null = null;
let sheetsDbActive = false;

/** Validates a PEM private key actually parses before trusting it, so a
 * corrupted/truncated key (easy to introduce by hand-copying) fails loudly
 * and clearly falls back, instead of silently misbehaving. */
export function isValidPrivateKey(keyStr: string | undefined): boolean {
  if (!keyStr) return false;
  try {
    const normalized = keyStr.replace(/\\n/g, '\n');
    crypto.createPrivateKey(normalized);
    return true;
  } catch {
    return false;
  }
}

export function isSheetsBackendConfigured(): boolean {
  if (sheetsDbActive) return true;
  return Boolean(
    process.env.GOOGLE_SHEET_ID &&
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    isValidPrivateKey(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY)
  );
}

function getSheetsClient() {
  if (sheetsClient) return sheetsClient;
  const privateKey = (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  sheetsClient = google.sheets({ version: 'v4', auth });
  spreadsheetId = process.env.GOOGLE_SHEET_ID || null;
  return sheetsClient;
}

async function ensureTabsExist() {
  const sheets = getSheetsClient();
  const meta = await sheets.spreadsheets.get({ spreadsheetId: spreadsheetId! });
  const existingTitles = new Set((meta.data.sheets || []).map((s) => s.properties?.title));

  const missing = TABS.filter((t) => !existingTitles.has(t));
  if (missing.length > 0) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: spreadsheetId!,
      requestBody: { requests: missing.map((title) => ({ addSheet: { properties: { title } } })) }
    });
  }

  for (const tab of TABS) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheetId!,
      range: `${tab}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [HEADERS[tab]] }
    });
  }
}

function chunkString(str: string, size = 40000): string[] {
  if (!str) return [''];
  const chunks: string[] = [];
  for (let i = 0; i < str.length; i += size) {
    chunks.push(str.slice(i, i + size));
  }
  return chunks.length > 0 ? chunks : [''];
}

async function readTabRecords(tab: TabName): Promise<any[]> {
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({ spreadsheetId: spreadsheetId!, range: `${tab}!A2:ZZ` });
  const rows = res.data.values || [];
  const records: any[] = [];
  const headerColsCount = HEADERS[tab].length - 1;
  for (const row of rows) {
    if (row.length <= headerColsCount) continue;
    const jsonParts = row.slice(headerColsCount);
    const jsonStr = jsonParts.join('');
    if (!jsonStr) continue;
    try { records.push(JSON.parse(jsonStr)); } catch { console.warn(`Skipping unparsable row in ${tab}`); }
  }
  return records;
}

const rowFns: Record<Exclude<TabName, 'Meta'>, (r: any) => any[]> = {
  Users: (u) => [
    String(u.id || '').slice(0, 500),
    String(u.name || '').slice(0, 500),
    String(u.role || '').slice(0, 500),
    String(u.email || '').slice(0, 500),
    String(u.status || 'active').slice(0, 500),
    String(u.createdAt || '').slice(0, 500),
    ...chunkString(JSON.stringify(u))
  ],
  Events: (e) => [
    String(e.id || '').slice(0, 500),
    String(e.name || '').slice(0, 500),
    String(e.venue || '').slice(0, 500),
    String(e.date || '').slice(0, 500),
    String(e.status || 'upcoming').slice(0, 500),
    e.ticketsSold || 0,
    e.totalRevenue || 0,
    ...chunkString(JSON.stringify(e))
  ],
  Tickets: (t) => [
    String(t.id || '').slice(0, 500),
    String(t.ticketCode || '').slice(0, 500),
    String(t.eventName || '').slice(0, 500),
    String(t.holderName || '').slice(0, 500),
    String(t.category || '').slice(0, 500),
    String(t.status || 'valid').slice(0, 500),
    String(t.issuedAt || '').slice(0, 500),
    ...chunkString(JSON.stringify(t))
  ],
  Orders: (o) => [
    String(o.id || '').slice(0, 500),
    String(o.orderNumber || '').slice(0, 500),
    String(o.customerName || '').slice(0, 500),
    String(o.eventName || '').slice(0, 500),
    o.totalAmount || 0,
    String(o.status || 'pending').slice(0, 500),
    String(o.createdAt || '').slice(0, 500),
    ...chunkString(JSON.stringify(o))
  ],
  Customers: (c) => [
    String(c.id || '').slice(0, 500),
    String(c.name || '').slice(0, 500),
    String(c.email || '').slice(0, 500),
    c.totalOrders || 0,
    c.totalSpent || 0,
    ...chunkString(JSON.stringify(c))
  ],
  Scanners: (s) => [
    String(s.id || '').slice(0, 500),
    String(s.name || '').slice(0, 500),
    String(s.gate || '').slice(0, 500),
    String(s.venue || '').slice(0, 500),
    s.isOnline ? 'Yes' : 'No',
    ...chunkString(JSON.stringify(s))
  ],
  ScannerLogs: (l) => [
    String(l.id || '').slice(0, 500),
    String(l.ticketCode || '').slice(0, 500),
    String(l.holderName || '').slice(0, 500),
    String(l.status || '').slice(0, 500),
    String(l.scannedAt || '').slice(0, 500),
    String(l.gate || '').slice(0, 500),
    ...chunkString(JSON.stringify(l))
  ],
  Activities: (a) => [
    String(a.id || '').slice(0, 500),
    String(a.user || '').slice(0, 500),
    String(a.action || '').slice(0, 500),
    String(a.target || '').slice(0, 500),
    String(a.timestamp || '').slice(0, 500),
    ...chunkString(JSON.stringify(a))
  ],
  Notifications: (n) => [
    String(n.id || '').slice(0, 500),
    String(n.title || '').slice(0, 500),
    String(n.category || '').slice(0, 500),
    String(n.timestamp || '').slice(0, 500),
    n.isRead ? 'Yes' : 'No',
    ...chunkString(JSON.stringify(n))
  ]
};

async function pushStateToSheets(state: AppState) {
  const sheets = getSheetsClient();
  const writeTab = async (tab: TabName, rows: any[][]) => {
    await sheets.spreadsheets.values.clear({ spreadsheetId: spreadsheetId!, range: `${tab}!A2:ZZ` });
    if (rows.length === 0) return;
    await sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheetId!,
      range: `${tab}!A2`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: rows }
    });
  };

  await writeTab('Users', state.users.map(rowFns.Users));
  await writeTab('Events', state.events.map(rowFns.Events));
  await writeTab('Tickets', state.tickets.map(rowFns.Tickets));
  await writeTab('Orders', state.orders.map(rowFns.Orders));
  await writeTab('Customers', state.customers.map(rowFns.Customers));
  await writeTab('Scanners', state.scanners.map(rowFns.Scanners));
  await writeTab('ScannerLogs', state.scannerLogs.map(rowFns.ScannerLogs));
  await writeTab('Activities', state.activities.map(rowFns.Activities));
  await writeTab('Notifications', state.notifications.map(rowFns.Notifications));
  await writeTab('Meta', [['customLogoUrl', ...chunkString(JSON.stringify(state.customLogoUrl || ''))]]);
}

// ── Write queue (debounced) ──
let pendingWrite = false;
let debounceTimer: any = null;
let lastFlushAt = 0;
const isServerless = Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT);
const DEBOUNCE_MS = isServerless ? 0 : 1200;
const MAX_WAIT_MS = isServerless ? 0 : 4000;

function scheduleFlush() {
  pendingWrite = true;
  if (debounceTimer) clearTimeout(debounceTimer);
  const sinceLastFlush = Date.now() - lastFlushAt;
  const delay = sinceLastFlush >= MAX_WAIT_MS ? 0 : DEBOUNCE_MS;

  debounceTimer = setTimeout(async () => {
    if (!pendingWrite || !cachedState) return;
    pendingWrite = false;
    lastFlushAt = Date.now();
    try {
      await pushStateToSheets(cachedState);
    } catch (err) {
      console.error('Failed to write database to Google Sheets:', err);
    }
  }, delay);
}

export async function flushSheetsDb(): Promise<void> {
  if (debounceTimer) clearTimeout(debounceTimer);
  if (pendingWrite && cachedState) {
    pendingWrite = false;
    try {
      await pushStateToSheets(cachedState);
    } catch (err) {
      console.error('Failed to flush database to Google Sheets:', err);
    }
  }
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
    events: [],
    tickets: [],
    orders: [],
    customers: [],
    scanners: [],
    scannerLogs: [],
    activities: [
      {
        id: 'act-seed',
        user: 'System',
        action: 'initialized the database',
        target: 'Courtside Liberia',
        timestamp: now,
        type: 'system'
      }
    ],
    notifications: [],
    customLogoUrl: undefined
  };
}

/** Bootstraps the Sheets-backed database. Must be awaited once before the
 * app serves any requests. After that, readState()/writeState() are
 * synchronous, reading/writing an in-memory cache. */
export async function ensureSheetsDb(): Promise<void> {
  if (!isSheetsBackendConfigured()) return;

  try {
    await ensureTabsExist();

    const [users, events, tickets, orders, customers, scanners, scannerLogs, activities, notifications, metaRows] = await Promise.all([
      readTabRecords('Users'),
      readTabRecords('Events'),
      readTabRecords('Tickets'),
      readTabRecords('Orders'),
      readTabRecords('Customers'),
      readTabRecords('Scanners'),
      readTabRecords('ScannerLogs'),
      readTabRecords('Activities'),
      readTabRecords('Notifications'),
      (async () => {
        const sheets = getSheetsClient();
        const res = await sheets.spreadsheets.values.get({ spreadsheetId: spreadsheetId!, range: 'Meta!A2:ZZ' });
        return res.data.values || [];
      })()
    ]);

    const isBrandNew = users.length === 0;

    if (isBrandNew) {
      cachedState = defaultSeedState();
      console.log('Google Sheets database is empty — seeding default data.');
      await pushStateToSheets(cachedState);
    } else {
      const metaEntry = metaRows.find((r) => r[0] === 'customLogoUrl');
      let customLogoUrl: string | undefined;
      if (metaEntry && metaEntry.length > 1) {
        try { customLogoUrl = JSON.parse(metaEntry.slice(1).join('')) || undefined; } catch { /* ignore */ }
      }
      cachedState = { users, events, tickets, orders, customers, scanners, scannerLogs, activities, notifications, customLogoUrl };
      console.log(`Loaded database from Google Sheets: ${events.length} events, ${tickets.length} tickets, ${users.length} users.`);
    }

    lastFlushAt = Date.now();
    sheetsDbActive = true;
  } catch (err) {
    console.error('Google Sheets database backend unavailable, falling back to local storage:', err);
    sheetsDbActive = false;
    throw err;
  }
}

export function isSheetsDbActive(): boolean {
  return sheetsDbActive;
}

export function readSheetsState(): AppState {
  if (!cachedState) cachedState = emptyState();
  return cachedState;
}

export function writeSheetsState(data: AppState): void {
  cachedState = data;
  scheduleFlush();
}
