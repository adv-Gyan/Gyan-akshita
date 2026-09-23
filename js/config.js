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
      date:        "20 November 2026",
      time:        "6:00 PM",
      venue: "Harding Road",
      address: "R-37, Harding Rd, Rajbansi Nagar, Patna, Bihar 800014",
      description: "The beginning of forever — an intimate ring exchange ceremony with our closest family.",
      dressCode:   "Festive / Semi-Formal",
      photo:       "assets/images/events/ring.jpg",
    },
    {
      id:          "haldi",
      name:        "Haldi Carnival",
      icon:        "🌼",
      date:        "21 November 2026",
      time:        "10:00 AM",
      venue:       "Harding Road",
      address:     "R-37, Harding Rd, Rajbansi Nagar, Patna, Bihar 800014",
      description: "A joyous celebration of colour, laughter, and blessings as we usher in the wedding festivities.",
      dressCode:   "Whites & Yellows — clothes you don't mind getting colourful!",
      photo:       "assets/images/events/haldi.jpg",
    },
    {
      id:          "wedding",
      name:        "Wedding Ceremony",
      icon:        "🪷",
      date:        "21 November 2026",
      time:        "8:00 PM",                  // ← e.g. "11:00 AM"
      venue:       "Harding Road",
      address:     "R-37, Harding Rd, Rajbansi Nagar, Patna, Bihar 800014",
      description: "The sacred union of two hearts. Join us as we take our vows and begin our journey together.",
      dressCode:   "Traditional / Festive",
      photo:       "assets/images/events/wedding.jpg",
    },
  ],

  /* ── Venue (Wedding) ─────────────────────────────────────── */
  venue: {
    name:      "Harding Road",
    address:   "R-37, Harding Rd, Rajbansi Nagar, Patna, Bihar 800014",
    city:      "Patna, Bihar",
    mapsUrl:   "https://maps.app.goo.gl/spTvXEKddzQnfgh17?g_st=ic",
    embedUrl:  "https://www.google.com/maps?q=R-37%2C%20Harding%20Rd%2C%20Rajbansi%20Nagar%2C%20Patna%2C%20Bihar%20800014&output=embed",
  },

  /* ── RSVP ────────────────────────────────────────────────── */
  rsvp: {
    email:       "your@email.com",         // ← your email for form submissions
    whatsapp:    "",                       // ← optional: +91XXXXXXXXXX
    deadline:    "10 November 2026",
  },

  /* ── Audio ───────────────────────────────────────────────── */
  audio: {
    src:      "assets/audio/ambience.mp3",
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
