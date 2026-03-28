// ============================================================
// QAISS Database Proxy — Netlify Serverless Function
// Reads/writes to Supabase PostgreSQL
// ============================================================

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

const _fetch = typeof globalThis.fetch === 'function' ? globalThis.fetch : (...args) => import('node-fetch').then(m => m.default(...args));

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

// Simple rate limiter (in-memory, resets per cold start)
const rateLimiter = {};
function checkRate(ip, maxPerMinute) {
  const now = Date.now();
  if (!rateLimiter[ip]) rateLimiter[ip] = [];
  rateLimiter[ip] = rateLimiter[ip].filter(t => now - t < 60000);
  if (rateLimiter[ip].length >= maxPerMinute) return false;
  rateLimiter[ip].push(now);
  return true;
}

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Rate limiting: 30 requests per minute per IP
  const clientIP = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
  if (!checkRate(clientIP, 30)) {
    return { statusCode: 429, headers, body: JSON.stringify({ error: 'Rate limit exceeded. Max 30 requests/minute.' }) };
  }

  const params = event.queryStringParameters || {};
  const action = params.action || 'events';

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return { statusCode: 200, headers, body: JSON.stringify({ status: 'simulated', message: 'Database not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in Netlify env vars.', data: [] }) };
  }

  try {
    // Supabase REST API helper
    async function supabaseQuery(table, method, body, queryParams) {
      const url = `${SUPABASE_URL}/rest/v1/${table}${queryParams || ''}`;
      const opts = {
        method: method || 'GET',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': method === 'POST' ? 'return=representation' : ''
        }
      };
      if (body) opts.body = JSON.stringify(body);
      const res = await _fetch(url, opts);
      return res.json();
    }

    // ── ROUTES ────────────────────────────────
    if (action === 'events' && event.httpMethod === 'GET') {
      // Read recent events
      const limit = Math.min(parseInt(params.limit, 10) || 50, 200);
      const data = await supabaseQuery('events', 'GET', null, `?order=created_at.desc&limit=${limit}`);
      return { statusCode: 200, headers, body: JSON.stringify({ data }) };
    }

    if (action === 'log_event' && event.httpMethod === 'POST') {
      // Write event
      const body = JSON.parse(event.body);
      if (!body.type || !body.message) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'type and message required' }) };
      }
      const data = await supabaseQuery('events', 'POST', {
        type: body.type.substring(0, 50),
        message: body.message.substring(0, 500),
        severity: body.severity || 'info',
        source: body.source || 'dashboard'
      });
      return { statusCode: 201, headers, body: JSON.stringify({ data }) };
    }

    if (action === 'metrics' && event.httpMethod === 'GET') {
      // Read hourly metrics (last 24h)
      const data = await supabaseQuery('metrics_hourly', 'GET', null, '?order=hour.desc&limit=24');
      return { statusCode: 200, headers, body: JSON.stringify({ data }) };
    }

    if (action === 'log_metrics' && event.httpMethod === 'POST') {
      // Write hourly metric
      const body = JSON.parse(event.body);
      const data = await supabaseQuery('metrics_hourly', 'POST', {
        hour: body.hour || new Date().toISOString(),
        attacks: body.attacks || 0,
        blocked: body.blocked || 0,
        entropy: body.entropy || null,
        readiness_score: body.readiness_score || 93.4,
        active_nodes: body.active_nodes || 30
      });
      return { statusCode: 201, headers, body: JSON.stringify({ data }) };
    }

    if (action === 'threats' && event.httpMethod === 'GET') {
      // Read cached threats
      const data = await supabaseQuery('threat_cache', 'GET', null, '?order=abuse_score.desc&limit=20');
      return { statusCode: 200, headers, body: JSON.stringify({ data }) };
    }

    if (action === 'cache_threat' && event.httpMethod === 'POST') {
      // Cache threat intel
      const body = JSON.parse(event.body);
      const data = await supabaseQuery('threat_cache', 'POST', {
        ip_address: body.ip_address,
        country_code: body.country_code,
        abuse_score: body.abuse_score || 0,
        total_reports: body.total_reports || 0,
        isp: body.isp,
        threat_type: body.threat_type
      });
      return { statusCode: 201, headers, body: JSON.stringify({ data }) };
    }

    if (action === 'log_quantum' && event.httpMethod === 'POST') {
      // Log quantum execution
      const body = JSON.parse(event.body);
      const data = await supabaseQuery('quantum_executions', 'POST', {
        circuit_type: body.circuit_type || 'qrng',
        qubits: body.qubits || 20,
        shots: body.shots || 1000,
        entropy: body.entropy,
        source: body.source || 'simulation',
        results: body.results || {}
      });
      return { statusCode: 201, headers, body: JSON.stringify({ data }) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Unknown action: ' + action }) };

  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
