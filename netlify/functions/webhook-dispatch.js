// ============================================================
// QAISS Webhook Dispatcher — Sends real-time alerts to clients
// Triggered by DataStore events via db-proxy
// ============================================================

const _fetch = typeof globalThis.fetch === 'function' ? globalThis.fetch : (...args) => import('node-fetch').then(m => m.default(...args));

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || '';
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'qaiss_webhook_2026';

exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: '{"error":"POST only"}' };

  try {
    const body = JSON.parse(event.body);
    const { type, message, severity } = body;

    if (!type || !message) {
      return { statusCode: 400, headers, body: '{"error":"type and message required"}' };
    }

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return { statusCode: 200, headers, body: '{"dispatched":0,"reason":"no database"}' };
    }

    // Fetch active webhooks that match this event type
    const res = await _fetch(`${SUPABASE_URL}/rest/v1/webhooks?active=eq.true&select=*`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });

    if (!res.ok) {
      return { statusCode: 200, headers, body: '{"dispatched":0,"reason":"db error"}' };
    }

    const webhooks = await res.json();
    let dispatched = 0;

    // Build payload
    const payload = {
      event: type,
      message: message,
      severity: severity || 'info',
      timestamp: new Date().toISOString(),
      source: 'QAISS Quantum Security',
      version: '3.0'
    };

    // Generate HMAC signature
    const crypto = require('crypto');
    const signature = crypto.createHmac('sha256', WEBHOOK_SECRET).update(JSON.stringify(payload)).digest('hex');

    // Dispatch to matching webhooks
    const promises = webhooks
      .filter(wh => wh.events && wh.events.includes(type))
      .map(async (wh) => {
        try {
          const resp = await _fetch(wh.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-QAISS-Signature': signature,
              'X-QAISS-Event': type,
              'User-Agent': 'QAISS-Webhook/3.0'
            },
            body: JSON.stringify(payload)
          });

          // Update webhook stats
          await _fetch(`${SUPABASE_URL}/rest/v1/webhooks?id=eq.${wh.id}`, {
            method: 'PATCH',
            headers: {
              'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              last_triggered: new Date().toISOString(),
              trigger_count: (wh.trigger_count || 0) + 1
            })
          });

          if (resp.ok) dispatched++;
        } catch (err) {
          // Silently fail individual webhook — don't block others
        }
      });

    await Promise.all(promises);

    return {
      statusCode: 200, headers,
      body: JSON.stringify({ dispatched, total: webhooks.length, event: type })
    };

  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
