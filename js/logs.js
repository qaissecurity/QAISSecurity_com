// QAISS Security Logs Panel — Vanilla JS
// Adapted from React InteractiveLogsTable for QAISS quantum security business

var QAISS_LOGS=[
{id:'q1',ts:'2025-03-16T14:32:45Z',level:'success',service:'quantum-rng',msg:'Quantum entropy harvest completed — 72-qubit coherence optimal',dur:'12ms',status:'200',tags:['entropy','qrng','wukong']},
{id:'q2',ts:'2025-03-16T14:32:42Z',level:'warning',service:'threat-detect',msg:'Anomalous lattice signature detected in TLS handshake',dur:'847ms',status:'429',tags:['pqc','lattice','tls']},
{id:'q3',ts:'2025-03-16T14:32:40Z',level:'critical',service:'key-mgmt',msg:'ML-KEM key rotation failed — fallback to backup HSM',dur:'3.2s',status:'503',tags:['ml-kem','hsm','rotation']},
{id:'q4',ts:'2025-03-16T14:32:38Z',level:'info',service:'ai-immune',msg:'Neural threat model retrained on 14.2M new patterns',dur:'1.4s',status:'200',tags:['ai','neural','training']},
{id:'q5',ts:'2025-03-16T14:32:35Z',level:'success',service:'quantum-rng',msg:'QRNG seed distributed to 847 edge nodes',dur:'89ms',status:'200',tags:['qrng','distribution','edge']},
{id:'q6',ts:'2025-03-16T14:32:32Z',level:'critical',service:'threat-detect',msg:'Harvest-now-decrypt-later attack vector identified',dur:'2.1s',status:'500',tags:['hndl','quantum','attack']},
{id:'q7',ts:'2025-03-16T14:32:30Z',level:'info',service:'self-heal',msg:'Self-healing protocol activated — patching vector #QV-2847',dur:'456ms',status:'200',tags:['self-heal','patch','auto']},
{id:'q8',ts:'2025-03-16T14:32:28Z',level:'warning',service:'key-mgmt',msg:'ML-DSA certificate approaching expiry — 48h remaining',dur:'23ms',status:'429',tags:['ml-dsa','certificate','expiry']},
{id:'q9',ts:'2025-03-16T14:32:25Z',level:'success',service:'dashboard',msg:'Real-time monitoring dashboard sync completed',dur:'67ms',status:'200',tags:['dashboard','sync','realtime']},
{id:'q10',ts:'2025-03-16T14:32:22Z',level:'info',service:'ai-immune',msg:'Behavioral anomaly score recalibrated across all zones',dur:'234ms',status:'200',tags:['ai','anomaly','calibration']},
{id:'q11',ts:'2025-03-16T14:32:18Z',level:'warning',service:'quantum-rng',msg:'Qubit decoherence rate above threshold — compensating',dur:'1.8s',status:'429',tags:['decoherence','qubit','threshold']},
{id:'q12',ts:'2025-03-16T14:32:15Z',level:'success',service:'self-heal',msg:'Zero-day vulnerability neutralized in 340ms — no breach',dur:'340ms',status:'200',tags:['zero-day','neutralized','auto']}
];

var logsState={search:'',filterLevel:[],filterService:[],expanded:null};

function toggleLogs(){
var p=document.getElementById('logsPanel');
if(p.classList.contains('open')){p.classList.remove('open')}
else{p.classList.add('open');renderLogs()}
}

function toggleFilters(){
var f=document.getElementById('logsFilters');
f.classList.toggle('open');
if(f.classList.contains('open'))renderFilterTags();
}

function renderFilterTags(){
var levels=[],services=[];
QAISS_LOGS.forEach(function(l){
if(levels.indexOf(l.level)<0)levels.push(l.level);
if(services.indexOf(l.service)<0)services.push(l.service);
});
var lEl=document.getElementById('fLevel');
var sEl=document.getElementById('fService');
lEl.innerHTML='';sEl.innerHTML='';
levels.forEach(function(lv){
var b=document.createElement('button');
b.className='logs-ftag'+(logsState.filterLevel.indexOf(lv)>=0?' active':'');
b.textContent=lv;
b.onclick=function(){toggleFilter('level',lv)};
lEl.appendChild(b);
});
services.forEach(function(sv){
var b=document.createElement('button');
b.className='logs-ftag'+(logsState.filterService.indexOf(sv)>=0?' active':'');
b.textContent=sv;
b.onclick=function(){toggleFilter('service',sv)};
sEl.appendChild(b);
});
}

function toggleFilter(type,val){
var arr=type==='level'?logsState.filterLevel:logsState.filterService;
var idx=arr.indexOf(val);
if(idx>=0)arr.splice(idx,1);else arr.push(val);
updateFilterBadge();
renderFilterTags();
renderLogs();
}

function updateFilterBadge(){
var c=logsState.filterLevel.length+logsState.filterService.length;
var badge=document.getElementById('filterBadge');
if(c>0){badge.style.display='flex';badge.textContent=c}
else{badge.style.display='none'}
}

function filterLogs(){
logsState.search=document.getElementById('logsSearch').value.toLowerCase();
renderLogs();
}

function getFilteredLogs(){
return QAISS_LOGS.filter(function(l){
var matchSearch=!logsState.search||l.msg.toLowerCase().indexOf(logsState.search)>=0||l.service.toLowerCase().indexOf(logsState.search)>=0;
var matchLevel=logsState.filterLevel.length===0||logsState.filterLevel.indexOf(l.level)>=0;
var matchService=logsState.filterService.length===0||logsState.filterService.indexOf(l.service)>=0;
return matchSearch&&matchLevel&&matchService;
});
}

function formatTime(ts){
var d=new Date(ts);
var h=d.getHours();var m=d.getMinutes();var s=d.getSeconds();
return (h<10?'0':'')+h+':'+(m<10?'0':'')+m+':'+(s<10?'0':'')+s;
}

function statusClass(st){
if(st==='200')return 's200';
if(st==='429')return 's429';
if(st==='500'||st==='503')return 's500';
return '';
}

function renderLogs(){
var logs=getFilteredLogs();
var body=document.getElementById('logsBody');
var countEl=document.getElementById('logsCount');
countEl.textContent=logs.length+' of '+QAISS_LOGS.length+' events';
body.innerHTML='';

if(logs.length===0){
body.innerHTML='<div style="padding:24px;text-align:center;color:var(--dim);font-family:var(--mono);font-size:.75rem">No logs match your filters.</div>';
return;
}

logs.forEach(function(log){
var row=document.createElement('div');
row.className='log-row'+(logsState.expanded===log.id?' expanded':'');
row.innerHTML=
'<div class="log-summary">'+
'<span class="log-chevron">▶</span>'+
'<span class="log-level '+log.level+'">'+log.level+'</span>'+
'<span class="log-time">'+formatTime(log.ts)+'</span>'+
'<span class="log-service">'+log.service+'</span>'+
'<span class="log-msg">'+log.msg+'</span>'+
'<span class="log-status '+statusClass(log.status)+'">'+log.status+'</span>'+
'</div>'+
'<div class="log-detail">'+
'<div class="log-detail-label">Message</div>'+
'<div class="log-detail-val">'+log.msg+'</div>'+
'<div class="log-detail-grid">'+
'<div><div class="log-detail-label">Duration</div><div style="font-family:var(--mono);font-size:.7rem;color:var(--text)">'+log.dur+'</div></div>'+
'<div><div class="log-detail-label">Timestamp</div><div style="font-family:var(--mono);font-size:.65rem;color:var(--text)">'+log.ts+'</div></div>'+
'</div>'+
'<div class="log-detail-label">Tags</div>'+
'<div class="log-tags">'+log.tags.map(function(t){return '<span class="log-tag">'+t+'</span>'}).join('')+'</div>'+
'</div>';

row.querySelector('.log-summary').onclick=function(){
logsState.expanded=logsState.expanded===log.id?null:log.id;
renderLogs();
};
body.appendChild(row);
});
}
