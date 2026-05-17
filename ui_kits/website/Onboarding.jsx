/* PYVEX — 5-step onboarding flow.
 *
 * Sequence (runs after signup + email verification):
 *   1. What do you do for work?      single-choice role
 *   2. What do you wear?             multi-choice (womenswear / menswear)
 *   3. How did you hear about us?    single-choice, skippable
 *   4. Choose 3+ brands              multi-select, searchable, min 3
 *   5. Start with your closet        upload 5+ photos
 *
 * Persistence: stored in localStorage so a refresh resumes where you left off.
 * On finish: redirect to /ui_kits/website/index.html.
 */

const STORAGE = 'aura.onboarding';

const ROLES = [
  'Lawyer','Marketing lead','Software Engineer','College Student','High School Student',
  'Teacher','Consultant','Nurse','Product designer','Human resources',
  'Investment banker','Product manager','Founder','Architect','Creator',
  'Director','Other',
];

const SOURCES = [
  'Tiktok','Instagram','Reddit','Friend','ChatGPT','Google','Other','TV Show',
];

const BRANDS = [
  "A.P.C.","AMI Paris","ASOS","Abercrombie","Acne Studios","Aeropostale","Aimé Leon Dore","Aldo",
  "Alexander McQueen","Alexander Wang","AllSaints","Alo Yoga","American Eagle","Amiri","Arc'teryx",
  "Awake NY","BAPE","Balenciaga","Balmain","Banana Republic","Barbour","Bershka","Bode","Boden",
  "Boohoo","Bottega Veneta","Brioni","Brooks Brothers","Brunello Cucinelli","Burberry","COS",
  "Calvin Klein","Calvin Klein Collection","Canada Goose","Carhartt WIP","Cartier","Celine",
  "Christian Louboutin","Club Monaco","Coach","Cole Haan","Columbia","Comme des Garçons",
  "Common Projects","Converse","Courrèges","Crocs","DKNY","David Yurman","Dickies","Diesel",
  "Dior","Dolce & Gabbana","Dr. Martens","Dries Van Noten","Etro","Everlane","Express","Faherty",
  "Fashion Nova","Fear of God","Fendi","Ferragamo","Forever 21","Frame","Gap","Givenchy",
  "Golden Goose","Gucci","Gymshark","H&M","Helmut Lang","Hermès","Hoka","Hollister","Hugo Boss",
  "Issey Miyake","J.Crew","JW Anderson","Jacquemus","Jil Sander","Jimmy Choo","Junya Watanabe",
  "KITH","Kapital","Karl Lagerfeld","Kenzo","Lacoste","Lanvin","Lemaire","Levi's","Loewe",
  "Loro Piana","Louis Vuitton","Lucky Brand","Lululemon","Madewell","Maison Margiela","Mango",
  "Manolo Blahnik","Marc Jacobs","Marni","Massimo Dutti","Michael Kors","Missoni","Moncler",
  "New Balance","Nike","Off-White","Old Navy","On","Paige","Patagonia","Prada","Pull&Bear","Puma",
  "Quince","Rag & Bone","Ralph Lauren","Ralph Lauren Purple Label","Reebok","Reiss","Rick Owens",
  "SHEIN","Saint Laurent","Sandro","Skims","Steve Madden","Stone Island","Stüssy","Supreme",
  "Sézane","Target","The North Face","The Row","Theory","Thom Browne","Thursday Boot Company",
  "Timberland","Todd Snyder","Tom Ford","Tommy Hilfiger","Under Armour","Uniqlo","Urban Outfitters",
  "Valentino","Vans","Veja","Versace","Vetements","Vince","Vineyard Vines","Vuori","Walmart",
  "Yohji Yamamoto","Zara","Zegna","adidas",
];

const TOTAL_STEPS = 5;

// ── load/save helpers ──────────────────────────────────────────────────
const loadState = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE) || '{}'); }
  catch { return {}; }
};
const saveState = (patch) => {
  const cur = loadState();
  const next = { ...cur, ...patch };
  localStorage.setItem(STORAGE, JSON.stringify(next));
  return next;
};

// ── Page shell with logo, progress dots, skip ──────────────────────────
const Shell = ({ step, onSkip, children }) => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
    {/* ambient background blob */}
    <div aria-hidden style={{
      position: 'fixed', right: '-15%', top: '-20%',
      width: '60vw', height: '70vh',
      background: 'radial-gradient(closest-side, #46F3A8, transparent 65%)',
      opacity: 0.08, filter: 'blur(120px)', pointerEvents: 'none', zIndex: 0,
    }}/>
    <div aria-hidden style={{
      position: 'fixed', left: '-15%', bottom: '-20%',
      width: '60vw', height: '70vh',
      background: 'radial-gradient(closest-side, #15614A, transparent 65%)',
      opacity: 0.25, filter: 'blur(120px)', pointerEvents: 'none', zIndex: 0,
    }}/>

    {/* top bar */}
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '28px 40px', position: 'relative', zIndex: 2,
    }}>
      <a href="index.html" style={{
        fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 22,
        color: 'var(--fg-1)', letterSpacing: '-0.01em', textDecoration: 'none',
      }}>
        pyvex<span style={{ color: 'var(--accent)', textShadow: '0 0 12px rgba(70,243,168,0.6)' }}>·</span>me
      </a>
      {/* progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map(n => (
          <span key={n} style={{
            width: n === step ? 24 : 6, height: 6, borderRadius: 999,
            background: n <= step ? 'var(--accent)' : 'rgba(242,239,232,0.16)',
            boxShadow: n === step ? '0 0 12px rgba(70,243,168,0.5)' : 'none',
            transition: 'all 400ms cubic-bezier(0.2,0.8,0.2,1)',
          }}/>
        ))}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.15em', marginLeft: 12 }}>
          {String(step).padStart(2, '0')} / {String(TOTAL_STEPS).padStart(2, '0')}
        </span>
      </div>
      {onSkip ? (
        <button onClick={onSkip} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-2)',
          padding: '8px 14px', borderRadius: 999,
        }}>Skip</button>
      ) : <div style={{ width: 60 }}/>}
    </header>

    {/* content */}
    <main style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 40px 64px', position: 'relative', zIndex: 2,
    }}>
      {children}
    </main>
  </div>
);

// ── reusable Chip / Tile components ────────────────────────────────────
const Chip = ({ label, selected, onClick, size = 'md' }) => {
  const padding = size === 'lg' ? '14px 22px' : '11px 18px';
  const fontSize = size === 'lg' ? 15 : 14;
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: 'var(--font-ui)', fontSize, fontWeight: 500,
        padding, borderRadius: 999,
        background: selected ? 'var(--accent)' : 'transparent',
        color: selected ? 'var(--obsidian)' : 'var(--fg-1)',
        border: `1px solid ${selected ? 'var(--accent)' : 'var(--border-strong)'}`,
        cursor: 'pointer',
        transition: 'all 220ms cubic-bezier(0.2,0.8,0.2,1)',
        boxShadow: selected ? '0 0 24px rgba(70,243,168,0.35)' : 'none',
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = 'rgba(70,243,168,0.4)'; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
    >{label}</button>
  );
};

const Continue = ({ disabled, onClick, label = 'Continue' }) => (
  <button
    disabled={disabled} onClick={onClick} className="btn-primary"
    style={{
      padding: '16px 32px', fontSize: 15,
      opacity: disabled ? 0.35 : 1,
      display: 'inline-flex', alignItems: 'center', gap: 10,
    }}
  >
    {label}
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  </button>
);

const Question = ({ kicker, title, subtitle, children, ctaRow }) => (
  <div style={{ width: '100%', maxWidth: 900, display: 'flex', flexDirection: 'column', gap: 32 }}>
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.22em', color: 'var(--accent)', textTransform: 'uppercase' }}>{kicker}</div>
      <h1 style={{
        fontFamily: 'var(--font-display)', fontWeight: 300,
        fontSize: 'clamp(2.2rem, 5vw, 3.75rem)',
        lineHeight: 1.04, letterSpacing: '-0.02em',
        margin: '16px 0 14px', color: 'var(--fg-1)',
      }}>{title}</h1>
      {subtitle && (
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 16, lineHeight: 1.5, color: 'var(--fg-2)', margin: 0, maxWidth: 620 }}>
          {subtitle}
        </p>
      )}
    </div>
    {children}
    {ctaRow && <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>{ctaRow}</div>}
  </div>
);

// ── STEP 1: ROLE ───────────────────────────────────────────────────────
const StepRole = ({ value, onChange, onNext }) => (
  <Question
    kicker="· STEP 01"
    title={<>What do you do <em style={{ fontStyle: 'italic' }}>for work?</em></>}
    subtitle="We'll personalize recommendations for both weekdays and weekends."
    ctaRow={<Continue disabled={!value} onClick={onNext}/>}
  >
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {ROLES.map(r => (
        <Chip key={r} label={r} selected={value === r} onClick={() => onChange(r)} size="lg"/>
      ))}
    </div>
  </Question>
);

// ── STEP 2: WEAR (multi) ───────────────────────────────────────────────
const StepWear = ({ value, onChange, onNext }) => {
  const toggle = (k) => onChange(value.includes(k) ? value.filter(x => x !== k) : [...value, k]);
  const Tile = ({ k, label, tone }) => (
    <button onClick={() => toggle(k)} style={{
      position: 'relative', overflow: 'hidden',
      width: '100%', aspectRatio: '4/5',
      borderRadius: 20,
      border: `1.5px solid ${value.includes(k) ? 'var(--accent)' : 'var(--border-strong)'}`,
      background: 'transparent', cursor: 'pointer', padding: 0,
      transition: 'all 300ms cubic-bezier(0.2,0.8,0.2,1)',
      boxShadow: value.includes(k) ? '0 0 60px -10px rgba(70,243,168,0.5), inset 0 0 0 1px rgba(70,243,168,0.3)' : 'none',
    }}>
      <Portrait tone={tone} aspectRatio="4/5" label="" style={{ borderRadius: 18, height: '100%' }}/>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(5,7,7,0.85))', pointerEvents: 'none' }}/>
      <div style={{
        position: 'absolute', left: 24, right: 24, bottom: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 32, color: 'var(--fg-1)', letterSpacing: '-0.01em' }}>{label}</span>
        <span style={{
          width: 28, height: 28, borderRadius: 999,
          border: `1.5px solid ${value.includes(k) ? 'var(--accent)' : 'rgba(242,239,232,0.4)'}`,
          background: value.includes(k) ? 'var(--accent)' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--obsidian)',
        }}>
          {value.includes(k) && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>}
        </span>
      </div>
    </button>
  );
  return (
    <Question
      kicker="· STEP 02"
      title={<>What do you <em style={{ fontStyle: 'italic' }}>wear?</em></>}
      subtitle="You can choose both options if you're interested in both styles."
      ctaRow={<Continue disabled={!value.length} onClick={onNext}/>}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 720 }}>
        <Tile k="womenswear" label="Womenswear" tone="bone"/>
        <Tile k="menswear"   label="Menswear"   tone="smoke"/>
      </div>
    </Question>
  );
};

// ── STEP 3: SOURCE (single, skippable) ─────────────────────────────────
const StepSource = ({ value, onChange, onNext, onSkip }) => (
  <Question
    kicker="· STEP 03"
    title={<>How did you <em style={{ fontStyle: 'italic' }}>hear about us?</em></>}
    ctaRow={<><Continue disabled={!value} onClick={onNext}/><button onClick={onSkip} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--fg-2)', padding: '14px 18px' }}>Skip</button></>}
  >
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {SOURCES.map(s => <Chip key={s} label={s} selected={value === s} onClick={() => onChange(s)} size="lg"/>)}
    </div>
  </Question>
);

// ── STEP 4: BRANDS (multi, min 3) ──────────────────────────────────────
const StepBrands = ({ value, onChange, onNext }) => {
  const [q, setQ] = React.useState('');
  const toggle = (b) => onChange(value.includes(b) ? value.filter(x => x !== b) : [...value, b]);
  const filtered = q.trim()
    ? BRANDS.filter(b => b.toLowerCase().includes(q.toLowerCase()))
    : BRANDS;
  const count = value.length;
  const ready = count >= 3;
  return (
    <Question
      kicker="· STEP 04"
      title={<>Choose <em style={{ fontStyle: 'italic' }}>3 or more brands</em></>}
      subtitle="Choose brands of clothes you currently own or want."
      ctaRow={<>
        <Continue disabled={!ready} onClick={onNext} label={ready ? 'Continue' : `Choose ${3 - count} more`}/>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)', letterSpacing: '0.15em' }}>{String(count).padStart(2,'0')} SELECTED</span>
      </>}
    >
      {/* search */}
      <div style={{ maxWidth: 420 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 16px',
          background: 'var(--bg-elev-2)',
          border: '1px solid var(--border)',
          borderRadius: 12,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--fg-3)' }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            value={q} onChange={e => setQ(e.target.value)}
            placeholder="Search 150+ brands"
            style={{
              flex: 1, background: 'transparent', border: 'none',
              color: 'var(--fg-1)', fontFamily: 'var(--font-ui)', fontSize: 14, outline: 'none',
            }}
          />
        </div>
      </div>
      {/* grid */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 8,
        maxHeight: '50vh', overflowY: 'auto', padding: '4px 4px 16px',
      }}>
        {filtered.map(b => <Chip key={b} label={b} selected={value.includes(b)} onClick={() => toggle(b)}/>)}
        {filtered.length === 0 && (
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--fg-3)', padding: 16 }}>No brands match "{q}".</div>
        )}
      </div>
    </Question>
  );
};

// ── STEP 5: CLOSET (upload 5+ photos) ──────────────────────────────────
const StepCloset = ({ name, photos, onChange, onFinish }) => {
  const fileRef = React.useRef(null);
  const minSlots = 5;
  const slots = Math.max(minSlots, photos.length + 1);

  const addFiles = (files) => {
    const arr = Array.from(files).slice(0, 8);
    const readers = arr.map(f => new Promise(r => {
      const fr = new FileReader();
      fr.onload = () => r(fr.result);
      fr.readAsDataURL(f);
    }));
    Promise.all(readers).then(urls => onChange([...photos, ...urls]));
  };
  const remove = (i) => onChange(photos.filter((_, idx) => idx !== i));

  const ready = photos.length >= minSlots;
  return (
    <Question
      kicker={`· WELCOME, ${(name || 'AURA').toUpperCase()}`}
      title={<>Start with your <em style={{ fontStyle: 'italic' }}>closet</em>.</>}
      subtitle={<>A photo of your fit or clothes — we'll make each piece studio quality. <strong style={{ color: ready ? 'var(--accent)' : 'var(--fg-1)' }}>{Math.max(0, minSlots - photos.length)} more</strong> to unlock personalized daily looks.</>}
      ctaRow={<Continue disabled={!ready} onClick={onFinish} label="Enter the studio"/>}
    >
      <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => e.target.files && addFiles(e.target.files)}/>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, maxWidth: 920 }}>
        {Array.from({ length: slots }, (_, i) => {
          const photo = photos[i];
          if (photo) {
            return (
              <div key={i} style={{
                position: 'relative', aspectRatio: '3/4',
                borderRadius: 16, overflow: 'hidden',
                border: '1px solid rgba(70,243,168,0.3)',
                boxShadow: '0 0 40px -10px rgba(70,243,168,0.25)',
              }}>
                <img src={photo} alt={`piece ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                <button onClick={() => remove(i)} style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 28, height: 28, borderRadius: 999,
                  background: 'rgba(5,7,7,0.7)', backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(242,239,232,0.2)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-1)',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
                <div style={{ position: 'absolute', left: 8, bottom: 8, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(242,239,232,0.65)', letterSpacing: '0.18em' }}>
                  PIECE {String(i+1).padStart(2,'0')}
                </div>
              </div>
            );
          }
          // empty slot
          const isFirstEmpty = i === photos.length;
          return (
            <button key={i}
              onClick={() => isFirstEmpty && fileRef.current && fileRef.current.click()}
              disabled={!isFirstEmpty}
              style={{
                position: 'relative', aspectRatio: '3/4',
                borderRadius: 16, padding: 0,
                background: 'var(--bg-elev-1)',
                border: `1.5px dashed ${isFirstEmpty ? 'rgba(70,243,168,0.4)' : 'var(--border)'}`,
                cursor: isFirstEmpty ? 'pointer' : 'default',
                opacity: isFirstEmpty ? 1 : 0.35,
                transition: 'all 220ms cubic-bezier(0.2,0.8,0.2,1)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
                color: isFirstEmpty ? 'var(--accent)' : 'var(--fg-3)',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em' }}>
                {isFirstEmpty ? 'ADD' : `PIECE ${String(i+1).padStart(2,'0')}`}
              </span>
            </button>
          );
        })}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.15em' }}>
        {photos.length}/{minSlots}+ PIECES UPLOADED
      </div>
    </Question>
  );
};

// ── ROOT ───────────────────────────────────────────────────────────────
const Onboarding = () => {
  const initial = loadState();
  const [step, setStep]     = React.useState(initial.step || 1);
  const [role, setRole]     = React.useState(initial.role || '');
  const [wear, setWear]     = React.useState(initial.wear || []);
  const [source, setSource] = React.useState(initial.source || '');
  const [brands, setBrands] = React.useState(initial.brands || []);
  const [photos, setPhotos] = React.useState(initial.photos || []);
  const [name, setName]     = React.useState(initial.name || '');

  // pull display name from Clerk if available (or saved name)
  React.useEffect(() => {
    if (!name && window.loadClerk) {
      window.loadClerk().then(c => {
        if (c.user) {
          const n = c.user.firstName || (c.user.fullName || '').split(' ')[0] || (c.user.primaryEmailAddress?.emailAddress || '').split('@')[0];
          if (n) { setName(n); saveState({ name: n }); }
        }
      }).catch(() => {});
    }
  }, []);

  // persist whenever state changes
  React.useEffect(() => {
    saveState({ step, role, wear, source, brands, photoCount: photos.length, name });
  }, [step, role, wear, source, brands, photos.length, name]);

  const next = () => setStep(s => Math.min(TOTAL_STEPS, s + 1));
  const finish = () => {
    saveState({ step: 'complete', completedAt: Date.now() });
    window.location.href = 'index.html';
  };

  const skipSource = () => { setSource(''); saveState({ source: '' }); next(); };

  return (
    <Shell step={step} onSkip={step === 3 ? skipSource : null}>
      {step === 1 && <StepRole   value={role}   onChange={setRole}   onNext={next}/>}
      {step === 2 && <StepWear   value={wear}   onChange={setWear}   onNext={next}/>}
      {step === 3 && <StepSource value={source} onChange={setSource} onNext={next} onSkip={skipSource}/>}
      {step === 4 && <StepBrands value={brands} onChange={setBrands} onNext={next}/>}
      {step === 5 && <StepCloset name={name} photos={photos} onChange={setPhotos} onFinish={finish}/>}
    </Shell>
  );
};

Object.assign(window, { Onboarding });
