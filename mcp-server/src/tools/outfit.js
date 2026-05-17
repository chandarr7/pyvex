/* Outfit recommendation — head-to-toe look for a given temp + condition. */

const CONDITION_ADDS = {
  Rain:         ['umbrella', 'waterproof boot'],
  Drizzle:      ['compact umbrella'],
  Thunderstorm: ['waterproof shell', 'umbrella'],
  Snow:         ['shearling lining', 'wool scarf'],
  Haze:         ['sunglasses'],
  Dust:         ['lightweight scarf'],
  Clear:        [],
};

export function recommendOutfit({ tempF, condition = 'Clear' }) {
  if (typeof tempF !== 'number' || Number.isNaN(tempF)) {
    throw new Error('tempF must be a number');
  }

  let band, headline, palette, pieces;

  if (tempF >= 85) {
    band = 'HOT'; headline = 'Linen, in motion.';
    palette = ['#F2EFE8', '#D9C9B3', '#A89784', '#7A6657'];
    pieces = [
      { slot: 'TOP',    item: 'Linen camp shirt',         note: 'unbuttoned, bone' },
      { slot: 'BOTTOM', item: 'Pleated linen trouser',    note: 'wide leg, soft drape' },
      { slot: 'FOOT',   item: 'Suede driving loafer',     note: 'no sock' },
      { slot: 'EXTRA',  item: 'Sunglasses, woven belt',   note: '' },
    ];
  } else if (tempF >= 70) {
    band = 'WARM'; headline = 'Soft tailoring.';
    palette = ['#A89784', '#7A6657', '#3F4A45', '#2C2825'];
    pieces = [
      { slot: 'TOP',    item: 'Fine merino tee',          note: 'storm grey' },
      { slot: 'OUTER',  item: 'Unstructured silk blazer', note: 'oversized' },
      { slot: 'BOTTOM', item: 'Pleated cotton trouser',   note: 'tapered ankle' },
      { slot: 'FOOT',   item: 'Suede penny loafer',       note: 'cognac' },
    ];
  } else if (tempF >= 55) {
    band = 'COOL'; headline = 'The trench answers.';
    palette = ['#3F4A45', '#1A211E', '#0F2820', '#46524C'];
    pieces = [
      { slot: 'OUTER',  item: 'Camel trench coat',        note: 'belted at waist' },
      { slot: 'TOP',    item: 'Merino turtleneck',        note: 'storm grey' },
      { slot: 'BOTTOM', item: 'Wide-leg wool trouser',    note: 'pleated, ankle-break' },
      { slot: 'FOOT',   item: 'Leather Chelsea boot',     note: 'black, polished' },
      { slot: 'EXTRA',  item: 'Silk scarf',               note: '' },
    ];
  } else if (tempF >= 40) {
    band = 'COLD'; headline = 'Cashmere armor.';
    palette = ['#1A211E', '#0A1410', '#2C2825', '#3F4A45'];
    pieces = [
      { slot: 'OUTER',  item: 'Long wool overcoat',       note: 'navy, double-breasted' },
      { slot: 'TOP',    item: 'Cashmere knit',            note: 'oat or bone' },
      { slot: 'BOTTOM', item: 'Heavy wool trouser',       note: 'pleated' },
      { slot: 'FOOT',   item: 'Leather lace boot',        note: 'cordovan' },
      { slot: 'EXTRA',  item: 'Fine leather glove, scarf',note: '' },
    ];
  } else if (tempF >= 25) {
    band = 'FREEZE'; headline = 'Heritage, layered.';
    palette = ['#0E1311', '#F2EFE8', '#46524C', '#2C2825'];
    pieces = [
      { slot: 'OUTER',  item: 'Shearling-collar overcoat',note: 'tobacco' },
      { slot: 'LAYER',  item: 'Cashmere zip-neck',        note: 'beneath' },
      { slot: 'BOTTOM', item: 'Lined wool trouser',       note: 'flannel' },
      { slot: 'FOOT',   item: 'Insulated leather boot',   note: 'commando sole' },
      { slot: 'EXTRA',  item: 'Wool felt hat, cashmere scarf', note: '' },
    ];
  } else {
    band = 'SUBZERO'; headline = 'Architectural warmth.';
    palette = ['#0E1311', '#F2EFE8', '#A89784', '#46524C'];
    pieces = [
      { slot: 'OUTER',  item: 'Long down parka',          note: 'arctic-grade' },
      { slot: 'LAYER',  item: 'Merino base + cashmere',   note: 'double layered' },
      { slot: 'BOTTOM', item: 'Insulated trouser',        note: 'wool-lined' },
      { slot: 'FOOT',   item: 'Shearling-lined boot',     note: 'rubber sole' },
      { slot: 'EXTRA',  item: 'Wool balaclava, gloves',   note: '' },
    ];
  }

  const adds = CONDITION_ADDS[condition] || [];
  if (adds.length) {
    const extra = pieces.find(p => p.slot === 'EXTRA');
    if (extra) {
      extra.item = (extra.item ? extra.item + ', ' : '') + adds.join(', ');
    } else {
      pieces.push({ slot: 'EXTRA', item: adds.join(', '), note: '' });
    }
  }

  return { band, headline, palette, pieces, tempF, condition };
}
