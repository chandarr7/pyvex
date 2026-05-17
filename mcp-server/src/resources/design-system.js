/* Design system resources — exposed as MCP resources (read-only). */

export const COLORS = {
  raw: {
    obsidian: '#050707',
    carbon: '#0E1311',
    graphite: '#1A211E',
    slate: '#232B28',
    emeraldDeep: '#0A3A2E',
    emeraldMid: '#15614A',
    auraEmerald: '#46F3A8',
    auraEmeraldHalo: '#7AFFC2',
    auraGold: '#D4B886',
    auraGoldHalo: '#E8D2A4',
    bone: '#F2EFE8',
    smoke: '#8B928E',
    ash: '#4A524E',
  },
  semantic: {
    bg: '#050707',
    bgElev1: '#0E1311',
    bgElev2: '#1A211E',
    bgGlass: 'rgba(14,19,17,0.6)',
    fg1: '#F2EFE8',
    fg2: '#8B928E',
    fg3: '#4A524E',
    accent: '#46F3A8',
    accentSoft: 'rgba(70,243,168,0.16)',
    accentGlow: 'rgba(70,243,168,0.35)',
    border: 'rgba(242,239,232,0.08)',
    borderStrong: 'rgba(242,239,232,0.16)',
    borderAccent: 'rgba(70,243,168,0.40)',
  },
};

export const TYPOGRAPHY = {
  families: {
    display: "'Cormorant Garamond', Georgia, serif",
    ui: "'Geist', system-ui, sans-serif",
    mono: "'Geist Mono', ui-monospace, monospace",
  },
  scale: {
    hero: 'clamp(3.5rem, 8vw, 7.5rem)',
    display: 'clamp(2.5rem, 5vw, 4.5rem)',
    h1: 'clamp(2rem, 4vw, 3.25rem)',
    h2: 'clamp(1.5rem, 2.6vw, 2.25rem)',
    h3: 'clamp(1.25rem, 1.8vw, 1.5rem)',
    bodyLg: '1.125rem',
    body: '1rem',
    bodySm: '0.875rem',
    caption: '0.75rem',
    eyebrow: '0.6875rem',
  },
  rules: [
    'Serif speaks, sans operates. Cormorant for headlines and editorial moments. Geist for body, buttons, and UI chrome. Geist Mono for numbers, scores, AI confidence.',
    'Headlines use sentence case with a period: "Your personal AI stylist."',
    'Italic em inside headlines is the brand\'s signature emphasis.',
    'Eyebrow labels are ALL CAPS with 0.18em tracking and a 6px emerald dot.',
  ],
};

export const VOICE = {
  personality: ['Intelligent', 'Elegant', 'Powerful', 'Confident', 'Futuristic', 'Luxurious'],
  rules: [
    'Editorial, not corporate. Sentences are short. Statements are declarative.',
    'Use "your", not "our". The product orbits the user.',
    'No exclamation marks. Ever. Confidence does not need volume.',
    'No emoji.',
    'No marketing verbs (unlock, supercharge, revolutionize). Use real verbs (generate, analyze, style, score, match).',
  ],
  casing: {
    headlines: 'Sentence case with a period.',
    buttons: 'Title Case, two-to-three words ("Try AI Stylist").',
    eyebrows: 'ALL CAPS, tracked, prefixed with "·".',
    numbers: 'Always numerals.',
  },
  examples: [
    { wrong: 'Unlock your style potential!',     right: 'Your personal AI stylist.' },
    { wrong: 'Our amazing AI helps you look great', right: 'Outfits engineered for your identity.' },
    { wrong: 'Sign up today and save 50%',       right: 'Begin trial. No card.' },
  ],
};

export const MOTION = {
  easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  durations: { micro: '180ms', short: '300ms', medium: '600ms', long: '1200ms' },
  hover: 'Brightens 6%, emerald glow ring fades in 0 -> 24px spread at 0.3 opacity over 300ms.',
  press: 'scale(0.985), no color change, immediate (no transition).',
  reveal: 'Fade + 12px translate up over 1200ms. Never bounce. Luxury is restrained.',
};
