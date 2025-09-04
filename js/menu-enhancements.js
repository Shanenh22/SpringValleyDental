
// menu-enhancements.js — augments #site-nav drawer with patient-first layout + analytics
(function(){
  'use strict';
  const $  = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
  const on = (el,ev,fn)=>el&&el.addEventListener(ev,fn,{passive:true});

  function gaEvent(name, params){
    if (typeof gtag === 'function') {
      try{ gtag('event', name, params || {}); }catch(e){}
    } else {
      // fallback for debugging
      // console.log('[GA]', name, params);
    }
  }

  function buildHeader(nav){
    // Skip if already built
    if ($('.menu-header', nav)) return;

    // Brand row
    const header = document.createElement('div');
    header.className = 'menu-header';
    header.setAttribute('role','region');
    header.setAttribute('aria-label','Menu header');

    const closeBtn = document.createElement('button');
    closeBtn.className = 'menu-close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label','Close menu');
    closeBtn.innerText = '✕';

    // Reuse logo if present in header
    const logoSrc = ($('.navbar .logo img')||{}).src || ($('.navbar .logo')? $('.navbar .logo').getAttribute('src') : '');

    const brandRow = document.createElement('div');
    brandRow.className = 'brand-row';

    if (logoSrc) {
      const img = document.createElement('img');
      img.className = 'brand';
      img.alt = 'Practice logo';
      img.src = logoSrc;
      brandRow.appendChild(img);
    }

    const meta = document.createElement('div');
    meta.className = 'practice-meta';
    const name = document.createElement('div');
    name.className = 'practice-name';
    name.textContent = document.title || 'Our Practice';
    const hours = document.createElement('div');
    hours.className = 'practice-hours';
    hours.textContent = 'Open today • Call for hours';
    meta.appendChild(name);
    meta.appendChild(hours);
    brandRow.appendChild(meta);

    // Top CTAs
    const ctas = document.createElement('div');
    ctas.className = 'menu-ctas';
    ctas.setAttribute('role','group');
    ctas.setAttribute('aria-label','Primary actions');

    const phone = (typeof CTA_PHONE !== 'undefined') ? CTA_PHONE : 'tel:19728522222';
    const book  = (typeof CTA_BOOK  !== 'undefined') ? CTA_BOOK  : '/contact.html';
    const map   = (typeof CTA_MAP   !== 'undefined') ? CTA_MAP   : '/contact.html';

    const ctaCall = document.createElement('a');
    ctaCall.className = 'menu-cta call';
    ctaCall.href = phone;
    ctaCall.textContent = 'Call';
    ctaCall.setAttribute('aria-label','Call our office');
    on(ctaCall,'click',()=>gaEvent('menu_cta_click',{cta:'call'}));

    const ctaBook = document.createElement('a');
    ctaBook.className = 'menu-cta book';
    ctaBook.href = book;
    ctaBook.textContent = 'Book';
    ctaBook.setAttribute('aria-label','Book an appointment online');
    on(ctaBook,'click',()=>gaEvent('menu_cta_click',{cta:'book'}));

    const ctaDir = document.createElement('a');
    ctaDir.className = 'menu-cta directions';
    ctaDir.href = map;
    ctaDir.textContent = 'Directions';
    ctaDir.setAttribute('aria-label','Get directions and hours');
    on(ctaDir,'click',()=>gaEvent('menu_cta_click',{cta:'directions'}));

    ctas.appendChild(ctaCall); ctas.appendChild(ctaBook); ctas.appendChild(ctaDir);

    header.appendChild(closeBtn);
    header.appendChild(brandRow);
    header.appendChild(ctas);

    // Insert at top
    nav.insertBefore(header, nav.firstChild);

    // Close interaction (delegates to existing nav.js click handler)
    on(closeBtn,'click', function(ev){
      ev.preventDefault();
      // Trigger the same toggle used by your menu button to close
      const toggle = document.getElementById('nav-toggle') || document.querySelector('.hamburger');
      if (toggle) toggle.click();
    });
  }

  function buildSections(nav){
    // Avoid duplicates
    if ($('.menu-section', nav)) return;

    // Intent grid
    const intent = document.createElement('div');
    intent.className = 'menu-section';
    const t = document.createElement('h3');
    t.className = 'section-title';
    t.textContent = 'I need…';
    const ul = document.createElement('ul');
    ul.className = 'menu-links intent-grid';

    const items = [
      {href:'emergency.html', text:'Emergency care'},
      {href:'teeth-cleaning.html', text:'Cleaning & checkup'},
      {href:'teeth-whitening.html', text:'Teeth whitening'},
      {href:'dental-implants.html', text:'Dental implants'}
    ];
    items.forEach(it=>{
      const li=document.createElement('li'); const a=document.createElement('a');
      a.href=it.href; a.textContent=it.text; a.setAttribute('role','link');
      on(a,'click',()=>gaEvent('menu_intent_click',{label: it.text}));
      li.appendChild(a); ul.appendChild(li);
    });
    intent.appendChild(t); intent.appendChild(ul);

    // Patients section (only add links that exist on the site)
    const patients = document.createElement('div');
    patients.className = 'menu-section';
    const pt = document.createElement('h3');
    pt.className = 'section-title'; pt.textContent = 'Patients';
    const links = document.createElement('ul');
    links.className = 'menu-links';
    const candidates = [
      {href:'patient-info.html', text:'New patient forms'},
      {href:'patient-info.html#insurance', text:'Insurance & financing'},
      {href:'ask-a-question.html', text:'Ask a question'}
    ];
    candidates.forEach(c=>{
      const li=document.createElement('li'); const a=document.createElement('a');
      a.href=c.href; a.textContent=c.text;
      on(a,'click',()=>gaEvent('menu_link_click',{label: c.text}));
      li.appendChild(a); links.appendChild(li);
    });
    patients.appendChild(pt); patients.appendChild(links);

    // Footer trust
    const footer = document.createElement('div');
    footer.className = 'menu-footer';
    const trust = document.createElement('div');
    trust.className = 'trust';
    const pill1 = document.createElement('span'); pill1.className='pill insurance'; pill1.textContent='Most PPO plans accepted';
    const pill2 = document.createElement('span'); pill2.className='pill rating'; pill2.setAttribute('aria-label','Google rating'); pill2.textContent='★★★★★ 4.9';
    trust.appendChild(pill1); trust.appendChild(pill2);
    
    // Insert after existing nav links
    nav.appendChild(intent);
    nav.appendChild(patients);
    nav.appendChild(footer);
  }

  function dedupeBook(nav){
    // Hide any duplicate 'Book Online' link lower in the list
    const bookHref = (typeof CTA_BOOK !== 'undefined') ? CTA_BOOK : '/contact.html';
    const lowerLinks = $$('a[href*=\"appointment\"], a[href*=\"book\"], a[href*=\"contact\"]', nav);
    lowerLinks.forEach(a=>{
      // If it's clearly a booking link and not our top CTA, hide it
      const txt = (a.textContent||'').toLowerCase();
      if (txt.includes('book') || /appointment/i.test(txt)){
        a.classList.add('hide-dup');
      }
    });
  }

  function instrumentAll(nav){
    // Catch-all analytics for other links inside the drawer
    on(nav, 'click', function(ev){
      const a = ev.target.closest('a');
      if (!a) return;
      if (a.classList.contains('menu-cta')) return; // CTAs already tracked
      if (a.closest('.intent-grid')) return;        // intents already tracked
      gaEvent('menu_link_click', {label: a.textContent.trim().slice(0,80)});
    });
  }

  // Build when nav first opens
  document.addEventListener('click', function(e){
    const toggle = e.target.closest && e.target.closest('#nav-toggle, .hamburger');
    if (!toggle) return;
    const nav = document.getElementById('site-nav') || document.querySelector('nav.site-nav');
    if (!nav) return;
    // Wait a tick so your existing open logic runs first
    setTimeout(()=>{
      buildHeader(nav);
      buildSections(nav);
      dedupeBook(nav);
      instrumentAll(nav);
    }, 20);
  }, {passive:true});

})();
