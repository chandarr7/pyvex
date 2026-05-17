/* PYVEX — Shop.
 *
 * Workflow:
 *   1. User pastes a product link, types a description, or uploads a screenshot.
 *   2. Claude analyzes the item against the current wardrobe and returns:
 *      - classification (category, color, style, fit, material, brand if visible)
 *      - AURA score, versatility, cost-per-wear, worth-buying verdict
 *      - Matching wardrobe items by id
 *      - Why it works / why it doesn't
 *   3. User can add to Cart, Wishlist, or push into the Wardrobe.
 *
 * State shared with Wardrobe.jsx via localStorage key "aura.wardrobe.v1".
 */

const WARDROBE_KEY = 'aura.wardrobe.v1';
const SHOP_KEY     = 'aura.shop.v1';

const TONE_BY_CATEGORY = { top: 'bone', bottom: 'smoke', shoes: 'jade', outerwear: 'emerald', accessory: 'bone', bag: 'smoke', watch: 'jade', hat: 'bone' };

// ─── storage ────────────────────────────────────────────────────────
const loadWardrobe = () => { try { return JSON.parse(localStorage.getItem(WARDROBE_KEY) || '{}'); } catch { return {}; } };
const loadShop     = () => { try { return JSON.parse(localStorage.getItem(SHOP_KEY) || '{}'); } catch { return {}; } };
const saveShop     = (patch) => {
  const cur = loadShop(); const next = { ...cur, ...patch };
  localStorage.setItem(SHOP_KEY, JSON.stringify(next));
  return next;
};
const saveWardrobeItems = (items) => {
  const cur = loadWardrobe(); const next = { ...cur, items };
  localStorage.setItem(WARDROBE_KEY, JSON.stringify(next));
  return next;
};

// ─── seed sample analyzed products so first visit isn't empty ──────
const SEED_PRODUCTS = [
  {
    id: 'p1', name: 'Black wool overcoat',  brand: 'COS', price: 290, currency: 'USD',
    category: 'outerwear', color: 'black', styleType: 'minimal', fit: 'oversized', material: 'wool',
    auraScore: 9, versatility: 18, costPerWear: 4.20, verdict: 'BUY',
    whyItWorks: 'Anchors every cool-weather outfit you own. Sits flawlessly over the merino tee and wide-leg wool.',
    matchingIds: ['2', '4', '5', '8'],
  },
  {
    id: 'p2', name: 'Cream cashmere knit',  brand: 'Uniqlo C', price: 110, currency: 'USD',
    category: 'top', color: 'cream', styleType: 'quiet luxury', fit: 'relaxed', material: 'cashmere',
    auraScore: 8, versatility: 14, costPerWear: 3.10, verdict: 'BUY',
    whyItWorks: 'Bridges your storm-grey tee and the camel trench. Quiet luxury done correctly.',
    matchingIds: ['4', '5', '9', '11'],
  },
  {
    id: 'p3', name: 'Suede driving loafer', brand: 'Aimé Leon Dore', price: 480, currency: 'USD',
    category: 'shoes', color: 'cognac', styleType: 'smart casual', fit: 'standard', material: 'suede',
    auraScore: 7, versatility: 9, costPerWear: 8.40, verdict: 'CONSIDER',
    whyItWorks: 'Beautiful piece, but you already own the Chelsea boot and white sneaker. Wait for an off-season sale.',
    matchingIds: ['4', '11'],
  },
];

// ─── prompts ────────────────────────────────────────────────────────
const ANALYZE_PROMPT = (input, wardrobe) => `You are PYVEX, an elite AI fashion stylist and shopping advisor.

A user is considering buying this product:
"""
${input}
"""

Their current wardrobe (${wardrobe.length} pieces):
${JSON.stringify(wardrobe.map(({photoUrl, ...rest}) => rest), null, 2)}

Analyze the product against their existing closet. Return STRICT JSON — no markdown fences, no commentary:
{
  "name":        "<2-4 word descriptive product name>",
  "brand":       "<brand if mentioned/visible, else 'Unknown'>",
  "price":       <number in user's apparent currency, or estimated if not stated>,
  "currency":    "USD",
  "category":    "<top | bottom | shoes | outerwear | accessory | bag | watch | hat>",
  "color":       "<primary color, lowercase>",
  "styleType":   "<streetwear | casual | formal | smart casual | sporty | minimal | quiet luxury>",
  "fit":         "<oversized | relaxed | slim | athletic | standard>",
  "material":    "<best guess>",
  "auraScore":   <integer 1-10: how well it fits this wardrobe's direction>,
  "versatility": <integer 1-30: estimated number of new outfit combinations it unlocks>,
  "costPerWear": <number: estimated price ÷ projected wears, 2 decimals>,
  "verdict":     "<BUY | CONSIDER | SKIP>",
  "whyItWorks":  "<one editorial sentence on the rationale, 18-25 words>",
  "matchingIds": ["<ids of wardrobe items it pairs best with — up to 5>"]
}`;

// ─── UI atoms ───────────────────────────────────────────────────────
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
  }}>{label}</button>
);

const VERDICT_COLOR = { BUY: 'var(--accent)', CONSIDER: 'var(--aura-gold)', SKIP: '#ff7a7a' };
const VerdictBadge = ({ v }) => (
  <span style={{
    fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.22em',
    padding: '4px 10px', borderRadius: 999,
    color: VERDICT_COLOR[v] || 'var(--fg-2)',
    border: `1px solid ${VERDICT_COLOR[v]}40`,
    background: `${VERDICT_COLOR[v]}1A`,
  }}>{v}</span>
);

// ─── Add-product panel ──────────────────────────────────────────────
const AddProduct = ({ onAnalyze, wardrobe }) => {
  const [mode, setMode] = React.useState('describe');
  const [url, setUrl] = React.useState('');
  const [text, setText] = React.useState('');
  const [photoUrl, setPhotoUrl] = React.useState(null);
  const [photoHint, setPhotoHint] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');
  const fileRef = React.useRef(null);

  const onFile = (file) => {
    if (!file) return;
    const fr = new FileReader();
    fr.onload = () => setPhotoUrl(fr.result);
    fr.readAsDataURL(file);
  };

  const analyze = async () => {
    setError('');
    let input = '';
    if (mode === 'link') {
      if (!url.trim()) { setError('Paste a product URL.'); return; }
      input = `Product link: ${url.trim()}` + (text.trim() ? `\nUser note: ${text.trim()}` : '');
    } else if (mode === 'upload') {
      if (!photoUrl) { setError('Upload a screenshot first.'); return; }
      if (!photoHint.trim()) { setError('Add a hint — what is the product?'); return; }
      input = `Screenshot uploaded. User description: ${photoHint.trim()}`;
    } else {
      if (!text.trim()) { setError('Describe the product.'); return; }
      input = text.trim();
    }

    try {
      setBusy(true);
      const raw = await window.claude.complete(ANALYZE_PROMPT(input, wardrobe));
      const json = raw.replace(/^```json\s*|\s*```$/g, '').trim();
      const parsed = JSON.parse(json);
      onAnalyze({
        id: 'p' + Date.now(),
        photoUrl: mode === 'upload' ? photoUrl : null,
        sourceUrl: mode === 'link' ? url.trim() : null,
        ...parsed,
      });
      setUrl(''); setText(''); setPhotoUrl(null); setPhotoHint('');
    } catch (e) {
      console.error(e);
      setError('AURA didn\u2019t return clean data. Try a more specific description.');
    } finally { setBusy(false); }
  };

  const tabs = [
    { k: 'describe', l: 'Describe' },
    { k: 'link',     l: 'Paste link' },
    { k: 'upload',   l: 'Upload' },
  ];

  return (
    <div style={{ background: 'var(--bg-elev-1)', border: '1px solid var(--border)', borderRadius: 20, padding: 28, boxShadow: 'inset 0 1px 0 rgba(242,239,232,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, gap: 10, flexWrap: 'wrap' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 22, color: 'var(--fg-1)' }}>Analyze a piece</div>
        <div style={{ display: 'inline-flex', padding: 3, gap: 3, background: 'var(--bg-elev-2)', border: '1px solid var(--border)', borderRadius: 999 }}>
          {tabs.map(t => (
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

      {mode === 'describe' && (
        <textarea
          value={text} onChange={e => setText(e.target.value)}
          placeholder="e.g. Black wool overcoat from COS, $290, oversized"
          rows={3}
          style={{
            width: '100%', background: 'transparent', border: 'none',
            borderBottom: '1px solid var(--border-strong)',
            color: 'var(--fg-1)', fontFamily: 'var(--font-ui)', fontSize: 15,
            padding: '8px 0', outline: 'none', resize: 'none', boxSizing: 'border-box',
          }}
        />
      )}

      {mode === 'link' && (
        <>
          <input
            value={url} onChange={e => setUrl(e.target.value)}
            placeholder="https://store.example.com/product/..."
            style={{
              width: '100%', background: 'transparent', border: 'none',
              borderBottom: '1px solid var(--border-strong)',
              color: 'var(--fg-1)', fontFamily: 'var(--font-mono)', fontSize: 13,
              padding: '8px 0', outline: 'none', boxSizing: 'border-box',
            }}
          />
          <input
            value={text} onChange={e => setText(e.target.value)}
            placeholder="Optional context — what should AURA know?"
            style={{
              width: '100%', marginTop: 14, background: 'transparent', border: 'none',
              borderBottom: '1px solid var(--border-strong)',
              color: 'var(--fg-1)', fontFamily: 'var(--font-ui)', fontSize: 13,
              padding: '8px 0', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </>
      )}

      {mode === 'upload' && (
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
                  <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 18, color: 'var(--fg-1)' }}>Drop a screenshot</div>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)', marginTop: 4 }}>or click to upload</div>
                </div>
              )
            }
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => onFile(e.target.files && e.target.files[0])}/>
          <input
            value={photoHint} onChange={e => setPhotoHint(e.target.value)}
            placeholder="What is it? e.g. Brown leather chukka, Aldo, $130"
            style={{
              width: '100%', marginTop: 14, background: 'transparent', border: 'none',
              borderBottom: '1px solid var(--border-strong)',
              color: 'var(--fg-1)', fontFamily: 'var(--font-ui)', fontSize: 13,
              padding: '8px 0', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 18 }}>
        <button onClick={analyze} disabled={busy} className="btn-primary" style={{ padding: '12px 22px', fontSize: 14, opacity: busy ? 0.6 : 1 }}>
          {busy ? 'Analyzing' : 'Analyze with PYVEX'}
        </button>
        {error && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#ff7a7a' }}>{error}</span>}
        {busy && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--fg-3)' }}>READING THE WARDROBE</span>}
      </div>
      {wardrobe.length === 0 && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.15em', color: 'var(--fg-3)', marginTop: 14 }}>
          Tip: <a href="wardrobe.html" style={{ color: 'var(--accent)' }}>build your closet first</a> for sharper matching.
        </div>
      )}
    </div>
  );
};

// ─── Product card ───────────────────────────────────────────────────
const ProductCard = ({ product, wardrobe, inCart, inWishlist, inCloset, onCart, onWishlist, onCloset, onRemove }) => {
  const matched = (product.matchingIds || []).map(id => wardrobe.find(x => x.id === id)).filter(Boolean);
  return (
    <div style={{
      background: 'var(--bg-elev-1)', border: `1px solid ${product.verdict === 'BUY' ? 'rgba(70,243,168,0.30)' : 'var(--border)'}`,
      borderRadius: 20, padding: 24, position: 'relative', overflow: 'hidden',
      boxShadow: product.verdict === 'BUY' ? 'inset 0 1px 0 rgba(242,239,232,0.06), 0 0 40px -16px rgba(70,243,168,0.4)' : 'inset 0 1px 0 rgba(242,239,232,0.06)',
      display: 'flex', flexDirection: 'column', gap: 16,
    }}>
      {product.verdict === 'BUY' && (
        <div style={{ position: 'absolute', right: -30, top: -30, width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(70,243,168,0.22), transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }}/>
      )}

      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '120px 1fr', gap: 16 }}>
        {/* image */}
        <div style={{ borderRadius: 12, overflow: 'hidden', aspectRatio: '3/4', border: '1px solid var(--border)' }}>
          {product.photoUrl
            ? <img src={product.photoUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            : <Portrait tone={TONE_BY_CATEGORY[product.category] || 'smoke'} aspectRatio="3/4" label="" style={{ borderRadius: 0, height: '100%' }}/>}
        </div>
        {/* info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase' }}>· {product.brand}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 19, color: 'var(--fg-1)', lineHeight: 1.2, marginTop: 4, letterSpacing: '-0.01em' }}>{product.name}</div>
            </div>
            <VerdictBadge v={product.verdict}/>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, padding: '4px 9px', borderRadius: 999, color: 'var(--fg-2)', border: '1px solid var(--border)' }}>{product.category}</span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, padding: '4px 9px', borderRadius: 999, color: 'var(--fg-2)', border: '1px solid var(--border)' }}>{product.color}</span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, padding: '4px 9px', borderRadius: 999, color: 'var(--fg-2)', border: '1px solid var(--border)' }}>{product.fit}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-3)', letterSpacing: '0.18em' }}>AURA</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: 'var(--fg-1)', fontWeight: 300 }}>{product.auraScore}<span style={{ fontSize: 10, color: 'var(--fg-3)' }}>/10</span></div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-3)', letterSpacing: '0.18em' }}>UNLOCKS</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: 'var(--fg-1)', fontWeight: 300 }}>{product.versatility}<span style={{ fontSize: 10, color: 'var(--fg-3)' }}> fits</span></div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-3)', letterSpacing: '0.18em' }}>${product.price} · CPW</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: 'var(--fg-1)', fontWeight: 300 }}>${product.costPerWear?.toFixed ? product.costPerWear.toFixed(2) : product.costPerWear}</div>
            </div>
          </div>
        </div>
      </div>

      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, lineHeight: 1.5, color: 'var(--fg-1)', margin: 0 }}>{product.whyItWorks}</p>

      {matched.length > 0 && (
        <div style={{ paddingTop: 14, borderTop: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.18em', marginBottom: 8 }}>· PAIRS WITH</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {matched.map(m => (
              <span key={m.id} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontFamily: 'var(--font-ui)', fontSize: 12,
                padding: '6px 10px', borderRadius: 999,
                background: 'rgba(70,243,168,0.08)', color: 'var(--fg-1)',
                border: '1px solid rgba(70,243,168,0.25)',
              }}>
                <span style={{ width: 4, height: 4, borderRadius: 999, background: 'var(--accent)' }}/>
                {m.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', paddingTop: 14, borderTop: '1px solid var(--border)' }}>
        <button onClick={onCart} className={inCart ? 'btn-primary' : 'btn-ghost'} style={{ fontSize: 12, padding: '8px 14px' }}>
          {inCart ? 'In cart' : 'Add to cart'}
        </button>
        <button onClick={onWishlist} className="btn-ghost" style={{ fontSize: 12, padding: '8px 14px', borderColor: inWishlist ? 'var(--accent)' : undefined, color: inWishlist ? 'var(--accent)' : undefined }}>
          {inWishlist ? '✓ Wishlist' : 'Wishlist'}
        </button>
        <button onClick={onCloset} className="btn-ghost" style={{ fontSize: 12, padding: '8px 14px', borderColor: inCloset ? 'var(--accent)' : undefined, color: inCloset ? 'var(--accent)' : undefined }}>
          {inCloset ? '✓ In closet' : 'Add to closet'}
        </button>
        {product.sourceUrl && (
          <a href={product.sourceUrl} target="_blank" rel="noreferrer" style={{
            fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-2)',
            borderBottom: '1px solid var(--border-strong)', textDecoration: 'none', padding: '8px 4px',
          }}>Open source ↗</a>
        )}
        <button onClick={onRemove} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--fg-3)', fontFamily: 'var(--font-ui)', fontSize: 11, padding: '8px 4px' }}>Remove</button>
      </div>
    </div>
  );
};

// ─── small summary card for cart/wishlist tabs ──────────────────────
const ProductRow = ({ product, onRemove, onMove, moveLabel }) => (
  <div style={{
    display: 'grid', gridTemplateColumns: '60px 1fr auto auto', gap: 14, alignItems: 'center',
    padding: '14px 16px', background: 'var(--bg-elev-1)', border: '1px solid var(--border)',
    borderRadius: 14,
  }}>
    <div style={{ width: 60, height: 80, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
      {product.photoUrl
        ? <img src={product.photoUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
        : <Portrait tone={TONE_BY_CATEGORY[product.category] || 'smoke'} aspectRatio="3/4" label="" style={{ borderRadius: 0, height: '100%' }}/>}
    </div>
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>· {product.brand}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 16, color: 'var(--fg-1)', marginTop: 2 }}>{product.name}</div>
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>AURA {product.auraScore}/10 · unlocks {product.versatility} fits · ${product.costPerWear?.toFixed ? product.costPerWear.toFixed(2) : product.costPerWear}/wear</div>
    </div>
    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 300, fontSize: 22, color: 'var(--fg-1)' }}>${product.price}</div>
    <div style={{ display: 'flex', gap: 6 }}>
      {onMove && <button onClick={onMove} className="btn-ghost" style={{ fontSize: 11, padding: '6px 12px' }}>{moveLabel}</button>}
      <button onClick={onRemove} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 999, padding: '6px 12px', color: 'var(--fg-3)', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 11 }}>Remove</button>
    </div>
  </div>
);

// ─── ROOT ───────────────────────────────────────────────────────────
const Shop = () => {
  const shop = loadShop();
  const wd   = loadWardrobe();
  const [wardrobe, setWardrobe]   = React.useState(wd.items || []);
  const [analyzed, setAnalyzed]   = React.useState(shop.analyzed && shop.analyzed.length ? shop.analyzed : SEED_PRODUCTS);
  const [cart, setCart]           = React.useState(shop.cart || []);
  const [wishlist, setWishlist]   = React.useState(shop.wishlist || []);
  const [tab, setTab]             = React.useState('feed'); // feed | cart | wishlist

  React.useEffect(() => { saveShop({ analyzed, cart, wishlist }); }, [analyzed, cart, wishlist]);

  // Listen for wardrobe changes from other tabs / Wardrobe.jsx
  React.useEffect(() => {
    const onStorage = (e) => {
      if (e.key === WARDROBE_KEY) {
        try { setWardrobe(JSON.parse(e.newValue || '{}').items || []); } catch {}
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // — cart / wishlist / closet helpers
  const inCart     = (id) => cart.includes(id);
  const inWishlist = (id) => wishlist.includes(id);
  const inCloset   = (id) => {
    const product = analyzed.find(p => p.id === id);
    if (!product) return false;
    return wardrobe.some(w => w.name === product.name);
  };

  const toggleCart     = (id) => setCart(c => c.includes(id) ? c.filter(x => x !== id) : [...c, id]);
  const toggleWishlist = (id) => setWishlist(c => c.includes(id) ? c.filter(x => x !== id) : [...c, id]);
  const moveToCloset = (id) => {
    const p = analyzed.find(x => x.id === id);
    if (!p) return;
    if (wardrobe.some(w => w.name === p.name)) return;
    const nextWardrobe = [{
      id: 'w' + Date.now(),
      photoUrl: p.photoUrl || null,
      name: p.name,
      category: p.category, subcategory: p.category,
      color: p.color, fit: p.fit, styleType: p.styleType, material: p.material,
      seasons: ['All'], pattern: 'solid',
    }, ...wardrobe];
    setWardrobe(nextWardrobe);
    saveWardrobeItems(nextWardrobe);
  };

  const onAnalyze = (p) => setAnalyzed(prev => [p, ...prev]);
  const removeProduct = (id) => {
    setAnalyzed(prev => prev.filter(p => p.id !== id));
    setCart(c => c.filter(x => x !== id));
    setWishlist(c => c.filter(x => x !== id));
  };

  // derived
  const cartProducts     = cart.map(id => analyzed.find(p => p.id === id)).filter(Boolean);
  const wishlistProducts = wishlist.map(id => analyzed.find(p => p.id === id)).filter(Boolean);
  const cartTotal = cartProducts.reduce((s, p) => s + (Number(p.price) || 0), 0);

  return (
    <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
      <Background />

      <section className="section" style={{ paddingTop: 'clamp(64px, 8vw, 96px)', paddingBottom: 'clamp(40px, 6vw, 64px)' }}>
        <div className="container">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap', marginBottom: 40 }}>
            <div>
              <Eyebrow>· THE SHOP</Eyebrow>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontWeight: 300,
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                lineHeight: 1.04, letterSpacing: '-0.02em',
                margin: '20px 0 14px', color: 'var(--fg-1)',
              }}>
                A <em style={{ fontStyle: 'italic' }}>personal shopper</em>, calibrated to your closet.
              </h1>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 16, lineHeight: 1.5, color: 'var(--fg-2)', margin: 0, maxWidth: 540 }}>
                Paste any product link or upload a screenshot. PYVEX reads it against what you already own and tells you if it&rsquo;s worth buying.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 24 }}>
              <Stat value={analyzed.length} label="ANALYZED"/>
              <Stat value={cart.length} label="CART"/>
              <Stat value={wishlist.length} label="WISHLIST"/>
              <Stat value={wardrobe.length} label="CLOSET"/>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
            <Chip label={`Feed · ${analyzed.length}`}     selected={tab === 'feed'}     onClick={() => setTab('feed')}/>
            <Chip label={`Cart · ${cart.length}`}         selected={tab === 'cart'}     onClick={() => setTab('cart')}/>
            <Chip label={`Wishlist · ${wishlist.length}`} selected={tab === 'wishlist'} onClick={() => setTab('wishlist')}/>
            {tab === 'cart' && cartProducts.length > 0 && (
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-2)', letterSpacing: '0.15em' }}>
                TOTAL <span style={{ color: 'var(--accent)', fontSize: 18, marginLeft: 8 }}>${cartTotal}</span>
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 24, alignItems: 'start' }}>
            {/* LEFT — add panel (sticky) */}
            <div style={{ position: 'sticky', top: 32 }}>
              <AddProduct onAnalyze={onAnalyze} wardrobe={wardrobe}/>

              {wardrobe.length === 0 && (
                <div style={{ marginTop: 16, padding: 20, border: '1px dashed var(--border-strong)', borderRadius: 14 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 18, color: 'var(--fg-1)', marginBottom: 6 }}>Closet empty.</div>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.5 }}>
                    AURA pairs products against pieces you already own. <a href="wardrobe.html" style={{ color: 'var(--accent)' }}>Build your closet</a> for sharper recommendations.
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT — content tabs */}
            <div>
              {tab === 'feed' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {analyzed.length === 0 ? (
                    <div style={{ padding: 64, textAlign: 'center', border: '1px dashed var(--border-strong)', borderRadius: 20, color: 'var(--fg-3)' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 24, color: 'var(--fg-1)', marginBottom: 8 }}>Nothing analyzed yet.</div>
                      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 14 }}>Paste a link, describe a piece, or upload a screenshot to begin.</div>
                    </div>
                  ) : analyzed.map(p => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      wardrobe={wardrobe}
                      inCart={inCart(p.id)}
                      inWishlist={inWishlist(p.id)}
                      inCloset={inCloset(p.id)}
                      onCart={() => toggleCart(p.id)}
                      onWishlist={() => toggleWishlist(p.id)}
                      onCloset={() => moveToCloset(p.id)}
                      onRemove={() => removeProduct(p.id)}
                    />
                  ))}
                </div>
              )}

              {tab === 'cart' && (
                cartProducts.length === 0 ? (
                  <div style={{ padding: 64, textAlign: 'center', border: '1px dashed var(--border-strong)', borderRadius: 20, color: 'var(--fg-3)' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 24, color: 'var(--fg-1)', marginBottom: 8 }}>Cart is empty.</div>
                    <div style={{ fontFamily: 'var(--font-ui)', fontSize: 14 }}>Add analyzed pieces from the Feed.</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {cartProducts.map(p => (
                        <ProductRow key={p.id} product={p}
                          onRemove={() => toggleCart(p.id)}
                          onMove={() => { toggleWishlist(p.id); toggleCart(p.id); }}
                          moveLabel="→ Wishlist"
                        />
                      ))}
                    </div>
                    <div style={{
                      marginTop: 20, padding: '20px 24px',
                      background: 'rgba(70,243,168,0.06)',
                      border: '1px solid rgba(70,243,168,0.3)',
                      borderRadius: 16,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14,
                    }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.18em' }}>· READY TO CHECKOUT</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 36, color: 'var(--fg-1)', letterSpacing: '-0.02em', lineHeight: 1 }}>${cartTotal}</div>
                        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-2)', marginTop: 4 }}>{cartProducts.length} pieces · est. weighted CPW ${(cartProducts.reduce((s,p)=>s+(p.costPerWear||0),0)/(cartProducts.length||1)).toFixed(2)}</div>
                      </div>
                      <button className="btn-primary" style={{ fontSize: 14, padding: '14px 24px' }}>Proceed to checkout</button>
                    </div>
                  </div>
                )
              )}

              {tab === 'wishlist' && (
                wishlistProducts.length === 0 ? (
                  <div style={{ padding: 64, textAlign: 'center', border: '1px dashed var(--border-strong)', borderRadius: 20, color: 'var(--fg-3)' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 24, color: 'var(--fg-1)', marginBottom: 8 }}>Wishlist is empty.</div>
                    <div style={{ fontFamily: 'var(--font-ui)', fontSize: 14 }}>Save pieces you&rsquo;re considering for later.</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {wishlistProducts.map(p => (
                      <ProductRow key={p.id} product={p}
                        onRemove={() => toggleWishlist(p.id)}
                        onMove={() => { toggleCart(p.id); toggleWishlist(p.id); }}
                        moveLabel="→ Cart"
                      />
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

Object.assign(window, { Shop });
