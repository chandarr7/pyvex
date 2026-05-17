/* PYVEX — Wardrobe.
 *
 * Three modes in one page:
 *  1. ADD — type or upload a photo; AI classifies the item into our schema
 *  2. WARDROBE — grid of every piece, filterable
 *  3. GENERATE — AI builds ranked outfits + flags missing essentials
 *
 * Persistence: localStorage. State survives refresh.
 */

const STORAGE = 'aura.wardrobe.v1';

const CATEGORIES = ['top', 'bottom', 'shoes', 'outerwear', 'accessory'];
const CATEGORY_LABELS = {
  top: 'Tops', bottom: 'Bottoms', shoes: 'Shoes', outerwear: 'Outerwear', accessory: 'Accessories'
};
const TONE_BY_CATEGORY = { top: 'bone', bottom: 'smoke', shoes: 'jade', outerwear: 'emerald', accessory: 'bone' };

const OCCASIONS = ['Everyday', 'College', 'Smart Casual', 'Date', 'Gym / Street', 'Minimalist'];
const WEATHERS  = ['Mild', 'Hot', 'Cool', 'Cold', 'Rain'];

// ─── persistence ────────────────────────────────────────────────────
const load = () => { try { return JSON.parse(localStorage.getItem(STORAGE) || '{}'); } catch { return {}; } };
const save = (patch) => {
  const cur = load();
  const next = { ...cur, ...patch };
  localStorage.setItem(STORAGE, JSON.stringify(next));
  return next;
};

// ─── seed items so the page never feels empty on first visit ─────────
const SEED = [
  { id: '1', name: 'White cotton oxford',     category: 'top',       subcategory: 'oxford shirt',  color: 'white',       fit: 'relaxed',  styleType: 'smart casual', material: 'cotton',    seasons: ['Spring','Summer','Fall'], pattern: 'solid' },
  { id: '2', name: 'Storm grey merino tee',   category: 'top',       subcategory: 't-shirt',       color: 'storm grey',  fit: 'slim',     styleType: 'minimal',      material: 'merino',    seasons: ['All'],                    pattern: 'solid' },
  { id: '3', name: 'Black oversized hoodie',  category: 'top',       subcategory: 'hoodie',        color: 'black',       fit: 'oversized',styleType: 'streetwear',   material: 'cotton',    seasons: ['Fall','Winter'],          pattern: 'solid' },
  { id: '4', name: 'Wide-leg wool trouser',   category: 'bottom',    subcategory: 'trouser',       color: 'charcoal',    fit: 'relaxed',  styleType: 'smart casual', material: 'wool',      seasons: ['Fall','Winter'],          pattern: 'solid' },
  { id: '5', name: 'Selvedge raw denim',      category: 'bottom',    subcategory: 'jean',          color: 'indigo',      fit: 'slim',     styleType: 'casual',       material: 'denim',     seasons: ['All'],                    pattern: 'solid' },
  { id: '6', name: 'Black tapered cargo',     category: 'bottom',    subcategory: 'cargo',         color: 'black',       fit: 'relaxed',  styleType: 'streetwear',   material: 'cotton',    seasons: ['All'],                    pattern: 'solid' },
  { id: '7', name: 'White leather sneaker',   category: 'shoes',     subcategory: 'sneaker',       color: 'white',       fit: 'standard', styleType: 'minimal',      material: 'leather',   seasons: ['Spring','Summer','Fall'], pattern: 'solid' },
  { id: '8', name: 'Black Chelsea boot',      category: 'shoes',     subcategory: 'boot',          color: 'black',       fit: 'standard', styleType: 'smart casual', material: 'leather',   seasons: ['Fall','Winter'],          pattern: 'solid' },
  { id: '9', name: 'Camel trench coat',       category: 'outerwear', subcategory: 'trench',        color: 'camel',       fit: 'relaxed',  styleType: 'smart casual', material: 'cotton',    seasons: ['Spring','Fall'],          pattern: 'solid' },
  { id: '10', name: 'Navy wool overcoat',     category: 'outerwear', subcategory: 'overcoat',      color: 'navy',        fit: 'relaxed',  styleType: 'smart casual', material: 'wool',      seasons: ['Winter'],                 pattern: 'solid' },
  { id: '11', name: 'Black leather belt',     category: 'accessory', subcategory: 'belt',          color: 'black',       fit: 'standard', styleType: 'smart casual', material: 'leather',   seasons: ['All'],                    pattern: 'solid' },
  { id: '12', name: 'Silver tank watch',      category: 'accessory', subcategory: 'watch',         color: 'silver',      fit: 'standard', styleType: 'smart casual', material: 'metal',     seasons: ['All'],                    pattern: 'solid' },
];

// ─── Claude prompts ─────────────────────────────────────────────────
const CLASSIFY_PROMPT = (text) => `You are PYVEX, an AI fashion stylist with editorial taste. Classify the clothing item described below into a STRICT JSON object — no commentary, no markdown fences.

Item: "${text}"

Return exactly this shape:
{
  "name": "<2-5 word descriptive name>",
  "category": "<top | bottom | shoes | outerwear | accessory>",
  "subcategory": "<specific type, e.g. 'hoodie', 'cargo pants', 'sneaker', 'blazer'>",
  "color": "<primary color, lowercase>",
  "fit": "<oversized | relaxed | slim | athletic | standard>",
  "styleType": "<streetwear | casual | formal | smart casual | sporty | minimal>",
  "material": "<best guess, lowercase>",
  "seasons": ["<one or more of: Spring, Summer, Fall, Winter, All>"],
  "pattern": "<solid | striped | plaid | graphic | textured | other>"
}`;

const GENERATE_PROMPT = (items, occasion, weather) => `You are PYVEX, an elite AI wardrobe stylist and outfit recommendation engine.

WARDROBE (${items.length} items):
${JSON.stringify(items, null, 2)}

CONSTRAINTS:
- Occasion: ${occasion}
- Weather: ${weather}

YOUR JOB:
1. Generate 6–8 outfit combinations using ONLY items from the wardrobe above. Each outfit must reference real items by their "id".
2. Rules: color coordination, style consistency, weather appropriateness, no clashing fits/patterns, maximize wardrobe reuse, balance safe + bold options.
3. Rank the top 5 outfits.
4. Pick the single BEST overall outfit.
5. Identify missing wardrobe essentials, redundant items, and high-value pieces.

Return STRICT JSON — no commentary, no markdown fences:
{
  "summary": "<one sentence describing the wardrobe's overall direction, 18 words max>",
  "outfits": [
    {
      "id": "outfit_1",
      "title": "<2-4 word editorial outfit name>",
      "itemIds": ["<ids of items used>"],
      "styleExplanation": "<one sentence on why this combination works, editorial tone, 20 words max>",
      "occasionFit": "<one or two occasions this works for>",
      "styleScore": <integer 1-10>,
      "confidence": <integer 1-100>,
      "whyItWorks": "<10-15 words on the specific reason>"
    }
  ],
  "topFiveIds": ["<outfit ids of the top 5, ordered>"],
  "topFiveReason": "<one sentence explaining what unifies the top 5, 20 words max>",
  "bestOverallId": "<single outfit id>",
  "bestOverallReason": "<one sentence on why this is the standout, 20 words max>",
  "missingEssentials": ["<3-5 specific items the wardrobe lacks>"],
  "redundantItems": ["<item ids that overlap heavily with others — empty array if none>"],
  "highValueItems": ["<2-4 item ids that unlock the most combinations>"]
}`;

// ─── small UI atoms ─────────────────────────────────────────────────
const Eyebrow = ({ children }) => (
  <span style={{
    fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 500,
    letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--fg-2)',
    display: 'inline-flex', alignItems: 'center', gap: 10,
  }}>
    <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--accent)', boxShadow: '0 0 12px rgba(70,243,168,0.7)' }}/>
    {children}
  </span>
);

const Stat = ({ value, label }) => (
  <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: 14 }}>
    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 300, fontSize: 22, color: 'var(--fg-1)' }}>{value}</div>
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 2 }}>{label}</div>
  </div>
);

const Chip = ({ label, selected, onClick }) => (
  <button onClick={onClick} style={{
    fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 500,
    padding: '7px 14px', borderRadius: 999,
    background: selected ? 'var(--accent)' : 'transparent',
    color: selected ? 'var(--obsidian)' : 'var(--fg-2)',
    border: `1px solid ${selected ? 'var(--accent)' : 'var(--border-strong)'}`,
    cursor: 'pointer', transition: 'all 200ms cubic-bezier(0.2,0.8,0.2,1)',
    boxShadow: selected ? '0 0 24px rgba(70,243,168,0.3)' : 'none',
  }}>{label}</button>
);

// ─── Add-item panel ─────────────────────────────────────────────────
const AddItem = ({ onAdd }) => {
  const [mode, setMode] = React.useState('describe');
  const [text, setText] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');
  const [photoUrl, setPhotoUrl] = React.useState(null);
  const [photoHint, setPhotoHint] = React.useState('');
  const fileRef = React.useRef(null);

  const classify = async () => {
    setError('');
    const desc = mode === 'describe' ? text.trim() : photoHint.trim();
    if (!desc) { setError('Describe the piece or add a hint for the photo.'); return; }
    try {
      setBusy(true);
      const raw = await window.claude.complete(CLASSIFY_PROMPT(desc));
      const json = raw.replace(/^```json\s*|\s*```$/g, '').trim();
      const parsed = JSON.parse(json);
      onAdd({ id: String(Date.now()), photoUrl: mode === 'upload' ? photoUrl : null, ...parsed });
      setText(''); setPhotoUrl(null); setPhotoHint('');
    } catch (e) {
      console.error(e);
      setError('AI didn\u2019t return clean data. Try a more specific description.');
    } finally { setBusy(false); }
  };

  const onFile = (file) => {
    if (!file) return;
    const fr = new FileReader();
    fr.onload = () => setPhotoUrl(fr.result);
    fr.readAsDataURL(file);
  };

  return (
    <div style={{
      background: 'var(--bg-elev-1)', border: '1px solid var(--border)',
      borderRadius: 20, padding: 28,
      boxShadow: 'inset 0 1px 0 rgba(242,239,232,0.06)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 22, color: 'var(--fg-1)' }}>Add to closet</div>
        <div style={{ display: 'inline-flex', padding: 3, gap: 3, background: 'var(--bg-elev-2)', border: '1px solid var(--border)', borderRadius: 999 }}>
          {[{k:'describe',l:'Describe'},{k:'upload',l:'Upload'}].map(t => (
            <button key={t.k} onClick={() => setMode(t.k)} style={{
              fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 500,
              padding: '5px 14px', borderRadius: 999,
              background: mode === t.k ? 'var(--accent)' : 'transparent',
              color: mode === t.k ? 'var(--obsidian)' : 'var(--fg-2)',
              border: 'none', cursor: 'pointer',
            }}>{t.l}</button>
          ))}
        </div>
      </div>

      {mode === 'describe' ? (
        <textarea
          value={text} onChange={e => setText(e.target.value)}
          placeholder="e.g. Black oversized hoodie, washed cotton, drop shoulder"
          rows={3}
          style={{
            width: '100%', background: 'transparent', border: 'none',
            borderBottom: '1px solid var(--border-strong)',
            color: 'var(--fg-1)', fontFamily: 'var(--font-ui)', fontSize: 15,
            padding: '8px 0', outline: 'none', resize: 'none', boxSizing: 'border-box',
          }}
        />
      ) : (
        <div>
          <div
            onClick={() => fileRef.current && fileRef.current.click()}
            onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = 'rgba(70,243,168,0.5)'; }}
            onDragLeave={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
            onDrop={e => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--border-strong)'; onFile(e.dataTransfer.files && e.dataTransfer.files[0]); }}
            style={{
              border: '1px dashed var(--border-strong)', borderRadius: 14,
              padding: photoUrl ? 0 : 24, aspectRatio: photoUrl ? 'auto' : '4 / 2',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'border-color 300ms', overflow: 'hidden',
              background: photoUrl ? 'transparent' : 'rgba(242,239,232,0.02)',
            }}
          >
            {photoUrl
              ? <img src={photoUrl} alt="" style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 12 }}/>
              : (
                <div style={{ textAlign: 'center', color: 'var(--fg-2)' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 18, color: 'var(--fg-1)' }}>Drop a photo</div>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)', marginTop: 4 }}>or click to upload</div>
                </div>
              )
            }
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => onFile(e.target.files && e.target.files[0])}/>
          <input
            value={photoHint} onChange={e => setPhotoHint(e.target.value)}
            placeholder="A quick hint — what is it?"
            style={{
              width: '100%', marginTop: 14, background: 'transparent', border: 'none',
              borderBottom: '1px solid var(--border-strong)',
              color: 'var(--fg-1)', fontFamily: 'var(--font-ui)', fontSize: 14,
              padding: '8px 0', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 18 }}>
        <button onClick={classify} disabled={busy} className="btn-primary" style={{ padding: '12px 22px', fontSize: 14, opacity: busy ? 0.6 : 1 }}>
          {busy ? 'Classifying' : 'Classify & add'}
        </button>
        {error && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#ff7a7a' }}>{error}</span>}
        {busy && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--fg-3)' }}>PYVEX IS READING</span>}
      </div>
    </div>
  );
};

// ─── Item tile ──────────────────────────────────────────────────────
const ItemTile = ({ item, onRemove, highlight, dim }) => (
  <div style={{
    position: 'relative', borderRadius: 14, overflow: 'hidden',
    aspectRatio: '3 / 4',
    border: `1px solid ${highlight ? 'rgba(70,243,168,0.5)' : 'var(--border)'}`,
    boxShadow: highlight ? '0 0 40px -10px rgba(70,243,168,0.5)' : 'inset 0 1px 0 rgba(242,239,232,0.06)',
    opacity: dim ? 0.35 : 1,
    transition: 'all 400ms cubic-bezier(0.2,0.8,0.2,1)',
  }}>
    {item.photoUrl
      ? <img src={item.photoUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
      : <Portrait tone={TONE_BY_CATEGORY[item.category] || 'smoke'} aspectRatio="3 / 4" label="" style={{ borderRadius: 0, height: '100%' }}/>
    }
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 30%, rgba(5,7,7,0.85))', pointerEvents: 'none' }}/>
    {onRemove && (
      <button onClick={() => onRemove(item.id)} style={{
        position: 'absolute', top: 8, right: 8, width: 26, height: 26, borderRadius: 999,
        background: 'rgba(5,7,7,0.7)', backdropFilter: 'blur(8px)',
        border: '1px solid rgba(242,239,232,0.2)', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-1)',
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    )}
    <div style={{ position: 'absolute', left: 10, right: 10, bottom: 10 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', color: 'var(--accent)', marginBottom: 4, textTransform: 'uppercase' }}>· {item.category}</div>
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500, color: 'var(--fg-1)', lineHeight: 1.2 }}>{item.name}</div>
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-2)', marginTop: 2 }}>{item.color} · {item.fit}</div>
    </div>
  </div>
);

// ─── Outfit card ────────────────────────────────────────────────────
const OutfitCard = ({ outfit, items, rank, isBest }) => {
  const used = outfit.itemIds.map(id => items.find(i => i.id === id)).filter(Boolean);
  return (
    <div style={{
      position: 'relative',
      background: isBest
        ? 'linear-gradient(180deg, rgba(70,243,168,0.06) 0%, var(--bg-elev-1) 60%)'
        : 'var(--bg-elev-1)',
      border: `1px solid ${isBest ? 'rgba(70,243,168,0.4)' : 'var(--border)'}`,
      borderRadius: 20, padding: 20, overflow: 'hidden',
      boxShadow: isBest
        ? 'inset 0 1px 0 rgba(70,243,168,0.2), 0 0 60px -10px rgba(70,243,168,0.3)'
        : 'inset 0 1px 0 rgba(242,239,232,0.06)',
      display: 'flex', flexDirection: 'column', gap: 14,
    }}>
      {isBest && (
        <div style={{
          position: 'absolute', right: -30, top: -30, width: 140, height: 140, borderRadius: '50%',
          background: 'radial-gradient(closest-side, rgba(70,243,168,0.3), transparent 70%)',
          filter: 'blur(30px)', pointerEvents: 'none',
        }}/>
      )}
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          {rank && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', color: 'var(--accent)' }}>0{rank}</span>}
          <h3 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 22, color: 'var(--fg-1)', margin: 0, letterSpacing: '-0.01em' }}>{outfit.title}</h3>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 20, color: isBest ? 'var(--accent)' : 'var(--fg-1)', fontWeight: 300 }}>{outfit.styleScore}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.15em' }}>/10</span>
        </div>
      </div>
      {/* item thumbnails */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(used.length, 5)}, 1fr)`, gap: 6, position: 'relative' }}>
        {used.map(it => (
          <div key={it.id} style={{
            aspectRatio: '3/4', borderRadius: 10, overflow: 'hidden',
            border: '1px solid var(--border)',
          }}>
            {it.photoUrl
              ? <img src={it.photoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              : <Portrait tone={TONE_BY_CATEGORY[it.category] || 'smoke'} aspectRatio="3/4" label="" style={{ borderRadius: 0, height: '100%' }}/>}
          </div>
        ))}
      </div>
      <div style={{ position: 'relative' }}>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, lineHeight: 1.45, color: 'var(--fg-1)', margin: 0 }}>{outfit.styleExplanation}</p>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)', marginTop: 8, lineHeight: 1.4 }}>
          {used.map(it => it.name).join(' · ')}
        </div>
      </div>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--fg-3)', textTransform: 'uppercase' }}>{outfit.occasionFit}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-2)' }}>CONFIDENCE {outfit.confidence}</span>
      </div>
    </div>
  );
};

// ─── ROOT ───────────────────────────────────────────────────────────
const Wardrobe = () => {
  const initial = load();
  const [items, setItems]         = React.useState(initial.items && initial.items.length ? initial.items : SEED);
  const [filter, setFilter]       = React.useState('all');
  const [occasion, setOccasion]   = React.useState('Everyday');
  const [weather, setWeather]     = React.useState('Mild');
  const [generating, setGenerating] = React.useState(false);
  const [results, setResults]     = React.useState(initial.results || null);
  const [error, setError]         = React.useState('');

  React.useEffect(() => { save({ items }); }, [items]);
  React.useEffect(() => { save({ results }); }, [results]);

  const addItem = (it) => setItems(prev => [it, ...prev]);
  const removeItem = (id) => setItems(prev => prev.filter(x => x.id !== id));

  const filteredItems = filter === 'all' ? items : items.filter(i => i.category === filter);

  const counts = React.useMemo(() => {
    const c = { top: 0, bottom: 0, shoes: 0, outerwear: 0, accessory: 0 };
    items.forEach(i => { if (c[i.category] !== undefined) c[i.category]++; });
    return c;
  }, [items]);

  const generate = async () => {
    setError('');
    if (items.length < 4) { setError('Add at least 4 items to generate outfits.'); return; }
    try {
      setGenerating(true);
      const slim = items.map(({ photoUrl, ...rest }) => rest); // strip photo data URIs
      const raw = await window.claude.complete(GENERATE_PROMPT(slim, occasion, weather));
      const json = raw.replace(/^```json\s*|\s*```$/g, '').trim();
      const parsed = JSON.parse(json);
      setResults(parsed);
      setTimeout(() => document.getElementById('results-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
    } catch (e) {
      console.error(e);
      setError('AI returned a response we couldn\u2019t parse. Try again.');
    } finally { setGenerating(false); }
  };

  const best = results && results.outfits && results.outfits.find(o => o.id === results.bestOverallId);
  const topFive = results && results.topFiveIds && results.topFiveIds
    .map(id => results.outfits.find(o => o.id === id)).filter(Boolean);
  const others = results && results.outfits
    && results.outfits.filter(o => !results.topFiveIds.includes(o.id));

  return (
    <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
      <Background />

      <section className="section" style={{ paddingTop: 'clamp(64px, 8vw, 96px)', paddingBottom: 'clamp(40px, 6vw, 64px)' }}>
        <div className="container">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap', marginBottom: 40 }}>
            <div>
              <Eyebrow>· YOUR CLOSET</Eyebrow>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontWeight: 300,
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                lineHeight: 1.04, letterSpacing: '-0.02em',
                margin: '20px 0 0', color: 'var(--fg-1)',
              }}>
                Your <em style={{ fontStyle: 'italic' }}>wardrobe</em>, intelligent.
              </h1>
            </div>
            <div style={{ display: 'flex', gap: 24 }}>
              <Stat value={items.length} label="PIECES"/>
              <Stat value={counts.top} label="TOPS"/>
              <Stat value={counts.bottom} label="BOTTOMS"/>
              <Stat value={counts.shoes} label="SHOES"/>
              <Stat value={counts.outerwear + counts.accessory} label="LAYERS"/>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24, alignItems: 'start' }}>
            {/* LEFT — add item + generate panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 32 }}>
              <AddItem onAdd={addItem}/>

              {/* Generate panel */}
              <div style={{ background: 'var(--bg-elev-1)', border: '1px solid var(--border)', borderRadius: 20, padding: 28, boxShadow: 'inset 0 1px 0 rgba(242,239,232,0.06)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 22, color: 'var(--fg-1)', marginBottom: 16 }}>Generate outfits</div>

                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 10 }}>OCCASION</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                  {OCCASIONS.map(o => <Chip key={o} label={o} selected={occasion === o} onClick={() => setOccasion(o)}/>)}
                </div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 10 }}>WEATHER</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                  {WEATHERS.map(w => <Chip key={w} label={w} selected={weather === w} onClick={() => setWeather(w)}/>)}
                </div>
                <button
                  className="btn-primary"
                  onClick={generate}
                  disabled={generating || items.length < 4}
                  style={{ width: '100%', padding: '14px 20px', fontSize: 14, opacity: (generating || items.length < 4) ? 0.5 : 1 }}
                >
                  {generating ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ display: 'flex', gap: 3 }}>
                        <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--obsidian)', animation: 'pulse-soft 1.2s ease-in-out infinite' }}/>
                        <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--obsidian)', animation: 'pulse-soft 1.2s ease-in-out infinite 0.2s' }}/>
                        <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--obsidian)', animation: 'pulse-soft 1.2s ease-in-out infinite 0.4s' }}/>
                      </span>
                      Generating
                    </span>
                  ) : 'Generate outfits'}
                </button>
                {error && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#ff7a7a', marginTop: 10 }}>{error}</div>}
                {items.length < 4 && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--fg-3)', marginTop: 10 }}>ADD {4 - items.length} MORE TO UNLOCK</div>}
              </div>
            </div>

            {/* RIGHT — wardrobe grid */}
            <div>
              {/* category filter */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
                <Chip label={`All · ${items.length}`} selected={filter === 'all'} onClick={() => setFilter('all')}/>
                {CATEGORIES.map(c => counts[c] > 0 && (
                  <Chip key={c} label={`${CATEGORY_LABELS[c]} · ${counts[c]}`} selected={filter === c} onClick={() => setFilter(c)}/>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {filteredItems.map(it => (
                  <ItemTile key={it.id} item={it} onRemove={removeItem}
                    highlight={results && results.highValueItems && results.highValueItems.includes(it.id)}
                    dim={results && results.redundantItems && results.redundantItems.includes(it.id)}
                  />
                ))}
                {filteredItems.length === 0 && (
                  <div style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center', color: 'var(--fg-3)', fontFamily: 'var(--font-ui)', fontSize: 14, border: '1px dashed var(--border-strong)', borderRadius: 16 }}>
                    Nothing in this category yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RESULTS ────────────────────────────────────────────────── */}
      {results && (
        <section id="results-anchor" className="section" style={{ paddingTop: 'clamp(48px, 8vw, 96px)', paddingBottom: 'clamp(64px, 10vw, 128px)' }}>
          <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>

            {/* WARDROBE SUMMARY */}
            <div>
              <Eyebrow>· WARDROBE SUMMARY</Eyebrow>
              <p style={{
                fontFamily: 'var(--font-display)', fontWeight: 400, fontStyle: 'italic',
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1.2,
                color: 'var(--fg-1)', margin: '20px 0 0', maxWidth: 720, letterSpacing: '-0.01em',
              }}>&ldquo;{results.summary}&rdquo;</p>
            </div>

            {/* BEST OVERALL */}
            {best && (
              <div>
                <Eyebrow>· BEST OVERALL LOOK</Eyebrow>
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, marginTop: 24, alignItems: 'start' }}>
                  <OutfitCard outfit={best} items={items} isBest/>
                  <div>
                    <h3 style={{
                      fontFamily: 'var(--font-display)', fontWeight: 300,
                      fontSize: 'clamp(2rem, 3.5vw, 2.5rem)', lineHeight: 1.1, letterSpacing: '-0.02em',
                      color: 'var(--fg-1)', margin: '0 0 16px',
                    }}>The one to <em style={{ fontStyle: 'italic' }}>wear</em>.</h3>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: 15, lineHeight: 1.55, color: 'var(--fg-2)', margin: 0 }}>{results.bestOverallReason}</p>
                  </div>
                </div>
              </div>
            )}

            {/* TOP 5 */}
            {topFive && topFive.length > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20, gap: 24, flexWrap: 'wrap' }}>
                  <div>
                    <Eyebrow>· TOP 5</Eyebrow>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.05, letterSpacing: '-0.02em', color: 'var(--fg-1)', margin: '16px 0 0' }}>The standouts.</h2>
                  </div>
                  {results.topFiveReason && (
                    <p style={{ maxWidth: 380, fontFamily: 'var(--font-ui)', fontSize: 14, lineHeight: 1.5, color: 'var(--fg-2)', margin: 0 }}>{results.topFiveReason}</p>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  {topFive.map((o, i) => <OutfitCard key={o.id} outfit={o} items={items} rank={i+1}/>)}
                </div>
              </div>
            )}

            {/* OTHER OUTFITS */}
            {others && others.length > 0 && (
              <div>
                <Eyebrow>· ALSO GENERATED</Eyebrow>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 20 }}>
                  {others.map(o => <OutfitCard key={o.id} outfit={o} items={items}/>)}
                </div>
              </div>
            )}

            {/* RECOMMENDATIONS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* Missing essentials */}
              <div className="card-editorial" style={{ padding: 28 }}>
                <Eyebrow>· MISSING ESSENTIALS</Eyebrow>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 22, color: 'var(--fg-1)', margin: '16px 0 14px', letterSpacing: '-0.01em' }}>Add these to unlock more.</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(results.missingEssentials || []).map((m, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 12, fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--fg-1)' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.18em' }}>0{i+1}</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* High value pieces */}
              <div className="card-editorial" style={{ padding: 28 }}>
                <Eyebrow>· HIGH-VALUE PIECES</Eyebrow>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 22, color: 'var(--fg-1)', margin: '16px 0 14px', letterSpacing: '-0.01em' }}>These unlock the most.</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {(results.highValueItems || []).map(id => {
                    const it = items.find(x => x.id === id);
                    if (!it) return null;
                    return (
                      <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', borderRadius: 999, background: 'rgba(70,243,168,0.08)', border: '1px solid rgba(70,243,168,0.3)' }}>
                        <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }}/>
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-1)' }}>{it.name}</span>
                      </div>
                    );
                  })}
                </div>
                {results.redundantItems && results.redundantItems.length > 0 && (
                  <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--fg-3)', textTransform: 'uppercase', marginBottom: 10 }}>· REDUNDANT</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {results.redundantItems.map(id => {
                        const it = items.find(x => x.id === id);
                        if (!it) return null;
                        return (
                          <span key={id} style={{ fontFamily: 'var(--font-ui)', fontSize: 12, padding: '5px 10px', borderRadius: 999, color: 'var(--fg-3)', border: '1px solid var(--border)' }}>{it.name}</span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

Object.assign(window, { Wardrobe });
