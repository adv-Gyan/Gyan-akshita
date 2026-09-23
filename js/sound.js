/**
 * SOUND.JS — Wedding invitation background music
 *
 * Upload the music file to:
 *   assets/audio/ambient.mp3
 *
 * The envelope opening is the user gesture used to start playback.
 * The floating button then controls play/pause.
 */
window.SoundManager = (function () {
  'use strict';

  let audio = null;
  let started = false;
  let isMuted = false;
  let ready = false;

  const toggle = document.getElementById('sound-toggle');
  const iconOn = toggle?.querySelector('.sound-on');
  const iconOff = toggle?.querySelector('.sound-off');

  function getConfig() {
    return window.weddingData?.audio || {
      src: 'assets/audio/ambient.mp3',
      autoplay: true,
      loop: true,
      volume: 0.4,
    };
  }

  function setUI(playing) {
    if (!toggle) return;
    toggle.disabled = !ready;
    toggle.classList.toggle('is-playing', !!playing);
    iconOn?.classList.toggle('hidden', !playing);
    iconOff?.classList.toggle('hidden', !!playing);
    toggle.setAttribute(
      'aria-label',
      playing ? 'Pause wedding music' : 'Play wedding music'
    );
    toggle.title = playing ? 'Pause music' : 'Play music';
  }

  function createAudio() {
    if (audio) return audio;

    const cfg = getConfig();
    audio = new Audio();
    audio.src = cfg.src;
    audio.loop = cfg.loop !== false;
    audio.volume = Math.max(0, Math.min(1, cfg.volume ?? 0.4));
    audio.preload = 'auto';

    audio.addEventListener('canplay', () => {
      ready = true;
      setUI(!audio.paused && !audio.muted);
    });

    audio.addEventListener('play', () => {
      started = true;
      setUI(true);
    });

    audio.addEventListener('pause', () => setUI(false));

    audio.addEventListener('ended', () => setUI(false));

    /* Keep the button visible if the file has not been uploaded yet.
       Once ambient.mp3 is uploaded, it becomes playable automatically. */
    audio.addEventListener('error', () => {
      ready = false;
      setUI(false);
      if (toggle) toggle.title = 'Add ambient.mp3 to enable music';
    });

    audio.load();
    return audio;
  }

  async function start() {
    const cfg = getConfig();
    if (!cfg.autoplay) {
      createAudio();
      return;
    }

    const player = createAudio();

    try {
      await player.play();
      started = true;
      isMuted = false;
      setUI(true);
    } catch (_) {
      /* Autoplay can still be blocked; the visible button can start it. */
      setUI(false);
    }
  }

  async function toggleMusic() {
    const player = createAudio();
    if (!ready) return;

    try {
      if (player.paused) {
        await player.play();
        isMuted = false;
      } else {
        player.pause();
      }
    } catch (_) {
      setUI(false);
    }
  }

  toggle?.addEventListener('click', toggleMusic);

  /* Prepare the player immediately, but do not play before the invitation opens. */
  createAudio();

  return { start };
})();
