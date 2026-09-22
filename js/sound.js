/**
 * ============================================================
 * SOUND.JS — Audio manager with toggle
 * On by default (user-configured). Respects browser policies.
 * ============================================================
 */

window.SoundManager = (function () {
  'use strict';

  let audio    = null;
  let isMuted  = false;
  let started  = false;

  const toggle    = document.getElementById('sound-toggle');
  const iconOn    = toggle?.querySelector('.sound-on');
  const iconOff   = toggle?.querySelector('.sound-off');

  function getConfig() {
    return window.weddingData?.audio || {
      src:      'assets/audio/ambient.mp3',
      autoplay: true,
      loop:     true,
      volume:   0.4,
    };
  }

  function createAudio() {
    if (audio) return;
    const cfg = getConfig();
    audio = new Audio(cfg.src);
    audio.loop   = cfg.loop !== false;
    audio.volume = cfg.volume ?? 0.4;

    audio.addEventListener('error', () => {
      /* Audio file not found — hide toggle gracefully */
      if (toggle) toggle.style.display = 'none';
    });
  }

  function start() {
    if (started) return;
    createAudio();

    const cfg = getConfig();
    if (!cfg.autoplay) {
      updateUI();
      return;
    }

    /* Browsers require user gesture — envelope tap counts! */
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          started = true;
          updateUI();
        })
        .catch(() => {
          /* Autoplay blocked — show toggle so user can manually start */
          updateUI(true);
        });
    }
  }

  function toggleMute() {
    if (!audio) return;

    if (!started) {
      audio.play().then(() => { started = true; isMuted = false; updateUI(); }).catch(() => {});
      return;
    }

    isMuted = !isMuted;
    audio.muted = isMuted;
    updateUI();
  }

  function updateUI(blocked = false) {
    if (!toggle) return;

    if (blocked || isMuted) {
      iconOn?.classList.add('hidden');
      iconOff?.classList.remove('hidden');
      toggle.setAttribute('aria-label', 'Unmute background music');
      toggle.title = 'Unmute music';
    } else {
      iconOn?.classList.remove('hidden');
      iconOff?.classList.add('hidden');
      toggle.setAttribute('aria-label', 'Mute background music');
      toggle.title = 'Mute music';
    }
  }

  if (toggle) {
    toggle.addEventListener('click', toggleMute);
  }

  return { start };

})();
