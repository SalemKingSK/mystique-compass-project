/**
 * MYSTIQUE COMPASS — Anonymous Analytics Collector (Cloudflare Worker)
 *
 * Companion service to src/lib/usage-tracker.ts on the client. Accepts
 * batched, anonymous usage events and stores them in Workers KV. Exposes a
 * separate, admin-key-protected read endpoint for the dashboard.
 *
 * NO personal data is ever collected. Each device only carries a random,
 * client-generated UUID — not a name, email, or account. Location is derived
 * server-side from Cloudflare's own edge request metadata (`request.cf`),
 * so the client never needs to ask for (or has access to) the browser
 * geolocation API.
 *
 * ── Routes ──────────────────────────────────────────────────────────────
 *   POST /collect   (also accepts POST /)   — ingest a batch of events.
 *                    Public, no auth — this is what the app calls.
 *   GET  /stats      — aggregated counts. Requires ?key=ADMIN_KEY or an
 *                    `Authorization: Bearer <ADMIN_KEY>` header.
 *   OPTIONS *        — CORS preflight for the above.
 *
 * ── Storage design ──────────────────────────────────────────────────────
 * Every accepted batch is written as its own KV entry:
 *   key:   raw:<ISO-date>:<deviceId>:<random>
 *   value: JSON { deviceId, events, country, colo, receivedAt }
 * /stats aggregates by listing all `raw:` keys at read time — no counters
 * are incremented on write, so there's no race condition to worry about at
 * this traffic scale. If usage ever grows enough that listing becomes slow,
 * see the README for the counter-based scaling note.
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function json(body, init = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...CORS_HEADERS,
      ...(init.headers || {}),
    },
  });
}

function isAuthorized(request, env) {
  if (!env.ADMIN_KEY) return false; // fail closed if the secret was never set
  const url = new URL(request.url);
  const queryKey = url.searchParams.get("key");
  if (queryKey && queryKey === env.ADMIN_KEY) return true;
  const authHeader = request.headers.get("Authorization") || "";
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (match && match[1] === env.ADMIN_KEY) return true;
  return false;
}

const VALID_EVENT_TYPES = new Set(["pwa_install", "share", "session_start"]);
const MAX_EVENTS_PER_BATCH = 200; // mirrors MAX_QUEUE_SIZE in usage-tracker.ts

function validatePayload(payload) {
  if (!payload || typeof payload !== "object") return "payload must be an object";
  if (typeof payload.deviceId !== "string" || payload.deviceId.length === 0) {
    return "deviceId must be a non-empty string";
  }
  if (payload.deviceId.length > 128) return "deviceId too long";
  if (!Array.isArray(payload.events)) return "events must be an array";
  if (payload.events.length === 0) return "events must not be empty";
  if (payload.events.length > MAX_EVENTS_PER_BATCH) return "too many events in one batch";
  for (const ev of payload.events) {
    if (!ev || typeof ev !== "object") return "each event must be an object";
    if (!VALID_EVENT_TYPES.has(ev.type)) return `unknown event type: ${ev.type}`;
    if (typeof ev.ts !== "number") return "event.ts must be a number";
  }
  return null;
}

async function handleCollect(request, env) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "invalid JSON body" }, { status: 400 });
  }

  const validationError = validatePayload(payload);
  if (validationError) {
    return json({ error: validationError }, { status: 400 });
  }

  const cf = request.cf || {};
  const country = typeof cf.country === "string" ? cf.country : "XX";
  const colo = typeof cf.colo === "string" ? cf.colo : "unknown";
  const receivedAt = Date.now();
  const isoDate = new Date(receivedAt).toISOString().slice(0, 10); // YYYY-MM-DD
  const random = crypto.randomUUID();
  const key = `raw:${isoDate}:${payload.deviceId}:${random}`;

  const record = {
    deviceId: payload.deviceId,
    events: payload.events,
    country,
    colo,
    receivedAt,
  };

  try {
    // 90-day TTL keeps KV storage bounded automatically for a hobby-scale
    // deployment — raw event batches age out on their own; aggregate trends
    // in the dashboard are still meaningful within that window. Raise or
    // remove expirationTtl in the README's scaling note if longer retention
    // is ever wanted.
    await env.ANALYTICS_KV.put(key, JSON.stringify(record), {
      expirationTtl: 60 * 60 * 24 * 90,
    });
  } catch (err) {
    return json({ error: "storage failure" }, { status: 500 });
  }

  return json({ ok: true, stored: payload.events.length });
}

async function collectAllRawKeys(kv) {
  const keys = [];
  let cursor;
  do {
    const page = await kv.list({ prefix: "raw:", cursor, limit: 1000 });
    keys.push(...page.keys);
    cursor = page.cursor;
    if (page.list_complete) break;
  } while (cursor);
  return keys;
}

async function handleStats(request, env) {
  if (!isAuthorized(request, env)) {
    return json({ error: "unauthorized" }, { status: 401 });
  }

  const keys = await collectAllRawKeys(env.ANALYTICS_KV);

  const uniqueDevices = new Set();
  const uniqueInstallDevices = new Set();
  let totalSessions = 0;
  let totalInstalls = 0;
  let totalShares = 0;
  const byCountry = {};
  const byDay = {};
  const shareMethodCounts = {};

  // Bound how many records we actually fetch+parse in one request so a
  // large history can't time out the Worker — recent-first is most useful
  // for a dashboard anyway. Increase in the README's scaling note if a
  // deeper window is ever needed.
  const MAX_RECORDS_TO_READ = 2000;
  const recordKeys = keys.slice(-MAX_RECORDS_TO_READ);

  const records = await Promise.all(
    recordKeys.map(async (k) => {
      try {
        const raw = await env.ANALYTICS_KV.get(k.name);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    }),
  );

  for (const record of records) {
    if (!record) continue;
    uniqueDevices.add(record.deviceId);
    byCountry[record.country] = (byCountry[record.country] || 0) + 1;
    const day = new Date(record.receivedAt).toISOString().slice(0, 10);
    byDay[day] = (byDay[day] || 0) + 1;

    for (const ev of record.events || []) {
      if (ev.type === "session_start") totalSessions += 1;
      if (ev.type === "pwa_install") {
        totalInstalls += 1;
        uniqueInstallDevices.add(record.deviceId);
      }
      if (ev.type === "share") {
        totalShares += 1;
        const method = (ev.meta && ev.meta.method) || "unknown";
        shareMethodCounts[method] = (shareMethodCounts[method] || 0) + 1;
      }
    }
  }

  return json({
    generatedAt: new Date().toISOString(),
    recordsScanned: records.filter(Boolean).length,
    totalRawKeysStored: keys.length,
    uniqueDevices: uniqueDevices.size,
    uniqueInstalls: uniqueInstallDevices.size,
    totalSessions,
    totalInstalls,
    totalShares,
    shareMethodCounts,
    byCountry,
    byDay,
  });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    if (request.method === "POST" && (url.pathname === "/" || url.pathname === "/collect")) {
      return handleCollect(request, env);
    }

    if (request.method === "GET" && url.pathname === "/stats") {
      return handleStats(request, env);
    }

    return json({ error: "not found" }, { status: 404 });
  },
};
