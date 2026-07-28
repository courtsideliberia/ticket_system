# Deployment Guide

This app is a full Node/Express server plus a React/Vite frontend, now also
configured as an installable PWA. Its database can be either a local JSON
file (the original default) or a Google Sheet — see below.

## Database: local JSON file vs. Google Sheets

By default, this app stores everything (events, tickets, users, scans, audit
logs) in a local JSON file at `data/database.json`. That's simple and fast,
but only reliably persists on a host with a real, persistent filesystem
(Render, with the disk configured in `render.yaml`).

You can instead make a **Google Sheet the app's live database** — every
read and write goes to/from the sheet, not the JSON file. This also solves
Netlify's storage limitation (see below), since a Sheet isn't tied to any
one function container's local disk.

### Setting up Google Sheets as your database

1. **Enable the Sheets API and create a Service Account:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/) and
     select or create a project.
   - Go to **APIs & Services → Library**, search for "Google Sheets API,"
     and enable it.
   - Go to **APIs & Services → Credentials → Create Credentials → Service
     Account**. Give it any name (e.g. "courtside-tickets-db").
   - Open the new service account, go to the **Keys** tab, **Add Key →
     Create new key → JSON**. This downloads a `.json` file — keep it
     private, never commit it to git.

2. **Create the Google Sheet and share it:**
   - Create a new, blank Google Sheet at [sheets.google.com](https://sheets.google.com).
   - Copy its ID from the URL: `https://docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`
   - Click **Share**, and share the sheet with the service account's email
     address (the `client_email` field in the JSON key you downloaded) —
     give it **Editor** access. This step is essential; without it, the
     server has no permission to read or write the sheet.

3. **Set three environment variables** (locally in `.env`, and in your
   hosting platform's dashboard for production):
   - `GOOGLE_SHEET_ID` — the ID you copied above.
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL` — the `client_email` field from the JSON key.
   - `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` — the `private_key` field from the
     JSON key, pasted exactly as-is (including the `-----BEGIN PRIVATE
     KEY-----` lines). If a platform's UI doesn't support multi-line env
     values, replace the real newlines with literal `\n` — the app handles
     both.

4. **Start the app.** On first run with these three variables set, the
   server automatically creates the tabs it needs (Events, Tickets, Users,
   BatchRequests, AuditLogs, ScanLogs, Meta) and seeds the same default
   data the JSON-file version starts with. From then on, every read/write
   goes through the sheet — you can open it any time to see live data.

**Notes and honest limitations:**
- Each tab keeps a friendly, human-readable set of columns for browsing,
  plus one `Data (JSON)` column holding the full record — reads use only
  that JSON column, so don't delete or hand-edit it if you want the app to
  keep working correctly with what you type into the other columns.
- Writes are debounced (coalesced) for about a second to avoid hammering
  Google's API during a burst of ticket scans — a scan is still confirmed
  to the scanner instantly (that part is in-memory), it just may take up
  to ~1-4 seconds to actually land in the visible sheet.
- Google Sheets has API rate limits (generous for a single event's worth of
  traffic, but not built for high-volume transactional workloads). This is
  a lightweight database, not a replacement for a real one at large scale.
- If you don't set these three variables, nothing changes — the app keeps
  using the local JSON file exactly as it did before.

This is a separate feature from the existing **"Sync to Google Sheets"**
button in the app's admin UI, which still works exactly as it did — that's
a one-click *export* of a copy of your data to a sheet of your choosing,
authenticated as whichever Google account clicks "Connect." The setup above
makes a sheet the app's actual, live backend instead.

## Render (recommended if using the local JSON file)

Render runs this app exactly as it's built: a long-running Node process with
a real filesystem.

1. Push this repo to GitHub/GitLab.
2. In Render, choose **New → Blueprint** and point it at this repo — it will
   pick up `render.yaml` automatically. Or create a Web Service manually with:
   - Build command: `npm install && npm run build`
   - Start command: `npm run start`
   - Health check path: `/api/events`
3. `render.yaml` also provisions a 1GB persistent disk mounted at `/data`, and
   sets `DATA_DIR=/data/courtside` so your ticket/event database survives
   deploys and restarts. Without this disk, the app still works, but the
   database resets on every deploy.

## Netlify (static frontend + serverless API)

Netlify hosts the frontend on its CDN and runs the API through a Netlify
Function (`netlify/functions/api.ts`), which wraps the *same* Express app used
on Render via `serverless-http` — no route logic is duplicated.

1. Push this repo, then in Netlify choose **Import an existing project**.
   `netlify.toml` configures the build (`npm run build`), publish dir
   (`dist`), and the `/api/*` → function redirect automatically.
2. Deploy. The site, navigation, and read-only API calls will work immediately.

**Important limitation (only applies if you're using the local JSON-file
database — not if you've set up Google Sheets as described above):** this
app's JSON-file database lives on local disk, and Netlify Functions run in
short-lived, stateless containers — the local filesystem (including `/tmp`,
which is where the function points the database on Netlify) is not
guaranteed to persist between invocations or across cold starts/redeploys.
In practice, this means ticket generation and scanning may not reliably
keep data between requests on Netlify the way they will on Render, **unless**
you configure the Google Sheets database (see the top of this file) — since
a Sheet isn't tied to any one function's local disk, it persists correctly
on Netlify too, and is the recommended setup if you want to deploy here.

## PWA

Both hosts serve the generated `manifest.webmanifest`, service worker
(`sw.js`), and icon set automatically since they're just static files that
`vite build` outputs into `dist/`. Once deployed over HTTPS (both Render and
Netlify serve HTTPS by default), visitors on mobile Chrome/Safari or desktop
Chrome/Edge will see an "Install app" prompt, and the app will work offline
for the app shell (API calls are intentionally always network-only, so
ticket/scan data is never served stale).

## Environment variables

| Variable   | Where           | Purpose                                            |
|------------|-----------------|-----------------------------------------------------|
| `PORT`     | Render          | Injected automatically — server.ts reads it now.    |
| `DATA_DIR` | Render/Netlify  | Where the JSON database file lives (only used if the Google Sheets database below isn't configured). |
| `NODE_ENV` | Both            | Set to `production` for the production build.       |
| `GOOGLE_SHEET_ID` | Both (optional) | Makes the app's database a Google Sheet instead of the JSON file. See the setup section above. |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Both (optional) | Paired with the above — the service account that reads/writes the sheet. |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | Both (optional) | Paired with the above — the service account's private key. |

Any existing Google Sheets / API keys your app already used (check `.env.example`
if present) still apply the same way on either host — add them as environment
variables in each platform's dashboard.
