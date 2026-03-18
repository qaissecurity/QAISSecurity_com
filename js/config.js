// ============================================================
// QAISS API Configuration
// ============================================================
// 
// HOW TO USE:
// 1. Sign up for each service below (all have free tiers)
// 2. Paste your API keys in the spaces provided
// 3. The website automatically activates each feature
//
// Services with empty keys will gracefully fall back to
// simulated/demo behavior — nothing breaks.
// ============================================================

var QAISS_CONFIG = {

  // ── TIER 1: ESSENTIAL ──────────────────────────────────

  // GOOGLE ANALYTICS (GA4)
  // Sign up: https://analytics.google.com
  // 1. Create a new GA4 property
  // 2. Get your Measurement ID (starts with "G-")
  // 3. Paste below
  GA_MEASUREMENT_ID: '',  // e.g. 'G-XXXXXXXXXX'

  // EMAILJS (Contact Form)
  // Sign up: https://www.emailjs.com (free: 200 emails/month)
  // 1. Create account → Add email service (Gmail works)
  // 2. Create email template with variables: {{from_name}}, {{from_email}}, {{company}}, {{subject}}, {{message}}
  // 3. Get your Service ID, Template ID, and Public Key
  EMAILJS_PUBLIC_KEY: '',    // e.g. 'abc123xyz'
  EMAILJS_SERVICE_ID: '',    // e.g. 'service_qaiss'
  EMAILJS_TEMPLATE_ID: '',   // e.g. 'template_contact'

  // WEB3FORMS (Backup Contact Form — simpler alternative)
  // Sign up: https://web3forms.com (free: unlimited)
  // 1. Enter your email on the homepage
  // 2. Get your Access Key from the email they send
  WEB3FORMS_KEY: '',  // e.g. 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'

  // MAILCHIMP (Newsletter)
  // Sign up: https://mailchimp.com (free: 500 contacts)
  // 1. Create audience → Signup forms → Embedded forms
  // 2. Copy the form action URL (contains your list URL)
  // The URL looks like: https://gmail.us21.list-manage.com/subscribe/post?u=XXXXX&id=XXXXX
  MAILCHIMP_URL: '',  // Full form action URL
  
  // ── TIER 2: REAL DATA ──────────────────────────────────

  // ABUSEIPDB (Real Threat Data for Attack Map)
  // Sign up: https://www.abuseipdb.com/register (free: 1000 checks/day)
  // 1. Create account → API tab → Create Key
  // Note: CORS restricted — we use it via a proxy or fallback to simulated data
  ABUSEIPDB_KEY: '',  // e.g. 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'

  // HAVE I BEEN PWNED (Breach Checker)
  // No API key needed for breach search by domain (public endpoint)
  // Set to true to enable the feature
  HIBP_ENABLED: true,

  // COINGECKO (Quantum Company Data)
  // No API key needed! Free public API
  // Shows real market data for quantum computing companies
  COINGECKO_ENABLED: true,

  // SHODAN (Internet Vulnerability Scanner)
  // Sign up: https://account.shodan.io/register (free tier available)
  // Note: Requires backend proxy — will be activated when backend is deployed
  SHODAN_KEY: '',  // e.g. 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'

  // ── TIER 3: PROFESSIONAL POLISH ────────────────────────

  // GOOGLE RECAPTCHA v3 (Spam Protection)
  // Sign up: https://www.google.com/recaptcha/admin
  // 1. Register new site → reCAPTCHA v3
  // 2. Add your domain
  // 3. Get Site Key (public key for frontend)
  RECAPTCHA_SITE_KEY: '',  // e.g. '6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'

  // CRISP (Live Chat Widget)
  // Sign up: https://crisp.chat (free: 2 seats)
  // 1. Create workspace → Settings → Setup instructions
  // 2. Get your Website ID
  CRISP_WEBSITE_ID: '',  // e.g. 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'

  // HOTJAR (Heatmaps & Analytics)
  // Sign up: https://www.hotjar.com (free: basic plan)
  // 1. Create account → Add site → Get tracking code
  // 2. Get your Site ID (number)
  HOTJAR_SITE_ID: '',  // e.g. '1234567'

};
