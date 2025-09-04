/* nav.js - Clean Mobile Navigation (iOS Compatible) */
(() => {
  'use strict';
  
  const MOBILE_BREAKPOINT = 768;
  
  // Get elements
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.hamburger');
  let overlay = document.querySelector('.nav-overlay');
  
  // Create overlay if it doesn't exist
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);
  }
  
  // Exit if essential elements are missing
  if (!nav || !toggle) {
    console.warn('Navigation elements not found');
    return;
  }
  
  // State tracking
  let isOpen = false;
  let lastFocusedElement = null;
  
  // Media query for responsive behavior
  const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
  
  // Utility functions
  const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT;
  
  const preventScroll = (prevent) => {
    if (prevent) {
      document.documentElement.classList.add('nav-locked');
      document.body.classList.add('nav-locked');
    } else {
      document.documentElement.classList.remove('nav-locked');
      document.body.classList.remove('nav-locked');
    }
  };
  
  const updateAriaExpanded = (expanded) => {
    toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  };
  
  const focusFirstNavItem = () => {
    const firstLink = nav.querySelector('a, button');
    if (firstLink && typeof firstLink.focus === 'function') {
      // Small delay to ensure the nav is fully visible
      setTimeout(() => firstLink.focus(), 100);
    }
  };
  
  const restoreFocus = () => {
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  };
  
  // Open navigation
  const openNav = () => {
    if (!isMobile() || isOpen) return;
    
    isOpen = true;
    lastFocusedElement = document.activeElement;
    
    nav.classList.add('is-open');
    overlay.classList.add('is-active');
    overlay.setAttribute('aria-hidden', 'false');
    
    updateAriaExpanded(true);
    preventScroll(true);
    focusFirstNavItem();
  };
  
  // Close navigation
  const closeNav = () => {
    if (!isOpen) return;
    
    isOpen = false;
    
    nav.classList.remove('is-open');
    overlay.classList.remove('is-active');
    overlay.setAttribute('aria-hidden', 'true');
    
    updateAriaExpanded(false);
    preventScroll(false);
    restoreFocus();
  };
  
  // Toggle navigation
  const toggleNav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isMobile()) return;
    
    if (isOpen) {
      closeNav();
    } else {
      openNav();
    }
  };
  
  // Handle responsive changes
  const handleBreakpointChange = (e) => {
    if (!e.matches) {
      // Switched to mobile
      if (isOpen) {
        // Keep nav open if it was already open
        nav.classList.add('is-open');
        overlay.classList.add('is-active');
      }
    } else {
      // Switched to desktop - always close mobile nav
      if (isOpen) {
        closeNav();
      }
    }
  };
  
  // Event listeners
  toggle.addEventListener('click', toggleNav);
  toggle.addEventListener('touchstart', (e) => {
    // Prevent double-tap zoom on iOS
    e.preventDefault();
  });
  
  // Close on overlay click
  overlay.addEventListener('click', closeNav);
  overlay.addEventListener('touchstart', (e) => {
    // Prevent scrolling when touching overlay
    e.preventDefault();
    closeNav();
  });
  
  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeNav();
    }
  });
  
  // Close when clicking nav links (mobile)
  nav.addEventListener('click', (e) => {
    if (isMobile() && e.target.tagName === 'A' && !e.target.classList.contains('dropdown-toggle')) {
      // Small delay to allow navigation to complete
      setTimeout(closeNav, 100);
    }
  });
  
  // Handle responsive breakpoint changes
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleBreakpointChange);
  } else if (mediaQuery.addListener) {
    // Fallback for older browsers
    mediaQuery.addListener(handleBreakpointChange);
  }
  
  // Handle window resize (fallback)
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (!isMobile() && isOpen) {
        closeNav();
      }
    }, 100);
  });
  
  // Handle visibility change (close nav if page becomes hidden)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && isOpen) {
      closeNav();
    }
  });
  
  // Initialize state
  updateAriaExpanded(false);
  
  // Prevent iOS rubber band scrolling when nav is open
  let startY = 0;
  document.addEventListener('touchstart', (e) => {
    if (isOpen && e.target.closest('.site-nav')) {
      startY = e.touches[0].clientY;
    }
  });
  
  document.addEventListener('touchmove', (e) => {
    if (isOpen && e.target.closest('.site-nav')) {
      const currentY = e.touches[0].clientY;
      const scrollTop = nav.scrollTop;
      const maxScroll = nav.scrollHeight - nav.clientHeight;
      
      // Prevent overscroll at top and bottom
      if ((scrollTop <= 0 && currentY > startY) || 
          (scrollTop >= maxScroll && currentY < startY)) {
        e.preventDefault();
      }
    }
  }, { passive: false });
  
})();
