/* How It Works — 3-step animated flow */
const STEPS = [
  { n: '01', title: 'Upload or choose avatar',
    text: 'A single photo. Or pick from twelve calibrated avatars built for every body and culture.',
    icon: 'camera' },
  { n: '02', title: 'AI analyzes style profile',
    text: 'Skin tone, build, posture, palette, mood. Cross-referenced against 14M editorial frames in 4 seconds.',
    icon: 'sparkles' },
  { n: '03', title: 'Receive personalized outfits',
    text: 'Twelve looks, ranked. Shoppable, swappable, savable to your wardrobe. Yours immediately.',
    icon: 'shirt' },
];

const HowItWorks = () => (
  <section className="section" id="how">
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: 80, maxWidth: 720, margin: '0 auto 80px' }}>
        <Eyebrow>· THE METHOD</Eyebrow>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 300,
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          lineHeight: 1.05, letterSpacing: '-0.02em',
          margin: '20px 0 0', color: 'var(--fg-1)',
        }}>
          Three steps. <em style={{ fontStyle: 'italic' }}>Four seconds</em>.
        </h2>
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
        position: 'relative',
      }}>
        {/* horizontal connector line */}
        <div style={{
          position: 'absolute', left: '8%', right: '8%', top: 64,
          height: 1, background: 'linear-gradient(90deg, transparent, rgba(70,243,168,0.4), transparent)',
        }}/>
        {STEPS.map((s, i) => (
          <div key={s.n} style={{
            padding: '0 24px', position: 'relative',
            borderLeft: i === 0 ? 'none' : '1px solid var(--border)',
          }}>
            {/* numbered dot */}
            <div style={{
              width: 128, height: 128, borderRadius: 999,
              background: 'rgba(14,19,17,0.6)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(70,243,168,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 32px',
              position: 'relative', zIndex: 2,
              boxShadow: '0 0 60px rgba(70,243,168,0.15), inset 0 1px 0 rgba(242,239,232,0.08)',
            }}>
              <div style={{ color: 'var(--accent)' }}>
                <Icon name={s.icon} size={32} stroke={1.25}/>
              </div>
            </div>
            <div style={{ textAlign: 'center', maxWidth: 320, margin: '0 auto' }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 11,
                letterSpacing: '0.18em', color: 'var(--accent)', marginBottom: 12,
              }}>{s.n}</div>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 22,
                lineHeight: 1.2, letterSpacing: '-0.01em',
                margin: '0 0 12px', color: 'var(--fg-1)',
              }}>{s.title}</h3>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, lineHeight: 1.6, color: 'var(--fg-2)', margin: 0 }}>{s.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

Object.assign(window, { HowItWorks });
