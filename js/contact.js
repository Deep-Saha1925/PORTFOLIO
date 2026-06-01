/* =============================================
   CONTACT PAGE — STATIC FORM HANDLER
   Two methods:
   1. Formspree (free, no backend needed)
   2. mailto fallback (opens email app)
============================================= */

(function () {
  'use strict';

  // ── CONFIG — replace with your Formspree ID ──
  // Sign up free at https://formspree.io
  // Create a form → copy the ID (e.g. "xpzgabcd")
  const FORMSPREE_ID = 'YOUR_FORM_ID'; // ← replace this
  const FORMSPREE_URL = `https://formspree.io/f/${FORMSPREE_ID}`;
  const MY_EMAIL = 'deepsaha1925@gmail.com';

  // ── STATE ──
  let activeMethod = 'formspree'; // 'formspree' | 'mailto'

  // ── ELEMENTS ──
  const form          = document.getElementById('contactForm');
  const submitBtn     = document.getElementById('submitBtn');
  const btnText       = document.getElementById('btnText');
  const errorMsg      = document.getElementById('errorMsg');
  const successScreen = document.getElementById('successScreen');
  const sendAgainBtn  = document.getElementById('sendAgainBtn');
  const methodBtns    = document.querySelectorAll('.ct-method-btn');
  const setupNote     = document.getElementById('setupNote');

  // Hide setup note if Formspree is already configured
  if (setupNote && FORMSPREE_ID !== 'YOUR_FORM_ID') {
    setupNote.style.display = 'none';
  }

  // ── METHOD TOGGLE ──
  methodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      methodBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeMethod = btn.dataset.method;
      // Update button label hint
      if (activeMethod === 'mailto') {
        btnText.textContent = 'Open Email App →';
      } else {
        btnText.textContent = 'Send Message →';
      }
      hideError();
    });
  });

  // ── PHONE FORMAT ──
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      let v = this.value.replace(/\D/g, '').slice(0, 10);
      if (v.length > 5) v = v.slice(0, 5) + ' ' + v.slice(5);
      this.value = v;
    });
  }

  // ── VALIDATION ──
  function validate() {
    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const phone   = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name)               return 'Please enter your full name.';
    if (!email)              return 'Please enter your email address.';
    if (!emailRx.test(email)) return 'Please enter a valid email address.';
    if (!phone)              return 'Please enter your phone number.';
    if (!message)            return 'Please write a message.';
    return null;
  }

  function showError(msg) {
    errorMsg.textContent     = '✕ ' + msg;
    errorMsg.style.display   = 'block';
    form.classList.add('shake');
    setTimeout(() => form.classList.remove('shake'), 400);
  }

  function hideError() {
    errorMsg.style.display = 'none';
    errorMsg.textContent   = '';
  }

  function setLoading(on) {
    submitBtn.disabled = on;
    btnText.innerHTML  = on
      ? '<span class="ct-spinner"></span>Sending...'
      : (activeMethod === 'mailto' ? 'Open Email App →' : 'Send Message →');
  }

  function showSuccess() {
    form.style.display          = 'none';
    document.getElementById('methodGroup').style.display = 'none';
    successScreen.classList.add('show');
  }

  // ── SEND VIA FORMSPREE ──
  async function sendFormspree(data) {
    const res = await fetch(FORMSPREE_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body:    JSON.stringify(data),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.error || 'Server error');
    }
  }

  // ── SEND VIA MAILTO (opens email client) ──
  function sendMailto(data) {
    const subject = encodeURIComponent(
      data.subject ? data.subject : `Portfolio Contact from ${data.name}`
    );
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\n\n${data.message}`
    );
    window.location.href = `mailto:${MY_EMAIL}?subject=${subject}&body=${body}`;
  }

  // ── FORM SUBMIT ──
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideError();

      const err = validate();
      if (err) { showError(err); return; }

      const data = {
        name:    document.getElementById('name').value.trim(),
        email:   document.getElementById('email').value.trim(),
        phone:   document.getElementById('phone').value.trim(),
        subject: document.getElementById('subject').value.trim(),
        message: document.getElementById('message').value.trim(),
      };

      // ── MAILTO path — instant, no network needed ──
      if (activeMethod === 'mailto') {
        sendMailto(data);
        showSuccess();
        return;
      }

      // ── FORMSPREE path ──
      if (FORMSPREE_ID === 'YOUR_FORM_ID') {
        // Not configured yet → fall back to mailto silently
        sendMailto(data);
        showSuccess();
        return;
      }

      setLoading(true);
      try {
        await sendFormspree(data);
        showSuccess();
      } catch (err) {
        showError('Could not send message. Try the "Open Email App" method instead.');
      } finally {
        setLoading(false);
      }
    });
  }

  // ── SEND AGAIN ──
  if (sendAgainBtn) {
    sendAgainBtn.addEventListener('click', () => {
      successScreen.classList.remove('show');
      form.style.display = 'block';
      document.getElementById('methodGroup').style.display = 'flex';
      form.reset();
      btnText.textContent = activeMethod === 'mailto' ? 'Open Email App →' : 'Send Message →';
    });
  }

})();