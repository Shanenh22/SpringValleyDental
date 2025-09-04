/* nav.js — 769px breakpoint, dual overlay support, desktop-safe */
(() => {
  const BREAKPOINT = 769;

  const $ = (sel, root = document) => root.querySelector(sel);

  const nav = $('#site-nav');
  const toggle = document.querySelector('.hamburger');

  // Collect both possible overlays; create one if none exists
  let overlays = [
    document.querySelector('#nav-overlay'),
    document.querySelector('.nav-overlay'),
  ].filter(Boolean);

  if (overlays.length === 0) {
    const ov = document.createElement('div');
    ov.className = 'nav-overlay';
    ov.hidden = true;
    document.body.appendChild(ov);
    overlays = [ov];
  }

  if (!nav || !toggle || overlays.length === 0) return;

  const mq = window.matchMedia(`(min-width: ${BREAKPOINT}px)`);
  let prevFocus = null;

  const showOverlays = () => overlays.forEach(o => { o.hidden = false; o.classList.add('is-active'); });
  const hideOverlays = () => overlays.forEach(o => { o.classList.remove('is-active'); o.hidden = true; });

  const lockScroll = (on) => {
    document.documentElement.classList.toggle('nav-locked', !!on);
    document.body.classList.toggle('nav-locked', !!on);
  };

  // Hook for inert/focus-trap if you add one later
  const setInert = (_on) => {};

  // Initial state: inline on desktop, hidden on mobile
  nav.hidden = !mq.matches;
  hideOverlays();
  toggle.setAttribute('aria-expanded', 'false');

  const open = () => {
    prevFocus = document.activeElement;
    nav.hidden = false;
    nav.classList.add('is-open');
    showOverlays();
    toggle.setAttribute('aria-expanded', 'true');
    lockScroll(true);
    setInert(true);

    const first = $('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])', nav);
    if (first && first.focus) first.focus();
  };

  const close = () => {
    nav.classList.remove('is-open');
    hideOverlays();

    // Show inline on desktop; hide drawer on mobile
    nav.hidden = !mq.matches;

    toggle.setAttribute('aria-expanded', 'false');
    lockScroll(false);
    setInert(false);

    if (prevFocus && prevFocus.focus) prevFocus.focus();
  };

  // Toggle via hamburger — ignore clicks on desktop widths
  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    if (mq.matches) return; // don't open mobile drawer in desktop layout
    nav.classList.contains('is-open') ? close() : open();
  });

  // Close on overlay click(s) and Escape
  overlays.forEach(o => o.addEventListener('click', close));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  // Auto-close when crossing into desktop (>= 769px)
  const onChange = (e) => { 
    if (e.matches) {
      // Desktop mode - force close and show nav
      close();
      nav.hidden = false;
    } else {
      // Mobile mode - hide nav if not open
      if (!nav.classList.contains('is-open')) {
        nav.hidden = true;
      }
    }
  };
  if (mq.addEventListener) mq.addEventListener('change', onChange);
  else if (mq.addListener) mq.addListener(onChange); // Safari/older

  // Additional window resize handler for edge cases
  window.addEventListener('resize', () => {
    const isDesktop = window.innerWidth >= BREAKPOINT;
    if (isDesktop && nav.classList.contains('is-open')) {
      close();
      nav.hidden = false;
    }
  });
})();