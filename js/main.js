/* =============================================
   DEEP SAHA — PORTFOLIO JS
============================================= */

(function () {
  'use strict';

  // ── THEME ──────────────────────────────────
  const root      = document.getElementById('pf-root');
  const themeBtns = document.querySelectorAll('#themeToggle');
  const saved     = localStorage.getItem('pf-theme');
  if (saved === 'light') root.setAttribute('data-theme', 'light');

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isLight = root.getAttribute('data-theme') === 'light';
      if (isLight) {
        root.removeAttribute('data-theme');
        localStorage.setItem('pf-theme', 'dark');
      } else {
        root.setAttribute('data-theme', 'light');
        localStorage.setItem('pf-theme', 'light');
      }
    });
  });

  // ── NAVBAR SCROLL ──────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.style.boxShadow = window.scrollY > 20
        ? '0 4px 30px rgba(0,0,0,0.25)'
        : 'none';
    }, { passive: true });
  }

  // ── MOBILE NAV ─────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('open');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
      });
    });
  }

  // ── SCROLL REVEAL ──────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger children of same parent
          const siblings = entry.target.parentElement
            ? [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')]
            : [];
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${Math.min(idx, 4) * 0.08}s`;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // ── PHONE FORMAT ───────────────────────────
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      let v = this.value.replace(/\D/g, '').slice(0, 10);
      if (v.length > 5) v = v.slice(0, 5) + ' ' + v.slice(5);
      this.value = v;
    });
  }

  // ── CONTACT FORM ───────────────────────────
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn        = document.getElementById('submitBtn');
      const btnText    = document.getElementById('btnText');
      const successMsg = document.getElementById('successMsg');
      const errorMsg   = document.getElementById('errorMsg');

      // Validate
      const name    = document.getElementById('name').value.trim();
      const email   = document.getElementById('email').value.trim();
      const phone   = document.getElementById('phone').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !phone || !message) {
        errorMsg.textContent = '✕ Please fill in all fields.';
        errorMsg.style.display = 'block';
        successMsg.style.display = 'none';
        return;
      }

      // Loading state
      btn.disabled = true;
      btnText.innerHTML = '<span class="ct-spinner"></span>Sending...';

      // Simulate send (replace with real endpoint or Formspree)
      // To use Formspree: change action URL below and use fetch
      const FORMSPREE_URL = 'https://formspree.io/f/YOUR_FORM_ID'; // replace with real ID

      const payload = { name, email, phone, message };

      try {
        // Try real endpoint; if it fails with 404/network, show success anyway for demo
        const res = await fetch(FORMSPREE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok || FORMSPREE_URL.includes('YOUR_FORM_ID')) {
          successMsg.style.display = 'block';
          errorMsg.style.display   = 'none';
          form.reset();
        } else {
          throw new Error('Server error');
        }
      } catch {
        // Demo fallback — shows success if no backend configured
        if (FORMSPREE_URL.includes('YOUR_FORM_ID')) {
          successMsg.style.display = 'block';
          errorMsg.style.display   = 'none';
          form.reset();
        } else {
          errorMsg.textContent     = '✕ Error sending message. Please try again.';
          errorMsg.style.display   = 'block';
          successMsg.style.display = 'none';
        }
      }

      btn.disabled   = false;
      btnText.textContent = 'Send Message →';
    });
  }

  // ── ACTIVE NAV LINK ────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage) {
      a.classList.add('active');
    }
  });

})();
