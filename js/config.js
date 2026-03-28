// ============================================================
// QAISS Dashboard — API Configuration
// ============================================================
//
// API keys are used ONLY through Netlify Functions (server-side).
// Client-side keys below are for services that require them.
// All sensitive keys go in Netlify Environment Variables.
//
// Services with empty keys fall back to simulated data.
// ============================================================

var QAISS_CONFIG = {

  // ── QUANTUM HARDWARE ───────────────────────────
  // OriginQ WuKong — set in Netlify env: ORIGINQ_API_KEY
  ORIGINQ_ENDPOINT: 'https://qcloud.originqc.com.cn',

  // ── THREAT INTELLIGENCE ────────────────────────
  // AbuseIPDB — set in Netlify env: ABUSEIPDB_KEY
  // Accessed via /.netlify/functions/threat-proxy

  // ── AI ASSISTANT ───────────────────────────────
  // Anthropic Claude — set in Netlify env: ANTHROPIC_API_KEY
  // Accessed via /.netlify/functions/ai-proxy

  // ── ANALYTICS (optional) ───────────────────────
  GA_MEASUREMENT_ID: '',  // Google Analytics 4

};
