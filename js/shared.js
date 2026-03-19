// QAISS Shared JS v2.0

// PAGE LOADER
window.addEventListener('load',function(){setTimeout(function(){var l=document.getElementById('pageLoader');if(l)l.classList.add('done')},600)});

// BACK TO TOP
window.addEventListener('scroll',function(){
  var b=document.getElementById('btt');if(b)b.classList.toggle('show',scrollY>500);
  var n=document.getElementById('navbar');if(n)n.classList.toggle('scrolled',scrollY>60);
  var prog=document.getElementById('scrollProg');if(prog){var h=document.documentElement.scrollHeight-window.innerHeight;prog.style.width=h>0?(scrollY/h*100)+'%':'0%';}
});

// TOAST NOTIFICATIONS
function showToast(msg,type){type=type||"info";var c=document.getElementById("toastContainer");if(!c){c=document.createElement("div");c.id="toastContainer";c.className="toast-container";document.body.appendChild(c)}var t=document.createElement("div");var icon=type==="ok"?"\u2713":type==="err"?"\u2717":"\u2139";t.className="toast toast-"+type;t.innerHTML="<span>"+icon+"</span><span>"+msg+"</span>";c.appendChild(t);setTimeout(function(){t.classList.add("out");setTimeout(function(){t.remove()},300)},4000)}

// MOBILE NAV TOGGLE
function toggleMobileNav(){var hb=document.getElementById("hamburger");if(hb)hb.setAttribute("aria-expanded",hb.getAttribute("aria-expanded")==="true"?"false":"true");var l=document.getElementById("navLinks");var b=document.getElementById("hamburger");var o=document.getElementById("navOverlay");if(l&&b){l.classList.toggle("open");b.classList.toggle("open");if(o)o.classList.toggle("open")}}
document.querySelectorAll(".nav-link").forEach(function(a){a.addEventListener("click",function(){var l=document.getElementById("navLinks");var b=document.getElementById("hamburger");var o=document.getElementById("navOverlay");if(l)l.classList.remove("open");if(b)b.classList.remove("open");if(o)o.classList.remove("open")})});

// SMOOTH SCROLL
function goTo(id){var el=document.getElementById(id);if(el)el.scrollIntoView({behavior:'smooth',block:'start'})}

// MODAL SYSTEM
var MODALS={
qubits:{tag:'HARDWARE',color:'var(--purple)',title:'72-Qubit Quantum Processor',body:'<p>The Origin WuKong chip contains <strong>198 physical qubits total</strong>: 72 functional working qubits and 126 coupler qubits.</p><div class="mstat"><div class="ms"><div class="ms-v" style="color:var(--purple)">72</div><div class="ms-l">Working qubits</div></div><div class="ms"><div class="ms-v" style="color:var(--teal)">126</div><div class="ms-l">Coupler qubits</div></div><div class="ms"><div class="ms-v" style="color:var(--coral)">198</div><div class="ms-l">Total qubits</div></div></div><p>72 qubits is enough to run meaningful quantum algorithms — Shor\'s algorithm components, Grover\'s search, variational eigensolvers, and quantum autoencoders.</p><p><strong>Cloud access:</strong> QAISS connects to WuKong via QCloudService (pyqpanda3 SDK) with automatic fallback to CPUQVM when hardware is under maintenance.</p>'},
response:{tag:'PERFORMANCE',color:'var(--coral)',title:'Sub-Millisecond Classical Response',body:'<p>When QAISS detects a threat, the <strong>classical automation layer</strong> executes the response in under 1 millisecond. Note: The fast response comes from the classical security orchestration, not from quantum processing itself. Quantum jobs (QRNG, key generation) are queued asynchronously.</p><h3>What the classical layer does in &lt;1ms</h3><ul><li>Compromised node isolated from network</li><li>Pre-generated quantum keys rotated into place</li><li>Threat signature queued for network distribution</li><li>Fresh quantum entropy batch requested (async)</li></ul><p><em>Quantum cloud API latency is typically 100ms-2s per job. QAISS pre-generates entropy and keys in batches, so the response layer always has fresh quantum material ready.</em></p>'},
selfheal:{tag:'CAPABILITY',color:'var(--teal)',title:'Self-Healing Defense',body:'<p>QAISS doesn\'t just detect threats — it <strong>heals itself and gets stronger</strong> from every attack.</p><h3>The healing process</h3><ul><li><strong>Detection:</strong> Quantum AI identifies the threat</li><li><strong>Isolation:</strong> Affected nodes quarantined in &lt;1ms</li><li><strong>Analysis:</strong> Threat deconstructed into signature</li><li><strong>Vaccination:</strong> Signature distributed network-wide</li><li><strong>Evolution:</strong> Quantum GAN generates variations to stress-test</li></ul>'},
qrng:{tag:'LAYER 1',color:'var(--purple)',title:'Quantum Random Number Generation',body:'<p>QRNG is the heartbeat of QAISS — true randomness from quantum physics.</p><ul><li>Hadamard gates create superposition on WuKong\'s qubits</li><li>Each measurement collapses to 0 or 1 with genuine quantum randomness</li><li>Output validated against NIST SP 800-90B tests</li><li>Shannon entropy (normalized) validates output quality — target: &gt;0.99</li></ul><p><strong>QCloudService integration:</strong> Circuits run on WuKong via pyqpanda3 with automatic CPUQVM fallback. CLI: <code>--cloud --output results.json</code></p>'},
qkd:{tag:'LAYER 1',color:'var(--purple)',title:'Quantum Key Distribution',body:'<p>QKD uses quantum mechanics for <strong>physically guaranteed security</strong>.</p><ul><li><strong>BB84:</strong> Single-photon polarization — eavesdropping disturbs quantum states</li><li><strong>E91:</strong> Entanglement-based — Bell inequality violations verify no interception</li></ul>'},
pqc:{tag:'LAYER 1',color:'var(--purple)',title:'Post-Quantum Cryptography',body:'<p>QAISS implements all three NIST PQC standards:</p><ul><li><strong>FIPS 203 — ML-KEM (Kyber):</strong> Lattice-based key encapsulation</li><li><strong>FIPS 204 — ML-DSA (FIPS 204):</strong> Lattice-based digital signatures</li><li><strong>FIPS 205 — SPHINCS+:</strong> Hash-based signature fallback</li></ul>'},
mlkem:{tag:'ALGORITHM',color:'var(--purple)',title:'ML-KEM / Kyber',body:'<p>Lattice-based Key Encapsulation Mechanism — quantum-safe replacement for RSA and ECDH.</p><ul><li>ML-KEM-512: ~128-bit security</li><li>ML-KEM-768: ~192-bit security</li><li>ML-KEM-1024: ~256-bit security (QAISS default)</li></ul>'},
dilithium:{tag:'ALGORITHM',color:'var(--purple)',title:'ML-DSA (FIPS 204)',body:'<p>Lattice-based digital signature scheme for quantum-safe authentication.</p><ul><li>AI agent communication authentication</li><li>Threat signature signing during vaccination</li><li>Model weight integrity verification</li></ul>'},
agility:{tag:'ARCHITECTURE',color:'var(--purple)',title:'Cryptographic Agility',body:'<p>Hot-swap cryptographic algorithms <strong>without changing application code</strong>.</p><ul><li>Abstraction layer between app logic and crypto</li><li>Algorithm selection via configuration</li><li>Automatic failover if weakness detected</li><li>Zero downtime during runtime swap</li></ul>'},
autoencoder:{tag:'LAYER 2',color:'var(--teal)',title:'Quantum Autoencoder',body:'<p>Compresses network traffic into quantum states. <strong>Anomalies produce measurably different reconstructions.</strong></p><ul><li>Features encoded via angle embedding</li><li>Parametrized circuit compresses to latent space on WuKong</li><li>Reconstruction error threshold triggers alert</li></ul>'},
qgan:{tag:'LAYER 2',color:'var(--teal)',title:'Quantum GAN',body:'<p>QAISS\'s <strong>perpetual sparring partner</strong> — continuously invents attacks to sharpen defenses.</p><div class="mstat"><div class="ms"><div class="ms-v" style="color:var(--teal)">0.015</div><div class="ms-l">QGAN MSE</div></div><div class="ms"><div class="ms-v" style="color:var(--dim)">0.078</div><div class="ms-l">Classical MSE</div></div><div class="ms"><div class="ms-v" style="color:var(--amber)">5.2×</div><div class="ms-l">Improvement</div></div></div>'},
behavioral:{tag:'LAYER 2',color:'var(--teal)',title:'Behavioral AI',body:'<p>Learns the <strong>unique behavioral fingerprint</strong> of each network — API patterns, access rhythms, auth sequences.</p>'},
anomaly:{tag:'LAYER 2',color:'var(--teal)',title:'Anomaly Detection',body:'<p>Multi-layer detection: quantum autoencoder + statistical analysis + behavioral ML ensemble.</p>'},
attacksim:{tag:'LAYER 2',color:'var(--teal)',title:'Attack Simulation',body:'<p>Quantum GAN generates <strong>synthetic attack scenarios</strong> to stress-test defenses continuously.</p>'},
hybrid:{tag:'LAYER 2',color:'var(--teal)',title:'Hybrid Inference',body:'<p>Two-stage pipeline: quantum feature extraction on WuKong → classical neural network classification on GPU.</p>'},
isolation:{tag:'LAYER 3',color:'var(--coral)',title:'Auto-Isolation',body:'<p>Compromised nodes isolated from the network in <strong>under 1 millisecond</strong>. No human approval needed.</p>'},
rekey:{tag:'LAYER 3',color:'var(--coral)',title:'Quantum Re-Keying',body:'<p>All cryptographic keys in affected zones rotate instantly using fresh quantum entropy.</p>'},
vaccination:{tag:'LAYER 3',color:'var(--coral)',title:'Digital Vaccination',body:'<p>Every detected threat converted into <strong>permanent network-wide immunity</strong>. Same exploit never works twice.</p>'},
cryptoheal:{tag:'LAYER 3',color:'var(--coral)',title:'Crypto Self-Heal',body:'<p>If cryptographic weakness detected, the system <strong>autonomously switches to stronger algorithms</strong>.</p>'},
immunity:{tag:'LAYER 3',color:'var(--coral)',title:'Network Immunity',body:'<p>When Node A detects an attack, Nodes B through Z are vaccinated before the attacker can pivot. Herd immunity for digital systems.</p>'},
threatmap:{tag:'LAYER 4',color:'var(--blue)',title:'Live Threat Map',body:'<p>Real-time geographic visualization of all network traffic, detections, and responses.</p>'},
entropyhealth:{tag:'LAYER 4',color:'var(--blue)',title:'Entropy Health Monitor',body:'<p>Continuous monitoring of QRNG output quality — Shannon entropy (normalized), NIST tests, autocorrelation.</p><ul><li>Bell state fidelity grading: A+ (&gt;0.98), A (&gt;0.95), B (&gt;0.90), C</li><li>Error rate tracking via |01&rang; and |10&rang; measurement counts</li><li>Results exported as JSON via <code>--output</code> flag</li></ul>'},
aiconf:{tag:'LAYER 4',color:'var(--blue)',title:'AI Confidence Scoring',body:'<p>Transparent display of AI confidence levels with explainable classification reasoning.</p>'},
pqcready:{tag:'LAYER 4',color:'var(--blue)',title:'PQC Migration Readiness',body:'<p>Comprehensive assessment of cryptographic posture with prioritized migration roadmap.</p>'},
evolog:{tag:'LAYER 4',color:'var(--blue)',title:'Evolution Log',body:'<p>Running record of the immune system\'s growing intelligence — patterns learned, vaccinations distributed.</p>'},
api:{tag:'LAYER 4',color:'var(--blue)',title:'Open API',body:'<p>RESTful + WebSocket API for third-party integration. Python and JavaScript SDKs.</p>'},
entropy_info:{tag:'CONCEPT',color:'var(--coral)',title:'Infinite Unpredictability',body:'<p>Quantum randomness is guaranteed by physics — the universe itself doesn\'t "know" the outcome until measurement. No computation can predict it.</p>'},
privacy:{tag:'LEGAL',color:'var(--muted)',title:'Privacy Policy',body:'<p><strong>Last updated:</strong> March 2026</p><h3>Information we collect</h3><p>Only information you voluntarily provide through contact form and newsletter signup.</p><h3>Data protection</h3><p>Your data is protected using quantum-safe encryption. We do not sell or share personal information.</p><h3>Your rights (GDPR)</h3><ul><li>Right to access, rectification, erasure</li><li>Right to data portability</li><li>Right to withdraw consent</li></ul><p>Contact: <span style="color:var(--teal)">qaissecurity@gmail.com</span></p>'},
originpilot:{tag:'PLATFORM',color:'var(--teal)',title:'Origin Pilot — Quantum OS',body:'<p>Released in <strong>February 2026</strong>, Origin Pilot is the world\'s first publicly downloadable quantum computer operating system.</p><div class="mstat"><div class="ms"><div class="ms-v" style="color:var(--teal)">v4.0</div><div class="ms-l">Latest Version</div></div><div class="ms"><div class="ms-v" style="color:var(--purple)">234</div><div class="ms-l">Patents (6th globally)</div></div><div class="ms"><div class="ms-v" style="color:var(--amber)">30M+</div><div class="ms-l">Global Visits</div></div></div><h3>Key features</h3><ul><li><strong>Multi-hardware:</strong> Supports superconducting, trapped ion, and neutral atom qubits</li><li><strong>Hybrid orchestration:</strong> Quantum + classical + AI workflow integration</li><li><strong>Auto-calibration:</strong> Automatic qubit calibration and parallel task execution</li><li><strong>Enterprise PQC:</strong> Post-quantum cryptography tools in Enterprise Edition</li></ul><h3>Why it matters for QAISS</h3><p>Origin Pilot\'s Enterprise Edition includes PQC tools that directly validate QAISS\'s cryptographic layer. The quantum-classical-AI integration architecture mirrors exactly what QAISS implements for security.</p>'},
};

function showModal(key){
  var m=MODALS[key];if(!m)return;
  document.getElementById('modalC').innerHTML='<div class="modal-tag" style="color:'+m.color+'">'+m.tag+'</div><h2>'+m.title+'</h2>'+m.body;
  document.getElementById('modalO').classList.add('open');document.body.classList.add('modal-open');
}
function closeModal(){document.getElementById('modalO').classList.remove('open');document.body.classList.remove('modal-open')}

// 3D EXPLORER
var expRenderer,expScene,expCamera,expActive=-1,expInit=false;
var layerGroups=[],tCamPos={x:0,y:2,z:22},tLookAt={x:0,y:0,z:0};
var isDrag=false,dStart={x:0,y:0},oAngle={x:0,y:0},oTarget={x:0,y:0};
var PAL=[[.659,.333,.969],[.176,.831,.749],[.957,.447,.714],[.220,.741,.973],[.984,.749,.141]];
var EL=[
  {name:'Quantum Entropy Core',tag:'LAYER 01',tl:'The heartbeat — true randomness.',color:0xa855f7,css:'var(--purple)',y:6,ch:['QRNG','QKD','ML-KEM','ML-DSA','SPHINCS+','Agility'],st:[{v:'72',l:'Qubits'},{v:'∞',l:'Entropy'},{v:'Async',l:'Key Gen'}],d1:'WuKong creates superposition states via cloud API. Each qubit collapses with true quantum randomness.',d2:'QKD protocols prove eavesdropping physically disturbs quantum states.'},
  {name:'AI Neural Immune System',tag:'LAYER 02',tl:'The brain — self-learning detection.',color:0x2dd4bf,css:'var(--teal)',y:2,ch:['Autoencoder','QGAN','Behavioral','Anomaly','Attack Sim','Hybrid'],st:[{v:'0.015',l:'MSE'},{v:'94%',l:'Accuracy'},{v:'24/7',l:'Active'}],d1:'Quantum autoencoders compress traffic into quantum states. Anomalies create measurably different states.',d2:'Quantum GAN generates attacks while discriminator learns to detect them.'},
  {name:'Autonomous Self-Healing',tag:'LAYER 03',tl:'Isolate, neutralize, vaccinate.',color:0xf472b6,css:'var(--coral)',y:-2,ch:['Isolation','Re-Key','Vaccination','Response','Self-Heal','Immunity'],st:[{v:'<1ms',l:'Classical Resp.'},{v:'0',l:'Repeats'},{v:'100%',l:'Coverage'}],d1:'Classical automation isolates nodes in <1ms. Pre-generated quantum keys rotate into place.',d2:'Every threat signature distributed network-wide. Same exploit never succeeds twice.'},
  {name:'Command Dashboard',tag:'LAYER 04',tl:'See and control everything.',color:0x38bdf8,css:'var(--blue)',y:-6,ch:['Threats','Entropy','AI Conf','PQC','Evolution','API'],st:[{v:'847',l:'Patterns'},{v:'Live',l:'Stream'},{v:'REST',l:'API'}],d1:'Real-time visibility. Operators see threats detected, isolated, vaccinated.',d2:'Evolution Score tracks growing intelligence. Open API for integration.'}
];
function openExplorer(){
  if(typeof THREE==='undefined'){alert('3D Explorer requires internet access for Three.js.');return}
  initExplorer();document.getElementById('expO').classList.add('open');document.body.classList.add('explorer-open');
  tCamPos={x:0,y:2,z:22};tLookAt={x:0,y:0,z:0};oTarget={x:0,y:0};expActive=-1;
  document.getElementById('epP').classList.remove('hidden');document.getElementById('ipanel').classList.remove('open');
  document.querySelectorAll('.eb').forEach(function(b){b.classList.remove('active')});
}
function closeExplorer(){document.getElementById('expO').classList.remove('open');document.body.classList.remove('explorer-open')}
function focusLayer(i){
  expActive=i;var L=EL[i];document.getElementById('epP').classList.add('hidden');
  tCamPos={x:-8,y:L.y+1,z:12};tLookAt={x:0,y:L.y,z:0};
  layerGroups.forEach(function(g,j){g.children.forEach(function(c){if(c.material){c.material.opacity=j===i?(c.material.opacity<.2?.25:Math.min(c.material.opacity*1.5,1)):(c.material.opacity<.2?.04:Math.min(c.material.opacity*.3,.3))}})});
  document.querySelectorAll('.eb').forEach(function(b,j){b.classList.toggle('active',j===i)});
  document.getElementById('pC').innerHTML='<div class="ipt" style="color:'+L.css+'">'+L.tag+'</div><h2 style="color:'+L.css+'">'+L.name+'</h2><div class="iptl">'+L.tl+'</div><div class="ipch">'+L.ch.map(function(c){return'<span class="ipc2">'+c+'</span>'}).join('')+'</div><div class="ipst">'+L.st.map(function(s){return'<div class="ips"><div class="ipsv" style="color:'+L.css+'">'+s.v+'</div><div class="ipsl">'+s.l+'</div></div>'}).join('')+'</div><h3>How it works</h3><p>'+L.d1+'</p><p>'+L.d2+'</p>';
  document.getElementById('ipanel').classList.add('open');
}
function closePanel(){
  document.getElementById('ipanel').classList.remove('open');expActive=-1;tCamPos={x:0,y:2,z:22};tLookAt={x:0,y:0,z:0};
  document.getElementById('epP').classList.remove('hidden');document.querySelectorAll('.eb').forEach(function(b){b.classList.remove('active')});
}

// KEYBOARD SHORTCUTS
document.addEventListener('keydown',function(e){
  if(document.getElementById('modalO').classList.contains('open')){if(e.key==='Escape')closeModal();return}
  if(document.getElementById('expO').classList.contains('open')){
    if(e.key>='1'&&e.key<='4')focusLayer(+e.key-1);
    if(e.key==='Escape'){if(expActive>=0)closePanel();else closeExplorer()}
  }
});

// SCROLL ANIMATIONS
var obs=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}})},{threshold:.08,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('[data-anim]').forEach(function(el){obs.observe(el)});

// COUNTER ANIMATION
var cO=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var el=e.target,t=+el.dataset.count;if(!t)return;var suffix=el.dataset.suffix||'';var c=0,s=Math.ceil(t/50);var tm=setInterval(function(){c+=s;if(c>=t){c=t;clearInterval(tm)}el.textContent=c+suffix},25);cO.unobserve(el)}})},{threshold:.3});
document.querySelectorAll('[data-count]').forEach(function(el){cO.observe(el)});

// GLOW CURSOR
var gcur=document.getElementById('glowCursor');
if(gcur){document.addEventListener('mousemove',function(e){gcur.style.transform='translate('+(e.clientX-125)+'px,'+(e.clientY-125)+'px)'})}

// COOKIE BANNER
if(!localStorage.getItem('qaiss_cookies')){setTimeout(function(){var c=document.getElementById('cookieBanner');if(c)c.classList.add('show')},2000)}
function acceptCookies(){document.getElementById('cookieBanner').classList.remove('show');try{localStorage.setItem('qaiss_cookies','accepted')}catch(e){}}
function declineCookies(){document.getElementById('cookieBanner').classList.remove('show');try{localStorage.setItem('qaiss_cookies','declined')}catch(e){}}

// FOOTER GIANT TEXT HOVER EFFECT
(function(){
  var giant=document.getElementById('footerGiant');if(!giant)return;
  var svg=giant.querySelector('svg');if(!svg)return;
  var reveal=document.getElementById('ftReveal');if(!reveal)return;
  var outline=giant.querySelector('.ft-outline');
  svg.addEventListener('mousemove',function(e){
    var rect=svg.getBoundingClientRect();
    var cx=((e.clientX-rect.left)/rect.width*100);
    var cy=((e.clientY-rect.top)/rect.height*100);
    reveal.setAttribute('cx',cx+'%');
    reveal.setAttribute('cy',cy+'%');
    if(outline)outline.style.opacity='0.7';
  });
  svg.addEventListener('mouseleave',function(){
    reveal.setAttribute('cx','50%');
    reveal.setAttribute('cy','50%');
    if(outline)outline.style.opacity='0';
  });
})();
// CANVAS VISUALIZATIONS HELPER
function iV(id,fn){var c=document.getElementById(id);if(!c)return;var x=c.getContext('2d');function rs(){c.width=c.parentElement.offsetWidth;c.height=c.parentElement.offsetHeight}rs();window.addEventListener('resize',rs);var f=0;(function l(){requestAnimationFrame(l);x.clearRect(0,0,c.width,c.height);fn(x,c.width,c.height,f++)})()}

// GLOWING BORDER EFFECT (Aceternity-inspired)
(function(){
  // Auto-apply glow-card class to all interactive elements
  var selectors='.tc,.hc,.stat,.demo-panel,.scanner-box,.market-card,.partner,.test-card,.blog-card,.dl-card,.contact-card,.contact-form,.uc2,.rm,.evo,.df,.nl-box,.ly';
  document.querySelectorAll(selectors).forEach(function(el){el.classList.add('glow-card')});
  
  // Track mouse and update glow angle for nearby cards
  document.addEventListener('mousemove',function(e){
    var cards=document.querySelectorAll('.glow-card');
    cards.forEach(function(card){
      var rect=card.getBoundingClientRect();
      var cx=rect.left+rect.width/2;
      var cy=rect.top+rect.height/2;
      var dx=e.clientX-cx;
      var dy=e.clientY-cy;
      var dist=Math.sqrt(dx*dx+dy*dy);
      var proximity=rect.width*0.8+100;
      
      if(dist<proximity){
        var angle=Math.atan2(dy,dx)*180/Math.PI+90;
        var px=((e.clientX-rect.left)/rect.width*100);
        var py=((e.clientY-rect.top)/rect.height*100);
        card.style.setProperty('--glow-angle',angle+'deg');
        card.style.setProperty('--glow-x',Math.max(0,Math.min(100,px))+'%');
        card.style.setProperty('--glow-y',Math.max(0,Math.min(100,py))+'%');
        card.classList.add('glow-active');
      }else{
        card.classList.remove('glow-active');
      }
    });
  },{passive:true});
})();

// Hero Stats — animate immediately on page load (above the fold)
(function(){
  function animateHeroStat(el){
    var t=+el.dataset.count;if(!t)return;
    var suffix=el.dataset.suffix||'';
    var prefix=el.dataset.prefix||'';
    var duration=1200;
    var start=performance.now();
    function step(now){
      var p=Math.min((now-start)/duration,1);
      var ease=1-Math.pow(1-p,3);
      var v=Math.round(ease*t);
      el.textContent=prefix+v+suffix;
      if(p<1)requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  // Start hero counters after a small delay (let page render first)
  setTimeout(function(){
    document.querySelectorAll('[data-anim-hero]').forEach(animateHeroStat);
  },600);
})();
