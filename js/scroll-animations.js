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

    /* Remove the pre-paint guard immediately before GSAP sets the
       initial off-screen positions, so the first visible frame is
       already the intended animation state. */
    document.getElementById('main-invite')?.classList.add('hero-animation-ready');

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
      .to(arch, { scale: 1, opacity: 0.34, duration: 1.25, filter: 'drop-shadow(0 0 14px rgba(201,168,76,.12))' })
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

    /* The event connector is a continuous hand-drawn gold path.
       Its SVG stroke is revealed by the guest's scroll position. */
    gsap.set(fill, { opacity: 0, scaleY: 1, transformOrigin: 'center center' });

    const timelineLine = qs('.timeline-line', track);
    let timelinePath = qs('.timeline-line-path', track);
    let timelineGlow = qs('.timeline-line-glow', track);

    if (timelineLine && !timelinePath) {
      /* The SVG path itself is created inside drawTimelinePath so it can
         inherit the responsive track dimensions safely. */
    }
    if (timelineLine && !timelineGlow) {
      timelineGlow = document.createElement('span');
      timelineGlow.className = 'timeline-line-glow';
      timelineGlow.setAttribute('aria-hidden', 'true');
      timelineLine.appendChild(timelineGlow);
    }

    const drawTimelinePath = () => {
      if (!timelineLine) return;

      const trackRect = track.getBoundingClientRect();
      const anchors = items.map((item) => {
        const dot = qs('.event-dot', item);
        const card = qs('.event-card', item);
        const dotRect = dot?.getBoundingClientRect();
        const cardRect = card?.getBoundingClientRect();
        return {
          x: dotRect
            ? dotRect.left - trackRect.left + dotRect.width / 2
            : trackRect.width / 2,
          y: dotRect
            ? dotRect.top - trackRect.top + dotRect.height / 2
            : item.offsetTop,
          bottomY: cardRect
            ? cardRect.bottom - trackRect.top + 8
            : item.offsetTop + item.offsetHeight
        };
      });
      if (anchors.length < 2) return;

      /* Each event connector hugs the outside edge of its card, then
         sweeps through the empty gap before curling into the next card.
         This keeps every stroke away from the event text and imagery. */
      let d = `M ${anchors[0].x} ${anchors[0].y}`;
      for (let i = 0; i < anchors.length - 1; i++) {
        const prev = anchors[i];
        const cur = anchors[i + 1];
        const nextTop = cur.y;
        const gapTop = prev.bottomY;
        const gapBottom = Math.max(gapTop + 24, nextTop - 8);
        const gapHeight = gapBottom - gapTop;
        const centerX = trackRect.width / 2;
        const direction = cur.x > prev.x ? 1 : -1;
        const flourish = Math.min(90, Math.max(28, trackRect.width * .12));

        d += ` L ${prev.x} ${gapTop}`;
        d += ` C ${prev.x} ${gapTop + gapHeight * .22}, ${centerX + flourish * direction} ${gapTop + gapHeight * .22}, ${centerX} ${gapTop + gapHeight * .50}`;
        d += ` C ${centerX - flourish * direction} ${gapTop + gapHeight * .78}, ${cur.x} ${gapBottom - gapHeight * .22}, ${cur.x} ${gapBottom}`;
        d += ` L ${cur.x} ${cur.y}`;
      }
      const svg = timelineLine.querySelector('svg.timeline-line-svg');
      let timelineSvg = svg;
      if (!timelineSvg) {
        timelineSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        timelineSvg.classList.add('timeline-line-svg');
        timelineSvg.setAttribute('aria-hidden', 'true');
        timelineSvg.setAttribute('preserveAspectRatio', 'none');
        timelineLine.appendChild(timelineSvg);
      }

      timelinePath = timelineSvg.querySelector('.timeline-line-path');
      if (!timelinePath) {
        timelinePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        timelinePath.classList.add('timeline-line-path');
        timelinePath.setAttribute('fill', 'none');
        timelineSvg.appendChild(timelinePath);
      }

      timelineSvg.setAttribute('viewBox', `0 0 ${Math.max(1, trackRect.width)} ${Math.max(1, trackRect.height)}`);
      timelineSvg.setAttribute('width', trackRect.width);
      timelineSvg.setAttribute('height', trackRect.height);
      timelinePath.setAttribute('d', d);

      const len = timelinePath.getTotalLength();
      /* The calligraphic stroke begins hidden and is drawn progressively
         by the ScrollTrigger below. */
      gsap.set(timelinePath, {
        strokeDasharray: len,
        strokeDashoffset: len
      });
      timelinePath.dataset.length = len;
    };

    items.forEach((item, i) => {
      const card = qs('.event-card', item);
      const dot = qs('.event-dot', item);
      const photo = qs('.event-card-photo', item);
      const dress = qs('.event-card-dresscode', item);
      const x = i % 2 === 0 ? -90 : 90;

      const tl = gsap.timeline({ scrollTrigger: { trigger: item, start: 'top 82%', once: true } });
      tl.fromTo(dot,
          { opacity: .35, scale: .65 },
          { opacity: 1, scale: 1.08, duration: .55, ease: 'back.out(2)', immediateRender: false })
        .to(dot, { scale: 1, duration: .2 }, '-=.08')
        .fromTo(card,
          { opacity: 0, x, y: 24 },
          { opacity: 1, x: 0, y: 0, duration: .8, ease: 'power3.out', immediateRender: false },
          '-=.3');
      if (dress) {
        tl.fromTo(dress,
          { opacity: 0, y: 10, scale: .92 },
          { opacity: 1, y: 0, scale: 1, duration: .4, ease: 'back.out(1.5)', immediateRender: false },
          '-=.18');
      }

      if (photo) gsap.to(photo, {
        scale: 1.08, xPercent: 2.5, ease: 'none',
        scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: 1.2 }
      });
    });

    requestAnimationFrame(drawTimelinePath);

    ScrollTrigger.create({
      trigger: track,
      start: 'top 78%',
      end: 'bottom 72%',
      scrub: 0.35,
      onRefresh: drawTimelinePath,
      onUpdate: (self) => {
        const progress = self.progress;
        const clamped = Math.max(0, Math.min(1, progress));
        if (timelinePath && timelinePath.dataset.length) {
          const len = Number(timelinePath.dataset.length);
          gsap.set(timelinePath, {
            strokeDashoffset: len * (1 - clamped)
          });
        }
        if (timelineGlow && timelinePath && timelinePath.dataset.length) {
          const len = Number(timelinePath.dataset.length);
          try {
            const pt = timelinePath.getPointAtLength(len * clamped);
            gsap.set(timelineGlow, {
              x: pt.x,
              y: pt.y,
              opacity: clamped > 0.015 && clamped < 0.995 ? 1 : 0
            });
          } catch (_) {
            gsap.set(timelineGlow, { opacity: 0 });
          }
        }
        items.forEach((item, i) => {
          const threshold = items.length === 1 ? 0 : i / (items.length - 1);
          const dot = qs('.event-dot', item);
          if (!dot) return;
          const reached = progress >= Math.max(.08, threshold);
          gsap.to(dot, {
            scale: reached ? 1.18 : 1,
            boxShadow: reached
              ? '0 0 20px rgba(201,168,76,.65)'
              : '0 0 12px rgba(201,168,76,.5)',
            duration: .18,
            overwrite: true
          });
          dot.classList.toggle('timeline-reached', reached);
        });
      }
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
    qsa('#main-invite > .section:not(#section-hero)').forEach(section => {
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
    qsa('.event-item').forEach((item, i) => reveal(item, i % 2 === 0 ? 'native-event-left' : 'native-event-right'));
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
          entry.target.classList.add('native-is-visible');
          observer.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
      targets.forEach(el => io.observe(el));
    } else {
      targets.forEach(el => el.classList.add('native-is-visible'));
    }

    const track = qs('.timeline-track');
    const fill = qs('#timeline-fill');
    const items = qsa('.event-item');
    if (track && fill) {
      const updateTimeline = () => {
        const rect = track.getBoundingClientRect();
        const viewport = Math.max(window.innerHeight, 1);
        const start = viewport * 0.78;
        const end = viewport * 0.72;
        const total = Math.max(track.offsetHeight, 1);
        const progress = Math.max(0, Math.min(1, (start - rect.top) / Math.max(total - (start - end), 1)));
        fill.style.transform = 'scaleY(' + progress + ')';
        items.forEach(item => {
          const dot = qs('.event-dot', item);
          if (dot) dot.classList.toggle('timeline-reached', item.getBoundingClientRect().top < viewport * 0.72);
        });
      };
      let ticking = false;
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => { updateTimeline(); ticking = false; });
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      updateTimeline();
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
      initHero();
      initPhoto();
      initMessage();
      initEvents();
      initCountdown();
      initVenue();
      initRSVP();
      initSectionTransitions();
      initDividersAndFooter();
      inlineAndAnimateDividers();
      initGenericReveals();
      ScrollTrigger.refresh();
    };
    waitForGSAP();
  }

  return { init };
})();
