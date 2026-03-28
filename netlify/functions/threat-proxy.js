// ============================================================
// QAISS Threat Proxy — Netlify Serverless Function
// Proxies AbuseIPDB requests (API keys stay server-side)
// ============================================================

const _fetch = typeof globalThis.fetch === 'function' ? globalThis.fetch : (...args) => import('node-fetch').then(m => m.default(...args));

const ABUSEIPDB_KEY = process.env.ABUSEIPDB_KEY || '';
const ABUSEIPDB_BASE = 'https://api.abuseipdb.com/api/v2';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const params = event.queryStringParameters || {};
  const action = params.action || 'blacklist';

  if (!ABUSEIPDB_KEY) {
    return {
      statusCode: 200, headers,
      body: JSON.stringify({ data: getSimulatedData(action, params), source: 'simulated' })
    };
  }

  try {
    let url, fetchOptions;

    if (action === 'check' && params.ip) {
      url = `${ABUSEIPDB_BASE}/check?ipAddress=${encodeURIComponent(params.ip)}&maxAgeInDays=90&verbose`;
    } else if (action === 'blacklist') {
      const limit = Math.min(parseInt(params.limit, 10) || 10, 50);
      url = `${ABUSEIPDB_BASE}/blacklist?confidenceMinimum=90&limit=${limit}`;
    } else if (action === 'check-block' && params.network) {
      url = `${ABUSEIPDB_BASE}/check-block?network=${encodeURIComponent(params.network)}&maxAgeInDays=30`;
    } else {
      return {
        statusCode: 400, headers,
        body: JSON.stringify({ error: 'Invalid action. Use: check, blacklist, check-block' })
      };
    }

    fetchOptions = {
      method: 'GET',
      headers: {
        'Key': ABUSEIPDB_KEY,
        'Accept': 'application/json'
      }
    };

    const response = await _fetch(url, fetchOptions);

    if (!response.ok) {
      console.error('AbuseIPDB error:', response.status);
      return {
        statusCode: 200, headers,
        body: JSON.stringify({ data: getSimulatedData(action, params), source: 'simulated' })
      };
    }

    const data = await response.json();

    // Cache results in Supabase
    if (data.data && SUPABASE_URL && SUPABASE_KEY) {
      const threats = Array.isArray(data.data) ? data.data : [data.data];
      threats.slice(0, 10).forEach(t => {
        cacheThreat(t).catch(() => {});
      });
    }

    return {
      statusCode: 200, headers,
      body: JSON.stringify({ ...data, source: 'abuseipdb' })
    };

  } catch (err) {
    console.error('Threat proxy error:', err);
    return {
      statusCode: 200, headers,
      body: JSON.stringify({ data: getSimulatedData(action, params), source: 'simulated' })
    };
  }
};

function getSimulatedData(action, params) {
  if (action === 'check') {
    return {
      ipAddress: params.ip || '0.0.0.0',
      isPublic: true,
      abuseConfidenceScore: Math.floor(Math.random() * 60) + 40,
      countryCode: ['US','CN','RU','DE','NL','BG','BR','IN','SG','KR'][Math.floor(Math.random()*10)],
      isp: ['CloudFlare','DigitalOcean','AWS','Tencent','Hetzner'][Math.floor(Math.random()*5)],
      totalReports: Math.floor(Math.random() * 2000) + 50,
      lastReportedAt: new Date().toISOString()
    };
  }

  if (action === 'blacklist') {
    const threats = [];
    const countries = ['CN','RU','US','DE','NL','BG','BR','IN','VN','ID'];
    const isps = ['Tor Exit','Bulletproof Hosting','ChinaNet','Contabo','OVH','Linode','Hetzner','DigitalOcean'];
    const limit = Math.min(parseInt(params.limit, 10) || 10, 50);

    for (let i = 0; i < limit; i++) {
      threats.push({
        ipAddress: `${Math.floor(Math.random()*223)+1}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
        abuseConfidenceScore: Math.floor(Math.random() * 20) + 80,
        countryCode: countries[Math.floor(Math.random()*countries.length)],
        isp: isps[Math.floor(Math.random()*isps.length)],
        totalReports: Math.floor(Math.random() * 3000) + 100,
        lastReportedAt: new Date(Date.now() - Math.random() * 86400000).toISOString()
      });
    }
    return threats;
  }

  return [];
}

// Cache threat data in Supabase
async function cacheThreat(threat) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return;
  const ip = threat.ipAddress || threat.ip;
  if (!ip) return;

  await _fetch(`${SUPABASE_URL}/rest/v1/threat_cache`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify({
      ip_address: ip,
      country_code: threat.countryCode || null,
      abuse_score: threat.abuseConfidenceScore || 0,
      total_reports: threat.totalReports || 0,
      isp: threat.isp || null,
      threat_type: threat.abuseConfidenceScore >= 90 ? 'Critical' : threat.abuseConfidenceScore >= 70 ? 'High' : 'Medium',
      last_checked: new Date().toISOString()
    })
  });
}
