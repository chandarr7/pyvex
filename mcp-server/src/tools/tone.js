/* Skin tone palette — curated clothing colors that flatter a complexion. */

const PALETTES = {
  // Warm undertones
  warm: {
    summary: 'Honeyed sun, warm under-light. Colors with weight and earth.',
    colors: [
      { name: 'Storm Olive',    hex: '#3E4631', note: 'A warm green that grounds golden skin without competing.' },
      { name: 'Bone',           hex: '#EDE6D6', note: 'Off-white with a hint of yellow — softer than pure white.' },
      { name: 'Cognac',         hex: '#9B5D34', note: 'A warm leather brown that flatters golden under-light.' },
      { name: 'Cardinal',       hex: '#A8362E', note: 'A muted, brick-leaning red — never blue-toned.' },
      { name: 'Camel',          hex: '#B79268', note: 'The luxury neutral, calibrated to warm undertones.' },
      { name: 'Tobacco',        hex: '#6F4A24', note: 'A deep warm brown for editorial weight.' },
      { name: 'Cream',          hex: '#F5EDD8', note: 'Softer than bone, brighter than wheat.' },
      { name: 'Forest',         hex: '#2A3A2A', note: 'A muted deep green for evening tailoring.' },
    ],
  },
  cool: {
    summary: 'Cool under-light, blue tones. Colors with clarity and edge.',
    colors: [
      { name: 'Ink',            hex: '#1A2238', note: 'A cool navy that reads expensive against cool skin.' },
      { name: 'Slate Rose',     hex: '#A4747C', note: 'A dusty pink with grey beneath — never sweet.' },
      { name: 'Porcelain',      hex: '#EEEEF0', note: 'A cool white — cleaner than bone.' },
      { name: 'Wine',           hex: '#6F2737', note: 'A blue-leaning red for evening.' },
      { name: 'Storm Grey',     hex: '#5A5F66', note: 'A neutral grey with a cool cast.' },
      { name: 'Cobalt',         hex: '#2B4E8C', note: 'A saturated blue for statement moments.' },
      { name: 'Obsidian',       hex: '#101418', note: 'Cooler than warm black — slightly blue.' },
      { name: 'Lavender Smoke', hex: '#8A8AA0', note: 'A muted purple for soft contrast.' },
    ],
  },
  neutral: {
    summary: 'Balanced under-light. Both warm and cool families work.',
    colors: [
      { name: 'Stone',          hex: '#B4ADA0', note: 'A truly neutral mid-tone, balanced between warm and cool.' },
      { name: 'Pewter',         hex: '#6E6E68', note: 'A neutral grey-brown — works against any skin.' },
      { name: 'Bone',           hex: '#EDE6D6', note: 'A safe off-white with warmth.' },
      { name: 'Storm Olive',    hex: '#3E4631', note: 'Olive green sits well on neutral undertones.' },
      { name: 'Navy',           hex: '#1F2A4C', note: 'A versatile blue — the neutral\'s formal answer.' },
      { name: 'Espresso',       hex: '#3B2A22', note: 'A near-black brown with depth.' },
      { name: 'Sage',           hex: '#8A9882', note: 'A muted green-grey for daytime softness.' },
      { name: 'Charcoal',       hex: '#33333A', note: 'A near-black grey for tailoring.' },
    ],
  },
  olive: {
    summary: 'Olive undertone — neither warm nor cool, sits between. Earthy, complex tones win.',
    colors: [
      { name: 'Storm Olive',    hex: '#3E4631', note: 'Self-evident — olive on olive is editorial.' },
      { name: 'Rust',           hex: '#A85C36', note: 'Burnt orange brings warmth without yellowing.' },
      { name: 'Forest',         hex: '#2A3A2A', note: 'A deep green that flatters olive complexity.' },
      { name: 'Mustard',        hex: '#B6892E', note: 'Earthy yellow that picks up olive\'s warmth.' },
      { name: 'Cream',          hex: '#F5EDD8', note: 'A warm off-white that softens olive\'s contrast.' },
      { name: 'Terracotta',     hex: '#A85C4A', note: 'Sun-baked clay — natural against olive.' },
      { name: 'Bronze',         hex: '#6F4E2A', note: 'A metallic warm brown for evening.' },
      { name: 'Slate',          hex: '#4A4F58', note: 'A cool counterweight to olive\'s warmth.' },
    ],
  },
};

const DEPTH_MAP = {
  fair:   { range: 'Light foreground, low contrast palette',  bias: 'Soft mid-tones over deep darks.' },
  medium: { range: 'Most flexible band — full range available.', bias: 'Editorial freedom.' },
  deep:   { range: 'Rich pigment carries deeper colors beautifully.', bias: 'Saturated darks and luminous brights.' },
};

const KEYWORDS_TO_UNDERTONE = {
  warm:    ['warm', 'golden', 'yellow', 'peach', 'sun-kissed', 'tan'],
  cool:    ['cool', 'pink', 'rose', 'blue', 'porcelain', 'ash'],
  olive:   ['olive', 'mediterranean', 'green-undertone'],
  neutral: ['neutral', 'balanced', 'in-between'],
};

const KEYWORDS_TO_DEPTH = {
  fair:   ['fair', 'porcelain', 'pale', 'ivory', 'light'],
  medium: ['medium', 'tan', 'beige', 'golden', 'olive', 'sun-kissed'],
  deep:   ['deep', 'dark', 'ebony', 'rich', 'mahogany', 'brown', 'cocoa', 'sable'],
};

function detect(text, map, fallback) {
  const lower = text.toLowerCase();
  for (const [key, words] of Object.entries(map)) {
    if (words.some(w => lower.includes(w))) return key;
  }
  return fallback;
}

export function analyzeSkinTone({ description, undertone, depth }) {
  if (!description && !undertone) {
    throw new Error('Provide either a `description` or `undertone` (warm | cool | neutral | olive).');
  }

  const u = (undertone || (description ? detect(description, KEYWORDS_TO_UNDERTONE, 'neutral') : 'neutral')).toLowerCase();
  const d = (depth     || (description ? detect(description, KEYWORDS_TO_DEPTH,     'medium')  : 'medium')).toLowerCase();

  const palette = PALETTES[u];
  if (!palette) throw new Error(`Unknown undertone: ${u}. Use warm | cool | neutral | olive.`);

  const depthMeta = DEPTH_MAP[d] || DEPTH_MAP.medium;

  return {
    undertone: u,
    depth: d,
    summary: palette.summary,
    depthNote: depthMeta.bias,
    range: depthMeta.range,
    colors: palette.colors,
    interpretedFrom: description || `${u} undertone, ${d} depth`,
  };
}
