/* Hero — cinematic fullscreen with rotating AI model + floating UI cards */
const Hero = () => {
  // model index for rotating display
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % 3), 4500);
    return () => clearInterval(id);
  }, []);
  const tones = ['emerald', 'jade', 'smoke'];
  const labels = ['MILAN · 03', 'PARIS · 11', 'NEW YORK · 07'];

  return (
    <section className="section" style={{
      minHeight: '100vh', paddingTop: 120, paddingBottom: 80,
      display: 'flex', alignItems: 'center', position: 'relative',
    }}>
      <div className="container" style={{ width: '100%', display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 'clamp(40px, 6vw, 96px)', alignItems: 'center' }}>
        {/* LEFT — copy + CTAs */}
        <div className="reveal in" style={{ position: 'relative', zIndex: 2 }}>
          <Eyebrow>· INTELLIGENCE FOR STYLE</Eyebrow>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 300,
            fontSize: 'clamp(3rem, 7.5vw, 6.5rem)',
            lineHeight: 1.02, letterSpacing: '-0.025em',
            margin: '24px 0 28px', color: 'var(--fg-1)',
          }}>
            Your personal<br/>
            <em style={{ fontStyle: 'italic', fontWeight: 400 }}>AI stylist</em>.
          </h1>
          <p style={{
            fontFamily: 'var(--font-ui)', fontSize: 'clamp(1rem, 1.2vw, 1.125rem)',
            lineHeight: 1.55, color: 'var(--fg-2)',
            maxWidth: 460, margin: '0 0 40px',
          }}>
            Discover outfits engineered for your identity, confidence, and lifestyle.
            Built from 14M editorial frames.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <button className="btn-primary">Try AI Stylist</button>
            <button className="btn-ghost">Generate My Look</button>
          </div>
          {/* trust strip */}
          <div style={{ display: 'flex', gap: 24, marginTop: 56, alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>Trusted by</span>
            <div style={{ display: 'flex', gap: 28, opacity: 0.7 }}>
              {['VOGUE','HYPEBEAST','SSENSE','HIGHSNOBIETY'].map(l => (
                <span key={l} style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, letterSpacing: '0.15em', color: 'var(--fg-2)' }}>{l}</span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — rotating portrait + floating UI */}
        <div style={{ position: 'relative', aspectRatio: '3 / 4', maxHeight: 700 }}>
          {/* main rotating portrait */}
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: 24, overflow: 'hidden',
          }}>
            {tones.map((tone, i) => (
              <div key={i} style={{
                position: 'absolute', inset: 0,
                opacity: idx === i ? 1 : 0,
                transition: 'opacity 1400ms cubic-bezier(0.2,0.8,0.2,1)',
              }}>
                <Portrait label={labels[i]} aspectRatio="3 / 4" tone={tone} style={{ height: '100%' }}/>
              </div>
            ))}
            {/* slow rotation indicator ring */}
            <div style={{
              position: 'absolute', right: 16, top: 16,
              width: 44, height: 44, borderRadius: 999,
              border: '1px solid rgba(242,239,232,0.18)',
              animation: 'spin-slow 20s linear infinite',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            }}>
              <div style={{ marginTop: -4, width: 6, height: 6, borderRadius: 999, background: 'var(--accent)', boxShadow: '0 0 12px rgba(70,243,168,0.8)' }}/>
            </div>
          </div>

          {/* Floating glass card — Aura Score (top-left) */}
          <div className="glass" style={{
            position: 'absolute', left: -28, top: '18%',
            width: 220, padding: '16px 20px', borderRadius: 16,
            zIndex: 3,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: '0.20em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.65)' }}>AURA SCORE</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)' }}>↗ +12.4</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 300, fontSize: 44, lineHeight: 1, color: 'var(--fg-1)', marginTop: 8 }}>
              94.3<span style={{ fontSize: 20, color: 'rgba(242,239,232,0.5)' }}>%</span>
            </div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-2)', marginTop: 6 }}>trend confidence</div>
          </div>

          {/* Floating chip — Live weather (right) */}
          <WeatherHeroCard style={{
            position: 'absolute', right: -16, top: '46%',
            zIndex: 3,
          }}/>

          {/* Floating chip — Confidence (bottom-left) */}
          <div className="glass" style={{
            position: 'absolute', left: 16, bottom: 28,
            padding: '14px 16px', borderRadius: 14,
            zIndex: 3, display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ width: 32, height: 32, borderRadius: 999, background: 'rgba(70,243,168,0.18)', border: '1px solid rgba(70,243,168,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
              <Icon name="sparkles" size={14}/>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: '0.20em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.65)' }}>CONFIDENCE</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--fg-1)', marginTop: 2 }}>9.2 <span style={{ color: 'var(--fg-3)' }}>/ 10</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

Object.assign(window, { Hero });
