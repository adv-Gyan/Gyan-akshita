/**
 * SCROLL-ANIMATIONS.JS
 * Cinematic GSAP + ScrollTrigger choreography.
 */
window.ScrollAnimations = (function () {
  'use strict';

  let initialized = false;

  const qs = (s, root = document) => root.querySelector(s);
  const qsa = (s, root = document) => Array.from(root.querySelectorAll(s));
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canAnimate = () => typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !reduced();

  function injectEvents() {
    const container = document.getElementById('events-container');
    if (!container || !window.weddingData || container.children.length) return;

    window.weddingData.events.forEach((evt) => {
      const item = document.createElement('article');
      item.className = 'event-item';
      item.setAttribute('aria-label', `Event: ${evt.name}`);
      item.innerHTML = `
        <div class="event-dot" aria-hidden="true"></div>
        <div class="event-card">
          <div class="event-card-photo-wrap">
            <img src="${evt.photo}" alt="${evt.name} celebration" class="event-card-photo" loading="lazy"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
            <div class="event-photo-placeholder" style="display:none">
              <span class="event-icon">${evt.icon || '✦'}</span><p>Photo coming soon</p>
            </div>
          </div>
          <div class="event-card-body">
            <h3 class="event-card-name">${evt.icon || '✦'} ${evt.name}</h3>
            <p class="event-card-date-time">
              ${evt.date !== 'TBD' ? evt.date : ''}
              ${evt.time !== 'TBD' ? ' · ' + evt.time : ''}
              ${evt.date === 'TBD' && evt.time === 'TBD' ? 'Date & time coming soon' : ''}
            </p>
            <p class="event-card-venue">
              ${evt.venue !== 'TBD' ? evt.venue : ''}
              ${evt.venue !== 'TBD' && evt.address !== 'TBD' ? '<br/>' : ''}
              ${evt.address !== 'TBD' ? evt.address : ''}
              ${evt.venue === 'TBD' ? 'Venue to be announced' : ''}
            </p>
            <p class="event-card-description">${evt.description || ''}</p>
            ${evt.dressCode ? `<span class="event-card-dresscode">👗 ${evt.dressCode}</span>` : ''}
          </div>
        </div>`;
      container.appendChild(item);
    });
  }

  function injectVenue() {
    if (!window.weddingData) return;
    const v = window.weddingData.venue || {};
    const name = qs('#venue-name-display');
    const address = qs('#venue-address-display');
    const button = qs('#venue-directions-btn');
    const map = qs('#venue-map-wrap');

    if (name) name.textContent = v.name && v.name !== 'TBD' ? v.name : 'Venue to be announced';
    if (address) address.textContent = v.address && v.address !== 'TBD' ? v.address : 'Address will be updated soon';
    if (button) button.href = v.mapsUrl || '#';

    if (map && v.embedUrl) {
      map.innerHTML = `<iframe src="${v.embedUrl}" title="Venue location map" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`;
    }
  }

  function splitWords(el) {
    if (!el) return [];
    if (el.dataset.split === 'true') return qsa('.split-word', el);
    const parts = el.textContent.trim().split(/(\s+)/);
    el.textContent = '';
    parts.forEach(part => {
      if (/^\s+$/.test(part)) el.appendChild(document.createTextNode(part));
      else if (part) {
        const span = document.createElement('span');
        span.className = 'split-word';
        span.textContent = part;
        el.appendChild(span);
      }
    });
    el.dataset.split = 'true';
    return qsa('.split-word', el);
  }

  function reducedMotionFallback() {
    qsa('.animate-hero, .reveal-on-scroll, .event-item').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.filter = 'none';
    });
    qsa('.section-header img, .caption-divider, .hero-divider img, .site-footer > img, .venue-map-wrap')
      .forEach(el => { el.style.clipPath = 'none'; el.style.opacity = '1'; });
  }

  function initHero() {
    const hero = qs('#section-hero');
    if (!hero || !canAnimate()) return;

    const bg = qs('.hero-bg', hero);
    const arch = qs('.hero-arch-frame', hero);
    const monogram = qs('.hero-monogram', hero);
    const bride = qs('.hero-bride', hero);
    const groom = qs('.hero-groom', hero);
    const amp = qs('.hero-and', hero);
    const divider = qs('.hero-divider', hero);
    const invite = qs('.hero-invite-line', hero);
    const date = qs('.hero-date', hero);
    const cue = qs('.scroll-indicator', hero);
    const dateText = qs('.hero-date-text', hero);

    if (dateText && !dateText.dataset.splitLetters) {
      const text = dateText.textContent;
      dateText.textContent = '';
      Array.from(text).forEach((char) => {
        const span = document.createElement('span');
        span.className = char === ' ' ? 'date-letter date-space' : 'date-letter';
        span.textContent = char;
        dateText.appendChild(span);
      });
      dateText.dataset.splitLetters = 'true';
    }
    const dateLetters = dateText ? qsa('.date-letter', dateText) : [];

    gsap.set([monogram, bride, groom, amp, divider, invite, date, cue], { opacity: 0, y: 18, filter: 'blur(7px)' });
    gsap.set(bride, { x: -90 });
    gsap.set(groom, { x: 90 });
    gsap.set(amp, { y: 0, scale: .35 });
    gsap.set(dateLetters, { opacity: 0, y: 8, filter: 'blur(3px)' });
    gsap.set(arch, { scale: .82, opacity: 0 });

    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .to(arch, { scale: 1, opacity: 1, duration: 1.25, filter: 'drop-shadow(0 0 18px rgba(201,168,76,.3))' })
      .to(monogram, { opacity: 1, y: 0, filter: 'blur(0)', duration: .55 }, '-=.6')
      .to(bride, { opacity: 1, x: 0, filter: 'blur(0)', duration: .8 }, '-=.3')
      .to(groom, { opacity: 1, x: 0, filter: 'blur(0)', duration: .8 }, '<')
      .to(amp, { opacity: 1, scale: 1, filter: 'blur(0)', duration: .55, ease: 'back.out(1.7)' }, '-=.35')
      .to(amp, { textShadow: '0 0 8px rgba(255,245,201,.9), 0 0 24px rgba(201,168,76,.55)', duration: .28, yoyo: true, repeat: 1 }, '-=.15')
      .to(divider, { opacity: 1, y: 0, filter: 'blur(0)', duration: .5 }, '-=.2')
      .to(invite, { opacity: 1, y: 0, filter: 'blur(0)', duration: .55 }, '-=.18')
      .to(date, { opacity: 1, y: 0, filter: 'blur(0)', duration: .3 }, '-=.12')
      .to(dateLetters, { opacity: 1, y: 0, filter: 'blur(0)', duration: .08, stagger: .055, ease: 'power2.out' }, '-=.05')
      .to(cue, { opacity: 1, y: 0, filter: 'blur(0)', duration: .45 }, '-=.1');

    if (bg) gsap.to(bg, {
      yPercent: 12, scale: 1.12, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1.2 }
    });
    gsap.to(arch, {
      yPercent: -6, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1.5 }
    });
  }

  function initPhoto() {
    const section = qs('#section-photo');
    const frame = qs('.photo-mughal-frame', section);
    const photo = qs('.couple-photo', section);
    const caption = qs('.photo-caption', section);
    if (!section || !frame || !canAnimate()) return;

    const frameBorder = frame;
    const vignette = qs('.photo-frame-overlay', frame);

    /* Keep content visible if ScrollTrigger is delayed/blocked. The reveal
       animation is applied only when the section actually enters view. */
    const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 72%', once: true } });
    tl.fromTo(frame,
      { clipPath: 'circle(0% at 50% 55%)', opacity: 0, scale: .96 },
      { clipPath: 'circle(78% at 50% 55%)', opacity: 1, scale: 1, duration: 1.15, ease: 'power3.inOut', immediateRender: false }
    )
      .to(frame, { filter: 'drop-shadow(0 0 22px rgba(201,168,76,.32))', duration: .45 }, '-=.15')
      .fromTo(caption,
        { y: 28, opacity: 0, letterSpacing: '.22em' },
        { y: 0, opacity: 1, letterSpacing: '.08em', duration: .7, immediateRender: false },
        '-=.2'
      );
    if (vignette) {
      tl.fromTo(vignette, { opacity: .15 }, { opacity: .35, duration: .45 }, '-=.25');
    }

    if (photo) gsap.to(photo, {
      scale: 1.01, ease: 'none',
      scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1.4 }
    });
  }

  function initMessage() {
    const section = qs('#section-message');
    const card = qs('.message-card', section);
    if (!section || !card || !canAnimate()) return;

    const verse = qs('.message-verse', card);
    const body = qs('.message-body', card);
    const quote = qs('.message-quote-mark', card);
    const closing = qs('.message-closing', card);
    const words = splitWords(verse);

    const signature = qs('.message-sig', card);
    /* Never hide message content before ScrollTrigger fires. */
    gsap.set(card, { '--card-draw': 0 });

    const messageTl = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 72%', once: true } });
    messageTl.fromTo(card, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: .6, ease: 'power3.out', immediateRender: false })
      .fromTo(quote, { opacity: 0, scale: 0, transformOrigin: '50% 80%' }, { opacity: .2, scale: 1, duration: .65, ease: 'back.out(1.8)', immediateRender: false }, '-=.2')
      .fromTo(words, { opacity: 0, y: 10, filter: 'blur(4px)' }, { opacity: 1, y: 0, filter: 'blur(0)', duration: .32, stagger: .065, immediateRender: false }, '-=.25')
      .fromTo(body, { opacity: 0, y: 16, filter: 'blur(4px)' }, { opacity: 1, y: 0, filter: 'blur(0)', duration: .75, immediateRender: false }, '-=.12')
      .fromTo(closing, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .5, immediateRender: false }, '-=.18')
      .fromTo(signature, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: .75, ease: 'power2.inOut', immediateRender: false }, '-=.25')
      .to(card, { '--card-draw': 1, boxShadow: '0 0 34px rgba(201,168,76,.14)', duration: .35 }, '-=.1');
  }

  function initEvents() {
    const section = qs('#section-events');
    const track = qs('.timeline-track', section);
    const fill = qs('#timeline-fill', section);
    const items = qsa('.event-item', section);
    if (!section || !track || !fill || !items.length || !canAnimate()) return;

    /* The timeline line is the only element intentionally held at zero;
       event cards themselves must remain readable if ScrollTrigger is late. */
    gsap.set(fill, { height: 0 });

    items.forEach((item, i) => {
      const card = qs('.event-card', item);
      const dot = qs('.event-dot', item);
      const photo = qs('.event-card-photo', item);
      const dress = qs('.event-card-dresscode', item);
      const x = i % 2 === 0 ? -70 : 70;

      const tl = gsap.timeline({ scrollTrigger: { trigger: item, start: 'top 78%', once: true } });
      tl.fromTo(dot, { opacity: 0, scale: .2 }, { opacity: 1, scale: 1, duration: .5, ease: 'back.out(2)', immediateRender: false })
        .fromTo(card, { opacity: 0, x, y: 18 }, { opacity: 1, x: 0, y: 0, duration: .7, ease: 'power3.out', immediateRender: false }, '-=.22');
      if (dress) {
        tl.fromTo(dress, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .35, immediateRender: false }, '-=.18');
      }

      if (photo) gsap.to(photo, {
        scale: 1, xPercent: 2, ease: 'none',
        scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: 1.4 }
      });
    });

    const timelineTrigger = gsap.to(fill, {
      height: '100%', ease: 'none',
      scrollTrigger: {
        trigger: track, start: 'top 70%', end: 'bottom 78%', scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          items.forEach((item, i) => {
            const threshold = (i + 0.5) / items.length;
            const dot = qs('.event-dot', item);
            if (!dot) return;
            gsap.to(dot, { scale: progress >= threshold ? 1.12 : 1, duration: .16, overwrite: true });
            dot.classList.toggle('timeline-reached', progress >= threshold);
          });
        }
      }
    });
  }

  function initCountdown() {
    const section = qs('#section-countdown');
    const units = qsa('.countdown-unit', section);
    if (!section || !units.length || !canAnimate()) return;
    section.style.setProperty('--countdown-pulse', '0');

    gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 75%', once: true } })
      .fromTo(units, { opacity: 0, y: -22, scale: .96 }, {
        opacity: 1, y: 0, scale: 1, duration: .55, stagger: .11,
        ease: 'back.out(1.4)',
        onComplete: () => qsa('.countdown-number', section).forEach(el => el.classList.add('countdown-live'))
      });
  }

  function initVenue() {
    const section = qs('#section-venue');
    if (!section || !canAnimate()) return;
    const name = qs('.venue-name', section);
    const address = qs('.venue-address', section);
    const map = qs('.venue-map-wrap', section);
    const button = qs('#venue-directions-btn', section);

    if (name) name.classList.add('gold-shimmer');
    gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 72%', once: true } })
      .fromTo(name, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .65, immediateRender: false })
      .to(name, { backgroundPosition: '-120% 0', duration: 1.05 }, '-=.3')
      .fromTo(address, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .5, immediateRender: false }, '-=.5')
      .fromTo(map, { opacity: 0, clipPath: 'inset(0 50% 0 50% round 8px)' }, { opacity: 1, clipPath: 'inset(0 0% 0 0% round 8px)', duration: .9, ease: 'power3.inOut', immediateRender: false }, '-=.15')
      .fromTo(button, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .5, immediateRender: false }, '-=.2')
      .call(() => button && button.classList.add('venue-directions-ready'));
  }

  async function inlineAndAnimateDividers() {
    const images = qsa('.section-header img, .caption-divider, .hero-divider img, .site-footer > img');
    if (!images.length) return;
    const seen = {};
    for (const img of images) {
      const src = img.getAttribute('src');
      if (!src || seen[src] === false) continue;
      try {
        let svgText = seen[src];
        if (!svgText) {
          const response = await fetch(src);
          if (!response.ok) throw new Error('divider fetch failed');
          svgText = await response.text();
          seen[src] = svgText;
        }
        const holder = document.createElement('div');
        holder.innerHTML = svgText.trim();
        const svg = holder.firstElementChild;
        if (!svg || svg.tagName.toLowerCase() !== 'svg') continue;
        svg.classList.add(...Array.from(img.classList));
        svg.setAttribute('aria-hidden', 'true');
        svg.style.width = getComputedStyle(img).width;
        svg.style.opacity = '1';
        img.replaceWith(svg);
        const strokes = qsa('path,line,polyline,polygon,circle', svg).filter(el => {
          const fill = el.getAttribute('fill');
          return !fill || fill === 'none';
        });
        strokes.forEach(el => {
          try {
            const length = el.getTotalLength ? el.getTotalLength() : 120;
            gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });
            gsap.to(el, {
              strokeDashoffset: 0,
              duration: .8,
              ease: 'power2.out',
              scrollTrigger: { trigger: svg, start: 'top 84%', once: true }
            });
          } catch (_) {}
        });
        qsa('polygon,circle', svg).forEach(el => {
          gsap.fromTo(el, { opacity: 0, scale: .7, transformOrigin: '50% 50%' }, {
            opacity: 1, scale: 1, duration: .35, ease: 'back.out(1.6)',
            scrollTrigger: { trigger: svg, start: 'top 84%', once: true }
          });
        });
      } catch (_) {
        seen[src] = false;
      }
    }
  }

  function initDividersAndFooter() {
    const dividers = qsa('.section-header img, .caption-divider, .hero-divider img');
    if (canAnimate()) {
      dividers.forEach(el => gsap.to(el, {
        clipPath: 'inset(0 0% 0 0%)', opacity: 1, duration: .8,
        scrollTrigger: { trigger: el, start: 'top 84%', once: true }
      }));
      const footer = qs('.site-footer');
      if (footer) gsap.fromTo(footer, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: .8,
        scrollTrigger: { trigger: footer, start: 'top 88%', once: true }
      });
    }
  }

  function initGenericReveals() {
    if (!canAnimate()) return;
    qsa('.reveal-on-scroll').forEach(el => {
      if (el.closest('#section-photo, #section-message, #section-countdown, #section-venue, #section-events')) return;
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: .7, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 82%', once: true }
      });
    });
  }

  function init() {
    if (initialized) return;
    initialized = true;

    injectEvents();
    injectVenue();

    if (reduced()) {
      reducedMotionFallback();
      return;
    }

    const waitForGSAP = () => {
      if (!canAnimate()) {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
          setTimeout(waitForGSAP, 50);
        }
        return;
      }
      gsap.registerPlugin(ScrollTrigger);
      initHero();
      initPhoto();
      initMessage();
      initEvents();
      initCountdown();
      initVenue();
      initDividersAndFooter();
      inlineAndAnimateDividers();
      initGenericReveals();
      ScrollTrigger.refresh();
    };
    waitForGSAP();
  }

  return { init };
})();
