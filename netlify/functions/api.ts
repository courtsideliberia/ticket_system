// Netlify Functions adapter — wraps the same Express app used by the
// standalone server (server.ts:createApp) so the API can run on Netlify
// without duplicating any route logic.
//
// STORAGE (please read):
// By default, this app stores its state in a local JSON file. That works
// perfectly on Render (a persistent process with a real filesystem), but
// Netlify Functions run in short-lived, stateless containers — anything
// written to disk (including /tmp) can disappear between invocations.
//
// Fix: configure the Google Sheets database (see sheetsDb.ts and
// DEPLOYMENT.md) via GOOGLE_SHEET_ID / GOOGLE_SERVICE_ACCOUNT_EMAIL /
// GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY — once set, this app reads and writes
// a Google Sheet instead of the local file, which persists correctly here.

import serverless from 'serverless-http';
import { createApp } from '../../server';
import { flushSheetsDb } from '../../sheetsDb';

// Netlify Functions can only write to /tmp — only relevant when the Google
// Sheets backend isn't configured (that becomes the database instead).
process.env.DATA_DIR = process.env.DATA_DIR || '/tmp/courtside-data';

let handlerPromise: Promise<any> | null = null;

async function getHandler() {
  if (!handlerPromise) {
    handlerPromise = createApp().then((app) => serverless(app));
  }
  return handlerPromise;
}

export const handler = async (event: any, context: any) => {
  const fn = await getHandler();
  const result = await fn(event, context);
  // Make sure any pending write reaches Google Sheets before the function
  // container is frozen — a background timer isn't guaranteed to survive
  // past the response being returned.
  await flushSheetsDb();
  return result;
};
