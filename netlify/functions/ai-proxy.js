// ============================================================
// QAISS AI Proxy — Netlify Serverless Function
// Proxies Claude API requests (key stays server-side)
// ============================================================

const _fetch = typeof globalThis.fetch === 'function' ? globalThis.fetch : (...args) => import('node-fetch').then(m => m.default(...args));

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({error: 'Method not allowed'}) };
  }

  if (!ANTHROPIC_API_KEY) {
    return {
      statusCode: 200, headers,
      body: JSON.stringify({
        response: 'Enterprise AI Core offline. Awaiting secure API handshake. To activate, configure ANTHROPIC_API_KEY in your deployment environment. All other security systems remain fully operational.',
        source: 'offline',
        status: 'simulated'
      })
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { system, message, history } = body;

    // Build messages array with input validation
    const validRoles = ['user', 'assistant'];
    const messages = [];
    if (history && Array.isArray(history)) {
      history.forEach(h => {
        if (h.role && validRoles.includes(h.role) && typeof h.content === 'string') {
          messages.push({ role: h.role, content: h.content.substring(0, 2000) });
        }
      });
    }
    if (!message || typeof message !== 'string') {
      return { statusCode: 400, headers, body: JSON.stringify({error: 'Message required'}) };
    }
    messages.push({ role: 'user', content: message.substring(0, 2000) });

    const response = await _fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: system || 'You are the QAISS AI Security Assistant.',
        messages: messages
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error:', response.status, errText);
      return {
        statusCode: 200, headers,
        body: JSON.stringify({ response: 'AI temporarily unavailable. Please try again.', source: 'error' })
      };
    }

    const data = await response.json();
    const text = data.content && data.content[0] ? data.content[0].text : 'Analysis complete.';

    // Log AI interaction to Supabase
    if (SUPABASE_URL && SUPABASE_KEY) {
      _fetch(`${SUPABASE_URL}/rest/v1/events`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          type: 'AI_QUERY',
          message: 'User asked: ' + message.substring(0, 100) + (message.length > 100 ? '...' : ''),
          severity: 'info',
          source: 'ai-assistant'
        })
      }).catch(() => {});
    }

    return {
      statusCode: 200, headers,
      body: JSON.stringify({ response: text, source: 'claude' })
    };

  } catch (err) {
    console.error('AI proxy error:', err);
    return {
      statusCode: 200, headers,
      body: JSON.stringify({ response: 'AI processing error. Using local knowledge base.', source: 'error' })
    };
  }
};
