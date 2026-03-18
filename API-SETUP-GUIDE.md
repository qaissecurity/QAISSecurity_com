# QAISS — API Integration Setup Guide
## Activating All Services

Your QAISS website has a plug-and-play API layer. Add your keys to `js/config.js` and each service activates automatically. Nothing breaks if a key is missing — the site gracefully falls back.

---

## Quick Start

1. Open `js/config.js` in any text editor
2. Paste your API keys in the empty quotes
3. Save and refresh the website
4. Open browser console (F12) to see which services activated

---

## TIER 1 — Essential Services

### 1. Google Analytics (GA4)
**Why:** See how many visitors you get, which pages they visit, where they come from.

**Setup (5 minutes):**
1. Go to https://analytics.google.com
2. Click "Start measuring" → Create Account → Create Property
3. Enter "QAISS" as property name
4. Choose Web → Enter your website URL
5. Copy the **Measurement ID** (starts with `G-`)
6. Paste in config.js: `GA_MEASUREMENT_ID: 'G-XXXXXXXXXX'`

**What it enables:** Visitor tracking, page views, scroll depth, section engagement, form submissions, newsletter signups — all tracked automatically.

---

### 2. EmailJS (Contact Form)
**Why:** Contact form sends real emails to qaissecurity@gmail.com — no backend needed.

**Setup (10 minutes):**
1. Go to https://www.emailjs.com → Sign Up (free)
2. **Add Email Service:**
   - Click "Email Services" → "Add New Service"
   - Choose "Gmail" → Connect your qaissecurity@gmail.com
   - Note the **Service ID** (e.g., `service_qaiss`)
3. **Create Email Template:**
   - Click "Email Templates" → "Create New Template"
   - Subject: `QAISS Contact: {{subject}}`
   - Body:
     ```
     New QAISS inquiry from {{from_name}}

     Email: {{from_email}}
     Company: {{company}}
     Subject: {{subject}}

     Message:
     {{message}}
     ```
   - Note the **Template ID** (e.g., `template_contact`)
4. **Get Public Key:**
   - Account → API Keys → Copy **Public Key**
5. Paste all three in config.js:
   ```
   EMAILJS_PUBLIC_KEY: 'your_public_key',
   EMAILJS_SERVICE_ID: 'service_qaiss',
   EMAILJS_TEMPLATE_ID: 'template_contact',
   ```

**What it enables:** Contact form sends directly to your email. No mailto: popup — seamless experience.

---

### 3. Web3Forms (Backup Contact Form)
**Why:** Simpler alternative to EmailJS. Works as automatic fallback.

**Setup (2 minutes):**
1. Go to https://web3forms.com
2. Enter qaissecurity@gmail.com on the homepage
3. Check your email for the **Access Key**
4. Paste in config.js: `WEB3FORMS_KEY: 'your-access-key'`

**What it enables:** If EmailJS fails, the contact form automatically uses Web3Forms instead.

---

### 4. Mailchimp (Newsletter)
**Why:** Collect email subscribers who want quantum security updates.

**Setup (10 minutes):**
1. Go to https://mailchimp.com → Sign Up (free: 500 contacts)
2. Create your first **Audience** (list)
3. Go to Audience → Signup forms → Embedded forms
4. Copy the **form action URL** from the generated code
   - It looks like: `https://gmail.us21.list-manage.com/subscribe/post?u=XXXXX&id=XXXXX`
5. Paste in config.js: `MAILCHIMP_URL: 'https://gmail.us21...'`

**What it enables:** Newsletter signup actually adds subscribers to your Mailchimp list. You can send campaigns, automations, etc.

---

## TIER 2 — Real Data Services

### 5. AbuseIPDB (Threat Intelligence)
**Why:** Show REAL cyber threat data on the attack map.

**Setup (5 minutes):**
1. Go to https://www.abuseipdb.com/register → Create account
2. Go to API tab → Create API Key
3. Paste in config.js: `ABUSEIPDB_KEY: 'your_key'`

**Note:** This API has CORS restrictions. Currently prepared for backend proxy integration. The key is stored ready for when you deploy a backend (Node.js/Python). For now, the attack map uses enhanced simulated data.

**Free tier:** 1,000 checks/day

---

### 6. Have I Been Pwned (Breach Checker)
**Why:** Check if a visitor's domain has been in data breaches — powerful for the threat scanner.

**Setup:** Already enabled by default (`HIBP_ENABLED: true`). The public breach search API works without a key.

**What it enables:** Enhanced threat scanner results showing real breach history.

---

### 7. CoinGecko (Market Data)
**Why:** Show real-time quantum computing market data.

**Setup:** Already enabled by default (`COINGECKO_ENABLED: true`). No key needed.

**What it enables:** Real cryptocurrency and tech market data via public API.

---

### 8. Shodan (Vulnerability Scanner)
**Why:** Real internet vulnerability data for the threat scanner.

**Setup:**
1. Go to https://account.shodan.io/register
2. Get your API key from your account page
3. Paste in config.js: `SHODAN_KEY: 'your_key'`

**Note:** Requires backend proxy. Ready for future deployment.

---

## TIER 3 — Professional Polish

### 9. Google reCAPTCHA v3 (Spam Protection)
**Why:** Stop bots from spamming your contact form.

**Setup (5 minutes):**
1. Go to https://www.google.com/recaptcha/admin
2. Click "+" → Register new site
3. Choose **reCAPTCHA v3**
4. Add your domain(s)
5. Copy the **Site Key** (public key)
6. Paste in config.js: `RECAPTCHA_SITE_KEY: 'your_site_key'`

**What it enables:** Invisible spam protection. No captcha puzzles for visitors.

---

### 10. Crisp (Live Chat)
**Why:** Visitors can chat with you in real time.

**Setup (5 minutes):**
1. Go to https://crisp.chat → Sign Up (free: 2 seats)
2. Create your workspace
3. Go to Settings → Website Settings → Setup instructions
4. Copy your **Website ID**
5. Paste in config.js: `CRISP_WEBSITE_ID: 'your_website_id'`

**What it enables:** Chat bubble appears on every page. You get notified on phone/desktop when someone messages.

---

### 11. Hotjar (Heatmaps)
**Why:** See exactly where visitors click, how far they scroll, what they ignore.

**Setup (5 minutes):**
1. Go to https://www.hotjar.com → Sign Up (free plan)
2. Add your site
3. Get your **Site ID** (a number)
4. Paste in config.js: `HOTJAR_SITE_ID: '1234567'`

**What it enables:** Heatmaps, scroll maps, session recordings. Invaluable for optimizing the website.

---

## Architecture Overview

```
User visits page
      ↓
config.js loads (API keys)
      ↓
shared.js loads (core functions)
      ↓
integrations.js loads → checks each key
      ↓
┌─ GA key present? → Load Google Analytics, track page views + section scrolls
├─ EmailJS key? → Load EmailJS SDK, contact form uses it
├─ Web3Forms key? → Register as EmailJS fallback
├─ Mailchimp URL? → Newsletter uses JSONP subscription
├─ reCAPTCHA key? → Load invisible captcha
├─ Crisp ID? → Load live chat widget
├─ Hotjar ID? → Load heatmap tracking
├─ CoinGecko enabled? → Register market data function
├─ HIBP enabled? → Register breach check function
└─ AbuseIPDB key? → Ready for backend proxy
      ↓
Three.js + explorer.js loads
      ↓
Page-specific JS loads
```

**Fallback chain for contact form:**
1. EmailJS (if key present) → sends via email API
2. Web3Forms (if key present) → sends via form API
3. mailto: link (always works) → opens email client

---

## Testing

Open the browser console (F12 → Console) after loading any page. You'll see:

```
[QAISS] Google Analytics activated
[QAISS] EmailJS activated
[QAISS] reCAPTCHA v3 activated
[QAISS] Crisp live chat activated
[QAISS] Hotjar activated
[QAISS] Active integrations: Analytics, EmailJS, Web3Forms, Mailchimp, reCAPTCHA, Crisp Chat, Hotjar, CoinGecko, HIBP
```

Services without keys simply don't appear — no errors, no broken features.

---

*QAISS API Integration Guide v1.0 · March 2026*
