/**
 * ============================================================
 * ENVELOPE.JS — Image-based envelope opening animation
 * ============================================================
 * Approach:
 *   1. Tap → subtle press feedback
 *   2. Crossfade closed→open envelope photo
 *   3. Card slides up from inside the envelope
 *   4. Everything fades → main invitation reveals
 * ============================================================
 */

(function () {
  'use strict';

  let hasOpened = false;

  /* ── DOM refs ─────────────────────────────────────────── */
  const scene       = document.getElementById('envelope-scene');
  const envelope    = document.getElementById('envelope');
  const imgClosed   = document.getElementById('env-img-closed');
  const imgOpen     = document.getElementById('env-img-open');
  const card        = document.getElementById('env-card');
  const tapHint     = document.querySelector('.tap-hint');
  const mainInvite  = document.getElementById('main-invite');
  const soundToggle = document.getElementById('sound-toggle');
  const heroAnimEls = document.querySelectorAll('.animate-hero');

  /* ── Reduced motion check ─────────────────────────────── */
  const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Open envelope ────────────────────────────────────── */
  function openEnvelope() {
    if (hasOpened) return;
    hasOpened = true;

    document.body.style.overflow = 'hidden';
    envelope.setAttribute('aria-pressed', 'true');

    if (prefersReducedMotion) {
      openReduced();
      return;
    }

    const tl = gsap.timeline({ onComplete: onRevealComplete });

    /* ── PHASE 1: Touch press (0–0.2s) ──────────────────
       Subtle scale-down so user feels contact              */
    tl.to(envelope, {
      scale: 0.96,
      duration: 0.15,
      ease: 'power2.out',
    });
    tl.to(envelope, {
      scale: 1,
      duration: 0.15,
      ease: 'power2.inOut',
    });

    /* Fade out tap hint */
    tl.to(tapHint, {
      opacity: 0,
      y: 10,
      duration: 0.25,
      ease: 'power2.in',
    }, '<');

    /* ── PHASE 2: Envelope opens (0.3–1.1s) ─────────────
       Crossfade closed→open photo                          */
    tl.to(imgClosed, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
    }, '+=0.15');

    tl.to(imgOpen, {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.inOut',
    }, '<');

    /* Slight zoom-in during open */
    tl.to(envelope, {
      scale: 1.03,
      duration: 0.8,
      ease: 'power2.out',
    }, '<');

    /* ── PHASE 3: Card emerges (1.1–2.0s) ───────────────
       Card slides up from inside the envelope                */
    tl.to(card, {
      opacity: 1,
      y: -60,
      duration: 0.9,
      ease: 'power3.out',
    }, '-=0.2');

    /* ── PHASE 4: Hold + transition (2.0–3.2s) ──────────
       Brief moment of awe, then scene fades                 */
    tl.to(scene, {
      opacity: 0,
      scale: 0.95,
      duration: 0.7,
      ease: 'power2.inOut',
    }, '+=0.4');

    /* Reveal main invite */
    tl.to(mainInvite, {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
      onStart: () => {
        mainInvite.setAttribute('aria-hidden', 'false');
        mainInvite.classList.add('is-visible');
      },
    }, '-=0.35');
  }

  /* ── Reduced motion ───────────────────────────────────── */
  function openReduced() {
    gsap.to(scene, { opacity: 0, duration: 0.3 });
    gsap.to(mainInvite, {
      opacity: 1,
      duration: 0.3,
      delay: 0.2,
      onStart: () => {
        mainInvite.setAttribute('aria-hidden', 'false');
        mainInvite.classList.add('is-visible');
      },
      onComplete: onRevealComplete,
    });
  }

  /* ── Post-reveal cleanup ──────────────────────────────── */
  function onRevealComplete() {
    scene.style.display = 'none';
    scene.setAttribute('aria-hidden', 'true');

    document.body.classList.add('invite-open');
    document.body.style.overflow = '';

    /* Trigger hero staggered animations */
    setTimeout(() => {
      heroAnimEls.forEach(el => el.classList.add('is-visible'));
    }, 100);

    /* Show sound toggle */
    soundToggle.classList.remove('hidden');

    /* Start sound */
    if (window.SoundManager) window.SoundManager.start();

    /* Start scroll observers */
    if (window.ScrollAnimations) window.ScrollAnimations.init();
  }

  /* ── Event listeners ──────────────────────────────────── */
  function onInteract(e) {
    e.preventDefault();
    openEnvelope();
  }

  envelope.addEventListener('click', onInteract);
  envelope.addEventListener('touchend', onInteract, { passive: false });
  envelope.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openEnvelope();
    }
  });

  /* Wait for GSAP */
  function waitForGSAP() {
    if (typeof gsap !== 'undefined') return;
    setTimeout(waitForGSAP, 50);
  }
  waitForGSAP();

})();
