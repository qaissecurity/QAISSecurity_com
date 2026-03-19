// QAISS Quantum Globe Command Center v3.0
// ════════════════════════════════════════════
// Realistic procedural Earth with attack lines, protection nodes, live counters
// Built on Three.js r128

if(typeof THREE!=='undefined'){
document.getElementById('bgF').classList.add('hidden');
(function(){
var PAL=[[.659,.333,.969],[.178,.831,.749],[.957,.439,.714],[.220,.741,.973],[.984,.749,.149]];
var c=document.getElementById('bg-canvas'),r=new THREE.WebGLRenderer({canvas:c,antialias:true,alpha:true});
r.setSize(innerWidth,innerHeight);r.setPixelRatio(Math.min(devicePixelRatio,2));
var sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,.1,1000);cam.position.z=55;
var N=1500,geo=new THREE.BufferGeometry(),pos=new Float32Array(N*3),col=new Float32Array(N*3),bp=new Float32Array(N*3);
for(var i=0;i<N;i++){var i3=i*3,x=(Math.random()-.5)*130,y=(Math.random()-.5)*130,z=(Math.random()-.5)*90;pos[i3]=x;pos[i3+1]=y;pos[i3+2]=z;bp[i3]=x;bp[i3+1]=y;bp[i3+2]=z;var cl=PAL[~~(Math.random()*5)];col[i3]=cl[0];col[i3+1]=cl[1];col[i3+2]=cl[2]}
geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('color',new THREE.BufferAttribute(col,3));
var mat=new THREE.ShaderMaterial({vertexShader:'varying vec3 vC;void main(){vC=color;vec4 m=modelViewMatrix*vec4(position,1.);gl_PointSize=2.*(80./(-m.z));gl_Position=projectionMatrix*m;}',fragmentShader:'varying vec3 vC;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(vC,smoothstep(.5,.05,d)*.6);}',transparent:true,vertexColors:true,depthWrite:false,blending:THREE.AdditiveBlending});
sc.add(new THREE.Points(geo,mat));
var mx=0,my=0,sy=0;
document.addEventListener('mousemove',function(e){mx=(e.clientX/innerWidth-.5)*2;my=(e.clientY/innerHeight-.5)*2});
window.addEventListener('scroll',function(){sy=scrollY});
!function an(){requestAnimationFrame(an);var t=Date.now()*.00025,pa=geo.attributes.position.array;
for(var i=0;i<N;i++){var i3=i*3;pa[i3]=bp[i3]+Math.sin(t+i*.008)*2;pa[i3+1]=bp[i3+1]+Math.cos(t+i*.012)*1.5;pa[i3+2]=bp[i3+2]+Math.sin(t*.4+i*.015)*1}
geo.attributes.position.needsUpdate=true;
cam.position.x+=(mx*5-cam.position.x)*.015;cam.position.y+=(-my*3-cam.position.y)*.015;
cam.position.z=55-Math.min(sy*.007,18);cam.lookAt(sc.position);r.render(sc,cam)}();
window.addEventListener('resize',function(){cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();r.setSize(innerWidth,innerHeight)});
})();

// QUANTUM GLOBE COMMAND CENTER
// ════════════════════════════════════════════
var expInit=false,expRenderer,expScene,expCamera;
var globeGroup,nodesGroup,arcsGroup,flowGroup,qkdGroup;

var QAISS_NODES=[
  {lat:40.71,lon:-74.01,name:'New York',region:'NA',st:'active'},
  {lat:37.77,lon:-122.42,name:'San Francisco',region:'NA',st:'active'},
  {lat:51.51,lon:-0.13,name:'London',region:'EU',st:'active'},
  {lat:48.86,lon:2.35,name:'Paris',region:'EU',st:'active'},
  {lat:52.52,lon:13.41,name:'Berlin',region:'EU',st:'active'},
  {lat:35.69,lon:139.69,name:'Tokyo',region:'APAC',st:'active'},
  {lat:22.32,lon:114.17,name:'Hong Kong',region:'APAC',st:'active'},
  {lat:1.35,lon:103.82,name:'Singapore',region:'APAC',st:'active'},
  {lat:-33.87,lon:151.21,name:'Sydney',region:'APAC',st:'active'},
  {lat:55.76,lon:37.62,name:'Moscow',region:'EU',st:'monitoring'},
  {lat:39.91,lon:116.39,name:'Beijing',region:'APAC',st:'monitoring'},
  {lat:28.61,lon:77.23,name:'New Delhi',region:'APAC',st:'active'},
  {lat:-23.55,lon:-46.63,name:'Sao Paulo',region:'SA',st:'active'},
  {lat:25.20,lon:55.27,name:'Dubai',region:'ME',st:'active'},
  {lat:44.43,lon:26.10,name:'Bucharest',region:'EU',st:'active'},
  {lat:41.01,lon:28.98,name:'Istanbul',region:'EU',st:'active'},
  {lat:59.33,lon:18.07,name:'Stockholm',region:'EU',st:'active'},
  {lat:35.18,lon:136.91,name:'Nagoya',region:'APAC',st:'active'},
  {lat:34.05,lon:-118.24,name:'Los Angeles',region:'NA',st:'active'},
  {lat:43.65,lon:-79.38,name:'Toronto',region:'NA',st:'active'},
  {lat:-34.60,lon:-58.38,name:'Buenos Aires',region:'SA',st:'active'},
  {lat:30.04,lon:31.24,name:'Cairo',region:'AF',st:'active'},
  {lat:-1.29,lon:36.82,name:'Nairobi',region:'AF',st:'active'},
  {lat:47.50,lon:19.04,name:'Budapest',region:'EU',st:'active'},
  {lat:50.08,lon:14.44,name:'Prague',region:'EU',st:'active'},
  {lat:37.57,lon:126.98,name:'Seoul',region:'APAC',st:'active'},
  {lat:13.76,lon:100.50,name:'Bangkok',region:'APAC',st:'active'},
  {lat:19.43,lon:-99.13,name:'Mexico City',region:'NA',st:'active'},
  {lat:45.46,lon:9.19,name:'Milan',region:'EU',st:'active'},
  {lat:31.23,lon:121.47,name:'Shanghai',region:'APAC',st:'monitoring'}
];

// OriginQ WuKong Hardware Configuration
var QAISS_HARDWARE={
  processor:'OriginQ WuKong 180-qubit',
  sdk:'pyqpanda3 v0.3.4',
  status:'connected',
  qubits:{
    total:180,active:72,
    bestFidelity:{qubit:1,fidelity:0.9973},
    qrngMapping:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
    anomalyMapping:[38,39,40,41],
    bb84Mapping:[42,43],
    bellMapping:[44,45]
  }
};

// Region key rotation stats (simulated)
var REGION_KEYS={
  NA:{rotated:847,pending:12,algo:'ML-KEM-1024',speed:'247ms'},
  EU:{rotated:1203,pending:8,algo:'ML-KEM-1024',speed:'189ms'},
  APAC:{rotated:634,pending:15,algo:'ML-KEM-768',speed:'312ms'},
  SA:{rotated:156,pending:3,algo:'ML-KEM-768',speed:'287ms'},
  ME:{rotated:89,pending:2,algo:'ML-KEM-1024',speed:'198ms'},
  AF:{rotated:67,pending:4,algo:'ML-KEM-768',speed:'345ms'}
};

function latLonToVec3(lat,lon,R){
  var p=(90-lat)*(Math.PI/180),t=(lon+180)*(Math.PI/180);
  return new THREE.Vector3(-(R*Math.sin(p)*Math.cos(t)),R*Math.cos(p),R*Math.sin(p)*Math.sin(t));
}

function makeArc(s,e,col,h){
  var mid=new THREE.Vector3().addVectors(s,e).multiplyScalar(0.5);
  mid.normalize().multiplyScalar(h);
  var curve=new THREE.QuadraticBezierCurve3(s,mid,e);
  var g=new THREE.BufferGeometry().setFromPoints(curve.getPoints(40));
  var m=new THREE.LineBasicMaterial({color:col,transparent:true,opacity:0.6});
  return new THREE.Line(g,m);
}

window.initExplorer=function(){
  if(expInit)return;expInit=true;
  var cv=document.getElementById('expC');
  expRenderer=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
  expRenderer.setSize(innerWidth,innerHeight);
  expRenderer.setPixelRatio(Math.min(devicePixelRatio,2));
  expRenderer.setClearColor(0x020210,1);
  expScene=new THREE.Scene();
  expScene.fog=new THREE.FogExp2(0x020210,.003);
  expCamera=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,.1,500);
  expCamera.position.set(0,8,30);

  globeGroup=new THREE.Group();
  expScene.add(globeGroup);

  // ═══ REALISTIC PROCEDURAL EARTH ═══
  var earthGeo=new THREE.SphereGeometry(10,64,64);
  var earthMat=new THREE.ShaderMaterial({
    uniforms:{time:{value:0}},
    vertexShader:[
      'varying vec3 vNormal;',
      'varying vec3 vPosition;',
      'varying vec2 vUv;',
      'void main(){',
      '  vNormal=normalize(normalMatrix*normal);',
      '  vPosition=position;',
      '  vUv=uv;',
      '  gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);',
      '}'
    ].join('\n'),
    fragmentShader:[
      'uniform float time;',
      'varying vec3 vNormal;',
      'varying vec3 vPosition;',
      'varying vec2 vUv;',
      // Simplex-like noise for continent generation
      'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
      'float noise(vec2 p){',
      '  vec2 i=floor(p),f=fract(p);',
      '  f=f*f*(3.-2.*f);',
      '  float a=hash(i),b=hash(i+vec2(1,0)),c=hash(i+vec2(0,1)),d=hash(i+vec2(1,1));',
      '  return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);',
      '}',
      'float fbm(vec2 p){',
      '  float v=0.,a=.5;',
      '  for(int i=0;i<5;i++){v+=a*noise(p);p*=2.;a*=.5;}',
      '  return v;',
      '}',
      'void main(){',
      // Convert sphere position to lat/lon
      '  float lon=atan(vPosition.x,vPosition.z);',
      '  float lat=asin(clamp(vPosition.y/10.,-1.,1.));',
      // Generate continent mask
      '  float cont=fbm(vec2(lon*2.5+0.3,lat*2.5+0.7)*1.8);',
      '  cont=smoothstep(0.42,0.55,cont);',
      // Ocean color (deep blue-dark)
      '  vec3 ocean=vec3(0.02,0.04,0.12);',
      // Land color (dark green-brown)
      '  vec3 land=vec3(0.04,0.12,0.06);',
      '  vec3 base=mix(ocean,land,cont);',
      // Add ice caps
      '  float iceCap=smoothstep(1.1,1.4,abs(lat)*3.14);',
      '  base=mix(base,vec3(0.15,0.18,0.25),iceCap*0.6);',
      // Subtle grid lines (like satellite imagery grid)
      '  float gridLon=abs(sin(lon*18.))*0.02;',
      '  float gridLat=abs(sin(lat*18.))*0.02;',
      '  base+=vec3(gridLon+gridLat)*0.3;',
      // Fresnel edge glow (atmosphere)
      '  float fresnel=pow(1.-abs(dot(vNormal,vec3(0,0,1.))),3.);',
      '  base+=vec3(0.1,0.15,0.4)*fresnel*0.5;',
      // Purple QAISS accent along terminator
      '  float term=dot(vNormal,normalize(vec3(0.5,0.3,1.)));',
      '  base+=vec3(0.659,0.333,0.969)*smoothstep(0.0,0.15,term)*0.08;',
      // City lights on dark side
      '  float darkSide=smoothstep(0.1,-0.2,term);',
      '  float cities=step(0.72,fbm(vec2(lon*8.,lat*8.)*3.))*cont;',
      '  base+=vec3(1.,0.85,0.5)*cities*darkSide*0.3;',
      '  gl_FragColor=vec4(base,1.);',
      '}'
    ].join('\n')
  });
  globeGroup.add(new THREE.Mesh(earthGeo,earthMat));

  // Atmosphere glow
  var aGeo=new THREE.SphereGeometry(10.3,48,48);
  var aMat=new THREE.ShaderMaterial({
    vertexShader:'varying vec3 vN;void main(){vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:'varying vec3 vN;void main(){float i=pow(.7-dot(vN,vec3(0,0,1.)),2.5);gl_FragColor=vec4(0.2,0.4,0.9,i*0.35);}',
    transparent:true,side:THREE.BackSide,depthWrite:false
  });
  globeGroup.add(new THREE.Mesh(aGeo,aMat));

  // Outer atmosphere haze
  var a2Geo=new THREE.SphereGeometry(10.8,32,32);
  var a2Mat=new THREE.ShaderMaterial({
    vertexShader:'varying vec3 vN;void main(){vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:'varying vec3 vN;void main(){float i=pow(.6-dot(vN,vec3(0,0,1.)),3.);gl_FragColor=vec4(0.659,0.333,0.969,i*0.15);}',
    transparent:true,side:THREE.BackSide,depthWrite:false
  });
  globeGroup.add(new THREE.Mesh(a2Geo,a2Mat));

  // ═══ EDGE NODES (Protection Points) ═══
  nodesGroup=new THREE.Group();globeGroup.add(nodesGroup);
  QAISS_NODES.forEach(function(n,i){
    var pos=latLonToVec3(n.lat,n.lon,10.05);
    var col=n.st==='active'?0x22c55e:0xfbbf24;
    // Node dot
    var d=new THREE.Mesh(new THREE.SphereGeometry(0.1,8,8),new THREE.MeshBasicMaterial({color:col}));
    d.position.copy(pos);d.userData={name:n.name,idx:i};nodesGroup.add(d);
    // Pulse ring
    var rg=new THREE.Mesh(new THREE.RingGeometry(0.15,0.22,16),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:0.4,side:THREE.DoubleSide}));
    rg.position.copy(pos);rg.lookAt(new THREE.Vector3(0,0,0));rg.userData.pp=Math.random()*Math.PI*2;nodesGroup.add(rg);
    // Vertical beacon line
    var beaconEnd=latLonToVec3(n.lat,n.lon,10.6);
    var bGeo=new THREE.BufferGeometry().setFromPoints([pos,beaconEnd]);
    var bMat=new THREE.LineBasicMaterial({color:col,transparent:true,opacity:0.2});
    var beacon=new THREE.Line(bGeo,bMat);beacon.userData.pp=Math.random()*Math.PI*2;
    nodesGroup.add(beacon);
  });

  // ═══ DATA FLOW LINES (teal) ═══
  flowGroup=new THREE.Group();globeGroup.add(flowGroup);
  [[0,2],[2,5],[5,7],[7,8],[0,3],[3,11],[2,4],[4,14],[0,12],[14,21],[19,0],[18,1],[25,5],[26,7],[27,0],[28,3]].forEach(function(p){
    var a=QAISS_NODES[p[0]],b=QAISS_NODES[p[1]];
    flowGroup.add(makeArc(latLonToVec3(a.lat,a.lon,10.1),latLonToVec3(b.lat,b.lon,10.1),0x2dd4bf,12));
  });

  // ═══ QKD ROUTES (purple) ═══
  qkdGroup=new THREE.Group();globeGroup.add(qkdGroup);
  [[0,2],[2,5],[5,10],[0,19],[2,14],[7,11],[3,13],[12,20],[21,22],[24,4],[25,29]].forEach(function(p){
    var a=QAISS_NODES[p[0]],b=QAISS_NODES[p[1]];
    var arc=makeArc(latLonToVec3(a.lat,a.lon,10.15),latLonToVec3(b.lat,b.lon,10.15),0xa855f7,13);
    arc.material.opacity=0.3;qkdGroup.add(arc);
  });

  // ═══ ATTACK ARCS (spawned dynamically) ═══
  arcsGroup=new THREE.Group();globeGroup.add(arcsGroup);

  // LIGHTING
  expScene.add(new THREE.AmbientLight(0x333355,0.5));
  var dl=new THREE.DirectionalLight(0xa855f7,0.3);dl.position.set(5,3,5);expScene.add(dl);
  var dl2=new THREE.DirectionalLight(0x2dd4bf,0.15);dl2.position.set(-3,2,-4);expScene.add(dl2);

  // STARFIELD
  var sN=4000,sG=new THREE.BufferGeometry(),sP=new Float32Array(sN*3);
  for(var s=0;s<sN;s++){sP[s*3]=(Math.random()-.5)*400;sP[s*3+1]=(Math.random()-.5)*400;sP[s*3+2]=(Math.random()-.5)*400;}
  sG.setAttribute('position',new THREE.BufferAttribute(sP,3));
  expScene.add(new THREE.Points(sG,new THREE.PointsMaterial({color:0xffffff,size:0.12,transparent:true,opacity:0.7})));

  // ═══ CONTROLS ═══
  var drag=false,pM={x:0,y:0},rV={x:0,y:0};
  cv.addEventListener('mousedown',function(e){drag=true;pM={x:e.clientX,y:e.clientY}});
  cv.addEventListener('mousemove',function(e){if(!drag)return;rV.x+=(e.clientY-pM.y)*0.002;rV.y+=(e.clientX-pM.x)*0.002;pM={x:e.clientX,y:e.clientY}});
  cv.addEventListener('mouseup',function(){drag=false});
  cv.addEventListener('mouseleave',function(){drag=false});
  cv.addEventListener('wheel',function(e){e.preventDefault();expCamera.position.z=Math.max(15,Math.min(60,expCamera.position.z+e.deltaY*0.02))},{passive:false});
  var tS={x:0,y:0};
  cv.addEventListener('touchstart',function(e){if(e.touches.length===1){drag=true;tS={x:e.touches[0].clientX,y:e.touches[0].clientY}}},{passive:true});
  cv.addEventListener('touchmove',function(e){if(!drag||e.touches.length!==1)return;rV.x+=(e.touches[0].clientY-tS.y)*0.003;rV.y+=(e.touches[0].clientX-tS.x)*0.003;tS={x:e.touches[0].clientX,y:e.touches[0].clientY}},{passive:true});
  cv.addEventListener('touchend',function(){drag=false},{passive:true});

  // ═══ LIVE COUNTERS ═══
  var attackCount=0,neutralizedCount=0;

  // ═══ ATTACK SPAWNER ═══
  function spawnAttack(){
    var si=Math.floor(Math.random()*QAISS_NODES.length),ti=Math.floor(Math.random()*QAISS_NODES.length);
    if(si===ti)ti=(ti+1)%QAISS_NODES.length;
    var sn=QAISS_NODES[si],tn=QAISS_NODES[ti];
    var arc=makeArc(latLonToVec3(sn.lat,sn.lon,10.2),latLonToVec3(tn.lat,tn.lon,10.2),0xf43f5e,14);
    arc.userData={prog:0,blocked:false,src:sn.name,tgt:tn.name};
    arcsGroup.add(arc);
    attackCount++;
    updateCounters();
  }
  setInterval(spawnAttack,4000+Math.random()*3000);

  function updateCounters(){
    var el=document.getElementById('ccMetricAttacks');
    if(el)el.textContent=attackCount;
    var el2=document.getElementById('ccMetricNeutralized');
    if(el2)el2.textContent=neutralizedCount;
    var el3=document.getElementById('ccValThreats');
    if(el3)el3.textContent=attackCount-neutralizedCount;
  }

  // ═══ ANIMATION LOOP ═══
  var clk=new THREE.Clock();
  !function anim(){
    requestAnimationFrame(anim);
    var dt=clk.getDelta(),t=clk.getElapsedTime();
    // Earth rotation
    globeGroup.rotation.y+=0.0008;
    globeGroup.rotation.x+=rV.x;globeGroup.rotation.y+=rV.y;
    rV.x*=0.92;rV.y*=0.92;
    // Update earth shader time
    earthMat.uniforms.time.value=t;
    // Pulse nodes
    nodesGroup.children.forEach(function(ch){if(ch.userData.pp!==undefined){var s=1+Math.sin(t*2+ch.userData.pp)*0.3;ch.scale.set(s,s,s);if(ch.material&&ch.material.opacity!==undefined)ch.material.opacity=0.3+Math.sin(t*2+ch.userData.pp)*0.2}});
    // Attack arcs lifecycle
    for(var a=arcsGroup.children.length-1;a>=0;a--){
      var arc=arcsGroup.children[a];arc.userData.prog+=dt*0.3;
      if(arc.userData.prog>1&&!arc.userData.blocked){
        arc.userData.blocked=true;arc.material.color.setHex(0x22c55e);arc.material.opacity=0.8;
        neutralizedCount++;updateCounters();
      }
      if(arc.userData.prog>2){arcsGroup.remove(arc);arc.geometry.dispose();arc.material.dispose()}
      else if(arc.userData.blocked)arc.material.opacity*=0.97;
    }
    // Animate flow lines
    qkdGroup.children.forEach(function(l,i){l.material.opacity=0.15+Math.sin(t*1.5+i)*0.15});
    flowGroup.children.forEach(function(l,i){l.material.opacity=0.3+Math.sin(t*2+i*0.5)*0.2});
    expRenderer.render(expScene,expCamera);
  }();

  window.addEventListener('resize',function(){if(!expRenderer)return;expCamera.aspect=innerWidth/innerHeight;expCamera.updateProjectionMatrix();expRenderer.setSize(innerWidth,innerHeight)});

  // Auto-hide intro text after globe loads
  setTimeout(function(){
    var ep=document.getElementById('epP');
    if(ep){ep.style.transition='opacity 1.5s ease';ep.style.opacity='0';
      setTimeout(function(){ep.style.display='none'},1600);
    }
  },2500);
};

function openExplorer(){var o=document.getElementById('expO');if(!o)return;o.classList.add('open');document.body.style.overflow='hidden';initExplorer()}
function closeExplorer(){var o=document.getElementById('expO');if(!o)return;o.classList.remove('open');document.body.style.overflow=''}

var layerColors=[0xa855f7,0x2dd4bf,0xf472b6,0x38bdf8];
var layerNames=['Quantum Entropy Core','AI Neural Immune Engine','Self-Healing Protocol','Real-Time Dashboard'];
var layerDescs=[
  'True quantum randomness from WuKong 180-qubit processor (72 active). QCloudService + CPUQVM fallback. Shannon entropy validated. Feeds all cryptographic operations across 847 edge nodes.',
  'Quantum autoencoder detects anomalies in network traffic. RY rotation encodes features, CNOT entanglement + Hadamard interference reveal deviations. 14.2M patterns trained. Retrained every 3 hours.',
  'BB84 Quantum Key Distribution for automatic threat remediation. Fresh quantum keys replace compromised material in under 340ms. Zero human intervention required. Information-theoretic security.',
  'Bell state tomography monitors system coherence in real-time. Fidelity 0.9987, Balance 0.9950, Error Rate 0.0000. Entropy Grade: A+. Displayed across all protected infrastructure.'
];

function focusLayer(idx){
  var ip=document.getElementById('ipanel'),pc=document.getElementById('pC');
  if(!ip||!pc)return;ip.classList.add('open');
  var c=layerColors[idx].toString(16).padStart(6,'0');
  pc.innerHTML='<h3 style="color:#'+c+';margin:0 0 8px">LAYER '+(idx+1)+': '+layerNames[idx]+'</h3><p style="color:var(--muted);line-height:1.7;font-size:.9rem">'+layerDescs[idx]+'</p><div style="margin-top:12px;font-family:var(--mono);font-size:.7rem;color:var(--dim)">STATUS: <span style="color:#22c55e">OPERATIONAL</span></div>';
}
function closePanel(){var ip=document.getElementById('ipanel');if(ip)ip.classList.remove('open')}

// ═══ GLOBE RAYCASTER — Click nodes for key rotation data ═══
var raycaster=new THREE.Raycaster();
var mouse=new THREE.Vector2();
var hoveredNode=null;

function onGlobeMouseMove(e){
  if(!nodesGroup||!expCamera)return;
  var cv=document.getElementById('expC');
  if(!cv)return;
  var rect=cv.getBoundingClientRect();
  mouse.x=((e.clientX-rect.left)/rect.width)*2-1;
  mouse.y=-((e.clientY-rect.top)/rect.height)*2+1;
  raycaster.setFromCamera(mouse,expCamera);
  var intersects=raycaster.intersectObjects(nodesGroup.children,false);
  var found=null;
  for(var i=0;i<intersects.length;i++){
    if(intersects[i].object.userData&&intersects[i].object.userData.name){
      found=intersects[i];break;
    }
  }
  if(found&&found.object.userData.name){
    hoveredNode=found.object;
    document.getElementById('expC').style.cursor='pointer';
  } else {
    hoveredNode=null;
    document.getElementById('expC').style.cursor='grab';
  }
}

function onGlobeClick(e){
  if(!hoveredNode||!hoveredNode.userData)return;
  var nd=QAISS_NODES[hoveredNode.userData.idx];
  var rk=REGION_KEYS[nd.region]||REGION_KEYS.NA;
  var ip=document.getElementById('ipanel'),pc=document.getElementById('pC');
  if(!ip||!pc)return;
  ip.classList.add('open');
  pc.innerHTML='<h3 style="color:#22c55e;margin:0 0 8px">'+nd.name+'</h3>'+
    '<div style="font-family:var(--mono);font-size:.65rem;color:var(--dim);margin-bottom:10px">LAT: '+nd.lat.toFixed(2)+' | LON: '+nd.lon.toFixed(2)+' | REGION: '+nd.region+'</div>'+
    '<div style="margin-bottom:6px"><span style="color:var(--muted);font-size:.85rem">Status:</span> <span style="color:'+(nd.st==="active"?"#22c55e":"#fbbf24")+'">'+nd.st.toUpperCase()+'</span></div>'+
    '<div style="border-top:1px solid rgba(168,85,247,.1);margin:10px 0;padding-top:10px"><div style="font-family:var(--mono);font-size:.55rem;color:var(--dim);letter-spacing:.15em;margin-bottom:6px">KEY ROTATION DATA</div></div>'+
    '<div style="margin-bottom:6px"><span style="color:var(--muted);font-size:.85rem">Keys Rotated (24h):</span> <span style="color:var(--purple);font-family:var(--mono);font-weight:700">'+rk.rotated+'</span></div>'+
    '<div style="margin-bottom:6px"><span style="color:var(--muted);font-size:.85rem">Pending Rotations:</span> <span style="color:#fbbf24;font-family:var(--mono)">'+rk.pending+'</span></div>'+
    '<div style="margin-bottom:6px"><span style="color:var(--muted);font-size:.85rem">Algorithm:</span> <span style="color:var(--purple);font-family:var(--mono)">'+rk.algo+'</span></div>'+
    '<div style="margin-bottom:6px"><span style="color:var(--muted);font-size:.85rem">Avg Rotation Speed:</span> <span style="color:var(--teal);font-family:var(--mono)">'+rk.speed+'</span></div>'+
    '<div style="margin-bottom:6px"><span style="color:var(--muted);font-size:.85rem">Encryption:</span> <span style="color:var(--blue);font-family:var(--mono)">AES-256 + ML-KEM</span></div>'+
    '<div style="margin-bottom:6px"><span style="color:var(--muted);font-size:.85rem">Threats (24h):</span> <span style="color:#f43f5e;font-family:var(--mono)">'+Math.floor(Math.random()*50)+'</span></div>'+
    '<div style="margin-top:12px;display:flex;gap:6px;flex-wrap:wrap">'+
    '<button class="cc-action-btn" onclick="ccAction(\'rotate\')">⟳ Force Rotate</button>'+
    '<button class="cc-action-btn" onclick="ccAction(\'scan\')">⊘ Scan Node</button>'+
    '</div>';
}

var expC=document.getElementById('expC');
if(expC){
  expC.addEventListener('mousemove',onGlobeMouseMove);
  expC.addEventListener('click',onGlobeClick);
}

} // end THREE check
