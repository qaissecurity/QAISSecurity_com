# QAISS Enterprise Dashboard v3.0

## Product
B2B Enterprise quantum security operations platform. Targets Fortune 500 CISOs, government agencies, and institutional investors. Monitors 30 global quantum-secured nodes, provides real-time threat intelligence, and tracks post-quantum cryptography compliance.

## Stack
- **Frontend:** Vanilla HTML/CSS/JS (zero npm dependencies)
- **Backend:** 6 Netlify Serverless Functions
- **Database:** Supabase PostgreSQL (5 tables, RLS enabled)
- **Public API:** 15 REST endpoints with API key auth
- **Quantum Core:** NIST SP 800-22 test suite, BB84 QKD simulator, Crypto inventory scanner

## Entry Point
`dashboard.html` — password: `qaiss2026` — session timeout: 30 min

## Files (13 source, ~5,000 lines)
```
dashboard.html           — Login gate + dashboard layout
css/dashboard.css        — Design system + responsive + print
js/config.js             — API configuration
js/dashboard-app.js      — Router, 11 pages, charts, exports, AI assistant
js/datastore.js          — Central state, Supabase sync, webhooks, crypto entropy
js/quantum-core.js       — NIST tests, BB84 QKD, crypto scanner (real math)
js/threat-mitigation.js  — 4 attack scenarios, readiness score, SLA metrics
netlify/functions/
  api-v1.js              — Public API (15 endpoints)
  ai-proxy.js            — Claude API proxy
  db-proxy.js            — Supabase CRUD + rate limiting
  quantum-proxy.js       — OriginQ proxy + execution logging
  threat-proxy.js        — AbuseIPDB proxy + threat caching
  webhook-dispatch.js    — HMAC-signed webhook delivery
```

## Pages (11)
Overview, Global Topology, Threat Intelligence, Quantum Readiness, Compliance & SLA, Threat Response, Node Management, AI Assistant, Audit Log, Settings, API Documentation

## Public API v1 (15 endpoints)
```
GET  /readiness    GET  /nodes        GET  /threats
GET  /compliance   GET  /events       GET  /metrics
GET  /health       GET  /siem/cef     GET  /siem/json
GET  /webhooks     POST /webhooks     POST /entropy/test
POST /qkd/simulate POST /scan         GET  /
```

## Database (5 tables)
events, metrics_hourly, threat_cache, quantum_executions, webhooks

## Env Vars (6)
```
SUPABASE_URL, SUPABASE_SERVICE_KEY, ABUSEIPDB_KEY,
ORIGINQ_API_KEY, ANTHROPIC_API_KEY, QAISS_API_KEYS
```

## Rules
- No 3D/WebGL/decorative animations
- All API keys server-side only
- Rate limiting on all functions
- Every table has CSV export
- Error boundaries on all pages
