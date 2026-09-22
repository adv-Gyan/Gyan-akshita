/**
 * ============================================================
 * SCROLL-ANIMATIONS.JS
 * — IntersectionObserver for reveal animations
 * — Timeline line draw on scroll
 * — Events injection from config.js
 * ============================================================
 */

window.ScrollAnimations = (function () {
  'use strict';

  let initialized = false;

  /* ── Inject event cards from config ──────────────────── */
  function injectEvents() {
    const container = document.getElementById('events-container');
    if (!container || !window.weddingData) return;

    const events = window.weddingData.events;

    events.forEach((evt, i) => {
      const item = document.createElement('article');
      item.className = 'event-item';
      item.setAttribute('aria-label', `Event: ${evt.name}`);

      item.innerHTML = `
        <div class="event-dot" aria-hidden="true"></div>

        <div class="event-card">
          <!-- Photo with Mughal arch clip -->
          <div class="event-card-photo-wrap">
            ${photoHTML(evt, i)}
          </div>

          <!-- Card details below -->
          <div class="event-card-body">
            <h3 class="event-card-name">${evt.icon || '✦'} ${evt.name}</h3>

            <p class="event-card-date-time">
              ${evt.date !== 'TBD' ? evt.date : ''}
              ${evt.time !== 'TBD' ? ' · ' + evt.time : ''}
              ${(evt.date === 'TBD' && evt.time === 'TBD') ? 'Date & time coming soon' : ''}
            </p>

            <p class="event-card-venue">
              ${evt.venue !== 'TBD' ? evt.venue : ''}
              ${(evt.venue !== 'TBD' && evt.address !== 'TBD') ? '<br/>' : ''}
              ${evt.address !== 'TBD' ? evt.address : ''}
              ${(evt.venue === 'TBD') ? 'Venue to be announced' : ''}
            </p>

            <p class="event-card-description">${evt.description || ''}</p>

            ${evt.dressCode
              ? `<span class="event-card-dresscode">👗 ${evt.dressCode}</span>`
              : ''}
          </div>
        </div>
      `;

      container.appendChild(item);
    });
  }

  function photoHTML(evt, i) {
    return `
      <img src="${evt.photo}"
           alt="${evt.name} celebration"
           class="event-card-photo"
           loading="lazy"
           onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'" />
      <div class="event-photo-placeholder" style="display:none">
        <span class="event-icon">${evt.icon || '✦'}</span>
        <p>Photo coming soon</p>
      </div>
    `;
  }

  /* ── Inject venue info ────────────────────────────────── */
  function injectVenue() {
    if (!window.weddingData) return;
    const v = window.weddingData.venue;

    const nameEl    = document.getElementById('venue-name-display');
    const addrEl    = document.getElementById('venue-address-display');
    const dirBtn    = document.getElementById('venue-directions-btn');
    const mapWrap   = document.getElementById('venue-map-wrap');

    if (nameEl)  nameEl.textContent  = v.name    !== 'TBD' ? v.name    : 'Venue to be announced';
    if (addrEl)  addrEl.textContent  = v.address !== 'TBD' ? v.address : 'Address will be updated soon';
    if (dirBtn)  dirBtn.href         = v.mapsUrl || '#';

    /* Embed map if URL provided */
    if (mapWrap && v.embedUrl && v.embedUrl.length > 0) {
      mapWrap.innerHTML = `
        <iframe
          src="${v.embedUrl}"
          title="Venue location map"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen>
        </iframe>
      `;
    }
  }

  /* ── Intersection Observer — reveal elements ──────────── */
  function initRevealObserver() {
    const items = document.querySelectorAll('.reveal-on-scroll, .event-item');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    });

    items.forEach(el => observer.observe(el));
  }

  /* ── Timeline line draw ───────────────────────────────── */
  function initTimelineLine() {
    const fill  = document.getElementById('timeline-fill');
    const track = document.querySelector('.timeline-track');
    if (!fill || !track) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const ratio = Math.max(0, Math.min(1, entry.intersectionRatio));
        fill.style.height = (ratio * 120) + '%'; // allow overshoot for full draw
      });
    }, {
      threshold: buildThresholdList(20),
    });

    observer.observe(track);
  }

  function buildThresholdList(n) {
    const list = [];
    for (let i = 0; i <= n; i++) list.push(i / n);
    return list;
  }

  /* ── Init ─────────────────────────────────────────────── */
  function init() {
    if (initialized) return;
    initialized = true;

    injectEvents();
    injectVenue();

    /* Small delay to let DOM render injected elements */
    requestAnimationFrame(() => {
      initRevealObserver();
      initTimelineLine();
    });
  }

  return { init };

})();
