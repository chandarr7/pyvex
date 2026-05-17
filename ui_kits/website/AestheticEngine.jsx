/* Aesthetic Engine — 10 categories shown as editorial cards on a grid */

const AESTHETICS = [
  { name: 'Old Money',         tag: 'Heritage, hush, navy',          tone: 'bone',    glow: 'gold' },
  { name: 'Quiet Luxury',      tag: 'Cashmere, whisper',             tone: 'smoke',   glow: 'emerald' },
  { name: 'Minimalist',        tag: 'Bone, black, line',             tone: 'smoke',   glow: 'emerald' },
  { name: 'Streetwear',        tag: 'Volume, cadence',               tone: 'jade',    glow: 'emerald' },
  { name: 'Techwear',          tag: 'Carbon, utility',               tone: 'emerald', glow: 'emerald' },
  { name: 'Korean',            tag: 'Layered, subdued',              tone: 'bone',    glow: 'gold' },
  { name: 'Luxury Editorial',  tag: 'Italian, sculptural',           tone: 'jade',    glow: 'gold' },
  { name: 'Corporate Elite',   tag: 'Tailored, decisive',            tone: 'smoke',   glow: 'emerald' },
  { name: 'Fitness Lifestyle', tag: 'Performance, recovery',         tone: 'emerald', glow: 'emerald' },
  { name: 'Creative Founder',  tag: 'Studio, off-duty',              tone: 'jade',    glow: 'gold' },
];

const AestheticCard = ({ a }) => {
  const [hover, setHover] = React.useState(false);
  const glowColor = a.glow === 'gold' ? 'rgba(212,184,134,0.35)' : 'rgba(70,243,168,0.35)';
  const accentColor = a.glow === 'gold' ? 'var(--aura-gold)' : 'var(--accent)';
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative', borderRadius: 16, overflow: 'hidden',
        aspectRatio: '3 / 4', cursor: 'pointer',
        transition: 'transform 600ms cubic-bezier(0.2,0.8,0.2,1)',
        transform: hover ? 'translateY(-4px)' : 'none',
      }}
    >
      <Portrait tone={a.tone} aspectRatio="3 / 4" label="" style={{ borderRadius: 16, height: '100%' }}/>
      {/* darkening gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, transparent 30%, rgba(5,7,7,0.85) 100%)',
        pointerEvents: 'none',
      }}/>
      {/* hover glow */}
      <div style={{
        position: 'absolute', inset: -4,
        boxShadow: hover ? `inset 0 0 0 1px ${glowColor}, 0 0 60px -10px ${glowColor}` : 'none',
        borderRadius: 16,
        transition: 'box-shadow 600ms cubic-bezier(0.2,0.8,0.2,1)',
        pointerEvents: 'none',
      }}/>
      {/* content */}
      <div style={{ position: 'absolute', left: 16, right: 16, bottom: 16 }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em',
          color: accentColor, marginBottom: 6,
          transition: 'color 300ms',
        }}>· AESTHETIC</div>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 400, fontStyle: 'italic',
          fontSize: 20, lineHeight: 1.15, color: 'var(--fg-1)',
          letterSpacing: '-0.01em',
        }}>{a.name}</div>
        <div style={{
          fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-2)',
          marginTop: 4,
        }}>{a.tag}</div>
      </div>
    </div>
  );
};

const AestheticEngine = () => (
  <section className="section" id="aesthetics">
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, gap: 24, flexWrap: 'wrap' }}>
        <div style={{ maxWidth: 640 }}>
          <Eyebrow>· AESTHETIC ENGINE</Eyebrow>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 300,
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            lineHeight: 1.05, letterSpacing: '-0.02em',
            margin: '20px 0 0', color: 'var(--fg-1)',
          }}>
            Ten worlds. One <em style={{ fontStyle: 'italic' }}>compass</em>.
          </h2>
        </div>
        <p style={{ maxWidth: 380, fontFamily: 'var(--font-ui)', fontSize: 15, lineHeight: 1.55, color: 'var(--fg-2)', margin: 0 }}>
          PYVEX reads which aesthetics belong to you, ranks them, and blends them. You are rarely one thing.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {AESTHETICS.map(a => <AestheticCard key={a.name} a={a}/>)}
      </div>
    </div>
  </section>
);

Object.assign(window, { AestheticEngine });
