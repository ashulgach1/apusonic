/* Apusonic — alt-cumbre main.js
   One idea holds the page: the ridge line is the waveform.
   The hero canvas draws layered Andean silhouettes whose crests oscillate
   like an audio signal — driven by time, cursor, scroll, and (once the
   visitor presses Listen) a real Web Audio analyser. No libraries. */
(function(){
  document.documentElement.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  function clamp01(v){ return Math.min(1,Math.max(0,v)); }
  function lerp(a,b,t){ return a+(b-a)*t; }

  /* smoothed value noise — the same family the ridge profiles have always used */
  function noiseFn(seed){
    function r(i){ var x=Math.sin(i*12.9898+seed*78.233)*43758.5453; return x-Math.floor(x); }
    return function(x){ var i=Math.floor(x),f=x-i,u=f*f*(3-2*f); return r(i)*(1-u)+r(i+1)*u; };
  }
  /* pointed ridge profile, N+1 samples in [0..1] */
  function ridgeProfile(seed,octaves,freq,sharp,N){
    var noise=noiseFn(seed), out=[];
    for(var i=0;i<=N;i++){
      var x=i/N,v=0,a=0.5,amp=0,f=freq;
      for(var k=0;k<octaves;k++){ var n=noise(x*f+seed*1.7); n=1-Math.abs(2*n-1); v+=a*n; amp+=a; f*=1.9; a*=0.5; }
      out.push(v/amp);
    }
    var mx=Math.max.apply(null,out),mn=Math.min.apply(null,out),rng=(mx-mn)||1;
    for(var m=0;m<=N;m++){ out[m]=Math.pow((out[m]-mn)/rng, sharp||1); }
    return out;
  }

  /* ============================================================
     AUDIO — a generative Andean loop + analyser for the canvas.
     Nothing plays until the visitor asks for it.
     ============================================================ */
  var actx=null, master=null, analyser=null, fftData=null, playing=false, schedTimer=null;
  var SCALE=[220, 261.63, 293.66, 329.63, 392, 440, 523.25, 587.33]; /* A minor pentatonic-ish ladder */

  function ensureCtx(){
    if(!actx){
      actx=new (window.AudioContext||window.webkitAudioContext)();
      master=actx.createGain(); master.gain.value=0;
      analyser=actx.createAnalyser(); analyser.fftSize=256; analyser.smoothingTimeConstant=0.82;
      fftData=new Uint8Array(analyser.frequencyBinCount);
      /* master -> soft delay (space) -> analyser -> out */
      var delay=actx.createDelay(1.2); delay.delayTime.value=0.42;
      var fb=actx.createGain(); fb.gain.value=0.34;
      var wet=actx.createGain(); wet.gain.value=0.38;
      master.connect(analyser);
      master.connect(delay); delay.connect(fb); fb.connect(delay);
      delay.connect(wet); wet.connect(analyser);
      analyser.connect(actx.destination);
    }
    if(actx.state==='suspended') actx.resume();
    return actx;
  }
  function pluck(freq,when,dur,peak,type){
    var o=actx.createOscillator(),o2=actx.createOscillator(),g=actx.createGain(),g2=actx.createGain();
    o.type=type||'triangle'; o2.type='sine';
    o.frequency.value=freq; o2.frequency.value=freq*2.002; g2.gain.value=0.14;
    g.gain.setValueAtTime(0.0001,when);
    g.gain.exponentialRampToValueAtTime(peak,when+0.04);
    g.gain.exponentialRampToValueAtTime(0.0001,when+dur);
    o.connect(g); o2.connect(g2); g2.connect(g); g.connect(master);
    o.start(when); o2.start(when); o.stop(when+dur+0.06); o2.stop(when+dur+0.06);
  }
  var droneNodes=[];
  function startDrone(){
    [[55,'sine',0.055],[110,'sine',0.045],[110.4,'sine',0.028]].forEach(function(d){
      var o=actx.createOscillator(),g=actx.createGain();
      o.type=d[1]; o.frequency.value=d[0]; g.gain.value=d[2];
      o.connect(g); g.connect(master); o.start();
      droneNodes.push({o:o,g:g});
    });
  }
  var step=0;
  function schedule(){
    /* look ahead and lay down sparse pentatonic plucks over the drone */
    var t=actx.currentTime+0.08;
    if(step%2===0){
      var idx=Math.floor(Math.random()*SCALE.length);
      /* favor steps downward — the melody descends like the range */
      if(Math.random()<0.6) idx=Math.max(0,idx-1);
      pluck(SCALE[idx], t, 1.6, 0.11, 'triangle');
      if(Math.random()<0.3) pluck(SCALE[idx]*2, t+0.22, 1.1, 0.05, 'sine');
    }
    if(step%8===0) pluck(SCALE[0]/2, t, 3.2, 0.09, 'sine');
    step++;
  }
  function startSound(){
    ensureCtx();
    playing=true; step=0;
    startDrone();
    master.gain.cancelScheduledValues(actx.currentTime);
    master.gain.setTargetAtTime(0.9, actx.currentTime, 0.6);
    schedule();
    schedTimer=setInterval(schedule, 620);
    document.body.classList.add('playing');
    setLabels();
  }
  function stopSound(){
    playing=false;
    clearInterval(schedTimer);
    if(master){ master.gain.setTargetAtTime(0.0001, actx.currentTime, 0.35); }
    setTimeout(function(){
      droneNodes.forEach(function(n){ try{ n.o.stop(); }catch(e){} });
      droneNodes=[];
    }, 900);
    document.body.classList.remove('playing');
    setLabels();
  }
  function toggleSound(){ playing ? stopSound() : startSound(); }

  var T=function(k,f){ return window.apusT ? (window.apusT(k)||f) : f; };
  var stBtn=document.getElementById('soundToggle'),
      stText=document.getElementById('stText'),
      heroListen=document.getElementById('heroListen');
  function setLabels(){
    if(stText) stText.textContent = playing ? T('sound.playing','Playing') : T('sound.idle','Listen');
    if(stBtn) stBtn.setAttribute('aria-pressed', playing?'true':'false');
  }
  if(stBtn) stBtn.addEventListener('click', toggleSound);
  if(heroListen) heroListen.addEventListener('click', toggleSound);

  /* audio level for the canvas: 0 when silent, smoothed FFT bands while playing */
  var bandCache=new Float32Array(64);
  function audioBands(){
    if(!playing||!analyser) {
      for(var z=0;z<64;z++) bandCache[z]*=0.94;   /* decay gracefully after stop */
      return bandCache;
    }
    analyser.getByteFrequencyData(fftData);
    for(var i=0;i<64;i++){
      var v=(fftData[i+2]||0)/255;
      bandCache[i]=Math.max(v, bandCache[i]*0.9);
    }
    return bandCache;
  }

  /* ============================================================
     HERO CANVAS — layered ridge-waveforms
     ============================================================ */
  var hero=document.getElementById('hero'),
      canvas=document.getElementById('wavecanvas');
  var mxT=0,myT=0,mx=0,my=0;
  if(!reduce){
    window.addEventListener('mousemove',function(e){
      mxT=(e.clientX/window.innerWidth)*2-1;
      myT=(e.clientY/window.innerHeight)*2-1;
    },{passive:true});
  }

  function buildHeroCanvas(){
    if(!canvas||!canvas.getContext) return;
    var ctx=canvas.getContext('2d'), W=0,H=0,DPR=1;
    var LAYERS=7, PTS=180, profs=[], t0=performance.now();
    for(var i=0;i<LAYERS;i++){
      profs.push(ridgeProfile(11+i*17.3, 4, 1.9+i*0.35, 1.6+0.5*(i/LAYERS), PTS));
    }
    function size(){
      DPR=Math.min(window.devicePixelRatio||1,2);
      W=hero.clientWidth; H=hero.clientHeight;
      canvas.width=W*DPR; canvas.height=H*DPR;
      canvas.style.width=W+'px'; canvas.style.height=H+'px';
      ctx.setTransform(DPR,0,0,DPR,0,0);
    }
    size();
    window.addEventListener('resize',size,{passive:true});

    /* far -> near: each layer fills to the bottom in near-bg so it occludes
       the layers behind it — waveform lines that read as a mountain range */
    var fills=['#17181C','#15161A','#141518','#121316','#101114','#0E0E10','#0C0B0A'];
    function strokeAlpha(i){ return 0.10 + (i/(LAYERS-1))*0.30; }

    function draw(now){
      var t=(now-t0)/1000;
      mx+=(mxT-mx)*0.04; my+=(myT-my)*0.04;
      var bands=audioBands();
      var scrollP=clamp01(window.scrollY/Math.max(1,H));
      ctx.clearRect(0,0,W,H);

      for(var i=0;i<LAYERS;i++){
        var ni=i/(LAYERS-1);                       /* 0 far .. 1 near */
        var prof=profs[i];
        var baseY=H*(0.46+0.50*Math.pow(ni,1.25)) + scrollP*H*0.22*ni; /* near layers sink as you scroll */
        var ampR=H*lerp(0.06,0.20,ni);             /* ridge height */
        var ampW=H*lerp(0.004,0.016,ni);           /* oscillation */
        var speed=lerp(0.14,0.5,ni);
        var par=mx*lerp(6,42,ni);                  /* cursor parallax, px */

        ctx.beginPath();
        ctx.moveTo(-4,H+4);
        for(var p=0;p<=PTS;p++){
          var x=(p/PTS)*W;
          var sx=p/PTS;
          /* audio: map bands across the width, weighted toward the center */
          var b=bands[Math.floor(sx*63)]||0;
          var win=Math.sin(sx*Math.PI);                       /* fade audio at the edges */
          var osc=Math.sin(sx*14+t*speed*2.2+i*1.7)*ampW*(1+my*0.35)
                 +Math.sin(sx*33-t*speed*3.1+i*0.9)*ampW*0.45;
          var audio=b*win*H*lerp(0.015,0.075,ni);
          var y=baseY - prof[p]*ampR - osc - audio;
          ctx.lineTo(x+par*(sx-0.5)*0.3+ (p===0?-4:0), y);
        }
        ctx.lineTo(W+4,H+4);
        ctx.closePath();
        ctx.fillStyle=fills[i]||fills[fills.length-1];
        ctx.fill();
        /* crest line: warm white, one red signal line mid-field */
        ctx.lineWidth=(i===4)?1.4:1;
        ctx.strokeStyle=(i===4)
          ? 'rgba(225,29,60,'+(0.55+bands[24]*0.45)+')'
          : 'rgba(244,241,234,'+strokeAlpha(i)+')';
        ctx.stroke();
      }
    }

    if(reduce){ draw(t0+1); return; }   /* one static frame under reduced motion */
    (function loop(now){
      requestAnimationFrame(loop);
      if(document.hidden) return;
      if(window.scrollY>H*1.15 && !playing) return;  /* hero off-screen and silent — rest */
      draw(now||performance.now());
    })(t0);
  }
  buildHeroCanvas();

  /* CTA canvas — a single quiet signal line */
  (function(){
    var band=document.querySelector('.cta-band'), c=document.getElementById('ctacanvas');
    if(!band||!c||!c.getContext) return;
    var ctx=c.getContext('2d'),W=0,H=0,DPR=1,t0=performance.now();
    var prof=ridgeProfile(83.2,3,2.4,1.4,140);
    function size(){ DPR=Math.min(window.devicePixelRatio||1,2);
      W=band.clientWidth; H=band.clientHeight;
      c.width=W*DPR; c.height=H*DPR; c.style.width=W+'px'; c.style.height=H+'px';
      ctx.setTransform(DPR,0,0,DPR,0,0); }
    size(); window.addEventListener('resize',size,{passive:true});
    function draw(now){
      var t=(now-t0)/1000, bands=audioBands();
      ctx.clearRect(0,0,W,H);
      ctx.beginPath();
      for(var p=0;p<=140;p++){
        var sx=p/140, x=sx*W;
        var b=(bands[Math.floor(sx*63)]||0)*Math.sin(sx*Math.PI);
        var y=H*0.82 - prof[p]*H*0.06 - Math.sin(sx*11+t*0.5)*H*0.008 - b*H*0.05;
        p===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.lineWidth=1; ctx.strokeStyle='rgba(244,241,234,.16)'; ctx.stroke();
    }
    if(reduce){ draw(t0+1); return; }
    (function loop(now){
      requestAnimationFrame(loop);
      if(document.hidden) return;
      var r=band.getBoundingClientRect();
      if(r.bottom<0||r.top>window.innerHeight) return;
      draw(now||performance.now());
    })(t0);
  })();

  /* ============================================================
     Load veil
     ============================================================ */
  var lifted=false, lift=function(){ if(lifted) return; lifted=true; document.body.classList.add('loaded'); };
  if(document.fonts && document.fonts.ready){
    document.fonts.ready.then(function(){ requestAnimationFrame(lift); });
  }
  setTimeout(lift,1200);

  /* ============================================================
     Header: blur when scrolled, hide going down / show going up.
     Red progress hairline.
     ============================================================ */
  var hdr=document.getElementById('hdr'),
      prog=document.getElementById('progress'),
      lastY=window.scrollY, ticking=false;
  function onScroll(){
    var y=window.scrollY;
    hdr.classList.toggle('scrolled', y>40);
    if(!reduce){
      hdr.classList.toggle('hide', y>lastY && y>window.innerHeight*0.9);
    }
    lastY=y;
    var doc=document.documentElement;
    var max=Math.max(1,doc.scrollHeight-window.innerHeight);
    if(prog) prog.style.transform='scaleX('+clamp01(y/max).toFixed(4)+')';
    ticking=false;
  }
  window.addEventListener('scroll',function(){
    if(!ticking){ ticking=true; requestAnimationFrame(onScroll); }
  },{passive:true});
  onScroll();

  /* ============================================================
     Reveals
     ============================================================ */
  if('IntersectionObserver' in window && !reduce){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    },{threshold:0.14,rootMargin:'0px 0px -6% 0px'});
    document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
  }

  /* ============================================================
     Markets index — accordion (one open at a time; first opens on arrival)
     ============================================================ */
  var rows=Array.prototype.slice.call(document.querySelectorAll('#mkIndex .row'));
  function setRow(row,open){
    row.classList.toggle('open',open);
    row.querySelector('.row-head').setAttribute('aria-expanded',open?'true':'false');
  }
  rows.forEach(function(row){
    row.querySelector('.row-head').addEventListener('click',function(){
      var isOpen=row.classList.contains('open');
      rows.forEach(function(r){ setRow(r,false); });
      if(!isOpen) setRow(row,true);
    });
  });
  if(rows.length){
    if('IntersectionObserver' in window && !reduce){
      var ioRow=new IntersectionObserver(function(es){
        es.forEach(function(e){
          if(e.isIntersecting){ setRow(rows[0],true); ioRow.disconnect(); }
        });
      },{threshold:0.4});
      ioRow.observe(rows[0]);
    } else { setRow(rows[0],true); }
  }

  /* ============================================================
     Marquee, banners, CTA, fallbacks
     ============================================================ */
  var mt=document.getElementById('mtrack'); if(mt&&!reduce){ mt.innerHTML+=mt.innerHTML; }

  var ctaBtn=document.getElementById('ctaBtn'),ctaInput=document.getElementById('ctaInput');
  if(ctaBtn) ctaBtn.addEventListener('click',function(){
    var v=(ctaInput.value||'').trim();
    window.location.href='mailto:hola@apusonic.pe'+(v?('?subject=Commission&body=From: '+encodeURIComponent(v)):'');
  });

  function logoFallback(img){
    var span=document.createElement('span');
    span.className='logo-fallback';
    span.setAttribute('role','img'); span.setAttribute('aria-label','Apusonic');
    span.innerHTML='<span class="tri">▲</span>PUSONIC';
    img.replaceWith(span);
  }
  document.querySelectorAll('img.logo-mb').forEach(function(img){
    if(img.complete && img.naturalWidth===0){ logoFallback(img); }
    else img.addEventListener('error',function(){ logoFallback(img); });
  });
  document.querySelectorAll('.banner img').forEach(function(bImg){
    var fail=function(){ bImg.closest('.banner').classList.add('noimg'); };
    if(bImg.complete && bImg.naturalWidth===0) fail();
    else bImg.addEventListener('error',fail);
  });
})();
