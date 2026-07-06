/* Apusonic — temporary private-preview gate.
   A soft lock only: this is static hosting, so a determined visitor could
   read the source and bypass it. It keeps the site private from casual and
   search-engine traffic until launch. The password is never stored in the
   source — only the SHA-256 hash of it is, and entry is compared by hash. */
(function(){
  var HASH='19a5545133f4a12bb8b566b6aac00f4a644ce801180be97a5367160a43bb2abc';
  var root=document.documentElement,
      gate=document.getElementById('gate'),
      form=document.getElementById('gateForm'),
      input=document.getElementById('gateInput'),
      err=document.getElementById('gateErr');
  if(!gate||!form||!input) return;

  if(!root.classList.contains('unlocked')){
    setTimeout(function(){ input.focus(); }, 500);
  }

  function reveal(){
    try{ sessionStorage.setItem('apus-unlocked','1'); }catch(e){}
    root.classList.add('unlocked');
    gate.setAttribute('hidden','');
  }
  function fail(){
    err.textContent='Incorrect password.';
    gate.classList.add('shake');
    setTimeout(function(){ gate.classList.remove('shake'); }, 500);
    input.select();
  }
  function toHex(buf){
    return Array.prototype.map.call(new Uint8Array(buf),function(b){
      return ('0'+b.toString(16)).slice(-2);
    }).join('');
  }

  form.addEventListener('submit',function(e){
    e.preventDefault();
    var v=input.value||'';
    if(!v) return;
    if(!(window.crypto&&crypto.subtle)){
      err.textContent='This browser can’t verify securely. Open the site over https.';
      return;
    }
    crypto.subtle.digest('SHA-256', new TextEncoder().encode(v)).then(function(buf){
      if(toHex(buf)===HASH) reveal(); else fail();
    }).catch(function(){ fail(); });
  });

  input.addEventListener('input',function(){ err.textContent=''; });
})();
