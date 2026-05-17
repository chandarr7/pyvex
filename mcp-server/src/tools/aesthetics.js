/* Aesthetic engine — match a vibe to brands and signature pieces. */

const AESTHETICS = {
  'old-money': {
    name: 'Old Money',
    summary: 'Heritage, hush, navy. Sailing-club energy without the boat.',
    palette: ['#1F2A4C', '#F5EDD8', '#3B2A22', '#A89784'],
    signatures: ['Cable-knit sweater', 'Pleated chino', 'Loafer with sock', 'Heritage trench', 'Cashmere polo'],
    brands: ['Ralph Lauren Purple Label', 'Brunello Cucinelli', 'Loro Piana', 'The Row', 'Brooks Brothers', 'Hermès'],
  },
  'quiet-luxury': {
    name: 'Quiet Luxury',
    summary: 'Cashmere, whisper. Logos die at the door.',
    palette: ['#7A6657', '#A89784', '#3F4A45', '#1A211E'],
    signatures: ['Cashmere knit', 'Wide-leg wool', 'Unstructured blazer', 'Suede loafer', 'Boucle jacket'],
    brands: ['The Row', 'Loro Piana', 'Brunello Cucinelli', 'Jil Sander', 'Lemaire', 'Bottega Veneta'],
  },
  'minimalist': {
    name: 'Minimalist',
    summary: 'Bone, black, line. The form is the statement.',
    palette: ['#0E1311', '#F2EFE8', '#46524C', '#FFFFFF'],
    signatures: ['Architectural coat', 'Column trouser', 'Cotton shirt', 'White sneaker', 'Black turtleneck'],
    brands: ['Jil Sander', 'COS', 'Lemaire', 'Helmut Lang', 'A.P.C.', 'Theory', 'Acne Studios'],
  },
  'streetwear': {
    name: 'Streetwear',
    summary: 'Volume, cadence. The fit is the language.',
    palette: ['#0E1311', '#46F3A8', '#F2EFE8', '#A85C36'],
    signatures: ['Oversized hoodie', 'Cargo trouser', 'Box-fit tee', 'Skate sneaker', 'Tech jacket'],
    brands: ['Supreme', 'Stüssy', 'Aimé Leon Dore', 'KITH', 'Fear of God', 'BAPE', 'Awake NY', 'Carhartt WIP'],
  },
  'techwear': {
    name: 'Techwear',
    summary: 'Carbon, utility. Built for the city as terrain.',
    palette: ['#0E1311', '#1A211E', '#46524C', '#46F3A8'],
    signatures: ['Shell jacket', 'Articulated trouser', 'Performance boot', 'Modular vest', 'Technical knit'],
    brands: ["Arc'teryx", 'Stone Island', 'ACRONYM', 'Nike ACG', 'Veilance', 'Y-3'],
  },
  'korean': {
    name: 'Korean',
    summary: 'Layered, subdued. Soft proportions, careful neutrals.',
    palette: ['#F2EFE8', '#A89784', '#3F4A45', '#7A6657'],
    signatures: ['Cardigan over button-up', 'Wide-leg trouser', 'Loafer', 'Tote bag', 'Bucket hat'],
    brands: ['ADER error', 'thisisneverthat', 'Andersson Bell', 'IISE', 'Wooyoungmi', 'Pushbutton'],
  },
  'luxury-editorial': {
    name: 'Luxury Editorial',
    summary: 'Italian, sculptural. The garment leads.',
    palette: ['#0A3A2E', '#F2EFE8', '#7A6657', '#46F3A8'],
    signatures: ['Sculptural coat', 'Silk trouser', 'Statement boot', 'Asymmetric knit', 'Architectural bag'],
    brands: ['Prada', 'Bottega Veneta', 'Loewe', 'Marni', 'Jacquemus', 'Saint Laurent', 'Jil Sander'],
  },
  'corporate-elite': {
    name: 'Corporate Elite',
    summary: 'Tailored, decisive. The boardroom listens before you speak.',
    palette: ['#1F2A4C', '#0E1311', '#F2EFE8', '#5A5F66'],
    signatures: ['Two-piece suit', 'Crisp shirt', 'Oxford', 'Silk tie', 'Topcoat'],
    brands: ['Brioni', 'Tom Ford', 'Zegna', 'Hugo Boss', 'Theory', 'Suitsupply', 'Thom Browne'],
  },
  'fitness-lifestyle': {
    name: 'Fitness Lifestyle',
    summary: 'Performance, recovery. Off-duty doesn\'t mean off-grid.',
    palette: ['#0E1311', '#F2EFE8', '#46524C', '#46F3A8'],
    signatures: ['Tech tee', 'Compression short', 'Running sneaker', 'Quarter-zip', 'Crew sock'],
    brands: ['Lululemon', 'Vuori', 'On', 'Nike', 'adidas', 'Alo Yoga', 'Hoka', 'Patagonia'],
  },
  'creative-founder': {
    name: 'Creative Founder',
    summary: 'Studio, off-duty. Smart from the waist up.',
    palette: ['#1A211E', '#F2EFE8', '#A89784', '#7A6657'],
    signatures: ['Cashmere knit', 'Selvedge jean', 'Suede chukka', 'Carryall', 'Field jacket'],
    brands: ['Todd Snyder', 'Aimé Leon Dore', 'A.P.C.', 'Drake\'s', 'Buck Mason', 'Faherty', 'J.Crew'],
  },
};

const ALIASES = {
  'old money': 'old-money', 'preppy': 'old-money', 'heritage': 'old-money',
  'quiet luxury': 'quiet-luxury', 'stealth wealth': 'quiet-luxury',
  'minimal': 'minimalist', 'clean': 'minimalist',
  'street': 'streetwear',
  'tech': 'techwear', 'gorpcore': 'techwear',
  'corporate': 'corporate-elite', 'business': 'corporate-elite', 'suit': 'corporate-elite',
  'fitness': 'fitness-lifestyle', 'athleisure': 'fitness-lifestyle',
  'creative': 'creative-founder', 'founder': 'creative-founder',
  'editorial': 'luxury-editorial', 'luxury': 'luxury-editorial', 'italian': 'luxury-editorial',
  'kpop': 'korean', 'k-pop': 'korean',
};

function normalize(input) {
  if (!input) return null;
  const k = input.toLowerCase().trim();
  if (AESTHETICS[k]) return k;
  if (ALIASES[k]) return ALIASES[k];
  // try partial matches
  for (const [alias, target] of Object.entries(ALIASES)) {
    if (k.includes(alias)) return target;
  }
  for (const key of Object.keys(AESTHETICS)) {
    if (k.includes(key) || key.includes(k)) return key;
  }
  return null;
}

export function listAesthetics() {
  return Object.entries(AESTHETICS).map(([key, a]) => ({
    key, name: a.name, summary: a.summary,
  }));
}

export function getAesthetic({ aesthetic }) {
  const key = normalize(aesthetic);
  if (!key) {
    throw new Error(
      `Unknown aesthetic: "${aesthetic}". Available: ${Object.keys(AESTHETICS).join(', ')}.`
    );
  }
  return { key, ...AESTHETICS[key] };
}
