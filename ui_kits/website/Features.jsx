/* AI Features — 8 capability cards with hover glow */
const FEATURES = [
  { icon: 'wand',     title: 'AI outfit generator',     text: 'Composed from 14M editorial frames, calibrated to your shape and palette.' },
  { icon: 'camera',   title: 'Virtual try-on',          text: 'See garments rendered onto your photo before you commit to a single hanger.' },
  { icon: 'shirt',    title: 'Smart closet',            text: 'Photograph what you own. Receive new arrangements without buying anything.' },
  { icon: 'sparkles', title: 'Daily AI stylist',        text: 'A morning brief, calibrated to your calendar, weather, and the day you intend to have.' },
  { icon: 'calendar', title: 'Occasion intelligence',   text: 'Black-tie, brunch, gallery opening. The brief is the start; we engineer the rest.' },
  { icon: 'weather',  title: 'Weather adaptive',        text: 'Outfits that respect the forecast. 14\u00b0C drizzle reads differently from 14\u00b0C clear.' },
  { icon: 'palette',  title: 'Color & tone analysis',   text: 'Eight clothing colors engineered for your skin, each with an editorial rationale.' },
  { icon: 'star',     title: 'Celebrity style recall',  text: 'Distill an icon\u2019s wardrobe into pieces you can actually buy this season.' },
  { icon: 'mood',     title: 'Mood detection',          text: 'Match your wardrobe to how you actually feel, not how the algorithm assumes.' },
  { icon: 'wallet',   title: 'Budget optimizer',        text: 'A capsule of nine. A wardrobe of forty. Best-in-class per dollar deployed.' },
  { icon: 'trending', title: 'Trend intelligence',      text: 'Tracking 220 editorial sources hourly. Trends arrive before they trend.' },
  { icon: 'user',     title: 'Personal brand analyzer', text: 'Read how the world reads you. Tune the signal before it leaves the room.' },
];

const FeatureCard = ({ icon, title, text }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      className="card-editorial"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative', overflow: 'hidden',
        padding: 28, borderRadius: 20,
        minHeight: 260,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 32,
      }}
    >
      {/* hover glow blob */}
      <div style={{
        position: 'absolute', right: -40, top: -40,
        width: 200, height: 200, borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(70,243,168,0.35), transparent 70%)',
        opacity: hover ? 0.8 : 0,
        filter: 'blur(40px)',
        transition: 'opacity 600ms cubic-bezier(0.2,0.8,0.2,1)',
        pointerEvents: 'none',
      }}/>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: hover ? 'rgba(70,243,168,0.16)' : 'rgba(242,239,232,0.04)',
          border: `1px solid ${hover ? 'rgba(70,243,168,0.4)' : 'rgba(242,239,232,0.10)'}`,
          color: hover ? 'var(--accent)' : 'var(--fg-1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 400ms cubic-bezier(0.2,0.8,0.2,1)',
        }}>
          <Icon name={icon} size={22}/>
        </div>
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 24,
          lineHeight: 1.15, letterSpacing: '-0.01em',
          marginBottom: 10, color: 'var(--fg-1)',
        }}>{title}</div>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, lineHeight: 1.55, color: 'var(--fg-2)', margin: 0 }}>{text}</p>
      </div>
    </div>
  );
};

const Features = () => (
  <section className="section" id="features">
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 64, gap: 24, flexWrap: 'wrap' }}>
        <div style={{ maxWidth: 720 }}>
          <Eyebrow>· INTELLIGENCE</Eyebrow>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 300,
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            lineHeight: 1.05, letterSpacing: '-0.02em',
            margin: '20px 0 0', color: 'var(--fg-1)',
          }}>
            Eight models, one <em style={{ fontStyle: 'italic' }}>wardrobe</em>.
          </h2>
        </div>
        <p style={{ maxWidth: 360, fontFamily: 'var(--font-ui)', fontSize: 15, lineHeight: 1.55, color: 'var(--fg-2)', margin: 0 }}>
          Each capability runs on its own engine. They converse before they answer you, so the outfit you receive has been read four times.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {FEATURES.map(f => <FeatureCard key={f.title} {...f}/>)}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--fg-3)', textAlign: 'center', marginTop: 32 }}>
        12 ENGINES · ONE INTELLIGENCE
      </div>
    </div>
  </section>
);

Object.assign(window, { Features });
