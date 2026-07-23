# Mystique Compass — Analytics Worker

A free, anonymous, login-free usage collector for the Mystique Compass PWA.
Runs entirely on Cloudflare's Workers + KV free tier. No credit card required
at this scale (well under the free tier's request and storage limits for a
personal-scale app).

Collects three anonymous event types sent by `src/lib/usage-tracker.ts` in
the main app: `pwa_install`, `share`, `session_start`. Each device is
identified only by a random client-generated UUID — no name, email, or
account. Location (country) is derived from Cloudflare's own edge request
metadata, never from the browser's geolocation API, so no permission prompt
is ever shown to the user.

## Files

- `src/worker.js` — the Worker itself (ingestion + stats endpoints).
- `wrangler.toml` — Cloudflare deploy config. Needs your KV namespace ID
  pasted in before first deploy (Step 2 below).
- `dashboard.html` — a standalone, single-file dashboard. No build step,
  no dependencies. Open it anywhere (even locally as `file://`) and point
  it at your deployed Worker + admin key.

## Deploy steps

Run these from inside `services/analytics-worker/`.

### 1. Install Wrangler (if not already available)

```bash
npm install -g wrangler
wrangler login
```

### 2. Create the KV namespace

```bash
wrangler kv namespace create ANALYTICS_KV
```

This prints something like:

```
[[kv_namespaces]]
binding = "ANALYTICS_KV"
id = "a1b2c3d4e5f6..."
```

Copy the `id` value into `wrangler.toml`, replacing
`REPLACE_WITH_YOUR_KV_NAMESPACE_ID`.

### 3. Set the admin key secret

Generate a strong random key and store it as a Worker secret (never commit
this to a file):

```bash
# generate one, e.g.:
openssl rand -hex 32

# then:
wrangler secret put ADMIN_KEY
# paste the generated value when prompted
```

**Save this key somewhere safe** — it's the only credential that unlocks
`/stats`. There's no recovery flow; if it's lost, run `wrangler secret put
ADMIN_KEY` again with a new value and update the dashboard's saved config.

### 4. Deploy

```bash
wrangler deploy
```

This prints your live Worker URL, something like:

```
https://mystique-analytics.<your-cloudflare-subdomain>.workers.dev
```

That's the value to set as `VITE_ANALYTICS_ENDPOINT` in the main app's
build environment (see the root project's deploy workflow) — point it at
`<worker-url>/collect`.

### 5. Open the dashboard

Open `dashboard.html` in a browser (works fine as a local file, or host it
statically — e.g. as `/stats/index.html` in the same GitHub Pages
deployment as the main app, per the deploy prompt's Task 6.5). On first
open it asks for two things, then remembers them in that browser's
`localStorage`:

- **Analytics Worker URL** — the `.workers.dev` URL from Step 4 (no
  trailing slash, no `/collect`/`/stats` suffix — the dashboard adds that).
- **Admin Key** — the value from Step 3.

## Endpoints

- `POST /collect` (also accepts `POST /`) — public, no auth. Body:
  ```json
  { "deviceId": "uuid-string", "events": [{ "type": "session_start", "ts": 1234567890, "meta": {} }] }
  ```
  Validates the shape, rejects anything malformed with a `400`, and stores
  valid batches with a 90-day TTL.

- `GET /stats?key=<ADMIN_KEY>` (or `Authorization: Bearer <ADMIN_KEY>`) —
  returns aggregated counts: total installs, sessions, shares, unique
  devices, breakdown by country and by day, and share-method breakdown.
  Returns `401` without a valid key.

## Scaling note (only relevant if usage gets large)

`/stats` currently aggregates by listing every stored `raw:` key at read
time and reading up to the most recent 2000 batches. This is simple,
race-condition-free, and completely fine for a personal-scale app. If this
project ever gets thousands of daily active users, the fix is to switch to
incrementally-updated counter keys (e.g. `count:installs:<day>`) written
during `/collect` instead of aggregating at read time — this file's
`handleCollect`/`handleStats` split is written so that change stays
localized to those two functions.

## Privacy note

No IP addresses, precise location, device fingerprints, or any personally
identifying data are ever stored — only: a random device UUID, event
type/timestamp/small metadata (e.g. which share method succeeded), and a
country code + Cloudflare colo code derived from the request at the edge.
