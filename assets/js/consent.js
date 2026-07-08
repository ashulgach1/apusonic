/* Apusonic — consent.js
   Cookie consent under Ley 29733 + D.S. 016-2024-JUS: express, granular,
   demonstrable. Non-essential categories default OFF; nothing is pre-checked.
   The decision (with timestamp) is stored so consent can be evidenced, and
   window.apusConsent exposes it for any future analytics/marketing scripts. */
(function(){
  var KEY='apus-consent-v1';
  var box=document.getElementById('consent'),
      panel=document.getElementById('consentPanel'),
      btnA=document.getElementById('ckAccept'),
      btnD=document.getElementById('ckDecline'),
      btnC=document.getElementById('ckCustom'),
      btnS=document.getElementById('ckSave'),
      cbA=document.getElementById('ckAnalytics'),
      cbM=document.getElementById('ckMarketing'),
      manage=document.getElementById('ckManage');
  if(!box) return;

  function read(){
    try{ return JSON.parse(localStorage.getItem(KEY)); }catch(e){ return null; }
  }
  function store(analytics,marketing){
    var c={necessary:true,analytics:!!analytics,marketing:!!marketing,ts:new Date().toISOString()};
    try{ localStorage.setItem(KEY,JSON.stringify(c)); }catch(e){}
    window.apusConsent=c;
    return c;
  }
  window.apusConsent=read()||null;

  function show(){
    box.hidden=false;
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ box.classList.add('show'); }); });
  }
  function hide(){
    box.classList.remove('show');
    setTimeout(function(){ box.hidden=true; },500);
  }
  function openPanel(){
    panel.hidden=false;
    btnC.setAttribute('aria-expanded','true');
    btnC.hidden=true; btnA.hidden=true; btnD.hidden=true; btnS.hidden=false;
    box.classList.add('expanded');
  }
  function resetPanel(){
    panel.hidden=true;
    btnC.setAttribute('aria-expanded','false');
    btnC.hidden=false; btnA.hidden=false; btnD.hidden=false; btnS.hidden=true;
    box.classList.remove('expanded');
  }

  btnA.addEventListener('click',function(){ store(true,true); hide(); });
  btnD.addEventListener('click',function(){ store(false,false); hide(); });
  btnC.addEventListener('click',openPanel);
  btnS.addEventListener('click',function(){ store(cbA.checked,cbM.checked); hide(); });

  /* footer "Cookie preferences" re-opens the dialog with current choices loaded */
  if(manage) manage.addEventListener('click',function(){
    var c=read();
    if(c){ cbA.checked=!!c.analytics; cbM.checked=!!c.marketing; }
    resetPanel(); show(); openPanel();
    box.scrollIntoView({block:'end'});
  });

  /* first visit: surface the banner shortly after load so it doesn't fight the
     hero intro (or the gate — it sits beneath the gate overlay until unlock) */
  if(!read()){ setTimeout(show, 1600); }
})();
