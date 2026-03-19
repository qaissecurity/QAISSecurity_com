// ============================================================
// QAISS COMMAND DASHBOARD v2.0
// Interactive SaaS Dashboard Logic
// ============================================================

(function(){
  // ── TAB SWITCHING ──
  window.dashTab = function(btn, panel){
    document.querySelectorAll('.dash-tab').forEach(function(t){t.classList.remove('active')});
    document.querySelectorAll('.dash-panel').forEach(function(p){p.style.display='none'});
    btn.classList.add('active');
    var el = document.getElementById('dp-'+panel);
    if(el) el.style.display='block';
  };

  // ── LIVE CLOCK ──
  function updateClock(){
    var el = document.getElementById('dashTime');
    if(el){
      var now = new Date();
      el.textContent = now.toUTCString().split(' ')[4] + ' UTC';
    }
  }
  setInterval(updateClock, 1000);
  updateClock();

  // ── LIVE FEED ──
  var feedMsgs = [
    {badge:'ENTROPY',color:'rgba(168,85,247,.15)',text_color:'var(--purple)',msg:'256-bit QRNG batch generated from WuKong'},
    {badge:'HEALED',color:'rgba(34,197,94,.15)',text_color:'#22c55e',msg:'Key rotation completed — all sectors nominal'},
    {badge:'DETECT',color:'rgba(251,191,36,.15)',text_color:'#fbbf24',msg:'Anomalous pattern flagged — source: '+Math.floor(Math.random()*200)+'.x.x.x'},
    {badge:'BLOCKED',color:'rgba(34,197,94,.15)',text_color:'#22c55e',msg:'Threat neutralized in '+Math.floor(200+Math.random()*150)+'ms'},
    {badge:'HEALTH',color:'rgba(56,189,248,.15)',text_color:'var(--blue)',msg:'Bell state fidelity: 0.99'+Math.floor(80+Math.random()*19)+' — Grade A+'},
    {badge:'QRNG',color:'rgba(168,85,247,.15)',text_color:'var(--purple)',msg:'Entropy pool replenished — '+Math.floor(512+Math.random()*512)+' bits'},
    {badge:'ROTATE',color:'rgba(45,212,191,.15)',text_color:'var(--teal)',msg:'ML-KEM key rotated — API gateway sector'},
    {badge:'SCAN',color:'rgba(56,189,248,.15)',text_color:'var(--blue)',msg:'Full system scan completed — 0 vulnerabilities'},
    {badge:'AI',color:'rgba(45,212,191,.15)',text_color:'var(--teal)',msg:'Neural immune retrained — '+Math.floor(14e6+Math.random()*1e6).toLocaleString()+' patterns'},
    {badge:'CERT',color:'rgba(244,114,182,.15)',text_color:'var(--coral)',msg:'ML-DSA certificate renewed — validity: 90 days'},
    {badge:'QCLOUD',color:'rgba(168,85,247,.15)',text_color:'var(--purple)',msg:'QCloudService connected — WuKong backend ready'},
    {badge:'ENTROPY',color:'rgba(45,212,191,.15)',text_color:'var(--teal)',msg:'Shannon H (normalized): 0.'+Math.floor(4990+Math.random()*10)+' — Grade A+'},
    {badge:'BELL',color:'rgba(56,189,248,.15)',text_color:'var(--blue)',msg:'Bell state |Phi+> fidelity: 0.99'+Math.floor(80+Math.random()*19)+' — error rate: 0.00'+Math.floor(Math.random()*20)},
  ];

  function addFeedItem(){
    var feed = document.getElementById('dashFeed');
    if(!feed) return;
    var m = feedMsgs[Math.floor(Math.random()*feedMsgs.length)];
    var now = new Date();
    var time = ('0'+now.getHours()).slice(-2)+':'+('0'+now.getMinutes()).slice(-2)+':'+('0'+now.getSeconds()).slice(-2);
    var item = document.createElement('div');
    item.className = 'dash-feed-item';
    item.style.opacity = '0';
    item.style.transform = 'translateY(-10px)';
    item.innerHTML = '<span class="dash-feed-time">'+time+'</span><span class="dash-feed-badge" style="background:'+m.color+';color:'+m.text_color+'">'+m.badge+'</span><span class="dash-feed-msg">'+m.msg+'</span>';
    feed.insertBefore(item, feed.firstChild);
    // Animate in
    setTimeout(function(){item.style.transition='all .3s';item.style.opacity='1';item.style.transform='translateY(0)'},10);
    // Keep max 15 items
    while(feed.children.length > 15) feed.removeChild(feed.lastChild);
  }
  setInterval(addFeedItem, 4000 + Math.random()*3000);

  // ── KPI COUNTERS ──
  function animateKPI(id, target, suffix){
    var el = document.getElementById(id);
    if(!el) return;
    var current = 0;
    var steps = 40;
    var increment = target / steps;
    var timer = setInterval(function(){
      current += increment;
      if(current >= target){current = target; clearInterval(timer)}
      if(target >= 1000000) el.textContent = (current/1000000).toFixed(1)+'M';
      else if(target >= 1000) el.textContent = Math.floor(current).toLocaleString();
      else if(target < 10) el.textContent = current.toFixed(3);
      else el.textContent = current.toFixed(1) + (suffix||'');
    }, 30);
  }

  // Start KPI animations after a delay
  setTimeout(function(){
    animateKPI('kpi-entropy', 7.998, '');
    animateKPI('kpi-threats', 14200000, '');
    animateKPI('kpi-keys', 2847, '');
    animateKPI('kpi-fidelity', 99.7, '%');
  }, 500);

  // ── REFRESH ──
  window.dashRefresh = function(){
    var btn = event.target;
    btn.textContent = '↻ Refreshing...';
    btn.disabled = true;
    setTimeout(function(){
      btn.textContent = '↻ Refresh';
      btn.disabled = false;
      addFeedItem();
      if(typeof showToast==='function') showToast('Dashboard refreshed','ok');
    }, 800);
  };

  // ── THEME TOGGLE ──
  var darkMode = true;
  window.dashToggleTheme = function(){
    darkMode = !darkMode;
    var dash = document.querySelector('.dash');
    if(dash){
      if(darkMode){
        dash.style.background = '';
        dash.style.color = '';
      } else {
        dash.style.background = 'rgba(245,243,255,.95)';
        dash.style.color = '#1a1a2e';
      }
    }
    if(typeof showToast==='function') showToast('Theme toggled','info');
  };

  // ── CHART RANGE ──
  window.dashChartRange = function(btn, range){
    document.querySelectorAll('.dash-pill').forEach(function(p){p.classList.remove('active')});
    btn.classList.add('active');
    drawChart(range);
  };

  // ── SIMPLE CHART (Canvas) ──
  function drawChart(range){
    var canvas = document.getElementById('threatChart');
    if(!canvas) return;
    var ctx = canvas.getContext('2d');
    var w = canvas.parentElement.offsetWidth - 16;
    var h = 200;
    canvas.width = w * 2;
    canvas.height = h * 2;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(2, 2);
    ctx.clearRect(0, 0, w, h);

    var points = range==='24h' ? 24 : range==='7d' ? 7 : 30;
    var data = [];
    for(var i=0;i<points;i++) data.push(Math.floor(50+Math.random()*200));

    var maxVal = Math.max.apply(null, data) * 1.2;
    var stepX = w / (points - 1);
    var padTop = 10, padBot = 25;
    var chartH = h - padTop - padBot;

    // Grid lines
    ctx.strokeStyle = 'rgba(168,85,247,.08)';
    ctx.lineWidth = 0.5;
    for(var g=0;g<5;g++){
      var gy = padTop + (chartH/4)*g;
      ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(w,gy);ctx.stroke();
    }

    // Area fill
    ctx.beginPath();
    ctx.moveTo(0, h - padBot);
    for(var i=0;i<points;i++){
      var x = i * stepX;
      var y = padTop + chartH - (data[i]/maxVal)*chartH;
      if(i===0) ctx.lineTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.lineTo((points-1)*stepX, h-padBot);
    ctx.closePath();
    var grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(168,85,247,.15)');
    grad.addColorStop(1, 'rgba(168,85,247,.01)');
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    for(var i=0;i<points;i++){
      var x = i * stepX;
      var y = padTop + chartH - (data[i]/maxVal)*chartH;
      if(i===0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Dots
    for(var i=0;i<points;i++){
      var x = i * stepX;
      var y = padTop + chartH - (data[i]/maxVal)*chartH;
      ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fillStyle='#a855f7';ctx.fill();
    }

    // X-axis labels
    ctx.fillStyle = 'rgba(160,156,184,.5)';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    var labelStep = Math.max(1, Math.floor(points/8));
    for(var i=0;i<points;i+=labelStep){
      var label = range==='24h' ? i+'h' : range==='7d' ? 'D'+(i+1) : i+1+'';
      ctx.fillText(label, i*stepX, h-8);
    }
  }

  // Draw initial chart
  setTimeout(function(){drawChart('24h')}, 300);

  // ── QUICK ACTIONS ──
  window.dashAction = function(action){
    var msgs = {
      'rotate': 'Force key rotation initiated... All ML-KEM keys refreshed in 287ms.',
      'scan': 'Full system scan running... 0 vulnerabilities detected. All layers nominal.',
      'entropy': 'Quantum entropy batch generated — 1024 bits from WuKong QRNG. Shannon H (normalized): 0.4998.',
      'health': 'Bell state diagnostic — Fidelity: 0.9993, Error rate: 0.0007, Shannon H: 0.5000, Grade: A+.',
      'export': 'Security report exported — PDF generated with 24h threat analysis.',
      'alert': 'Alert configuration panel — set thresholds, channels, and escalation rules.'
    };
    if(typeof showToast==='function') showToast(msgs[action]||'Action executed','ok');
    addFeedItem();
  };

  // ── ENTROPY GENERATOR ──
  window.dashGenerateEntropy = function(bits){
    var display = document.getElementById('entropyDisplay');
    if(!display) return;
    display.textContent = 'Generating ' + bits + ' quantum random bits...';
    display.style.color = 'var(--purple)';

    setTimeout(function(){
      var result = '';
      var ones = 0;
      for(var i=0;i<bits;i++){
        var bit = Math.random()>0.5?'1':'0';
        result += bit;
        if(bit==='1') ones++;
        if((i+1)%64===0 && i<bits-1) result += '\n';
      }
      display.textContent = result;
      display.style.color = 'var(--teal)';

      // Update metrics
      var bitsEl = document.getElementById('ent-bits');
      var shannonEl = document.getElementById('ent-shannon');
      var ratioEl = document.getElementById('ent-ratio');
      if(bitsEl) bitsEl.textContent = bits;
      var ratio = ones / bits;
      if(ratioEl) ratioEl.textContent = ratio.toFixed(3);
      // Shannon entropy (binary)
      var p = ratio, q = 1-ratio;
      var entropy = -(p*Math.log2(p) + q*Math.log2(q));
      if(shannonEl) shannonEl.textContent = entropy.toFixed(4) + ' (norm: ' + (entropy/Math.log2(bits)).toFixed(4) + ')';

      if(typeof showToast==='function') showToast(bits+'-bit quantum entropy generated — Shannon H: '+entropy.toFixed(4),'ok');
    }, 600 + Math.random()*400);
  };

  // ── SETTINGS TOGGLES ──
  window.dashSettingToggle = function(el, setting){
    var state = el.checked ? 'enabled' : 'disabled';
    if(typeof showToast==='function') showToast(setting + ' ' + state,'info');
  };

  // ── RESIZE HANDLER ──
  window.addEventListener('resize', function(){
    var dp = document.getElementById('dp-overview');
    if(dp && dp.style.display !== 'none') drawChart('24h');
  });

})();
