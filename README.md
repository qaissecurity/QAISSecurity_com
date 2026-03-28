# QAISS — Quantum AI Immune Security System

Enterprise quantum security operations platform. Real-time threat intelligence, post-quantum cryptography compliance, and quantum key distribution monitoring.

## Quick Deploy

### 1. Deploy to Netlify
Push this repo to GitHub, then connect to Netlify.

### 2. Set Environment Variables
In Netlify → Site Settings → Environment Variables:

| Variable | Required | Source |
|----------|----------|--------|
| `SUPABASE_URL` | Yes | supabase.com → Project Settings → API |
| `SUPABASE_SERVICE_KEY` | Yes | Supabase → Settings → API → service_role |
| `ABUSEIPDB_KEY` | No | abuseipdb.com → API tab |
| `ORIGINQ_API_KEY` | No | OriginQ Cloud |
| `ANTHROPIC_API_KEY` | No | console.anthropic.com |
| `QAISS_API_KEYS` | No | Comma-separated client API keys |

### 3. Access
- Dashboard: `https://your-site.netlify.app/dashboard`
- Password: `qaiss2026`
- API: `https://your-site.netlify.app/api/v1/`

## Architecture

```
Dashboard (11 pages) → DataStore → Netlify Functions (6)
                                       ↓
                        Supabase PostgreSQL (5 tables)
                        AbuseIPDB (threat intel)
                        OriginQ WuKong (quantum)
                        Claude API (AI assistant)
```

## Public API (15 endpoints)

```bash
curl -H "X-API-Key: your_key" https://site.netlify.app/api/v1/readiness
curl -H "X-API-Key: your_key" https://site.netlify.app/api/v1/siem/cef
```

## Tech

- Zero npm dependencies (vanilla JS)
- 13 source files / ~5,000 lines
- NIST SP 800-22 entropy test suite
- BB84 QKD protocol simulator
- Crypto inventory scanner (5 services × 30 nodes)
- SIEM export (CEF + ECS)
- HMAC-SHA256 webhooks

## Security

Password login, CSP headers, RLS on all tables, rate limiting, session timeout, HMAC webhooks, server-side API keys only.

## Token

- Solana: `qAiSsY4QBC75SGeFnrfujt4LTgZyCqinEyD11x5SR6f`
- Supply: 822,822,822 QAISS (mint/freeze revoked)

## Links

- [qaissecurity.com](https://qaissecurity.com)
- [@Qaissecurity](https://x.com/Qaissecurity)
- [Telegram](https://t.me/QaissSecurity)

Proprietary — QAISS Security. All rights reserved.
