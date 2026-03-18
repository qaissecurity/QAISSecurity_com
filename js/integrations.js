// ============================================================
// QAISS API Integration Layer v1.0
// Loads after config.js — auto-activates services with keys
// ============================================================

(function() {
  var C = window.QAISS_CONFIG || {};

  // ── GOOGLE ANALYTICS ──
  if (C.GA_MEASUREMENT_ID) {
    var gs = document.createElement('script');
    gs.async = true;
    gs.src = 'https://www.googletagmanager.com/gtag/js?id=' + C.GA_MEASUREMENT_ID;
    document.head.appendChild(gs);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', C.GA_MEASUREMENT_ID);
    window.qaiss_gtag = gtag;
    
  }

  // ── EMAILJS ──
  if (C.EMAILJS_PUBLIC_KEY) {
    var ejs = document.createElement('script');
    ejs.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    ejs.onload = function() {
      emailjs.init(C.EMAILJS_PUBLIC_KEY);
      
    };
    document.head.appendChild(ejs);
  }

  // ── CONTACT FORM HANDLER ──
  window.qaissSubmitContact = function(formData) {
    // Try EmailJS first
    if (C.EMAILJS_PUBLIC_KEY && C.EMAILJS_SERVICE_ID && C.EMAILJS_TEMPLATE_ID && window.emailjs) {
      return emailjs.send(C.EMAILJS_SERVICE_ID, C.EMAILJS_TEMPLATE_ID, {
        from_name: formData.name,
        from_email: formData.email,
        company: formData.company,
        subject: formData.subject,
        message: formData.message
      }).then(function() {
        
        if (C.GA_MEASUREMENT_ID && window.qaiss_gtag) {
          qaiss_gtag('event', 'contact_form_submit', {event_category: 'engagement', event_label: formData.subject});
        }
        return {success: true, method: 'emailjs'};
      });
    }

    // Fallback to Web3Forms
    if (C.WEB3FORMS_KEY) {
      return fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          access_key: C.WEB3FORMS_KEY,
          name: formData.name,
          email: formData.email,
          company: formData.company,
          subject: 'QAISS: ' + formData.subject,
          message: formData.message,
          from_name: 'QAISS Website'
        })
      }).then(function(r){return r.json()}).then(function(data) {
        
        return {success: data.success, method: 'web3forms'};
      });
    }

    // Final fallback: mailto
    var sl = 'QAISS: ' + formData.subject;
    var body = 'Name: ' + formData.name + '\nEmail: ' + formData.email + '\nCompany: ' + (formData.company || 'N/A') + '\n\nMessage:\n' + formData.message;
    window.open('mailto:qaissecurity@gmail.com?subject=' + encodeURIComponent(sl) + '&body=' + encodeURIComponent(body));
    return Promise.resolve({success: true, method: 'mailto'});
  };

  // ── NEWSLETTER HANDLER ──
  window.qaissSubscribe = function(email) {
    if (C.MAILCHIMP_URL) {
      // Mailchimp uses jsonp for client-side
      var url = C.MAILCHIMP_URL.replace('/post?', '/post-json?') + '&EMAIL=' + encodeURIComponent(email) + '&c=qaissMailchimpCallback';
      var s = document.createElement('script');
      s.src = url;
      document.body.appendChild(s);
      window.qaissMailchimpCallback = function(data) {
        
        document.body.removeChild(s);
      };
      if (C.GA_MEASUREMENT_ID && window.qaiss_gtag) {
        qaiss_gtag('event', 'newsletter_signup', {event_category: 'engagement'});
      }
      return true;
    }
    // Fallback: just log and show success (collect via other means later)
    return true;
  };

  // ── RECAPTCHA v3 ──
  if (C.RECAPTCHA_SITE_KEY) {
    var rc = document.createElement('script');
    rc.src = 'https://www.google.com/recaptcha/api.js?render=' + C.RECAPTCHA_SITE_KEY;
    document.head.appendChild(rc);
    window.qaissVerifyHuman = function() {
      return grecaptcha.execute(C.RECAPTCHA_SITE_KEY, {action: 'submit'}).then(function(token) {
        return token;
      });
    };
    
  }

  // ── CRISP LIVE CHAT ──
  if (C.CRISP_WEBSITE_ID) {
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = C.CRISP_WEBSITE_ID;
    var cr = document.createElement('script');
    cr.src = 'https://client.crisp.chat/l.js';
    cr.async = true;
    document.head.appendChild(cr);
    
  }

  // ── HOTJAR ──
  if (C.HOTJAR_SITE_ID) {
    (function(h,o,t,j,a,r){
      h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
      h._hjSettings={hjid:C.HOTJAR_SITE_ID,hjsv:6};
      a=o.getElementsByTagName('head')[0];
      r=o.createElement('script');r.async=1;
      r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
      a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    
  }

  // ── COINGECKO (Quantum Company Data) ──
  if (C.COINGECKO_ENABLED) {
    window.qaissGetQuantumData = function(callback) {
      // Fetch data for quantum-related companies/tokens
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,render-token&vs_currencies=usd&include_24hr_change=true')
        .then(function(r){return r.json()})
        .then(function(data) {
          callback(null, data);
        })
        .catch(function(err) {
          callback(err, null);
        });
    };
  }

  // ── HAVE I BEEN PWNED (Breach Check) ──
  if (C.HIBP_ENABLED) {
    window.qaissCheckBreach = function(domain, callback) {
      // HIBP v3 public API for breach lookup
      fetch('https://haveibeenpwned.com/api/v3/breaches?domain=' + encodeURIComponent(domain), {
        headers: {'Accept': 'application/json'}
      })
        .then(function(r) {
          if (r.status === 404) return callback(null, []);
          if (!r.ok) return callback('API error', null);
          return r.json();
        })
        .then(function(data) {
          if (data) callback(null, data);
        })
        .catch(function(err) {
          callback(err, null);
        });
    };
  }

  // ── ABUSEIPDB (Threat Intelligence) ──
  if (C.ABUSEIPDB_KEY) {
    window.qaissGetThreats = function(callback) {
      // Note: CORS restricted — this works via proxy or backend
      // For now, we enhance simulated data with real threat categories
      
      callback(null, {status: 'key_ready', note: 'Requires backend proxy for CORS'});
    };
  }

  // ── PAGE VIEW TRACKING ──
  if (C.GA_MEASUREMENT_ID && window.qaiss_gtag) {
    // Track which sections users scroll to
    var tracked = {};
    var trackObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting && !tracked[e.target.id]) {
          tracked[e.target.id] = true;
          qaiss_gtag('event', 'section_view', {
            event_category: 'scroll',
            event_label: e.target.id
          });
        }
      });
    }, {threshold: 0.3});
    document.querySelectorAll('section[id]').forEach(function(s) {
      trackObs.observe(s);
    });
  }

  // ── STATUS LOG ──
  var active = [];
  if (C.GA_MEASUREMENT_ID) active.push('Analytics');
  if (C.EMAILJS_PUBLIC_KEY) active.push('EmailJS');
  if (C.WEB3FORMS_KEY) active.push('Web3Forms');
  if (C.MAILCHIMP_URL) active.push('Mailchimp');
  if (C.RECAPTCHA_SITE_KEY) active.push('reCAPTCHA');
  if (C.CRISP_WEBSITE_ID) active.push('Crisp Chat');
  if (C.HOTJAR_SITE_ID) active.push('Hotjar');
  if (C.COINGECKO_ENABLED) active.push('CoinGecko');
  if (C.HIBP_ENABLED) active.push('HIBP');
  if (C.ABUSEIPDB_KEY) active.push('AbuseIPDB');

})();
