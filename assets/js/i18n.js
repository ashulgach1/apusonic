/* Apusonic i18n — English / Español (Perú) / Português (Brasil).
   Each value is innerHTML so inline markup (red spans, line breaks) is preserved. */
(function(){
  var DICT = {
    en: {
      'nav.services':'Services','nav.solutions':'Solutions','nav.contact':'Contact',
      'sound.idle':'Listen','sound.playing':'Playing',
      'hero.eyebrow':'Music origination & rights · Lima, Perú',
      'hero.l1':'We don’t license','hero.l2':'Perú’s sound.','hero.l3':'We originate it.',
      'hero.sub':'Original music for screens, stadiums, and institutions — written, recorded, and registered in Lima.',
      'hero.listen':'Press play — hear the summit',
      'scrollcue':'Scroll',
      'apu.pos':'noun · Quechua',
      'apu.quote':'In the Andes, the great mountain that watches over its people is called an <span class="red">Apu</span>.',
      'apu.note':'The mountain that gives a place its name and its character. Ours gives it a sound.',
      'manifesto.lead':'Written here. Recorded here. <span class="red">Registered to endure.</span>',
      'mani.1.h':'The origination edge',
      'mani.1.p':'We don’t pull tracks off a shelf. We write them, recorded with a full orchestra in Lima, so the work feels local, performs nationally, and moves people.',
      'mani.2.h':'The rights engine',
      'mani.2.p':'Every original note is registered with APDAYC and the regional societies, so a single commission keeps earning royalties on every broadcast, stream, and public play, for the life of the work.',
      'mani.3.h':'The only partner you need',
      'mani.3.p':'Composition, sonic branding, rights, and delivery, all under one roof in Lima. The first full-stack music house built for Peru’s screens, stadiums, and institutions.',
      'sec.1':'Streaming & cable TV','sec.2':'Film','sec.3':'Football clubs','sec.4':'Video games','sec.5':'State broadcast','sec.6':'Telenovela','sec.7':'Institutions','sec.8':'Advertising',
      'banner.1':'Recorded with a full orchestra in Lima.',
      'banner.2':'Anthems a stadium sings back.',
      'services.eyebrow':'Our services','services.h':'One house.<br>Every sound a story needs.',
      'svc.1.h':'Bespoke Composition & Sonic DNA',
      'svc.1.p':'Original scores for screen, brand anthems, and audio logos — written for you, recorded, mixed, and delivered as stems. Work-for-hire, with a retained writer’s share.',
      'svc.2.h':'Brand & Sonic Identity',
      'svc.2.p':'A complete audio identity for a club or institution: anthem, hype cues, stingers, digital-platform sounds, and stadium playback masters — built to play for decades.',
      'svc.3.h':'ADR & Localized Scoring',
      'svc.3.p':'When a foreign series is repackaged for Latin America, we compose the adapted score for every episode — original creation, not just localized dialogue.',
      'svc.4.h':'Technology-Enabled Delivery',
      'svc.4.p':'Embedded measurement and versioning, so clients can hear the ROI on their sound — our creativity made auditable, trackable, and indispensable.',
      'pkg.eyebrow':'Packages','pkg.h':'Four ways to commission. <span class="red">Every note original.</span>',
      'pkg.note':'Nothing here is pre-made. Every package is written for you, note by note — there is no catalog to buy from.',
      'pkg.1.h':'Original Score',
      'pkg.1.p':'An original commercial score, composed to picture and delivered finished — sessions, mix, and full stems.',
      'pkg.2.h':'Sonic Identity Suite',
      'pkg.2.p':'A complete sonic identity for a club or brand — a 2–3 minute anthem, a set of stingers, a digital kit, and a stadium playback master, with annual updates.',
      'pkg.3.h':'Adaptive Game Score',
      'pkg.3.p':'A dynamic, in-game score that responds to play — interactive layers, stingers, and sound design, delivered through middleware.',
      'pkg.4.h':'Episode ADR & Localization',
      'pkg.4.p':'Per-episode adapted scoring for a foreign series brought to Latin America — original transitional cues and bilingual delivery, not just dubbed dialogue.',
      'markets.eyebrow':'Who we serve','markets.h':'Peru produces more <span class="red">than it can score.</span>',
      'mk.1.tag':'Streaming & Cable TV','mk.1.h':'Thousands of hours, all needing music.',
      'mk.1.p':'Every series, every film, every channel needs original scoring and sound-branding. We compose it, at the volume and speed Peruvian broadcast actually moves.',
      'mk.2.tag':'Video Games','mk.2.h':'Dozens of studios, still scoring with stock.',
      'mk.2.p':'Local studios need original adaptive scores, stingers, and sound design built for play. We replace fragmented freelancers and generic overseas tracks with one studio that knows the medium.',
      'mk.3.tag':'Stadiums & Clubs','mk.3.h':'Anthems a city sings for decades.',
      'mk.3.p':'The country’s biggest clubs commission new anthems, in-stadium audio, and digital identity tracks. High-budget, emotional assets. We make them original, and we make them ownable.',
      'mk.4.tag':'Government & Institutions','mk.4.h':'Sound that represents a nation.',
      'mk.4.p':'State commissions, civic anthems, and original orchestral works. Public money meets permanent sound, written to stand for a country and registered to endure.',
      'mk.5.tag':'Film & Advertising','mk.5.h':'A score on screen, a logo at the shelf.',
      'mk.5.p':'National films and brand campaigns need original scores and sonic logos. We give each one a sound it owns, in the cinema and at the point of sale.',
      'mk.6.tag':'ADR & Dubbing','mk.6.h':'More than dubbed voices.',
      'mk.6.p':'When foreign series are repackaged for Latin America, they need adapted, original scoring, not just localized dialogue. We compose the music that makes a story travel.',
      'cta.eyebrow':'Commission','cta.h':'Peru already has a voice.<br><span class="red">We carry it to the summit.</span>',
      'cta.sub':'Reach out to the house that writes original sound and keeps what it earns. Tell us what needs music.',
      'cta.ph':'Your email','cta.btn':'Get in touch',
      'foot.apu':'<em>Apu</em> — in the Andes, the mountain that gives a place its name and its character. A music origination and rights house in Lima, Perú.',
      'foot.col1':'Services','foot.s1':'Composition & Sonic DNA','foot.s2':'Rights & Monetization','foot.s3':'Sonic Branding','foot.s4':'ADR & Localized Scoring','foot.s5':'Adaptive Game Score',
      'foot.col2':'Solutions','foot.sol1':'Streaming & Cable TV','foot.sol2':'Video Games','foot.sol3':'Stadiums & Clubs','foot.sol4':'Government & Institutions','foot.sol5':'Film & Advertising',
      'foot.col3':'Company','foot.c1':'Contact','foot.c3':'Lima, Perú',
      'foot.copy':'© 2026 Apusonic','foot.reg':'Registered with APDAYC · Lima, Perú'
    },
    es: {
      'nav.services':'Servicios','nav.solutions':'Soluciones','nav.contact':'Contacto',
      'sound.idle':'Escuchar','sound.playing':'Sonando',
      'hero.eyebrow':'Creación musical y derechos · Lima, Perú',
      'hero.l1':'No licenciamos','hero.l2':'el sonido del Perú.','hero.l3':'Lo originamos.',
      'hero.sub':'Música original para pantallas, estadios e instituciones — escrita, grabada y registrada en Lima.',
      'hero.listen':'Presiona play — escucha la cumbre',
      'scrollcue':'Desliza',
      'apu.pos':'sustantivo · quechua',
      'apu.quote':'En los Andes, la gran montaña que vela por su pueblo se llama <span class="red">Apu</span>.',
      'apu.note':'La montaña que le da a un lugar su nombre y su carácter. La nuestra le da un sonido.',
      'manifesto.lead':'Se escribe aquí. Se graba aquí. <span class="red">Se registra para perdurar.</span>',
      'mani.1.h':'La ventaja de originar',
      'mani.1.p':'No sacamos pistas de un estante. Las componemos y las grabamos con una orquesta completa en Lima, para que la obra se sienta local, funcione a nivel nacional y emocione a la gente.',
      'mani.2.h':'El motor de derechos',
      'mani.2.p':'Cada nota original se registra en APDAYC y en las sociedades regionales, para que un solo encargo siga generando regalías en cada emisión, reproducción y ejecución pública, durante toda la vida de la obra.',
      'mani.3.h':'El único socio que necesitas',
      'mani.3.p':'Composición, identidad sonora, derechos y entrega, todo bajo un mismo techo en Lima. La primera casa musical integral creada para las pantallas, los estadios y las instituciones del Perú.',
      'sec.1':'Streaming y TV por cable','sec.2':'Cine','sec.3':'Clubes de fútbol','sec.4':'Videojuegos','sec.5':'Televisión del Estado','sec.6':'Telenovela','sec.7':'Instituciones','sec.8':'Publicidad',
      'banner.1':'Grabado con una orquesta completa en Lima.',
      'banner.2':'Himnos que un estadio devuelve cantando.',
      'services.eyebrow':'Nuestros servicios','services.h':'Una sola casa.<br>Cada sonido que una historia necesita.',
      'svc.1.h':'Composición a medida y ADN sonoro',
      'svc.1.p':'Bandas sonoras originales para pantalla, himnos de marca y logos de audio — escritos para ti, grabados, mezclados y entregados en stems. Por encargo, con una participación de autor retenida.',
      'svc.2.h':'Identidad de marca y sonora',
      'svc.2.p':'Una identidad de audio completa para un club o institución: himno, cortinas de impacto, remates, sonidos para plataformas digitales y masters de reproducción para estadio — hechos para sonar por décadas.',
      'svc.3.h':'ADR y musicalización localizada',
      'svc.3.p':'Cuando una serie extranjera se readapta para América Latina, componemos la música adaptada de cada episodio — creación original, no solo diálogo doblado.',
      'svc.4.h':'Entrega potenciada por tecnología',
      'svc.4.p':'Medición y versionado integrados, para que los clientes escuchen el retorno de su sonido — nuestra creatividad hecha auditable, rastreable e indispensable.',
      'pkg.eyebrow':'Paquetes','pkg.h':'Cuatro formas de encargar. <span class="red">Cada nota, original.</span>',
      'pkg.note':'Aquí nada está prehecho. Cada paquete se escribe para ti, nota por nota — no hay catálogo que comprar.',
      'pkg.1.h':'Banda sonora original',
      'pkg.1.p':'Una banda sonora comercial original, compuesta a imagen y entregada terminada — sesiones, mezcla y stems completos.',
      'pkg.2.h':'Suite de identidad sonora',
      'pkg.2.p':'Una identidad sonora completa para un club o marca — un himno de 2 a 3 minutos, un set de remates, un kit digital y un master de reproducción para estadio, con actualizaciones anuales.',
      'pkg.3.h':'Música adaptativa para videojuegos',
      'pkg.3.p':'Una música dinámica dentro del juego que responde al jugador — capas interactivas, remates y diseño de sonido, entregada vía middleware.',
      'pkg.4.h':'ADR y localización por episodio',
      'pkg.4.p':'Música adaptada por episodio para una serie extranjera traída a América Latina — cortinas de transición originales y entrega bilingüe, no solo diálogo doblado.',
      'markets.eyebrow':'A quién servimos','markets.h':'El Perú produce más <span class="red">de lo que puede musicalizar.</span>',
      'mk.1.tag':'Streaming y TV por cable','mk.1.h':'Miles de horas, todas necesitan música.',
      'mk.1.p':'Cada serie, cada película, cada canal necesita musicalización original e identidad sonora. La componemos, al volumen y la velocidad a los que realmente se mueve la televisión peruana.',
      'mk.2.tag':'Videojuegos','mk.2.h':'Decenas de estudios, todavía musicalizan con pistas de archivo.',
      'mk.2.p':'Los estudios locales necesitan música adaptativa original, remates y diseño de sonido pensados para el juego. Reemplazamos a freelancers dispersos y pistas genéricas del extranjero con un solo estudio que conoce el medio.',
      'mk.3.tag':'Estadios y clubes','mk.3.h':'Himnos que una ciudad canta por décadas.',
      'mk.3.p':'Los clubes más grandes del país encargan nuevos himnos, audio para el estadio y pistas de identidad digital. Activos emocionales y de alto presupuesto. Los hacemos originales, y los hacemos de su propiedad.',
      'mk.4.tag':'Gobierno e instituciones','mk.4.h':'Sonido que representa a una nación.',
      'mk.4.p':'Encargos del Estado, himnos cívicos y obras orquestales originales. El dinero público se encuentra con un sonido permanente, escrito para representar a un país y registrado para perdurar.',
      'mk.5.tag':'Cine y publicidad','mk.5.h':'Una banda sonora en pantalla, un logo en el estante.',
      'mk.5.p':'Las películas nacionales y las campañas de marca necesitan bandas sonoras originales y logos sonoros. A cada una le damos un sonido propio, en el cine y en el punto de venta.',
      'mk.6.tag':'ADR y doblaje','mk.6.h':'Más que voces dobladas.',
      'mk.6.p':'Cuando las series extranjeras se adaptan para América Latina, necesitan una musicalización original y adaptada, no solo diálogos localizados. Componemos la música que hace que una historia viaje.',
      'cta.eyebrow':'Encarga tu obra','cta.h':'El Perú ya tiene una voz.<br><span class="red">Nosotros la llevamos a la cumbre.</span>',
      'cta.sub':'Contáctate con la casa que escribe sonido original y conserva lo que genera. Cuéntanos qué necesita música.',
      'cta.ph':'Tu correo','cta.btn':'Ponte en contacto',
      'foot.apu':'<em>Apu</em> — en los Andes, la montaña que le da a un lugar su nombre y su carácter. Una casa de creación musical y derechos en Lima, Perú.',
      'foot.col1':'Servicios','foot.s1':'Composición y ADN sonoro','foot.s2':'Derechos y monetización','foot.s3':'Identidad sonora','foot.s4':'ADR y musicalización localizada','foot.s5':'Música adaptativa para videojuegos',
      'foot.col2':'Soluciones','foot.sol1':'Streaming y TV por cable','foot.sol2':'Videojuegos','foot.sol3':'Estadios y clubes','foot.sol4':'Gobierno e instituciones','foot.sol5':'Cine y publicidad',
      'foot.col3':'Empresa','foot.c1':'Contacto','foot.c3':'Lima, Perú',
      'foot.copy':'© 2026 Apusonic','foot.reg':'Registrado en APDAYC · Lima, Perú'
    },
    pt: {
      'nav.services':'Serviços','nav.solutions':'Soluções','nav.contact':'Contato',
      'sound.idle':'Ouvir','sound.playing':'Tocando',
      'hero.eyebrow':'Criação musical e direitos · Lima, Peru',
      'hero.l1':'Não licenciamos','hero.l2':'o som do Peru.','hero.l3':'Nós o originamos.',
      'hero.sub':'Música original para telas, estádios e instituições — escrita, gravada e registrada em Lima.',
      'hero.listen':'Aperte o play — ouça o cume',
      'scrollcue':'Role',
      'apu.pos':'substantivo · quíchua',
      'apu.quote':'Nos Andes, a grande montanha que zela por seu povo é chamada de <span class="red">Apu</span>.',
      'apu.note':'A montanha que dá a um lugar seu nome e seu caráter. A nossa lhe dá um som.',
      'manifesto.lead':'Escrito aqui. Gravado aqui. <span class="red">Registrado para durar.</span>',
      'mani.1.h':'A vantagem de originar',
      'mani.1.p':'Não tiramos faixas de uma prateleira. Nós as compomos e gravamos com uma orquestra completa em Lima, para que a obra soe local, funcione em todo o país e emocione as pessoas.',
      'mani.2.h':'O motor de direitos',
      'mani.2.p':'Cada nota original é registrada na APDAYC e nas sociedades regionais, para que um único projeto continue gerando royalties em cada transmissão, streaming e execução pública, por toda a vida da obra.',
      'mani.3.h':'O único parceiro de que você precisa',
      'mani.3.p':'Composição, identidade sonora, direitos e entrega, tudo sob o mesmo teto em Lima. A primeira casa musical completa criada para as telas, os estádios e as instituições do Peru.',
      'sec.1':'Streaming e TV a cabo','sec.2':'Cinema','sec.3':'Clubes de futebol','sec.4':'Videogames','sec.5':'Radiodifusão estatal','sec.6':'Telenovela','sec.7':'Instituições','sec.8':'Publicidade',
      'banner.1':'Gravado com uma orquestra completa em Lima.',
      'banner.2':'Hinos que um estádio canta de volta.',
      'services.eyebrow':'Nossos serviços','services.h':'Uma só casa.<br>Cada som que uma história precisa.',
      'svc.1.h':'Composição sob medida e DNA sonoro',
      'svc.1.p':'Trilhas originais para tela, hinos de marca e logos de áudio — escritos para você, gravados, mixados e entregues em stems. Sob encomenda, com uma participação autoral retida.',
      'svc.2.h':'Identidade de marca e sonora',
      'svc.2.p':'Uma identidade de áudio completa para um clube ou instituição: hino, deixas de impacto, vinhetas, sons para plataformas digitais e masters de reprodução para estádio — feitos para tocar por décadas.',
      'svc.3.h':'ADR e trilha localizada',
      'svc.3.p':'Quando uma série estrangeira é readaptada para a América Latina, compomos a trilha adaptada de cada episódio — criação original, não apenas diálogo dublado.',
      'svc.4.h':'Entrega impulsionada por tecnologia',
      'svc.4.p':'Medição e versionamento integrados, para que os clientes ouçam o retorno do seu som — nossa criatividade tornada auditável, rastreável e indispensável.',
      'pkg.eyebrow':'Pacotes','pkg.h':'Quatro formas de encomendar. <span class="red">Cada nota, original.</span>',
      'pkg.note':'Aqui nada é pré-fabricado. Cada pacote é escrito para você, nota por nota — não há catálogo para comprar.',
      'pkg.1.h':'Trilha original',
      'pkg.1.p':'Uma trilha comercial original, composta para a imagem e entregue finalizada — sessões, mixagem e stems completos.',
      'pkg.2.h':'Suíte de identidade sonora',
      'pkg.2.p':'Uma identidade sonora completa para um clube ou marca — um hino de 2 a 3 minutos, um conjunto de vinhetas, um kit digital e um master de reprodução para estádio, com atualizações anuais.',
      'pkg.3.h':'Trilha adaptativa para games',
      'pkg.3.p':'Uma trilha dinâmica dentro do jogo que responde à jogabilidade — camadas interativas, vinhetas e design de som, entregue via middleware.',
      'pkg.4.h':'ADR e localização por episódio',
      'pkg.4.p':'Trilha adaptada por episódio para uma série estrangeira trazida à América Latina — pontes de transição originais e entrega bilíngue, não apenas diálogo dublado.',
      'markets.eyebrow':'Quem atendemos','markets.h':'O Peru produz mais <span class="red">do que consegue musicar.</span>',
      'mk.1.tag':'Streaming e TV a cabo','mk.1.h':'Milhares de horas, todas precisando de música.',
      'mk.1.p':'Cada série, cada filme, cada canal precisa de trilha original e identidade sonora. Nós a compomos, no volume e na velocidade em que a transmissão peruana realmente acontece.',
      'mk.2.tag':'Videogames','mk.2.h':'Dezenas de estúdios, ainda usando trilhas de catálogo.',
      'mk.2.p':'Os estúdios locais precisam de trilhas adaptativas originais, vinhetas e design de som feitos para o jogo. Substituímos freelancers dispersos e trilhas genéricas importadas por um único estúdio que entende o meio.',
      'mk.3.tag':'Estádios e clubes','mk.3.h':'Hinos que uma cidade canta por décadas.',
      'mk.3.p':'Os maiores clubes do país encomendam novos hinos, áudio para o estádio e faixas de identidade digital. Ativos emocionais e de alto orçamento. Nós os tornamos originais e os tornamos de sua propriedade.',
      'mk.4.tag':'Governo e instituições','mk.4.h':'Som que representa uma nação.',
      'mk.4.p':'Encomendas do Estado, hinos cívicos e obras orquestrais originais. O dinheiro público encontra um som permanente, escrito para representar um país e registrado para perdurar.',
      'mk.5.tag':'Cinema e publicidade','mk.5.h':'Uma trilha na tela, um logo na prateleira.',
      'mk.5.p':'Os filmes nacionais e as campanhas de marca precisam de trilhas originais e logos sonoros. Damos a cada um um som próprio, no cinema e no ponto de venda.',
      'mk.6.tag':'ADR e dublagem','mk.6.h':'Mais do que vozes dubladas.',
      'mk.6.p':'Quando séries estrangeiras são adaptadas para a América Latina, elas precisam de uma trilha original e adaptada, não apenas diálogos localizados. Compomos a música que faz uma história viajar.',
      'cta.eyebrow':'Encomende','cta.h':'O Peru já tem uma voz.<br><span class="red">Nós a levamos ao cume.</span>',
      'cta.sub':'Fale com a casa que escreve som original e mantém o que ele gera. Conte-nos o que precisa de música.',
      'cta.ph':'Seu e-mail','cta.btn':'Entre em contato',
      'foot.apu':'<em>Apu</em> — nos Andes, a montanha que dá a um lugar seu nome e seu caráter. Uma casa de criação musical e direitos em Lima, Peru.',
      'foot.col1':'Serviços','foot.s1':'Composição e DNA sonoro','foot.s2':'Direitos e monetização','foot.s3':'Identidade sonora','foot.s4':'ADR e trilha localizada','foot.s5':'Trilha adaptativa para games',
      'foot.col2':'Soluções','foot.sol1':'Streaming e TV a cabo','foot.sol2':'Videogames','foot.sol3':'Estádios e clubes','foot.sol4':'Governo e instituições','foot.sol5':'Cinema e publicidade',
      'foot.col3':'Empresa','foot.c1':'Contato','foot.c3':'Lima, Peru',
      'foot.copy':'© 2026 Apusonic','foot.reg':'Registrado na APDAYC · Lima, Peru'
    }
  };

  var SUP = ['en','es','pt'];
  var lang = 'en';
  try { var saved = localStorage.getItem('apus-lang'); if (saved && SUP.indexOf(saved) >= 0) lang = saved; } catch(e){}

  function apply(l){
    var d = DICT[l] || DICT.en;
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i=0;i<nodes.length;i++){ var k=nodes[i].getAttribute('data-i18n'); if (d[k]!=null) nodes[i].innerHTML=d[k]; }
    var ph = document.querySelectorAll('[data-i18n-ph]');
    for (var j=0;j<ph.length;j++){ var pk=ph[j].getAttribute('data-i18n-ph'); if (d[pk]!=null) ph[j].setAttribute('placeholder', d[pk]); }
    document.documentElement.setAttribute('lang', l);
    lang = l;
  }

  // expose helpers for main.js (sound toggle label)
  window.apusT = function(key){ var d = DICT[lang] || DICT.en; return d[key]!=null ? d[key] : (DICT.en[key]||''); };
  window.apusLang = function(){ return lang; };

  // apply chosen language immediately (runs before main.js duplicates the marquee)
  apply(lang);

  /* ---- language switcher ---- */
  var wrap = document.getElementById('lang'),
      toggle = document.getElementById('langToggle'),
      menu = document.getElementById('langMenu'),
      flagSlot = document.getElementById('langFlag');

  function flagFor(l){ var li = menu.querySelector('li[data-lang="'+l+'"]'); return li ? li.querySelector('.flag').innerHTML : ''; }
  function setFlag(l){ flagSlot.innerHTML = flagFor(l); }
  function openMenu(){ wrap.classList.add('open'); toggle.setAttribute('aria-expanded','true'); }
  function closeMenu(){ wrap.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); }
  function markActive(l){ var ls = menu.querySelectorAll('li'); for (var i=0;i<ls.length;i++){ ls[i].setAttribute('aria-selected', ls[i].getAttribute('data-lang')===l ? 'true':'false'); } }

  function choose(l){
    apply(l); setFlag(l); markActive(l);
    try { localStorage.setItem('apus-lang', l); } catch(e){}
    closeMenu();
  }

  setFlag(lang); markActive(lang);

  toggle.addEventListener('click', function(e){
    e.stopPropagation();
    wrap.classList.contains('open') ? closeMenu() : openMenu();
  });
  var items = menu.querySelectorAll('li');
  for (var i=0;i<items.length;i++){
    (function(li){
      li.addEventListener('click', function(){ choose(li.getAttribute('data-lang')); });
      li.addEventListener('keydown', function(e){ if (e.key==='Enter'||e.key===' '){ e.preventDefault(); choose(li.getAttribute('data-lang')); } });
    })(items[i]);
  }
  document.addEventListener('click', function(e){ if (!wrap.contains(e.target)) closeMenu(); });
  document.addEventListener('keydown', function(e){ if (e.key==='Escape') closeMenu(); });
})();
