/* Apusonic — main.js
   Hero: a clear-day Andean summit. WebGL (Three.js, CDN) when available —
   twelve noise-generated ridge planes at staggered depths with atmospheric
   haze, drifting cloud banks, a hazy high sun, and a scroll-driven camera
   that descends through the ranges. Falls back to a 2D layered parallax hero,
   and to a clean static layered scene under prefers-reduced-motion. */
(function(){
  document.documentElement.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ============================================================
     Shared ridge math (smoothed value-noise — same family as v1)
     ============================================================ */
  function noiseFn(seed){
    function r(i){ var x=Math.sin(i*12.9898+seed*78.233)*43758.5453; return x-Math.floor(x); }
    return function(x){ var i=Math.floor(x),f=x-i,u=f*f*(3-2*f); return r(i)*(1-u)+r(i+1)*u; };
  }
  /* normalized ridge profile: array of N+1 heights in [0..1], pointed summits */
  function ridgeProfile(seed,octaves,freq,sharp,smooth,N){
    var noise=noiseFn(seed), raw=[];
    for(var i=0;i<=N;i++){
      var x=i/N,v=0,a=0.5,amp=0,f=freq;
      for(var k=0;k<octaves;k++){ var n=noise(x*f+seed*1.7); n=1-Math.abs(2*n-1); v+=a*n; amp+=a; f*=1.9; a*=0.5; }
      raw.push(v/amp);
    }
    for(var pass=0;pass<(smooth||1);pass++){
      var sm=[];
      for(var j=0;j<=N;j++){
        var p0=raw[Math.max(0,j-1)],p1=raw[j],p2=raw[Math.min(N,j+1)];
        sm[j]=p0*0.2+p1*0.6+p2*0.2;
      }
      raw=sm;
    }
    var mx=Math.max.apply(null,raw),mn=Math.min.apply(null,raw),rng=(mx-mn)||1;
    for(var m=0;m<=N;m++){ raw[m]=Math.pow((raw[m]-mn)/rng, sharp||1); }
    return raw;
  }
  function lerp(a,b,t){ return a+(b-a)*t; }
  function clamp01(v){ return Math.min(1,Math.max(0,v)); }
  function easeInOut(t){ return t*t*(3-2*t); }
  /* hex color lerp -> css string */
  function hexToRgb(h){ var n=parseInt(h.slice(1),16); return [n>>16&255,n>>8&255,n&255]; }
  function mixHex(a,b,t){
    var A=hexToRgb(a),B=hexToRgb(b);
    return 'rgb('+Math.round(lerp(A[0],B[0],t))+','+Math.round(lerp(A[1],B[1],t))+','+Math.round(lerp(A[2],B[2],t))+')';
  }

  /* depth palette: far pale-blue haze -> near daylit slate (atmospheric perspective) */
  var FAR_COL='#AFC6D8', NEAR_COL='#5C6873';   /* medium slate — defined, and it IS the grey the definition lands on */
  function depthColor(t){ return mixHex(NEAR_COL, FAR_COL, Math.pow(t,0.62)); }

  /* ============================================================
     Starfield (shared by all hero modes) — one generated tile
     ============================================================ */
  (function stars(){
    var el=document.getElementById('stars'); if(!el) return;
    var c=document.createElement('canvas'); c.width=900; c.height=420;
    var ctx=c.getContext('2d');
    var rnd=noiseFn(3.7);
    for(var i=0;i<150;i++){
      var x=rnd(i*1.31)*900, y=Math.pow(rnd(i*2.17),1.6)*420,
          r=0.4+rnd(i*3.03)*0.9, a=0.25+rnd(i*4.41)*0.6;
      ctx.beginPath(); ctx.arc(x,y,r,0,6.2832);
      ctx.fillStyle='rgba(235,238,248,'+a.toFixed(2)+')'; ctx.fill();
    }
    el.style.backgroundImage='url('+c.toDataURL()+')';
    el.style.backgroundSize='900px 420px';
  })();

  /* ============================================================
     HERO ENGINE
     ============================================================ */
  var hero=document.getElementById('hero'),
      stage=document.getElementById('heroStage'),
      site=document.getElementById('site'),
      whiteout=document.getElementById('whiteout'),
      canvas=document.getElementById('glcanvas'),
      hdr=document.getElementById('hdr'),
      ranges=document.getElementById('ranges');

  /* intro progress: 0 at the top, 1 once the site content has scrolled fully into view.
     The hero stage is a FIXED full-viewport layer; .hero is just a scroll spacer behind it. */
  var heroH=hero.offsetHeight;
  window.addEventListener('resize',function(){ heroH=hero.offsetHeight; },{passive:true});
  function heroProgress(){
    return clamp01(window.scrollY / Math.max(1, heroH));
  }

  /* pointer / tilt parallax target, shared by both renderers */
  var mxT=0,myT=0;
  if(!reduce){
    var pmTick=false;
    window.addEventListener('mousemove',function(e){
      if(pmTick) return; pmTick=true;
      requestAnimationFrame(function(){
        mxT=(e.clientX/window.innerWidth)*2-1;
        myT=(e.clientY/window.innerHeight)*2-1;
        pmTick=false;
      });
    },{passive:true});
    if('ontouchstart' in window){
      window.addEventListener('deviceorientation',function(e){
        if(e.gamma==null||e.beta==null) return;
        mxT=Math.max(-1,Math.min(1,e.gamma/28));
        myT=Math.max(-1,Math.min(1,(e.beta-45)/40));
      },true);
    }
  }

  /* ---------- WebGL diorama ---------- */
  function buildGL(){
    if(reduce || typeof THREE==='undefined') return false;
    var renderer;
    try{
      renderer=new THREE.WebGLRenderer({canvas:canvas,alpha:true,antialias:true,powerPreference:'high-performance'});
    }catch(e){ return false; }
    if(!renderer.getContext()) return false;

    /* tunables — the whole scene in one place */
    var CFG={
      layers:18, spacing:15, firstZ:-22, width:660, points:260,
      ampBase:16.0, ampStep:3.5,                    /* lower ridge peaks — they sit well below the giant Apu */
      camStart:{y:26.0,z:30}, camEnd:{y:-40.0,z:20}, /* VERTICAL descent: lower start so more grey foreground */
      fogWarm:0xCBD9E6, fogCool:0xE7EFF5, fogNear:150, fogFar:470,
      moteCount:0, mistCount:11
    };

    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5)); /* cap DPR — less overdraw on the layered ridges */
    var scene=new THREE.Scene();
    scene.fog=new THREE.Fog(CFG.fogWarm,CFG.fogNear,CFG.fogFar);
    var cam=new THREE.PerspectiveCamera(47,1,1,6000);  /* tighter FOV; deep far plane so the sun sits way back */

    /* ridge cutouts at staggered depths — vertex-shaded with snow on the summits */
    var ridges=[], WHITE=new THREE.Color(0xffffff);
    for(var i=0;i<CFG.layers;i++){
      var t=i/(CFG.layers-1);                                /* 0 near .. 1 far */
      var prof=ridgeProfile(7+i*13.7, 4, 2.2+i*0.24, 2.6+1.0*(1-t), i>8?2:1, CFG.points);
      var amp=CFG.ampBase+i*CFG.ampStep, base=-3+i*0.82; /* far ridges rise higher in frame (more peaks behind the logo) */
      var shape=new THREE.Shape();
      shape.moveTo(-CFG.width/2,-110);                      /* extend far below the camera's lowest point — never empty under the ridges */
      for(var p=0;p<=CFG.points;p++){
        shape.lineTo(-CFG.width/2+(p/CFG.points)*CFG.width, base+prof[p]*amp);
      }
      shape.lineTo(CFG.width/2,-110);
      shape.closePath();
      var geo=new THREE.ShapeGeometry(shape,1), pa=geo.attributes.position;
      var rock=new THREE.Color(depthColor(t)), snow=rock.clone().lerp(WHITE,0.78), tmp=new THREE.Color();
      var cols=new Float32Array(pa.count*3);
      for(var v=0;v<pa.count;v++){
        var ty=clamp01((pa.getY(v)-base)/(amp||1));           /* 0 at base .. 1 at the peak */
        var snowMix=Math.pow(clamp01((ty-0.6)/0.4),1.4);      /* snow only near the summits */
        var shade=lerp(0.86,1.0,clamp01(ty*1.4));             /* shaded bodies, lit tops (lifted floor) */
        tmp.copy(rock).lerp(snow,snowMix);
        cols[v*3]=tmp.r*shade; cols[v*3+1]=tmp.g*shade; cols[v*3+2]=tmp.b*shade;
      }
      geo.setAttribute('color',new THREE.BufferAttribute(cols,3));
      var mat=new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:1,side:THREE.DoubleSide});
      var mesh=new THREE.Mesh(geo,mat);
      mesh.position.z=CFG.firstZ-i*CFG.spacing;
      scene.add(mesh);
      ridges.push(mesh);
    }

    /* THE APU — one colossal snow-capped peak, dead centre, far in the distance: the brand's mountain */
    (function(){
      var AW=410, AH=176, APTS=300, ah=AW/2;
      var anoise=ridgeProfile(123.7, 5, 2.6, 2.5, 2, APTS);     /* finer, more rugged texture on the flanks */
      var afine=ridgeProfile(57.3, 4, 3.4, 4.6, 2, APTS);       /* small-scale crags layered on top */
      var ash=new THREE.Shape();
      ash.moveTo(-ah,-120);
      for(var ap=0;ap<=APTS;ap++){
        var ax=ap/APTS, d=Math.abs(ax-0.5)*2;                   /* 0 at centre .. 1 at edges */
        var peak=Math.pow(Math.max(0,1-d),1.08);                /* sharp summit, broad base (near-triangular) */
        var rug=0.74+0.20*anoise[ap]+0.06*afine[ap];            /* layered ridges + fine crags */
        ash.lineTo(-ah+ax*AW, -8 + peak*AH*rug);
      }
      ash.lineTo(ah,-120); ash.closePath();
      var ageo=new THREE.ShapeGeometry(ash,1), apa=ageo.attributes.position;
      var arock=new THREE.Color('#7E9CB8'), asnow=new THREE.Color('#FBFDFF'), atc=new THREE.Color();
      var acol=new Float32Array(apa.count*3);
      for(var av=0;av<apa.count;av++){
        var aty=clamp01((apa.getY(av)+8)/AH);                    /* 0 base .. 1 summit */
        var asnowMix=Math.pow(clamp01((aty-0.30)/0.70),1.1);    /* heavy snow up high */
        var ashade=lerp(0.9,1.0,clamp01(aty*1.2));
        atc.copy(arock).lerp(asnow,asnowMix);
        acol[av*3]=atc.r*ashade; acol[av*3+1]=atc.g*ashade; acol[av*3+2]=atc.b*ashade;
      }
      ageo.setAttribute('color',new THREE.BufferAttribute(acol,3));
      var amesh=new THREE.Mesh(ageo, new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:1,side:THREE.DoubleSide,fog:false}));
      amesh.position.set(0,0, CFG.firstZ - CFG.layers*CFG.spacing - 30);  /* behind every ridge, dead centre */
      amesh.renderOrder=-1;                                       /* drawn first, behind the ranges */
      scene.add(amesh);
    })();

    /* THE SUN — a real body far back in the scene (millions of miles away): bright, and barely parallaxes */
    (function(){
      var c=document.createElement('canvas'); c.width=c.height=256;
      var x=c.getContext('2d'), g=x.createRadialGradient(128,128,0,128,128,128);
      g.addColorStop(0.00,'rgba(255,255,253,1)');
      g.addColorStop(0.11,'rgba(255,254,246,1)');
      g.addColorStop(0.18,'rgba(255,249,228,0.95)');
      g.addColorStop(0.32,'rgba(255,241,205,0.42)');
      g.addColorStop(0.58,'rgba(255,237,196,0.13)');
      g.addColorStop(1.00,'rgba(255,237,196,0)');
      x.fillStyle=g; x.fillRect(0,0,256,256);
      var sun=new THREE.Sprite(new THREE.SpriteMaterial({
        map:new THREE.CanvasTexture(c), transparent:true, depthWrite:false, depthTest:false, fog:false, opacity:1}));
      sun.scale.set(1900,1900,1);
      sun.position.set(-1120, 820, -2700);                        /* high upper-LEFT, far in the distance */
      sun.renderOrder=-2;
      scene.add(sun);
    })();

    /* soft radial sprite texture (mist + ember share it) */
    function glowTex(rgb){
      var c=document.createElement('canvas'); c.width=c.height=256;
      var x=c.getContext('2d'),g=x.createRadialGradient(128,128,8,128,128,128);
      g.addColorStop(0,'rgba('+rgb+',0.85)'); g.addColorStop(0.45,'rgba('+rgb+',0.28)'); g.addColorStop(1,'rgba('+rgb+',0)');
      x.fillStyle=g; x.fillRect(0,0,256,256);
      var tx=new THREE.CanvasTexture(c); return tx;
    }

    /* high clouds drifting across the upper sky (visible — no fog) */
    var mistTex=glowTex('248,251,255'),mists=[],cN=noiseFn(9);
    for(var mI=0;mI<CFG.mistCount;mI++){
      var w=130+cN(mI*1.7)*170, op=0.48+cN(mI*2.9)*0.30;
      var mm=new THREE.Mesh(
        new THREE.PlaneGeometry(w,w*0.24),
        new THREE.MeshBasicMaterial({map:mistTex,transparent:true,opacity:op,depthWrite:false,depthTest:false,fog:false})
      );
      mm.position.set((cN(mI*3.3)-0.5)*260, 30+cN(mI*4.1)*30, CFG.firstZ-(mI*1.4+5)*CFG.spacing*0.7);
      mm.userData={spd:0.18+cN(mI*5.3)*0.18,ph:mI*1.7,base:op};
      scene.add(mm); mists.push(mm);
    }

    /* the sun is a CSS layer behind the canvas (see .sun in styles.css): the opaque
       ridges occlude it naturally, so it reads as sitting in the sky behind the range */

    /* sparse warm motes drifting through the volume */
    var pos=new Float32Array(CFG.moteCount*3),seedR=noiseFn(5.5),drift=[];
    for(var d=0;d<CFG.moteCount;d++){
      pos[d*3]= (seedR(d*1.1)-0.5)*130;
      pos[d*3+1]= seedR(d*2.3)*26;
      pos[d*3+2]= CFG.firstZ - seedR(d*3.7)*(CFG.layers*CFG.spacing);
      drift.push({s:0.12+seedR(d*4.9)*0.3,ph:seedR(d*6.1)*6.28});
    }
    var pGeo=new THREE.BufferGeometry();
    pGeo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    var motes=new THREE.Points(pGeo,new THREE.PointsMaterial({
      color:0xF2F6FA,size:0.34,sizeAttenuation:true,transparent:true,opacity:0.32,
      depthWrite:false,blending:THREE.AdditiveBlending}));
    scene.add(motes);

    /* sizing */
    function size(){
      var w=stage.clientWidth,h=stage.clientHeight;
      renderer.setSize(w,h,true);                 /* set canvas CSS px too — never let it show at buffer size */
      cam.aspect=w/h; cam.updateProjectionMatrix();
    }
    size();
    window.addEventListener('resize',size);

    /* render loop — scroll-locked dolly, runs only while the hero is on screen */
    var mx=0,my=0,t0=performance.now(),running=true,
        fogW=new THREE.Color(CFG.fogWarm),fogC=new THREE.Color(CFG.fogCool);
    function loop(now){
      requestAnimationFrame(loop);
      if(document.hidden) return;
      frame();                                 /* keep scroll-driven styles in sync every frame */
      if(window.scrollY>heroH*0.52){ running=false; return; }  /* greyout covers the scene — stop rendering */
      running=true;
      var t=(now-t0)/1000;
      mx+=(mxT-mx)*0.045; my+=(myT-my)*0.045;
      var pe=clamp01(heroProgress()/0.62);  /* LINEAR vertical descent — no ease-out into the definition */

      /* descend straight DOWN the Y axis (not forward) — the range scrolls up past you */
      cam.position.set(mx*0.5, lerp(CFG.camStart.y,CFG.camEnd.y,pe)-my*0.4, lerp(CFG.camStart.z,CFG.camEnd.z,pe));
      cam.lookAt(mx*1.8, cam.position.y-3.9-my*0.6, cam.position.z-54);   /* gaze ~2° lower; gentle sway only */
      cam.rotation.z=mx*0.003;

      /* alpenglow cools as you descend */
      scene.fog.color.copy(fogW).lerp(fogC,pe);

      /* ridges fade just before the camera passes through them */
      for(var i=0;i<ridges.length;i++){
        var dz=cam.position.z-ridges[i].position.z;
        ridges[i].visible=dz>0.5;
        ridges[i].material.opacity=clamp01((dz-1.5)/9);
      }
      for(var m=0;m<mists.length;m++){
        var M=mists[m], WX=210, FD=70;
        M.position.x+=0.012+0.02*M.userData.spd;
        if(M.position.x>WX)M.position.x-=2*WX;        /* seamless wrap (jump full span) */
        var edge=clamp01((WX-Math.abs(M.position.x))/FD); /* fade to 0 at the wrap so it never pops */
        M.material.opacity=M.userData.base*edge*(0.85+0.15*Math.sin(t*0.16+M.userData.ph));
        M.visible=cam.position.z-M.position.z>2;
      }

      var arr=pGeo.attributes.position.array;
      for(var k=0;k<CFG.moteCount;k++){
        arr[k*3]  +=Math.sin(t*0.3+drift[k].ph)*0.004;
        arr[k*3+1]+=drift[k].s*0.012;
        if(arr[k*3+1]>27)arr[k*3+1]=0;
      }
      pGeo.attributes.position.needsUpdate=true;

      renderer.render(scene,cam);
    }
    requestAnimationFrame(loop);

    canvas.addEventListener('webglcontextlost',function(e){
      e.preventDefault();
      hero.classList.add('flat');
      build2D(true);
    });
    return true;
  }

  /* ---------- 2D layered fallback (and the reduced-motion static scene) ---------- */
  var twoD=null;
  function build2D(animate){
    if(twoD) return; twoD=true;
    hero.classList.add('flat');
    var n=10,layers=[],SVG='http://www.w3.org/2000/svg';
    for(var i=0;i<n;i++){
      var t=i/(n-1);                                   /* 0 far .. 1 near */
      var div=document.createElement('div'); div.className='r2d'+(i===n-1?' nearest':'');
      var hvh=lerp(62,34,Math.pow(t,1.2));             /* far layers sit higher */
      div.style.height=hvh+'vh'; div.style.zIndex=String(i+1);
      var svg=document.createElementNS(SVG,'svg');
      svg.setAttribute('viewBox','0 0 1440 520');
      svg.setAttribute('preserveAspectRatio','xMidYMax slice');
      var path=document.createElementNS(SVG,'path');
      var prof=ridgeProfile(7+i*13.7,3+(t>0.6?1:0),1.7+i*0.2,1.9+0.6*t,t<0.4?2:1,240);
      var amp=lerp(0.5,0.92,Math.pow(t,1.1))*520, base=lerp(0.18,0.04,t)*520;
      var d='M0,520 ';
      for(var p=0;p<=240;p++){ d+='L'+((p/240)*1440).toFixed(1)+','+(520-base-prof[p]*amp).toFixed(1)+' '; }
      d+='L1440,520 Z';
      path.setAttribute('d',d);
      path.setAttribute('fill',depthColor(1-t));
      svg.appendChild(path); div.appendChild(svg); ranges.appendChild(div);
      layers.push({el:div,t:t});
    }
    var m1=document.createElement('div'),m2=document.createElement('div');
    m1.className='mist2d'; m1.style.bottom='30vh'; m1.style.zIndex='4';
    m2.className='mist2d'; m2.style.bottom='16vh'; m2.style.zIndex='7';
    ranges.appendChild(m1); ranges.appendChild(m2);

    if(!animate || reduce) return;                     /* clean static layered scene */
    var pS=0,mx=0,my=0;
    function loop(){
      requestAnimationFrame(loop);
      if(document.hidden) return;
      frame();
      if(window.scrollY>heroH+10) return;
      pS+=(heroProgress()-pS)*0.09; mx+=(mxT-mx)*0.05; my+=(myT-my)*0.05;
      for(var i=0;i<layers.length;i++){
        var L=layers[i],near=L.t;
        L.el.style.transform='translate3d('+(mx*lerp(4,26,near)).toFixed(1)+'px,'+
          (pS*lerp(22,260,Math.pow(near,1.5))+my*lerp(2,10,near)).toFixed(1)+'px,0)';
      }
      m1.style.transform='translateX('+(mx*14).toFixed(1)+'px)';
      m2.style.transform='translateX('+(mx*30).toFixed(1)+'px)';
    }
    requestAnimationFrame(loop);
  }

  if(reduce){ build2D(false); }
  else if(!buildGL()){ build2D(true); }

  /* lift the white load veil once the first hero frame has painted (with a safety timeout) */
  var lifted=false, lift=function(){ if(lifted) return; lifted=true; document.body.classList.add('loaded'); };
  requestAnimationFrame(function(){ requestAnimationFrame(lift); });
  setTimeout(lift,1500);

  /* ---------- scroll: --p variable + header state ---------- */
  var ticking=false, siteReleased=false;
  /* Descent timeline (p = scrollY / hero-spacer height):
       0   .. 0.26  logo + tagline + sun slide UP and fade off the top
       0   .. 0.70  camera descends straight DOWN; the range scrolls up past you
       0.30.. 0.70  the paper-white whiteout builds in — the scene fogs out into white
       0.72.. 0.86  the (now-white) fixed stage fades out, revealing the white site behind it
       0.74.. 0.90  the Apu definition fades IN, held motionless (pinned) in the centre
       0.90.. 1.0   hold — the definition breathes, still motionless
       >= 1.0       released: the page scrolls normally (the definition scrolls up) */
  function frame(){
    var p=heroProgress(), T=heroH;
    hero.style.setProperty('--p', reduce?0:clamp01(p/0.26));                 /* logo/sun slide up + fade */
    if(!reduce){
      if(whiteout) whiteout.style.opacity=String(clamp01((p-0.40)/0.12));    /* grey-out: late + fast, hidden by the already-grey descent */
      if(stage)    stage.style.opacity=String(1-clamp01((p-0.52)/0.20));     /* grey stage fades the instant grey lands — definition appears sooner */
      if(site){
        if(window.scrollY<T){                                               /* hold the site pinned (revealed by the stage fade — opacity stays 1) */
          if(siteReleased){ siteReleased=false; site.style.willChange='transform'; }
          site.style.transform='translateY('+(window.scrollY-T).toFixed(1)+'px)';
        } else if(!siteReleased){                                           /* released: scroll normally */
          siteReleased=true; site.style.transform='none'; site.style.willChange='auto';
        }
      }
    }
    /* dark nav only once you're past the dark hero + grey definition, into the white content */
    hdr.classList.toggle('solid', reduce ? window.scrollY>window.innerHeight*0.55 : window.scrollY > heroH + window.innerHeight*0.7);
    ticking=false;
  }
  window.addEventListener('scroll',function(){
    if(!ticking){ ticking=true; requestAnimationFrame(frame); }
  },{passive:true});
  frame();

  /* ============================================================
     Everything below the hero — unchanged behavior
     ============================================================ */

  /* ---- single hero sound toggle (off by default) ---- */
  var actx=null,master=null;
  function ensureCtx(){if(!actx){actx=new (window.AudioContext||window.webkitAudioContext)();master=actx.createGain();master.gain.value=0.85;master.connect(actx.destination);}if(actx.state==='suspended')actx.resume();return actx;}
  var F={A1:110,A2:220,C3:261.63,E3:329.63,G3:392,A3:440,C4:523.25,E4:659.25};
  function tone(freq,start,dur,peak,type){var o=actx.createOscillator(),o2=actx.createOscillator(),g=actx.createGain(),og2=actx.createGain();
    o.type=type||'sine';o2.type='sine';o.frequency.value=freq;o2.frequency.value=freq*2.001;og2.gain.value=0.12;o2.connect(og2).connect(g);
    g.gain.setValueAtTime(0.0001,start);g.gain.exponentialRampToValueAtTime(peak,start+0.05);g.gain.exponentialRampToValueAtTime(0.0001,start+dur);
    o.connect(g);g.connect(master);o.start(start);o2.start(start);o.stop(start+dur+0.05);o2.stop(start+dur+0.05);}
  function signature(){var t=actx.currentTime+0.02;tone(F.A1,t,2.8,0.16,'sine');
    [[F.A2,0],[F.C3,.36],[F.E3,.74],[F.G3,1.12],[F.A3,1.52],[F.E4,2.05]].forEach(function(p){tone(p[0],t+p[1],1.15,0.13,'triangle');});}
  var st=document.getElementById('soundToggle'),stText=document.getElementById('stText'),npTimer=null;
  var T=function(k,f){return window.apusT?window.apusT(k):f;};
  st.addEventListener('click',function(){ensureCtx();signature();
    document.body.classList.add('playing');stText.textContent=T('sound.playing','Now playing');clearTimeout(npTimer);
    npTimer=setTimeout(function(){document.body.classList.remove('playing');stText.textContent=T('sound.idle','Sound');},3000);});

  /* ---- cta ---- */
  var ctaBtn=document.getElementById('ctaBtn'),ctaInput=document.getElementById('ctaInput');
  if(ctaBtn)ctaBtn.addEventListener('click',function(){var v=(ctaInput.value||'').trim();
    window.location.href='mailto:hola@apusonic.pe'+(v?('?subject=Commission&body=From: '+encodeURIComponent(v)):'');});

  /* ---- marquee duplicate ---- */
  var mt=document.getElementById('mtrack'); if(mt&&!reduce){mt.innerHTML+=mt.innerHTML;}

  /* ---- reveals ---- */
  if('IntersectionObserver' in window && !reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:0.12});
    document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});
  } else { document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in');}); }

  /* ---- graceful fallbacks if the binary assets are missing locally ---- */
  function logoFallback(img){
    var span=document.createElement('span');
    span.className='logo-fallback';
    span.setAttribute('role','img');
    span.setAttribute('aria-label','Apusonic');
    span.innerHTML='<span class="tri">\u25B2</span>PUSONIC';
    img.replaceWith(span);
  }
  document.querySelectorAll('img.logo-mb').forEach(function(img){
    if(img.complete && img.naturalWidth===0){ logoFallback(img); }
    else img.addEventListener('error',function(){ logoFallback(img); });
  });
  var bImg=document.querySelector('#banner img');
  if(bImg){
    var bFail=function(){ document.getElementById('banner').classList.add('noimg');
      console.warn('Apusonic: assets/img/orchestra_Wide.jpg is missing — drop the original back into assets/img/.'); };
    if(bImg.complete && bImg.naturalWidth===0) bFail();
    else bImg.addEventListener('error',bFail);
  }
})();
