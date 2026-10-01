/**
 * SCROLL-ANIMATIONS.JS
 * Cinematic GSAP + ScrollTrigger choreography.
 */
window.ScrollAnimations = (function () {
  'use strict';

  let initialized = false;
  let nativeInitialized = false;

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
    document.getElementById('main-invite')?.classList.add('hero-animation-ready');
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

    const main = document.getElementById('main-invite');
    main?.classList.add('hero-animation-ready');

    const bg = qs('.hero-bg', hero);
    const arch = qs('.hero-arch-frame', hero);
    const kicker = qs('.hero-kicker', hero);
    const monogram = qs('.hero-monogram', hero);
    const bride = qs('.hero-bride', hero);
    const groom = qs('.hero-groom', hero);
    const amp = qs('.hero-and', hero);
    const flourish = qs('.hero-flourish', hero);
    const divider = qs('.hero-divider', hero);
    const invite = qs('.hero-invite-line', hero);
    const date = qs('.hero-date', hero);
    const cue = qs('.scroll-indicator', hero);
    const dateText = qs('.hero-date-text', hero);

    if (!kicker || !monogram || !bride || !groom) return;

    if (dateText && !dateText.dataset.splitLetters) {
      const text = dateText.textContent;
      dateText.textContent = '';
      Array.from(text).forEach(char => {
        const span = document.createElement('span');
        span.className = char === ' ' ? 'date-letter date-space' : 'date-letter';
        span.textContent = char;
        dateText.appendChild(span);
      });
      dateText.dataset.splitLetters = 'true';
    }

    const dateLetters = dateText ? qsa('.date-letter', dateText) : [];

    gsap.set([kicker, monogram, bride, groom, amp, flourish, divider, invite, date, cue], {
      opacity: 0,
      filter: 'blur(2.5px)'
    });
    gsap.set(kicker, { y: 9, letterSpacing: '.28em' });
    gsap.set(monogram, { y: 9, scale: .94 });
    /* Script names enter like handwritten ink: the word is revealed from
       left to right while settling gently into place. */
    gsap.set(bride, { x: -12, y: 3, scale: .99, clipPath: 'inset(0 100% 0 0)' });
    gsap.set(groom, { x: 12, y: 3, scale: .99, clipPath: 'inset(0 100% 0 0)' });
    gsap.set(amp, { scale: .5, rotation: -10 });
    gsap.set(flourish, { y: 6, scaleX: .72 });
    gsap.set(divider, { y: 5, scaleX: .82 });
    gsap.set(invite, { y: 7 });
    gsap.set(date, { y: 6 });
    gsap.set(dateLetters, { opacity: 0, y: 3, filter: 'blur(1px)' });
    gsap.set(cue, { y: 5 });
    gsap.set(arch, { scale: .97, opacity: 0 });

    /* Fast, layered reveal: roughly 1.4 seconds with overlapping beats. */
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    tl.to(arch, { scale: 1, opacity: .23, duration: .24 })
      .to(kicker, {
        y: 0, opacity: 1, filter: 'blur(0)',
        letterSpacing: '.18em', duration: .18
      }, '-=.12')
      .to(monogram, {
        y: 0, scale: 1, opacity: 1, filter: 'blur(0)',
        duration: .20
      }, '-=.10')
      .to(bride, {
        x: 0, y: 0, scale: 1, opacity: 1, filter: 'blur(0)',
        clipPath: 'inset(0 0% 0 0)',
        duration: .72,
        ease: 'power2.inOut'
      }, '-=.10')
      .to(groom, {
        x: 0, y: 0, scale: 1, opacity: 1, filter: 'blur(0)',
        clipPath: 'inset(0 0% 0 0)',
        duration: .72,
        ease: 'power2.inOut'
      }, '-=.48')
      .to(amp, {
        scale: 1, rotation: -5, opacity: 1, filter: 'blur(0)',
        duration: .20, ease: 'back.out(1.55)'
      }, '-=.12')
      .to(flourish, {
        y: 0, scaleX: 1, opacity: 1, filter: 'blur(0)',
        duration: .18
      }, '-=.08')
      .to(divider, {
        y: 0, scaleX: 1, opacity: 1, filter: 'blur(0)',
        duration: .16
      }, '-=.07')
      .to(invite, {
        y: 0, opacity: 1, filter: 'blur(0)',
        duration: .20
      }, '-=.07')
      .to(date, {
        y: 0, opacity: 1, filter: 'blur(0)',
        duration: .15
      }, '-=.07')
      .to(dateLetters, {
        opacity: 1, y: 0, filter: 'blur(0)',
        duration: .035, stagger: .012
      }, '-=.05')
      .to(cue, {
        y: 0, opacity: 1, filter: 'blur(0)',
        duration: .14
      }, '-=.05');

    /* A faint ink-settle after the written reveal keeps the script organic
       without adding a flashy typewriter effect. */
    gsap.to([bride, groom], {
      filter: 'drop-shadow(0 0 8px rgba(232,201,122,.08))',
      duration: .22,
      yoyo: true,
      repeat: 1,
      ease: 'power1.inOut',
      delay: .08
    });

    if (bg) {
      gsap.to(bg, {
        yPercent: 7,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .9 }
      });
    }

    if (arch) {
      gsap.to(arch, {
        yPercent: -3,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1.1 }
      });
    }
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

  /*
   * Mark Your Calendar timeline
   * ----------------------------
   * This feature is deliberately independent of GSAP/ScrollTrigger.
   * The timeline is part of the invitation's core interaction, so it uses
   * native scroll + requestAnimationFrame and continues to work on iOS Safari
   * even when a third-party animation CDN is delayed or cached.
   */
  function initEvents() {
    const section = qs('#section-events');
    const track = qs('#calendar-timeline', section);
    const svg = qs('.calendar-timeline-svg', track);
    const shadow = qs('.calendar-timeline-shadow', track);
    const path = qs('.calendar-timeline-path', track);
    const glow = qs('.calendar-timeline-glow', track);
    const items = qsa('.event-item', section);

    if (!section || !track || !svg || !shadow || !path || !glow || !items.length) return;
    if (track.dataset.timelineReady === 'true') return;
    track.dataset.timelineReady = 'true';

    const clamp01 = value => Math.max(0, Math.min(1, value));

    let length = 0;
    let anchorProgress = [];
    let startScroll = 0;
    let endScroll = 1;
    let geometryKey = '';
    let rafId = 0;

    const getDotPoint = item => {
      const dot = qs('.event-dot', item);
      const tr = track.getBoundingClientRect();
      const dr = dot?.getBoundingClientRect();

      return {
        x: dr ? (dr.left + dr.width / 2) - tr.left : tr.width / 2,
        y: dr ? (dr.top + dr.height / 2) - tr.top : item.offsetTop + 16
      };
    };

    const buildPath = () => {
      const tr = track.getBoundingClientRect();
      const width = Math.max(1, tr.width);
      const height = Math.max(1, track.scrollHeight);
      const points = items.map(getDotPoint);

      if (!points.length) return;

      let d = 'M ' + points[0].x + ' ' + points[0].y;
      const sway = Math.min(34, Math.max(8, width * (width < 500 ? 0.022 : 0.038)));

      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1];
        const b = points[i];
        const dy = Math.max(40, b.y - a.y);
        const sign = i % 2 === 1 ? 1 : -1;
        const s = sway * sign;

        d +=
          ' C ' + (a.x + s) + ' ' + (a.y + dy * 0.18) +
          ', ' + (b.x - s) + ' ' + (b.y - dy * 0.18) +
          ', ' + b.x + ' ' + b.y;
      }

      /* IMPORTANT: viewBox belongs on the SVG, never on the <path>. */
      svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
      svg.setAttribute('width', String(width));
      svg.setAttribute('height', String(height));

      path.setAttribute('d', d);
      shadow.setAttribute('d', d);

      length = path.getTotalLength();
      path.style.strokeDasharray = String(length);
      shadow.style.strokeDasharray = String(length);

      /*
       * The curve is constructed to terminate exactly at every event dot.
       * Sampling its length maps each dot to the exact ink-draw position.
       */
      const samples = Math.min(2400, Math.max(800, Math.round(length * 3)));
      const sampled = [];

      for (let i = 0; i <= samples; i++) {
        const dist = length * (i / samples);
        const point = path.getPointAtLength(dist);
        sampled.push({ dist, x: point.x, y: point.y });
      }

      anchorProgress = points.map(anchor => {
        let bestDist = 0;
        let bestError = Infinity;

        for (const point of sampled) {
          const dx = point.x - anchor.x;
          const dy = point.y - anchor.y;
          const error = dx * dx + dy * dy;

          if (error < bestError) {
            bestError = error;
            bestDist = point.dist;
          }
        }

        return length ? bestDist / length : 0;
      });

      /*
       * Scroll window for the animation:
       *   first dot enters the lower 78% of the viewport → drawing starts
       *   last dot reaches the upper 45% of the viewport → drawing completes
       *
       * Absolute document coordinates are used so iOS viewport changes do
       * not depend on ScrollTrigger's refresh lifecycle.
       */
      const firstDot = qs('.event-dot', items[0]);
      const lastDot = qs('.event-dot', items[items.length - 1]);
      const firstRect = firstDot?.getBoundingClientRect();
      const lastRect = lastDot?.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const viewport = Math.max(window.innerHeight, 1);

      const firstAbsoluteTop = (firstRect?.top ?? 0) + scrollY;
      const lastAbsoluteTop = (lastRect?.top ?? firstAbsoluteTop + 1) + scrollY;

      startScroll = firstAbsoluteTop - viewport * 0.78;
      endScroll = lastAbsoluteTop - viewport * 0.45;

      /*
       * Very short timelines should still have a useful draw distance.
       * For the current three-event invitation this branch is normally not
       * needed, but it protects against future configuration changes.
       */
      if (endScroll <= startScroll + 40) {
        endScroll = startScroll + Math.max(window.innerHeight * 0.85, track.offsetHeight * 0.45, 320);
      }

      geometryKey =
        Math.round(width) + 'x' +
        Math.round(height) + ':' +
        items.map(item => item.offsetHeight).join(',');

      render();
    };

    const render = () => {
      if (!length) return;

      const scrollY = window.scrollY || window.pageYOffset || 0;
      const progress = clamp01((scrollY - startScroll) / Math.max(endScroll - startScroll, 1));
      const dash = length * (1 - progress);

      path.style.strokeDashoffset = String(dash);
      shadow.style.strokeDashoffset = String(dash);

      const head = path.getPointAtLength(length * progress);
      glow.setAttribute('cx', String(head.x));
      glow.setAttribute('cy', String(head.y));
      glow.style.opacity = progress > 0.005 && progress < 0.999 ? '1' : '0';

      items.forEach((item, index) => {
        const anchor = anchorProgress[index] ?? 1;

        /*
         * First event enters gently when the timeline itself begins.
         * Subsequent events reveal only as the gold ink reaches their dot.
         */
        const revealThreshold = index === 0 ? Math.max(0, anchor - 0.02) : anchor;
        const reached = progress >= revealThreshold;

        item.classList.toggle('is-visible', reached);
        item.classList.toggle(
          'event-reached',
          progress >= anchor - (index === 0 ? 0.005 : 0.008)
        );

        const dot = qs('.event-dot', item);
        if (dot) {
          dot.classList.toggle('event-dot-lit', progress >= anchor - (index === 0 ? 0 : 0.018));
        }
      });
    };

    const frame = () => {
      rafId = 0;

      const tr = track.getBoundingClientRect();
      const key =
        Math.round(tr.width) + 'x' +
        Math.round(track.scrollHeight) + ':' +
        items.map(item => item.offsetHeight).join(',');

      if (key !== geometryKey) buildPath();
      else render();
    };

    const requestFrame = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(frame);
    };

    /*
     * Start with the exact current scroll state, then update continuously.
     * passive listeners keep scrolling responsive on iPhone/Safari.
     */
    window.addEventListener('scroll', requestFrame, { passive: true });
    window.addEventListener('resize', requestFrame, { passive: true });
    window.addEventListener('orientationchange', requestFrame, { passive: true });

    if (document.fonts?.ready) {
      document.fonts.ready.then(requestFrame).catch(() => {});
    }

    window.addEventListener('load', requestFrame, { once: true });

    requestAnimationFrame(() => {
      geometryKey = '';
      buildPath();
    });
  }

  function initCountdown() {
    const section = qs('#section-countdown');
    const grid = qs('.countdown-grid', section);
    const units = qsa('.countdown-unit', section);
    const separators = qsa('.countdown-sep', section);
    if (!section || !grid || !units.length || !canAnimate()) return;

    section.style.setProperty('--pulse-opacity', '0.035');

    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top 78%', once: true }
    });

    tl.fromTo(grid,
      { opacity: 0, scale: .94 },
      { opacity: 1, scale: 1, duration: .45, ease: 'power2.out', immediateRender: false }
    )
      .fromTo(units,
        { opacity: 0, y: 34, scale: .88, filter: 'blur(5px)' },
        {
          opacity: 1, y: 0, scale: 1, filter: 'blur(0)',
          duration: .65, stagger: .13, ease: 'back.out(1.5)',
          immediateRender: false
        },
        '-=.2'
      )
      .fromTo(separators,
        { opacity: 0, scale: .4, y: 12 },
        { opacity: .45, scale: 1, y: 0, duration: .35, stagger: .08, ease: 'back.out(1.8)', immediateRender: false },
        '-=.35'
      )
      .to(section, {
        '--pulse-opacity': .14,
        duration: .28,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out'
      }, '-=.15')
      .add(() => {
        qsa('.countdown-number', section).forEach(el => el.classList.add('countdown-live'));
        units.forEach(el => el.classList.add('countdown-live-unit'));
      });
  }

  function initRSVP() {
    const section = qs('#section-rsvp');
    const header = qs('.section-header', section);
    const form = qs('#rsvp-form', section);
    if (!section || !form) return;

    /* Keep RSVP visible even if GSAP/ScrollTrigger is unavailable. */
    form.style.opacity = '1';
    form.style.transform = 'none';
    if (header) {
      header.style.opacity = '1';
      header.style.transform = 'none';
    }

    /* RSVP is deliberately not hidden for its entrance animation. It remains
       usable on Safari and when ScrollTrigger/CDN loading is delayed. */
    if (!canAnimate()) return;
    gsap.fromTo(section,
      { y: 18 },
      { y: 0, duration: .65, ease: 'power3.out', immediateRender: false,
        scrollTrigger: { trigger: section, start: 'top 88%', once: true } }
    );
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

  function initSectionTransitions() {
    if (!canAnimate()) return;

    /*
     * Subtle section-to-section movement. This is intentionally scrubbed
     * rather than a large entrance animation, so the page feels continuous
     * while scrolling instead of stopping between sections.
     */
    qsa('#main-invite > .section:not(#section-hero):not(#section-events)').forEach(section => {
      const inner = qs('.section-inner', section);
      if (inner) {
        gsap.fromTo(inner,
          { y: 18 },
          {
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'top 58%',
              scrub: 0.8
            }
          }
        );
      }
    });

    qsa('.section-break').forEach(divider => {
      gsap.fromTo(divider,
        { opacity: 0.55, scaleY: 0.92 },
        {
          opacity: 1,
          scaleY: 1,
          transformOrigin: 'center center',
          ease: 'none',
          scrollTrigger: {
            trigger: divider,
            start: 'top bottom',
            end: 'center 68%',
            scrub: 0.7
          }
        }
      );
    });
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

  /* iOS/Safari-safe native fallback. GSAP remains primary, but the invitation
     still gets visible motion if ScrollTrigger is blocked or unavailable. */
  function initNativeScrollAnimations() {
    if (nativeInitialized) return;
    nativeInitialized = true;

    /* Native emergency path: reveal hero copy if the GSAP CDN is unavailable. */
    document.getElementById('main-invite')?.classList.add('hero-animation-ready');

    const reveal = (el, cls = 'native-reveal') => {
      if (!el) return;
      el.classList.add('native-animation-target', cls);
    };

    /*
     * Native reveals are the reliability layer for the live site. They run
     * alongside GSAP rather than only when GSAP fails, because a page can
     * have GSAP loaded while a ScrollTrigger calculation is delayed by a
     * browser, cached page state, or mobile viewport change.
     *
     * The hero remains GSAP-controlled; everything after the hero gets a
     * browser-native IntersectionObserver reveal so the motion is guaranteed
     * to be visible while scrolling.
     */
    reveal(qs('.photo-mughal-frame'), 'native-photo-reveal');
    reveal(qs('.photo-caption'), 'native-slide-up');
    qsa('#section-photo .caption-divider, #section-message .caption-divider, #section-events .section-header img, #section-countdown .section-header img, #section-venue .section-header img, #section-rsvp .section-header img, .site-footer > img')
      .forEach(el => reveal(el, 'native-divider-reveal'));
    reveal(qs('#section-message .message-card'), 'native-message-reveal');
    reveal(qs('#section-events .section-header'), 'native-slide-up');
    qsa('.event-item').forEach(item => {
      /* Event cards stay spatially fixed. The native fallback is opacity-only
         and starts visible so a delayed observer can never hide the chapter. */
      reveal(item, 'native-event-static');
    });
    reveal(qs('#section-countdown .section-header'), 'native-slide-up');
    qsa('.countdown-unit').forEach((unit, i) => {
      unit.style.setProperty('--native-delay', (i * 120) + 'ms');
      reveal(unit, 'native-countdown');
    });
    reveal(qs('.countdown-date-label'), 'native-slide-up');
    reveal(qs('#section-venue .section-header'), 'native-slide-up');
    reveal(qs('.venue-card'), 'native-venue-reveal');
    reveal(qs('#section-rsvp .section-header'), 'native-slide-up');
    reveal(qs('.rsvp-form'), 'native-rsvp-reveal');
    reveal(qs('.site-footer'), 'native-slide-up');

    const targets = qsa('.native-animation-target');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          if (entry.target.classList.contains('event-item')) {
            /* Event cards must never translate as a whole. Use a quiet
               opacity-only reveal on the item; the card and its layout stay
               pixel-stable while the inner details can animate separately. */
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'none';
            entry.target.style.animation = 'none';
            entry.target.animate(
              [{ opacity: 0 }, { opacity: 1 }],
              { duration: 680, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'forwards' }
            );
          } else {
            entry.target.classList.add('native-is-visible');
          }
          observer.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
      targets.forEach(el => io.observe(el));
    } else {
      targets.forEach(el => el.classList.add('native-is-visible'));
    }

    const track = qs('#calendar-timeline');
    const path = qs('.calendar-timeline-path', track);
    const shadow = qs('.calendar-timeline-shadow', track);
    const glow = qs('.calendar-timeline-glow', track);
    const items = qsa('.event-item');

    if (track && path && shadow && glow) {
      let cachedKey = '';
      let cachedLength = 0;
      let cachedAnchors = [];

      const clamp01 = value => Math.max(0, Math.min(1, value));

      const pointForDot = item => {
        const dot = qs('.event-dot', item);
        const tr = track.getBoundingClientRect();
        const dr = dot?.getBoundingClientRect();
        return {
          x: dr ? (dr.left + dr.width / 2) - tr.left : tr.width / 2,
          y: dr ? (dr.top + dr.height / 2) - tr.top : item.offsetTop + 16
        };
      };

      const rebuild = () => {
        const tr = track.getBoundingClientRect();
        const width = Math.max(1, tr.width);
        const height = Math.max(1, tr.height);
        const pts = items.map(pointForDot);
        if (!pts.length) return;

        let d = 'M ' + pts[0].x + ' ' + pts[0].y;
        const sway = Math.min(38, Math.max(9, width * (width < 500 ? 0.025 : 0.042)));

        for (let i = 1; i < pts.length; i++) {
          const a = pts[i - 1];
          const b = pts[i];
          const dy = Math.max(50, b.y - a.y);
          const sign = (i % 2 === 1 ? 1 : -1);
          const s = sway * sign;
          d += ' C ' + (a.x + s) + ' ' + (a.y + dy * 0.16) + ', ' +
               (b.x - s) + ' ' + (b.y - dy * 0.16) + ', ' +
               b.x + ' ' + b.y;
        }

        path.setAttribute('d', d);
        shadow.setAttribute('d', d);
        path.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
        shadow.setAttribute('viewBox', '0 0 ' + width + ' ' + height);

        cachedLength = path.getTotalLength();
        path.style.strokeDasharray = String(cachedLength);
        shadow.style.strokeDasharray = String(cachedLength);

        const samples = 900;
        const samplePts = [];
        for (let i = 0; i <= samples; i++) {
          const dist = cachedLength * (i / samples);
          const p = path.getPointAtLength(dist);
          samplePts.push({dist, x:p.x, y:p.y});
        }
        cachedAnchors = pts.map(a => {
          let best = 0, bestD = Infinity;
          for (const sp of samplePts) {
            const dx=sp.x-a.x, dy=sp.y-a.y, d2=dx*dx+dy*dy;
            if(d2<bestD){bestD=d2;best=sp.dist/cachedLength;}
          }
          return best;
        });
        cachedKey = Math.round(width) + 'x' + Math.round(height);
      };

      const updateTimeline = () => {
        const rect = track.getBoundingClientRect();
        const viewport = Math.max(window.innerHeight, 1);
        const raw = (viewport * 0.78 - rect.top) /
                    Math.max(rect.height - viewport * 0.10, 1);
        const p = clamp01(raw);

        const key = Math.round(rect.width) + 'x' + Math.round(rect.height);
        if (key !== cachedKey) rebuild();
        if (!cachedLength) return;

        const offset = cachedLength * (1 - p);
        path.style.strokeDashoffset = String(offset);
        shadow.style.strokeDashoffset = String(offset);

        const head = path.getPointAtLength(cachedLength * p);
        glow.setAttribute('cx', head.x);
        glow.setAttribute('cy', head.y);
        glow.style.opacity = (p > .015 && p < .995) ? '1' : '0';

        items.forEach((item,i) => {
          const reached = p >= (cachedAnchors[i] ?? 1) - .012;
          item.classList.toggle('is-visible', p >= (cachedAnchors[i] ?? 1) - .06);
          item.classList.toggle('event-reached', reached);
          qs('.event-dot', item)?.classList.toggle('event-dot-lit', p >= (cachedAnchors[i] ?? 1) - .025);
        });
      };

      let ticking = false;
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          updateTimeline();
          ticking = false;
        });
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      requestAnimationFrame(updateTimeline);
    }
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

    /*
     * Start the native scroll-reveal layer immediately. Do not wait for the
     * GSAP CDN or ScrollTrigger. This is what makes the invite page animate
     * reliably in Chrome, Safari and cached mobile sessions.
     */
    initNativeScrollAnimations();

    const startedAt = Date.now();
    let fallbackStarted = false;
    const waitForGSAP = () => {
      if (!canAnimate()) {
        if (!fallbackStarted && Date.now() - startedAt > 1200) {
          fallbackStarted = true;
          initNativeScrollAnimations();
        }
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
          setTimeout(waitForGSAP, 50);
        }
        return;
      }
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({
        ignoreMobileResize: true,
        limitCallbacks: true
      });
      initHero();
      initPhoto();
      initMessage();
      initEvents();
      initCountdown();
      initVenue();
      initRSVP();
      initSectionTransitions();
      initDividersAndFooter();
      inlineAndAnimateDividers().finally(() => {
        requestAnimationFrame(() => ScrollTrigger.refresh(true));
      });
      initGenericReveals();

      /* Recalculate after fonts and late image/layout work settle. */
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh(true)).catch(() => {});
      }
      window.addEventListener('load', () => ScrollTrigger.refresh(true), { once: true });
      setTimeout(() => ScrollTrigger.refresh(true), 350);
      ScrollTrigger.refresh(true);
    };
    waitForGSAP();
  }

  return { init };
})();
