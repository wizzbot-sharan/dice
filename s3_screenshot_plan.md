# Application Proof System (revised)

Dice submit proof: optional S3 screenshot + Zoho Mail Reader confirmation. Storage stays on `dice_applied_jobs.screenshot_link` and `dice_applied_jobs.email_json`. AWS upload runs **only** when AWS keys are present. Mail access is Playwright against `https://zoho-mail-reader.onrender.com/` with **Admin Login** (not the old username/password-on-first-paint flow).

Admin credentials and AWS secrets live in `.env` / Railway only. Do not commit them.

## 1. Environment and dependencies

```bash
npm install @aws-sdk/client-s3
```

Document in `.env.example` (no real secrets):

```env
# Optional — screenshot upload skipped if any of these are missing
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET_NAME=
AWS_S3_BASE_PATH=dice-applications/screenshots

# Zoho Mail Reader admin (used by Global Sync + post-apply proof)
ZOHO_MAIL_READER_URL=https://zoho-mail-reader.onrender.com/
ZOHO_ADMIN_USERNAME=
ZOHO_ADMIN_PASSWORD=

APPLY_TIMEOUT_MINUTES=35
```

`hasAwsS3Config()` is true only when access key, secret, region, and bucket are all set. If false: still take the in-page screenshot if we want a buffer, **do not** call S3, leave `screenshot_link` null, log once, continue to mail proof.

Default `APPLY_TIMEOUT_MINUTES` becomes **35** so Dice form + 5s screenshot + 10 min mail poll fit in one job.

## 2. Database (unchanged storage)

- `clients_additional_info.zoho_connection` boolean default `false`
- `dice_applied_jobs.screenshot_link` text
- `dice_applied_jobs.email_json` jsonb  
  Examples: `{"status":"not connected"}`, `{"status":"mail not received"}`, or the found-mail object below.

## 3. Zoho session helper (`lib/zoho-mail-reader.js`)

Shared by Global Sync and the apply worker. Session file: `data/zoho-session.json` (gitignore).

### First open / expired session

1. `page.goto(ZOHO_MAIL_READER_URL)`.
2. Wait **10 seconds**.
3. Click **Admin Login**.
4. wait 10 **10 seconds**.
5. Fill username `ZOHO_ADMIN_USERNAME` and password `ZOHO_ADMIN_PASSWORD` (values you will put in env: `Created@123` / `Applywizz@2026`).
6. Submit login, wait **30 seconds** for the dashboard/list.
7. `context.storageState()` → `data/zoho-session.json`.

### Later visits

1. Open with saved storage state.
2. If Admin Login is still visible, treat session as dead and run first-open login again.
3. Even when cookies work, wait **30 seconds** after load before searching or scraping.

### Search a client (post-apply)

Search box: client's **`company_email`**. Wait **10 seconds** after typing/selecting. Click **Read mails**. Wait **20 seconds**. Then poll (section 5).

### Connected list (Global Sync only)

After the 30s load: click **Connected**, wait **10 seconds**, scrape emails, set `zoho_connection = true` for those `company_email` rows and `false` for other known clients.

If reader URL or admin env is missing: skip Zoho sync, log, do not fail the whole Global Sync.

## 4. Screenshot after Submit (`start-worker.js`)

On visible Submit:

1. Click Submit.
2. Wait **3 seconds**.
3. Inject a fixed top banner with the current URL (`z-index: 9999`).
4. Wait **2 seconds**.
5. `page.screenshot()`.
6. If AWS config is complete: upload  
   `[AWS_S3_BASE_PATH]/[AWL-ID]/[AWL-ID]|[Company]|[Title].png`  
   sanitize `|` / slashes in names. Write public/S3 URL to `screenshot_link`.
7. If AWS config is incomplete: skip upload, `screenshot_link` stays null.
8. Then mail proof (section 5). Mark apply `completed` and Telegram success **after** screenshot attempt (mail failure does not fail the Dice apply). Extend `saveAppliedJob` to patch `screenshot_link` / `email_json` without wiping status.

## 5. Mail proof after screenshot (10 minutes)

1. If `zoho_connection` is false: `email_json = {"status":"not connected"}`, done.
2. If admin env missing: same `not connected` (or `{"status":"reader not configured"}`) — do not hang.
3. New tab/context with zoho session helper (login if needed, **30s** wait).
4. Search **company_email**, wait **10s**, click **Read mails**, wait **10s**.
5. Look for mail `from` `applyonline@dice.com` whose subject matches job **Company** and **Title**.
6. If found, save:

```json
{
  "to": "...",
  "from": "...",
  "subject": "...",
  "body_html": "...",
  "body_text": "...",
  "received_at": "..."
}
```

7. If not found: wait **1 minute**, click **Read mails** again, wait **10 seconds**, re-check. Repeat until **10 minutes** have elapsed (about 10 Read-mails clicks).
8. Timeout: `{"status":"mail not received"}`.

AbortSignal from apply timeout: stop polling, save `mail not received` if nothing stored yet, do not throw away a completed apply.

## 6. Dashboard

- Queries return `screenshot_link` and `email_json`.
- Master Jobs Directory: **Proof** column for `completed` rows.
- **Dice Screenshot**: modal image, or disabled if no link (AWS skipped).
- **Email Proof**: modal JSON or status text.
- `npm run build` in `frontend/`.

## 7. Tests (no live AWS / Zoho / Dice)

- `hasAwsS3Config` true/false.
- S3 key path sanitization.
- Mail poll: found on first click; found on later click; 10 min miss → `mail not received`; `zoho_connection` false → `not connected`.
- Do not put admin passwords or AWS keys in tests.

## Files

- `database/migrations/012_application_proof.sql` (or equivalent ALTER)
- `lib/zoho-mail-reader.js`, `lib/s3-screenshot.js`
- `start-worker.js`, `lib/job-application-db.js`
- `scripts/sync-daily-pipeline.js`
- `lib/dashboard-server.js`, `frontend/src/pages/Dashboard.jsx`
- `.gitignore` `data/zoho-session.json`
- `.env.example`, `package.json` (`@aws-sdk/client-s3`)
- `test/application-proof.test.js`

## Out of scope

Hardcoding admin password in repo. Uploading screenshots without AWS. Changing `email_json` column location. Browserbase.
