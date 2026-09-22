/**
 * ============================================================
 * WEDDING CONFIGURATION — SINGLE SOURCE OF TRUTH
 * ============================================================
 * Edit ONLY this file to update all wedding details.
 * No need to touch any other file.
 * ============================================================
 */

const weddingData = {

  /* ── Couple ─────────────────────────────────────────────── */
  couple: {
    bride: {
      firstName: "Akshita",
      lastName:  "",           // ← add surname if desired
    },
    groom: {
      firstName: "Gyanendra",
      lastName:  "",           // ← add surname if desired
    },
  },

  /* ── Dates ───────────────────────────────────────────────── */
  weddingDate:    "2026-11-21T00:00:00",   // ISO — used by countdown
  dateDisplay:    "21 · November · 2026",

  /* ── Personal Message ────────────────────────────────────── */
  message: {
    verse: "Two souls, one destiny.",
    body:  `With hearts full of joy and gratitude, we invite you to be a cherished part of our celebration. Your presence will make our special day truly unforgettable. We look forward to sharing this beautiful journey with you.`,
    closing: "With love,",
  },

  /* ── Events ──────────────────────────────────────────────── */
  events: [
    {
      id:          "ring",
      name:        "Ring Ceremony",
      icon:        "💍",
      date:        "TBD",                  // ← e.g. "18 November 2026"
      time:        "TBD",                  // ← e.g. "6:00 PM onwards"
      venue:       "TBD",                  // ← venue name
      address:     "TBD",                  // ← full address
      description: "The beginning of forever — an intimate ring exchange ceremony with our closest family.",
      dressCode:   "Festive / Semi-Formal",
      photo:       "assets/images/events/ring.jpg",
    },
    {
      id:          "haldi",
      name:        "Haldi Carnival",
      icon:        "🌼",
      date:        "TBD",
      time:        "TBD",
      venue:       "TBD",
      address:     "TBD",
      description: "A joyous celebration of colour, laughter, and blessings as we usher in the wedding festivities.",
      dressCode:   "Whites & Yellows — clothes you don't mind getting colourful!",
      photo:       "assets/images/events/haldi.jpg",
    },
    {
      id:          "wedding",
      name:        "Wedding Ceremony",
      icon:        "🪷",
      date:        "21 November 2026",
      time:        "TBD",                  // ← e.g. "11:00 AM"
      venue:       "TBD",
      address:     "TBD",
      description: "The sacred union of two hearts. Join us as we take our vows and begin our journey together.",
      dressCode:   "Traditional / Festive",
      photo:       "assets/images/events/wedding.jpg",
    },
  ],

  /* ── Venue (Wedding) ─────────────────────────────────────── */
  venue: {
    name:      "TBD",                      // ← e.g. "The Grand Palace Hotel"
    address:   "TBD",                      // ← full address
    city:      "TBD",                      // ← city name
    mapsUrl:   "https://maps.google.com",  // ← Google Maps share link
    embedUrl:  "",                         // ← Maps iframe embed URL
  },

  /* ── RSVP ────────────────────────────────────────────────── */
  rsvp: {
    email:       "your@email.com",         // ← your email for form submissions
    whatsapp:    "",                       // ← optional: +91XXXXXXXXXX
    deadline:    "10 November 2026",
  },

  /* ── Audio ───────────────────────────────────────────────── */
  audio: {
    src:      "assets/audio/ambient.mp3",
    autoplay: true,
    loop:     true,
    volume:   0.4,
  },

  /* ── Assets ──────────────────────────────────────────────── */
  assets: {
    couplePhoto: "assets/images/couple.jpg",  // ← upload your photo here
    heroBg:      "assets/images/hero-bg.jpg",
  },

};

// Expose globally
window.weddingData = weddingData;
