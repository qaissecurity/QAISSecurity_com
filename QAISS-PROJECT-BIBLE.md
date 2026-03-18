# QAISS — Project Bible
## Complete Development Documentation & Fork Guide
### Version 1.0 — March 17, 2026

---

## 1. WHAT IS QAISS

**QAISS — Quantum AI Immune Security System** is a self-evolving digital immune system that fuses quantum computing (OriginQ WuKong 72-qubit processor) with AI for next-generation cybersecurity. It doesn't just detect threats — it evolves to anticipate them.

### Contact
- **Email**: contact@qaissecurity.com
- **GitHub**: github.com/Qaissecurity
- **Twitter**: @Qaissecurity
- **OriginQ**: qcloud@originqc.com
- **Phone/WhatsApp**: +40 736 469 828

---

## 2. ARCHITECTURE OVERVIEW

### Four Security Layers:
1. **Quantum Entropy Core** — True quantum randomness from 72-qubit WuKong processor, Hadamard gates, Shannon entropy 7.998/8.000
2. **AI Neural Immune Engine** — Quantum autoencoder anomaly detection, 14.2M patterns trained, 99.2% accuracy, retrained every 3h
3. **Self-Healing Protocol** — BB84 QKD, automatic ML-KEM key rotation, <340ms response, zero human intervention
4. **Real-Time Dashboard** — Bell state tomography, fidelity monitoring (0.9987), Claude AI Security integration

### PQC Standards Implemented:
- **FIPS 203 — ML-KEM** (Module-Lattice Key Encapsulation) — replaces RSA/ECDH
- **FIPS 204 — ML-DSA** (Module-Lattice Digital Signatures) — replaces ECDSA
- **FIPS 205 — SLH-DSA** (Stateless Hash-Based Signatures) — conservative fallback

---

## 3. FILE TREE

```
qaiss-site/
├── index.html              (807KB) Homepage + Command Center + Globe 3D
├── demo.html               (103KB) Live quantum demos + SaaS Dashboard
├── technology.html          (82KB)  4-layer architecture deep-dive
├── resources.html           (93KB)  Research articles + blog
├── about.html               (65KB)  Mission, Vision, Pillars
├── blog.html                (86KB)  9 articles with filters
├── use-cases.html          (104KB) 15 industries + risk matrix
├── contact.html             (66KB)  Contact form (EmailJS/Web3Forms)
├── faq.html                 (73KB)  12 Q&As + JSON-LD schema
├── privacy.html             (64KB)  8-section privacy policy
├── terms.html               (64KB)  9-section Terms of Service
├── 404.html                  (3KB)  Custom error page
│
├── css/
│   └── shared.css           (66KB) 779 CSS rules, all pages share this
│
├── js/
│   ├── config.js             (3KB) API keys placeholder
│   ├── shared.js            (21KB) Nav, toast, modals, loader, animations
│   ├── integrations.js       (7KB) EmailJS, GA4, reCAPTCHA, Crisp, Mailchimp
│   ├── explorer.js          (21KB) 3D Globe (Three.js), nodes, attacks, raycaster
│   ├── logs.js               (6KB) Security Logs panel with filters
│   ├── command-center.js    (28KB) Full Command Center dashboard logic
│   └── dashboard.js          (9KB) SaaS Dashboard on demo.html
│
├── quantum-demo/
│   ├── qaiss_quantum_demo.py      Python quantum circuit demo
│   ├── quantum_output.txt         Demo output
│   ├── requirements.txt           Dependencies
│   └── README.md                  Instructions
│
├── QAISS-Technical-Whitepaper.pdf (386KB)  Downloadable whitepaper
├── hero-video.mp4           (1.7MB) Homepage hero video
├── og-image.svg              (5KB) Open Graph image
├── favicon.ico               (4KB) Browser favicon
├── qaiss-logo.png          (193KB) Main logo
├── qaiss-logo-hero.png      (85KB) Hero section logo
├── qaiss-logo-nav.png        (5KB) Navbar logo
├── qaiss-logo-sm.png        (17KB) Small logo
├── qaiss-logo-footer.png    (10KB) Footer logo
├── plx-datacenter.jpg       (53KB) Parallax image
├── plx-cybersec.jpg         (55KB) Parallax image
├── plx-quantum.jpg          (54KB) Parallax image
├── arc-cryostat.jpg         (27KB) Architecture image
├── arc-qchip.jpg            (22KB) Architecture image
├── arc-qpu.jpg              (32KB) Architecture image
├── arc-qlayers.jpg          (44KB) Architecture image
│
├── manifest.json                  PWA manifest
├── sitemap.xml                    11 URLs
├── robots.txt                     Allow all + sitemap
├── netlify.toml                   Security headers + caching + redirects
├── _redirects                     Netlify 404 redirect
├── .gitignore                     Git ignore rules
├── LICENSE                        MIT License
├── README.md                      GitHub README
├── API-SETUP-GUIDE.md             API configuration guide
└── humans.txt                     Credits
```

---

## 4. COMMAND CENTER (index.html — 3D Explorer)

The centerpiece of the site. Opens from navbar button `◆ 3D Explorer`.

### Structure: `<div id="expO">` (fixed fullscreen overlay, z-index 1000)

```
expO (overlay, background: #020210)
├── canvas#expC (Three.js globe, z-index 2)
├── div.ep#epP (intro text, auto-hides after 2.5s)
├── div.qcc-header (z-index 40)
│   ├── Logo + "Command Center | Quantum Readiness"
│   ├── 4 Tabs: Summary | Threats | Operational Health | Key Rotation
│   └── Clock + Filters btn + Time range + Exit btn
├── div.qcc-subheader (z-index 38)
│   ├── Alert ticker (10 rotating messages, 5s interval)
│   ├── 5 Quick Stats (clickable → open info panels)
│   └── 4 Quick Actions (Rotate Keys, Full Scan, Gen Entropy, Bell Test)
├── div.qcc-sidebar (z-index 40)
│   ├── ◇ Overview → slide panel with 10 system stats
│   ├── ⊘ Threats → slide panel with 8 threat rows
│   ├── ◎ Layers → slide panel with 4 layer cards
│   ├── ⟳ Keys → slide panel with key rotation data
│   ├── ☰ Settings → modal (4 tabs: API Keys, General, Notifications, Security)
│   ├── 🤖 Claude AI → AI Security Console
│   └── ▣ Logs → Security Logs panel
├── div.qcc-slide#qccSlide0-3 (slide-out panels, z-index 45)
├── div.qcc-main (z-index 5)
│   ├── Left nodes: 72 QUBITS, 14.2M PATTERNS, 847 EDGE NODES
│   ├── Globe overlay labels: QAISS CORE + GLOBAL SHIELD
│   └── Right nodes: 3 PQC STANDARDS, <340 MS RESPONSE, A+ ENTROPY GRADE + Protected Services
├── button.qcc-bottom-toggle (collapsible toggle)
├── div.qcc-bottom (z-index 40, 7 tabs)
│   ├── Sessions — breakdown + region + bandwidth
│   ├── Readiness — nodes, legacy devices, NIST, migration, Q-Day
│   ├── Keys — rotation chart, algorithms, performance, actions
│   ├── Compliance — 5 standards + deadlines
│   ├── Activity — live feed (15 entries)
│   ├── Incidents — incident cards with investigate/report/block
│   └── 🤖 AI Insights — Claude analysis + recommendations
├── div.qcc-settings-overlay (Settings modal, z-index 50)
│   └── 4 tabs: API Keys (6 services incl. Claude), General, Notifications, Security
├── div.qcc-filter-overlay (Filter modal, z-index 50)
├── div.qcc-report-overlay (Report generator, z-index 50)
├── div.qcc-ai-overlay (Claude AI Security Console, z-index 55)
│   └── Chat interface + 6 quick actions + real Anthropic API
├── button.logs-toggle (z-index 44)
├── div.logs-panel (z-index 46, with search + filters)
├── div.eh.ehb (old orbit buttons — hidden via CSS)
└── div.ip#ipanel (info panel, z-index 48, for node/layer details)
```

### Globe (explorer.js):
- Procedural Earth shader (GLSL) — oceans, continents, ice caps, city lights, atmosphere
- 30 city nodes (QAISS_NODES array) with pulsing rings + beacon lines
- 16 data flow lines (teal) + 11 QKD routes (purple)
- Attack arcs spawn every 4-7s (red → green → disappear)
- Click on nodes → Key Rotation Data per region
- Drag to orbit + scroll to zoom + touch support
- 4000 starfield particles

### Claude AI Security (command-center.js):
- Real Anthropic API call to `claude-sonnet-4-20250514`
- System prompt with full QAISS context (stats, nodes, algorithms, incidents)
- Chat interface with typing indicator
- 6 quick actions: Analyze, Anomaly, Report, Recommend, Explain, Audit
- API key stored base64-encoded in localStorage

---

## 5. CSS ARCHITECTURE (css/shared.css)

All 12 pages share one CSS file. Major sections:

```
Root variables (:root) — colors, fonts, spacing
Base styles — body, typography, links
Navbar — fixed, glass morphism
Hero — WebGL canvas, video, stats
Sections — parallax, cards, grids
Modals — blog, FAQ overlays
Explorer (#expO) — fullscreen overlay
Logs panel — search, filters, rows
QAISS Command Dashboard — SaaS dashboard (demo.html)
QAISS Command Center (Palo Alto Style) — header, sidebar, main, bottom
Settings & API Keys — modal panels
Slide-out Panels — Overview, Threats, Layers, Keys
Sub-header — alert ticker, quick stats, actions
Clickable Quick Stats — hover, active states
Claude AI Security Layer — chat, quick actions, insights
Mobile Responsiveness — 27 @media queries
Touch Targets — 44px minimum (pointer:coarse)
Safe Areas — iPhone notch (env(safe-area-inset))
Reduced Motion — prefers-reduced-motion
Print Styles — hide interactive elements
Final Cleanup — hide old orbit buttons
```

### Key CSS Variables:
```css
--bg: #050510
--bg2: #0a0a1a
--purple: #a855f7
--teal: #2dd4bf
--coral: #f472b6
--blue: #38bdf8
--amber: #fbbf24
--mono: 'JetBrains Mono', monospace (loaded via Google Fonts)
```

---

## 6. JAVASCRIPT FILES

### config.js (3KB)
API keys placeholder — user fills in after deploy:
- EmailJS (service ID, template ID, public key)
- Google Analytics (GA4 measurement ID)
- reCAPTCHA v3 site key
- Mailchimp audience endpoint
- Crisp chat website ID

### shared.js (21KB)
Core functionality shared across ALL pages:
- Page loader animation
- Scroll progress bar
- Toast notification system (`showToast(msg, type)`)
- Mobile nav toggle
- Smooth scroll (`goTo(id)`)
- Modal open/close system
- Explorer open/close (also defined in explorer.js for index.html)
- Cookie banner
- Canvas visualizations (parallax backgrounds)

### integrations.js (7KB)
Third-party API integrations:
- Google Analytics (GA4) initialization
- EmailJS contact form submission
- Web3Forms fallback
- Mailchimp newsletter subscription
- reCAPTCHA v3 verification
- Crisp live chat widget
- Origin Quantum API helper

### explorer.js (21KB)
3D Globe Command Center (Three.js):
- Background particle field (1500 particles, shader material)
- Globe initialization (`initExplorer()`)
- Procedural Earth shader (GLSL vertex + fragment)
- 30 QAISS_NODES with lat/lon coordinates
- REGION_KEYS data (per-region key rotation stats)
- `latLonToVec3()` — coordinate conversion
- `makeArc()` — curved lines between points
- Node rendering (dots + pulse rings + beacon lines)
- Data flow lines (16) + QKD routes (11) + attack arcs
- Mouse/touch drag controls + zoom
- Attack spawner (4-7s interval)
- Live attack/neutralized counters
- Raycaster for node click detection
- `focusLayer()` — layer info display
- `onGlobeClick()` → shows Key Rotation Data per node

### logs.js (6KB)
Security Logs Panel:
- 12 pre-defined log entries with quantum security context
- Filter by level (success/warning/critical/info)
- Filter by service (quantum-rng, threat-detect, key-mgmt, ai-immune, self-heal, dashboard)
- Search by message text
- Expandable log detail rows

### command-center.js (28KB)
Full Command Center dashboard logic:
- Live UTC clock
- Tab switching (header + bottom panel)
- Sidebar navigation with slide-out panels (toggle/switch)
- Settings modal with 4 sub-tabs
- API key save/load/test (6 services: originq, threat, kms, analytics, webhook, claude)
- Filter panel (time, region, threat level)
- Report generator modal
- Bottom panel toggle (collapsible)
- Bottom panel 7 tabs with content switching
- Activity feed initialization (15 entries)
- Quick stat click handlers (5 detailed panels)
- Enhanced action buttons with loading animation
- Alert ticker rotation (10 messages, 5s interval)
- **Claude AI Security Layer**: open/close AI console, chat interface, `callClaude()` with real Anthropic API, 6 quick actions, typing indicator

### dashboard.js (9KB)
SaaS Dashboard on demo.html:
- 6 tabs: Overview, Entropy, Threats, Key Management, Compliance, Settings
- Live clock
- Animated KPI counters
- Canvas chart (entropy/threat/key data)
- Activity feed
- Entropy generator
- Quick actions (scan, rotate, report)
- Theme toggle (dark/light)

---

## 7. SECURITY IMPLEMENTATION

### HTTP Security Headers (netlify.toml):
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
Content-Security-Policy: [full CSP with whitelist]
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### Application Security:
- API keys stored base64-encoded in localStorage (`btoa/atob`)
- Zero console.log leaks in production
- `crossorigin="anonymous"` on external CDN scripts
- Cache-Control headers (1yr for static assets, 1hr for HTML)

---

## 8. MOBILE RESPONSIVENESS

27 @media queries covering:
- **< 900px (tablet)**: Compact sidebar (36px), hide subtitle, smaller tabs, narrower panels
- **< 600px (phone)**: Hide sidebar + tabs, full-width panels, smaller nodes, compact bottom panel
- **Touch devices** (`pointer:coarse`): 44px minimum touch targets
- **iPhone notch**: `env(safe-area-inset-*)` padding
- **Reduced motion**: All animations disabled
- **Print**: Hide all interactive elements, static layout

---

## 9. DEPLOY INSTRUCTIONS

### Platform: Netlify (configured in netlify.toml)

1. Unzip `QAISS-Deploy-Ready.zip`
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag & drop the unzipped folder
4. Connect domain in Netlify → Domain Management
5. Update nameservers at domain registrar
6. HTTPS auto-enabled (Let's Encrypt)

### Post-Deploy:
1. Add API keys to `js/config.js`
2. Configure Claude AI API key: Command Center → Settings → API Keys
3. Push to GitHub: `git init && git add . && git commit -m "QAISS v1.0" && git push`
4. Test on mobile
5. Verify security headers at securityheaders.com

---

## 10. DOMAIN STRATEGY

### Recommended: `qaiss.security` (primary)
- Perfect match: brand + industry TLD
- Professional and authoritative
- Memorable: "qaiss dot security"

### Alternative: `qaissecurity.com` (secondary, for email)
- Classic .com for corporate email
- Redirect to primary domain

### All verified available (March 17, 2026):
qaissecurity.com, qaissecurity.net, qaissecurity.io, qaiss.security, qaiss.ai, qaiss.io, qaiss-security.com

---

## 11. CANVA PITCH DECK

- **Design ID**: DAHEIY-YAW0
- **Edit URL**: https://www.canva.com/d/1Z0-0PQOeY9q-GE
- **View URL**: https://www.canva.com/d/YanyM229GXCNeR8
- **14 slides**, professional investor deck

---

## 12. VALIDATION STATUS (Final Audit — March 17, 2026)

| Check | Result |
|-------|--------|
| 12 HTML pages balanced | ✅ ALL divs match |
| 7 JS files syntax | ✅ ALL valid |
| CSS 779 rules balanced | ✅ 779/779 |
| Sitemap 11 URLs | ✅ ALL files exist |
| Whitepaper PDF (386KB) | ✅ Download functional |
| Console leaks | ✅ 0 |
| Security headers | ✅ 7 |
| Mobile responsive | ✅ 27 queries |
| Touch targets | ✅ 44px min |
| Safe areas | ✅ iPhone notch |
| Reduced motion | ✅ |
| Print styles | ✅ |
| Internal links | ✅ 0 broken |
| Image references | ✅ 0 missing |

---

## 13. CONTINUATION GUIDE

### To continue building with AI (Claude, GPT, etc.):
1. Share this file (`QAISS-PROJECT-BIBLE.md`) at the start of any new conversation
2. Upload the `QAISS-Deploy-Ready.zip` if you need code modifications
3. Reference specific sections/files by name

### Common tasks:
- **Add new page**: Copy any existing page, modify content, add to sitemap.xml, update nav in all pages
- **Modify Command Center**: Edit `js/command-center.js` + `css/shared.css` (search for `qcc-` prefix)
- **Modify Globe**: Edit `js/explorer.js` (search for `initExplorer`, `QAISS_NODES`)
- **Add API integration**: Edit `js/config.js` (add key) + `js/integrations.js` (add logic)
- **Update security headers**: Edit `netlify.toml`
- **Change branding**: Update logo files + CSS variables in `:root`

### File naming conventions:
- HTML: `kebab-case.html`
- CSS classes: `kebab-case` (old: 2-3 char abbreviations like `ep`, `eh`, `eb`)
- CSS Command Center: `qcc-` prefix
- JS functions: `camelCase`
- JS Command Center: `qcc` prefix

---

*Document generated March 17, 2026 — QAISS v1.0 Production Release*
