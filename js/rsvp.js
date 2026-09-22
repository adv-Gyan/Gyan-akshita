/**
 * ============================================================
 * RSVP.JS — Form submission handling
 * ============================================================
 */

(function () {
  'use strict';

  const form       = document.getElementById('rsvp-form');
  const submitBtn  = document.getElementById('rsvp-submit');
  const successDiv = document.getElementById('rsvp-success');
  const mealGroup  = document.getElementById('meal-group');

  if (!form) return;

  /* ── Show/hide meal preference based on attendance ──── */
  const radios = form.querySelectorAll('input[name="attending"]');
  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (mealGroup) {
        mealGroup.style.display = radio.value === 'yes' ? 'flex' : 'none';
      }
    });
  });

  /* ── Form submission ──────────────────────────────────── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    submitBtn.textContent = 'Sending…';
    submitBtn.disabled    = true;

    const data = {
      name:      form.elements['name'].value.trim(),
      guests:    form.elements['guests'].value,
      attending: form.elements['attending'].value,
      meal:      form.elements['meal']?.value || '',
      message:   form.elements['message'].value.trim(),
      timestamp: new Date().toISOString(),
    };

    /* ── Submission options ───────────────────────────────
       Option A: mailto (no server needed)
       Option B: fetch to webhook / formspree / etc.
       Config-driven — uses rsvp.email from weddingData    */

    const email = window.weddingData?.rsvp?.email || '';

    if (email && email !== 'your@email.com') {
      /* Build mailto */
      const subject = encodeURIComponent(`RSVP — ${data.name} — ${data.attending === 'yes' ? 'Attending' : 'Declining'}`);
      const body = encodeURIComponent(
        `Name: ${data.name}\n` +
        `Guests: ${data.guests}\n` +
        `Attending: ${data.attending === 'yes' ? 'Yes 🎉' : 'Regretfully No'}\n` +
        (data.attending === 'yes' ? `Meal preference: ${data.meal}\n` : '') +
        (data.message ? `\nMessage: ${data.message}` : '')
      );
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    }

    /* Simulate a brief async "send" then show success */
    await new Promise(r => setTimeout(r, 600));
    showSuccess(data);
  });

  /* ── Validation ───────────────────────────────────────── */
  function validateForm() {
    const name = form.elements['name'].value.trim();
    if (!name) {
      shakeField(form.elements['name']);
      form.elements['name'].focus();
      return false;
    }
    return true;
  }

  function shakeField(el) {
    el.style.borderColor = '#C0392B';
    el.style.animation   = 'shakeInput 0.4s ease';
    setTimeout(() => {
      el.style.borderColor = '';
      el.style.animation   = '';
    }, 600);
  }

  /* ── Show success ─────────────────────────────────────── */
  function showSuccess(data) {
    form.style.display   = 'none';
    successDiv.classList.remove('hidden');

    /* Personalise the message */
    const heading = successDiv.querySelector('.success-heading');
    if (heading && data.name) {
      heading.textContent = `Thank You, ${data.name.split(' ')[0]}!`;
    }

    /* Scroll to success */
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* Shake keyframe (injected if not in CSS) */
  if (!document.getElementById('shake-style')) {
    const style = document.createElement('style');
    style.id = 'shake-style';
    style.textContent = `
      @keyframes shakeInput {
        0%, 100% { transform: translateX(0); }
        25%       { transform: translateX(-8px); }
        75%       { transform: translateX(8px); }
      }
    `;
    document.head.appendChild(style);
  }

})();
