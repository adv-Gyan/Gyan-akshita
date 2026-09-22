/**
 * ============================================================
 * COUNTDOWN.JS — Live countdown to the wedding date
 * ============================================================
 */

(function () {
  'use strict';

  const daysEl    = document.getElementById('cd-days');
  const hoursEl   = document.getElementById('cd-hours');
  const minsEl    = document.getElementById('cd-minutes');
  const secsEl    = document.getElementById('cd-seconds');

  let lastValues = { d: '', h: '', m: '', s: '' };

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function getWeddingDate() {
    if (window.weddingData && window.weddingData.weddingDate) {
      return new Date(window.weddingData.weddingDate);
    }
    return new Date('2026-11-21T00:00:00');
  }

  function animateFlip(el) {
    el.classList.remove('ticking');
    /* Force reflow to restart animation */
    void el.offsetWidth;
    el.classList.add('ticking');
  }

  function updateCountdown() {
    const now     = new Date();
    const target  = getWeddingDate();
    const diff    = target - now;

    if (diff <= 0) {
      /* Wedding day! */
      if (daysEl)  daysEl.textContent  = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl)  minsEl.textContent  = '00';
      if (secsEl)  secsEl.textContent  = '00';
      document.querySelector('.countdown-date-label').textContent = '🎉 Today is the day!';
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const d = pad(days);
    const h = pad(hours);
    const m = pad(minutes);
    const s = pad(seconds);

    if (daysEl && d !== lastValues.d) {
      daysEl.textContent = d;
      animateFlip(daysEl);
      lastValues.d = d;
    }
    if (hoursEl && h !== lastValues.h) {
      hoursEl.textContent = h;
      animateFlip(hoursEl);
      lastValues.h = h;
    }
    if (minsEl && m !== lastValues.m) {
      minsEl.textContent = m;
      animateFlip(minsEl);
      lastValues.m = m;
    }
    if (secsEl && s !== lastValues.s) {
      secsEl.textContent = s;
      animateFlip(secsEl);
      lastValues.s = s;
    }
  }

  /* Run immediately then every second */
  updateCountdown();
  setInterval(updateCountdown, 1000);

})();
