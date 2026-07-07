/* Apusonic — fx.js
   The micro-interaction layer: clip-rise heading reveals, magnetic buttons,
   a lagging custom cursor, and a marquee that leans with scroll velocity.
   Everything here is enhancement — it no-ops under reduced motion, on touch,
   and if any piece is unavailable. */
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var EASE = 'cubic-bezier(.22,.75,.25,1)';

  /* ---- clip-rise reveal for big headings ----
     .rise hides with clip-path:inset(112%), which collapses the element's
     IntersectionObserver ratio to ~0 — so an observer is unreliable here (it
     can leave a heading invisible forever). Drive it off getBoundingClientRect
     instead, which reads the true layout box regardless of clip-path. */
  var rises=[].slice.call(document.querySelectorAll('.rise'));
  function checkRise(){
    var vh=window.innerHeight;
    for(var i=rises.length-1;i>=0;i--){
      var r=rises[i].getBoundingClientRect();
      if(r.top < vh*0.88 && r.bottom > 0){ rises[i].classList.add('in'); rises.splice(i,1); }
    }
  }
  if(rises.length){
    checkRise();
    window.addEventListener('scroll', function(){ requestAnimationFrame(checkRise); }, {passive:true});
    window.addEventListener('resize', checkRise, {passive:true});
  }

  if(reduce) return;   /* the rest is motion-only polish */

  var fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ---- magnetic buttons ----
     transform is set inline with priority so it wins over the hero intro's
     forwards-fill animation; released smoothly back to centre on leave. */
  if(fine){
    document.querySelectorAll('.hero-listen, #ctaBtn').forEach(function(el){
      el.classList.add('magnetic');
      el.style.transition='transform .4s '+EASE;
      var strength=0.34;
      el.addEventListener('mousemove',function(e){
        var b=el.getBoundingClientRect();
        var dx=(e.clientX-(b.left+b.width/2))*strength;
        var dy=(e.clientY-(b.top+b.height/2))*strength;
        el.style.setProperty('transform','translate('+dx.toFixed(1)+'px,'+dy.toFixed(1)+'px)','important');
      });
      el.addEventListener('mouseleave',function(){
        el.style.setProperty('transform','translate(0px,0px)','important');
      });
    });
  }

  /* ---- custom cursor: instant dot + lagging ring ---- */
  var cursor=document.getElementById('cursor'), dot=null, ring=null,
      tgtX=window.innerWidth/2, tgtY=window.innerHeight/2, rx=tgtX, ry=tgtY;
  if(fine && cursor){
    dot=cursor.querySelector('.cursor-dot');
    ring=cursor.querySelector('.cursor-ring');
    document.documentElement.classList.add('has-cursor');   /* only now hide the native cursor */
    window.addEventListener('mousemove',function(e){
      tgtX=e.clientX; tgtY=e.clientY;
      if(dot) dot.style.transform='translate('+tgtX+'px,'+tgtY+'px)';
    },{passive:true});
    var HOT='a,button,input,label,.row-head,.card,.lang-toggle,[role=option]';
    document.addEventListener('mouseover',function(e){
      if(e.target.closest && e.target.closest(HOT)) document.body.classList.add('cursor-hot');
    });
    document.addEventListener('mouseout',function(e){
      var to=e.relatedTarget;
      if(e.target.closest && e.target.closest(HOT) && !(to && to.closest && to.closest(HOT)))
        document.body.classList.remove('cursor-hot');
    });
    document.addEventListener('mousedown',function(){ document.body.classList.add('cursor-press'); });
    document.addEventListener('mouseup',function(){ document.body.classList.remove('cursor-press'); });
    document.addEventListener('mouseleave',function(){ cursor.style.opacity='0'; });
    document.addEventListener('mouseenter',function(){ cursor.style.opacity=''; });
  }

  /* ---- marquee leans with scroll velocity ---- */
  var marquee=document.querySelector('.marquee');
  var lastY=window.scrollY, vel=0, skew=0;
  window.addEventListener('scroll',function(){
    var y=window.scrollY; vel=y-lastY; lastY=y;
  },{passive:true});

  /* ---- one rAF loop: ring easing + skew decay ---- */
  function loop(){
    requestAnimationFrame(loop);
    if(document.hidden) return;
    if(fine && ring){
      rx+=(tgtX-rx)*0.38; ry+=(tgtY-ry)*0.38;   /* snappier trail — was too laggy */
      ring.style.transform='translate('+rx.toFixed(1)+'px,'+ry.toFixed(1)+'px)';
    }
    if(marquee){
      var target=Math.max(-4,Math.min(4,vel*0.28));
      skew+=(target-skew)*0.12; vel*=0.82;
      marquee.style.setProperty('--skew',skew.toFixed(2)+'deg');
    }
  }
  requestAnimationFrame(loop);
})();
