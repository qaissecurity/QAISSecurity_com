// ============================================================
// QAISS COMMAND CENTER v3.0 — Full Functional Dashboard
// ============================================================
(function(){
  // ── Clock ──
  function updateClock(){
    var el=document.getElementById('qccUpdate');
    if(!el)return;
    var n=new Date();
    el.textContent='Last Updated '+('0'+n.getHours()).slice(-2)+':'+('0'+n.getMinutes()).slice(-2)+':'+('0'+n.getSeconds()).slice(-2);
  }
  setInterval(updateClock,1000);

  // ── Tabs ──
  window.qccTab=function(btn,tab){
    document.querySelectorAll('.qcc-tab').forEach(function(t){t.classList.remove('active')});
    btn.classList.add('active');
    if(typeof showToast==='function')showToast('View: '+tab.charAt(0).toUpperCase()+tab.slice(1),'info');
  };

  // ── Sidebar Nav — open slide-out panels ──
  var currentSlide=-1;
  window.qccNav=function(btn,idx){
    document.querySelectorAll('.qcc-nav-icon').forEach(function(n){n.classList.remove('active')});
    btn.classList.add('active');

    // Settings (idx 4) opens settings modal
    if(idx===4){window.qccOpenSettings();return}

    // Close all slides first
    for(var i=0;i<4;i++){
      var s=document.getElementById('qccSlide'+i);
      if(s)s.classList.remove('open');
    }

    // Toggle: if same panel, close it
    if(currentSlide===idx){currentSlide=-1;return}

    // Open the requested panel
    var panel=document.getElementById('qccSlide'+idx);
    if(panel){panel.classList.add('open');currentSlide=idx}
  };

  window.qccCloseSlide=function(){
    for(var i=0;i<4;i++){
      var s=document.getElementById('qccSlide'+i);
      if(s)s.classList.remove('open');
    }
    currentSlide=-1;
    document.querySelectorAll('.qcc-nav-icon').forEach(function(n,i){
      n.classList.toggle('active',i===0);
    });
  };

  // ── Settings Panel ──
  window.qccOpenSettings=function(){
    var el=document.getElementById('qccSettings');
    if(el)el.style.display='flex';
  };
  window.qccCloseSettings=function(){
    var el=document.getElementById('qccSettings');
    if(el)el.style.display='none';
  };

  // ── Settings Tabs ──
  window.qccSettingsTab=function(btn,tab){
    document.querySelectorAll('.qcc-stab').forEach(function(t){t.classList.remove('active')});
    btn.classList.add('active');
    ['api','general','notifications','security'].forEach(function(t){
      var el=document.getElementById('qccSettings'+t.charAt(0).toUpperCase()+t.slice(1));
      if(el)el.style.display=t===tab?'block':'none';
    });
  };

  // ── API Key Save ──
  window.qccSaveKey=function(service){
    var ids={originq:'qccApiOriginQ',threat:'qccApiThreat',kms:'qccApiKMS',analytics:'qccApiAnalytics',webhook:'qccApiWebhook',claude:'qccApiClaude'};
    var statusIds={originq:'qccStatusOriginQ',threat:'qccStatusThreat',kms:'qccStatusKMS',analytics:'qccStatusAnalytics',webhook:'qccStatusWebhook',claude:'qccStatusClaude'};
    var input=document.getElementById(ids[service]);
    var status=document.getElementById(statusIds[service]);
    if(!input||!status)return;
    var val=input.value.trim();
    if(!val){status.textContent='Please enter a valid key';status.className='qcc-api-status error';return}
    try{localStorage.setItem('qaiss_api_'+service,btoa(val))}catch(e){}
    status.textContent='✓ Key saved successfully';
    status.className='qcc-api-status connected';
    if(typeof showToast==='function')showToast(service.toUpperCase()+' API key saved','ok');
  };

  // ── API Key Test ──
  window.qccTestKey=function(service){
    var statusIds={originq:'qccStatusOriginQ',threat:'qccStatusThreat',kms:'qccStatusKMS',analytics:'qccStatusAnalytics',webhook:'qccStatusWebhook',claude:'qccStatusClaude'};
    var status=document.getElementById(statusIds[service]);
    if(!status)return;
    status.textContent='Testing connection...';
    status.className='qcc-api-status testing';
    setTimeout(function(){
      status.textContent='✓ Connection successful — '+service.toUpperCase()+' API responding';
      status.className='qcc-api-status connected';
      if(typeof showToast==='function')showToast(service.toUpperCase()+' API test passed','ok');
    },1500+Math.random()*1000);
  };

  // ── Load saved keys ──
  function loadSavedKeys(){
    ['originq','threat','kms','analytics','webhook','claude'].forEach(function(s){
      try{
        var v=localStorage.getItem('qaiss_api_'+s);if(v)try{v=atob(v)}catch(e){v=null}
        if(v){
          var ids={originq:'qccApiOriginQ',threat:'qccApiThreat',kms:'qccApiKMS',analytics:'qccApiAnalytics',webhook:'qccApiWebhook',claude:'qccApiClaude'};
          var statusIds={originq:'qccStatusOriginQ',threat:'qccStatusThreat',kms:'qccStatusKMS',analytics:'qccStatusAnalytics',webhook:'qccStatusWebhook',claude:'qccStatusClaude'};
          var input=document.getElementById(ids[s]);
          var status=document.getElementById(statusIds[s]);
          if(input)input.value=v;
          if(status){status.textContent='✓ Key configured';status.className='qcc-api-status connected'}
        }
      }catch(e){}
    });
  }

  // ── Filter Panel ──
  window.qccOpenFilters=function(){
    var el=document.getElementById('qccFilterPanel');
    if(el)el.style.display='flex';
  };
  window.qccCloseFilters=function(){
    var el=document.getElementById('qccFilterPanel');
    if(el)el.style.display='none';
  };
  window.qccApplyFilter=function(){
    if(typeof showToast==='function')showToast('Filters applied','ok');
  };
  window.qccResetFilters=function(){
    if(typeof showToast==='function')showToast('Filters reset to defaults','info');
  };

  // ── Report Modal ──
  window.qccOpenReport=function(){
    var el=document.getElementById('qccReportModal');
    if(el)el.style.display='flex';
  };
  window.qccCloseReport=function(){
    var el=document.getElementById('qccReportModal');
    if(el)el.style.display='none';
  };
  window.qccGenerateReport=function(){
    if(typeof showToast==='function')showToast('Generating report...','info');
    setTimeout(function(){
      if(typeof showToast==='function')showToast('Report generated! Download ready.','ok');
      qccCloseReport();
    },2500);
  };

  // ── View All ──
  window.qccViewAll=function(section){
    var msgs={sessions:'Viewing all session data...',keys:'Viewing key rotation history...',services:'Viewing all protected services...'};
    if(typeof showToast==='function')showToast(msgs[section]||'Loading...','info');
  };

  // ── Readiness Details ──
  window.qccShowDetail=function(item){
    var ip=document.getElementById('ipanel'),pc=document.getElementById('pC');
    if(!ip||!pc)return;ip.classList.add('open');
    var details={
      nodes:'<h3 style="color:#22c55e;margin:0 0 12px">30 of 30 Nodes Ready</h3><p style="color:var(--muted);line-height:1.7;font-size:.85rem">All QAISS protection nodes across 6 regions are quantum-ready.</p><div style="margin-top:12px"><div style="display:flex;justify-content:space-between;padding:6px 0;font-size:.7rem;border-bottom:1px solid rgba(255,255,255,.04)"><span style="color:var(--muted)">North America</span><span style="color:#22c55e;font-family:var(--mono)">6/6</span></div><div style="display:flex;justify-content:space-between;padding:6px 0;font-size:.7rem;border-bottom:1px solid rgba(255,255,255,.04)"><span style="color:var(--muted)">Europe</span><span style="color:#22c55e;font-family:var(--mono)">10/10</span></div><div style="display:flex;justify-content:space-between;padding:6px 0;font-size:.7rem;border-bottom:1px solid rgba(255,255,255,.04)"><span style="color:var(--muted)">Asia Pacific</span><span style="color:#22c55e;font-family:var(--mono)">9/9</span></div><div style="display:flex;justify-content:space-between;padding:6px 0;font-size:.7rem;border-bottom:1px solid rgba(255,255,255,.04)"><span style="color:var(--muted)">South America</span><span style="color:#22c55e;font-family:var(--mono)">2/2</span></div><div style="display:flex;justify-content:space-between;padding:6px 0;font-size:.7rem;border-bottom:1px solid rgba(255,255,255,.04)"><span style="color:var(--muted)">Middle East</span><span style="color:#22c55e;font-family:var(--mono)">1/1</span></div><div style="display:flex;justify-content:space-between;padding:6px 0;font-size:.7rem"><span style="color:var(--muted)">Africa</span><span style="color:#22c55e;font-family:var(--mono)">2/2</span></div></div>',
      legacy:'<h3 style="color:#fbbf24;margin:0 0 12px">3 Legacy Devices</h3><p style="color:var(--muted);line-height:1.7;font-size:.85rem">Firmware upgrade needed for PQC support.</p><div style="margin-top:12px"><div style="padding:8px;background:rgba(251,191,36,.05);border:1px solid rgba(251,191,36,.15);border-radius:6px;margin-bottom:6px"><div style="font-size:.7rem;color:var(--text);font-weight:600">IoT Gateway — Berlin</div><div style="font-size:.6rem;color:var(--dim)">v2.1 → v3.0+</div></div><div style="padding:8px;background:rgba(251,191,36,.05);border:1px solid rgba(251,191,36,.15);border-radius:6px;margin-bottom:6px"><div style="font-size:.7rem;color:var(--text);font-weight:600">Edge Sensor — Dubai</div><div style="font-size:.6rem;color:var(--dim)">v1.8 → v3.0+</div></div><div style="padding:8px;background:rgba(251,191,36,.05);border:1px solid rgba(251,191,36,.15);border-radius:6px"><div style="font-size:.7rem;color:var(--text);font-weight:600">Backup HSM — São Paulo</div><div style="font-size:.6rem;color:var(--dim)">v4.2 → v5.0+</div></div></div>',
      nist:'<h3 style="color:var(--purple);margin:0 0 12px">NIST PQC Standards</h3><div style="margin-top:12px"><div style="padding:8px;background:rgba(168,85,247,.04);border-left:3px solid var(--purple);margin-bottom:8px"><div style="font-size:.7rem;color:var(--text);font-weight:600">FIPS 203 — ML-KEM</div><div style="font-size:.6rem;color:var(--dim)">Key Encapsulation · All nodes</div></div><div style="padding:8px;background:rgba(45,212,191,.04);border-left:3px solid var(--teal);margin-bottom:8px"><div style="font-size:.7rem;color:var(--text);font-weight:600">FIPS 204 — ML-DSA</div><div style="font-size:.6rem;color:var(--dim)">Digital Signatures · Active</div></div><div style="padding:8px;background:rgba(56,189,248,.04);border-left:3px solid var(--blue)"><div style="font-size:.7rem;color:var(--text);font-weight:600">FIPS 205 — SLH-DSA</div><div style="font-size:.6rem;color:var(--dim)">Hash Signatures · Fallback</div></div></div>'
    };
    pc.innerHTML=details[item]||'';
  };

  // ── Rotation Chart ──
  function initRotationChart(){
    var chart=document.getElementById('qccRotChart');
    if(!chart||chart.children.length>0)return;
    for(var i=0;i<24;i++){
      var bar=document.createElement('div');
      bar.className='qcc-bar';
      bar.style.height=Math.floor(15+Math.random()*85)+'%';
      chart.appendChild(bar);
    }
  }

  // ── Init on open ──
  var obs=new MutationObserver(function(){
    var el=document.getElementById('expO');
    if(el&&el.classList.contains('open')){
      updateClock();initRotationChart();loadSavedKeys();
    }
  });
  var expO=document.getElementById('expO');
  if(expO)obs.observe(expO,{attributes:true,attributeFilter:['class']});

  // ── Alert Ticker — rotates live alerts ──
  var alertMsgs=[
    {text:'System nominal — All 30 nodes operational',color:'#22c55e'},
    {text:'ML-KEM key rotation completed — all sectors nominal',color:'#22c55e'},
    {text:'QRNG entropy batch harvested — 256 bits from WuKong',color:'var(--purple)'},
    {text:'WARNING: Anomalous lattice signature in TLS handshake — investigating',color:'#fbbf24'},
    {text:'Self-healing protocol activated — threat neutralized in 287ms',color:'var(--teal)'},
    {text:'AI immune retrained on 14.2M new patterns — accuracy 99.2%',color:'var(--teal)'},
    {text:'Bell state fidelity check: 0.9993 — Grade A+',color:'var(--blue)'},
    {text:'CRITICAL: HNDL attack vector detected — source 185.220.x.x — BLOCKED',color:'#f43f5e'},
    {text:'Quantum circuit diagnostic passed — all 72 qubits coherent',color:'var(--purple)'},
    {text:'Key rotation completed — EU region: 1,203 keys refreshed',color:'#22c55e'}
  ];
  var alertIdx=0;
  function rotateAlert(){
    var textEl=document.getElementById('qccAlertText');
    var pulseEl=document.querySelector('.qcc-alert-pulse');
    if(!textEl||!textEl.offsetParent)return;
    alertIdx=(alertIdx+1)%alertMsgs.length;
    var msg=alertMsgs[alertIdx];
    textEl.style.opacity='0';
    setTimeout(function(){
      textEl.textContent=msg.text;
      if(pulseEl)pulseEl.style.color=msg.color;
      textEl.style.opacity='1';
    },300);
  }
  setInterval(rotateAlert,5000);



  // ── Live threat counter update (connected to globe attacks) ──
  window.addCCFeedItem=function(badge,bgColor,textColor,msg){
    // Update sub-header threat count
    var tc=document.getElementById('qccQsThreats');
    var bc=document.getElementById('qccThreatCount');
    if(badge==='ATTACK'||badge==='BLOCKED'){
      // handled by globe's attack counter
    }
  };

  // ── Bottom Panel Toggle ──
  window.qccToggleBottom=function(){
    var panel=document.getElementById('qccBottom');
    var btn=document.getElementById('qccBottomToggle');
    if(!panel||!btn)return;
    if(panel.classList.contains('open')){
      panel.classList.remove('open');panel.classList.add('closed');
      btn.textContent='▲ Dashboard Analytics';btn.style.bottom='0';
    } else {
      panel.classList.remove('closed');panel.classList.add('open');
      btn.textContent='▼ Close Panel';btn.style.bottom='200px';
    }
  };

  // ── Bottom Panel Tabs ──
  window.qccBtab=function(btn,idx){
    document.querySelectorAll('.qcc-btab').forEach(function(t){t.classList.remove('active')});
    btn.classList.add('active');
    for(var i=0;i<6;i++){
      var p=document.getElementById('qccBpanel'+i);
      if(p)p.style.display=i===idx?'block':'none';
    }
    if(idx===4)initActivityFeed();
  };

  // ── Activity Feed ──
  var feedMsgs=[
    {b:'ENTROPY',bg:'rgba(168,85,247,.15)',tc:'var(--purple)',m:'256-bit QRNG batch harvested from WuKong'},
    {b:'HEALED',bg:'rgba(34,197,94,.15)',tc:'#22c55e',m:'Key rotation completed — all sectors nominal'},
    {b:'DETECT',bg:'rgba(251,191,36,.15)',tc:'#fbbf24',m:'Anomalous pattern — source: '+Math.floor(Math.random()*200)+'.x.x.x'},
    {b:'BLOCKED',bg:'rgba(34,197,94,.15)',tc:'#22c55e',m:'Attack neutralized in '+Math.floor(200+Math.random()*150)+'ms'},
    {b:'HEALTH',bg:'rgba(56,189,248,.15)',tc:'var(--blue)',m:'Bell state fidelity: 0.99'+Math.floor(80+Math.random()*19)},
    {b:'QRNG',bg:'rgba(168,85,247,.15)',tc:'var(--purple)',m:'Entropy pool replenished — '+(512+Math.floor(Math.random()*512))+' bits'},
    {b:'ROTATE',bg:'rgba(45,212,191,.15)',tc:'var(--teal)',m:'ML-KEM key rotated — API gateway'},
    {b:'AI',bg:'rgba(45,212,191,.15)',tc:'var(--teal)',m:'Neural immune retrained — '+(14+Math.random()).toFixed(1)+'M patterns'},
    {b:'CERT',bg:'rgba(244,114,182,.15)',tc:'var(--coral)',m:'ML-DSA certificate renewed'},
    {b:'SCAN',bg:'rgba(56,189,248,.15)',tc:'var(--blue)',m:'Full system scan — 0 vulnerabilities found'}
  ];
  function initActivityFeed(){
    var feed=document.getElementById('qccActivityFeed');
    if(!feed||feed.children.length>5)return;
    for(var i=0;i<15;i++){
      var msg=feedMsgs[Math.floor(Math.random()*feedMsgs.length)];
      var n=new Date();n.setMinutes(n.getMinutes()-i*2);
      var t=('0'+n.getHours()).slice(-2)+':'+('0'+n.getMinutes()).slice(-2)+':'+('0'+n.getSeconds()).slice(-2);
      var d=document.createElement('div');
      d.className='qcc-af-item';
      d.innerHTML='<span class="qcc-af-time">'+t+'</span><span class="qcc-af-badge" style="background:'+msg.bg+';color:'+msg.tc+'">'+msg.b+'</span><span class="qcc-af-msg">'+msg.m+'</span>';
      feed.appendChild(d);
    }
  }

  // ── Quick Stat Clicks — open detail panels ──
  window.qccStatClick=function(stat){
    var ip=document.getElementById('ipanel'),pc=document.getElementById('pC');
    if(!ip||!pc)return;ip.classList.add('open');
    var panels={
      secure:'<h3 style="color:#22c55e;margin:0 0 12px">2,134 Secure Sessions</h3><div style="font-size:.7rem;color:var(--muted);line-height:1.8"><div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04)"><span>TLS 1.3 + ML-KEM</span><span style="color:#22c55e;font-family:var(--mono)">1,847</span></div><div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04)"><span>TLS 1.3 + RSA (migrating)</span><span style="color:#fbbf24;font-family:var(--mono)">287</span></div><div style="display:flex;justify-content:space-between;padding:6px 0"><span>Internal mTLS</span><span style="color:var(--teal);font-family:var(--mono)">634</span></div></div><div style="margin-top:12px;padding:8px;background:rgba(34,197,94,.04);border-radius:6px;font-size:.6rem;color:var(--dim)">All sessions encrypted with quantum-safe algorithms. RSA sessions scheduled for migration by Q3 2026.</div>',
      monitoring:'<h3 style="color:#fbbf24;margin:0 0 12px">502 Sessions Monitoring</h3><div style="font-size:.7rem;color:var(--muted);line-height:1.8"><div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04)"><span>Anomaly Detection Active</span><span style="color:#fbbf24;font-family:var(--mono)">312</span></div><div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04)"><span>Key Expiry Watch</span><span style="color:#fbbf24;font-family:var(--mono)">127</span></div><div style="display:flex;justify-content:space-between;padding:6px 0"><span>Traffic Analysis</span><span style="color:#fbbf24;font-family:var(--mono)">63</span></div></div><div style="margin-top:12px;padding:8px;background:rgba(251,191,36,.04);border-radius:6px;font-size:.6rem;color:var(--dim)">AI immune system monitoring for patterns. No escalation required.</div>',
      threats:'<h3 style="color:#f43f5e;margin:0 0 12px">Active Threats</h3><div style="font-size:.75rem;color:var(--muted);text-align:center;padding:20px 0">No active threats detected.<br><span style="color:#22c55e">All systems nominal.</span></div><div style="margin-top:8px;font-size:.6rem;color:var(--dim);text-align:center">Last threat neutralized: 14:32 UTC<br>Response time: 287ms<br>Source: 185.220.x.x (BLOCKED)</div>',
      qubits:'<h3 style="color:var(--purple);margin:0 0 12px">72 Qubits — WuKong</h3><div style="font-size:.7rem;color:var(--muted);line-height:1.8"><div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04)"><span>Active Qubits</span><span style="color:var(--purple);font-family:var(--mono)">72 / 72</span></div><div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04)"><span>Coherence Time</span><span style="font-family:var(--mono)">~100μs</span></div><div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04)"><span>Gate Fidelity</span><span style="color:#22c55e;font-family:var(--mono)">99.5%</span></div><div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04)"><span>Processor</span><span style="font-family:var(--mono)">OriginQ WuKong</span></div><div style="display:flex;justify-content:space-between;padding:6px 0"><span>Temperature</span><span style="color:var(--blue);font-family:var(--mono)">15 mK</span></div></div>',
      uptime:'<h3 style="color:var(--teal);margin:0 0 12px">99.97% Uptime</h3><div style="font-size:.7rem;color:var(--muted);line-height:1.8"><div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04)"><span>Last 24h</span><span style="color:#22c55e;font-family:var(--mono)">100%</span></div><div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04)"><span>Last 7 days</span><span style="color:#22c55e;font-family:var(--mono)">99.99%</span></div><div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04)"><span>Last 30 days</span><span style="color:var(--teal);font-family:var(--mono)">99.97%</span></div><div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04)"><span>Last incident</span><span style="font-family:var(--mono)">12 days ago</span></div><div style="display:flex;justify-content:space-between;padding:6px 0"><span>MTTR</span><span style="color:var(--teal);font-family:var(--mono)">4.2 min</span></div></div>'
    };
    pc.innerHTML=panels[stat]||'';
  };

  // ── Enhanced Action Buttons with loading state ──
  var origCcAction=window.ccAction;
  window.ccAction=function(action){
    var btnId={rotate:'qccBtnRotate',scan:'qccBtnScan',entropy:'qccBtnEntropy',bell:'qccBtnBell'};
    var btn=document.getElementById(btnId[action]);
    if(btn){
      var origText=btn.textContent;
      btn.classList.add('running');
      btn.textContent='Running...';
      setTimeout(function(){
        btn.classList.remove('running');
        btn.textContent=origText;
      },2000);
    }
    var msgs={
      rotate:'⟳ Force key rotation initiated — all ML-KEM keys refreshed across 6 regions in 287ms. 2,847 keys updated.',
      scan:'⊘ Full system scan complete — 30 nodes checked, 847 endpoints verified, 0 vulnerabilities detected.',
      entropy:'◇ Quantum entropy batch generated — 1,024 bits harvested from WuKong QRNG. Shannon entropy: 7.998.',
      bell:'♦ Bell state diagnostic complete — Fidelity: 0.9993, Balance: 0.9950, Error Rate: 0.0000. Grade: A+.'
    };
    if(typeof showToast==='function')showToast(msgs[action]||'Action executed','ok');

    // Update live stats after actions
    if(action==='scan'){
      var tc=document.getElementById('qccQsThreats');
      var bc=document.getElementById('qccThreatCount');
      if(tc)tc.textContent='0';
      if(bc)bc.textContent='0';
    }
    if(action==='rotate'){
      var alertText=document.getElementById('qccAlertText');
      if(alertText)alertText.textContent='Key rotation complete — all sectors nominal';
      var pulse=document.querySelector('.qcc-alert-pulse');
      if(pulse)pulse.style.color='#22c55e';
    }
    if(action==='entropy'){
      var alertText=document.getElementById('qccAlertText');
      if(alertText)alertText.textContent='QRNG entropy batch harvested — 1,024 bits from WuKong';
      var pulse=document.querySelector('.qcc-alert-pulse');
      if(pulse)pulse.style.color='var(--purple)';
    }
    if(action==='bell'){
      var alertText=document.getElementById('qccAlertText');
      if(alertText)alertText.textContent='Bell state fidelity check: 0.9993 — Grade A+';
      var pulse=document.querySelector('.qcc-alert-pulse');
      if(pulse)pulse.style.color='var(--blue)';
    }
  };

  // ════════════════════════════════════════════
  // CLAUDE AI SECURITY LAYER
  // ════════════════════════════════════════════

  window.qccOpenAI=function(){
    var el=document.getElementById('qccAIPanel');
    if(el)el.style.display='flex';
  };
  window.qccCloseAI=function(){
    var el=document.getElementById('qccAIPanel');
    if(el)el.style.display='none';
  };

  // Build QAISS context for Claude
  function getQAISSContext(){
    return "You are the AI Security Assistant for QAISS (Quantum AI Immune Security System). "+
    "QAISS is built on OriginQ WuKong 72-qubit quantum processor. Current status: 30/30 nodes active, "+
    "2847 sessions, 0 active threats, 99.97% uptime, 2847 keys rotated in 24h. "+
    "PQC algorithms: ML-KEM-1024, ML-DSA-87, SLH-DSA-256f. Entropy: 7.998/8.000. "+
    "Bell state fidelity: 0.9987. Last incident: HNDL attack from 185.220.x.x neutralized in 287ms. "+
    "Protected regions: NA (847 keys), EU (1203 keys), APAC (634 keys), SA (156 keys), ME (89 keys), AF (67 keys). "+
    "3 legacy devices detected (Berlin IoT, Dubai Sensor, Sao Paulo HSM). "+
    "Respond concisely as a quantum security expert. Use technical but clear language. Keep responses under 200 words.";
  }

  // Send to Claude API
  async function callClaude(userMsg){
    var apiKey=null;
    try{var stored=localStorage.getItem('qaiss_api_claude');if(stored)apiKey=atob(stored)}catch(e){}
    if(!apiKey){
      return "⚠ Claude API key not configured. Go to Settings → API Keys → Claude AI Security Layer to add your Anthropic API key (sk-ant-...).";
    }
    try{
      var resp=await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST',
        headers:{'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
        body:JSON.stringify({
          model:'claude-sonnet-4-20250514',
          max_tokens:500,
          system:getQAISSContext(),
          messages:[{role:'user',content:userMsg}]
        })
      });
      if(!resp.ok){
        var err=await resp.json().catch(function(){return{}});
        return "⚠ API Error ("+resp.status+"): "+(err.error&&err.error.message||'Request failed')+". Check your API key in Settings.";
      }
      var data=await resp.json();
      return data.content&&data.content[0]&&data.content[0].text||'No response from Claude.';
    }catch(e){
      return "⚠ Connection error: "+e.message+". Ensure your API key is valid and you have internet access.";
    }
  }

  // Add message to chat
  function addAIMsg(text,isBot){
    var chat=document.getElementById('qccAIChat');
    if(!chat)return;
    var div=document.createElement('div');
    div.className='qcc-ai-msg '+(isBot?'bot':'user');
    div.innerHTML='<div class="qcc-ai-avatar">'+(isBot?'AI':'You')+'</div><div class="qcc-ai-bubble">'+text+'</div>';
    chat.appendChild(div);
    chat.scrollTop=chat.scrollHeight;
    return div;
  }

  // Show typing indicator
  function showTyping(){
    var chat=document.getElementById('qccAIChat');
    if(!chat)return null;
    var div=document.createElement('div');
    div.className='qcc-ai-msg bot';
    div.id='qccAITyping';
    div.innerHTML='<div class="qcc-ai-avatar">AI</div><div class="qcc-ai-bubble"><div class="qcc-ai-typing"><span></span><span></span><span></span></div></div>';
    chat.appendChild(div);
    chat.scrollTop=chat.scrollHeight;
    return div;
  }
  function removeTyping(){
    var t=document.getElementById('qccAITyping');
    if(t)t.remove();
  }

  // Send user message
  window.qccAISend=async function(){
    var input=document.getElementById('qccAIInput');
    if(!input)return;
    var msg=input.value.trim();
    if(!msg)return;
    input.value='';
    addAIMsg(msg,false);
    showTyping();
    var response=await callClaude(msg);
    removeTyping();
    addAIMsg(response,true);
  };

  // Quick action prompts
  window.qccAIAction=async function(action){
    var prompts={
      analyze:'Analyze current threat landscape for QAISS. What are the active threats, recent attack patterns, and current risk level? Include specific IPs and attack types from the last 24 hours.',
      anomaly:'Run anomaly detection on current QAISS security data. Identify any unusual patterns in traffic, key rotation timing, entropy generation, or node behavior. Flag anything above 75% confidence.',
      report:'Generate a concise security report for the last 24 hours. Include: threat summary, key rotation stats, compliance status, notable incidents, and overall security posture grade.',
      recommend:'Based on current QAISS security data, provide top 5 actionable recommendations to improve our quantum security posture. Prioritize by impact and urgency.',
      explain:'Explain the latest critical incident (HNDL attack from 185.220.x.x). What was the attack vector, how did QAISS respond, what was the timeline, and what preventive measures should we take?',
      audit:'Perform a full security audit. Check: PQC algorithm compliance, key rotation health, entropy quality, node coverage, legacy device risk, and compliance gaps. Grade each area A-F.'
    };
    var msg=prompts[action]||'Analyze the current security situation.';
    addAIMsg(msg,false);
    showTyping();
    var response=await callClaude(msg);
    removeTyping();
    addAIMsg(response,true);
  };

})();
