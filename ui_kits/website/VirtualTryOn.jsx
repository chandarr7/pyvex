/* Virtual Try-On — large center avatar with garment carousel + before/after */

const LOOKS = [
  { name: 'The Capsule',     tone: 'bone',    items: ['Wool turtleneck','Pleated trouser','Loafer'],     score: '94' },
  { name: 'The Editorial',   tone: 'jade',    items: ['Cashmere coat','Silk shirt','Tapered slack'],     score: '91' },
  { name: 'The Off-Duty',    tone: 'smoke',   items: ['Boucl\u00e9 jacket','Wide jean','Suede boot'],    score: '88' },
  { name: 'The Black Tie',   tone: 'emerald', items: ['Tuxedo','Pleated shirt','Patent oxford'],         score: '96' },
  { name: 'The Soft Power',  tone: 'bone',    items: ['Belted blazer','Column skirt','Slingback'],       score: '92' },
];

const VirtualTryOn = () => {
  const [active, setActive] = React.useState(0);
  return (
    <section className="section" id="tryon">
      <div className="container">
        <div style={{ marginBottom: 56, maxWidth: 720 }}>
          <Eyebrow>· VIRTUAL TRY-ON</Eyebrow>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 300,
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            lineHeight: 1.05, letterSpacing: '-0.02em',
            margin: '20px 0 16px', color: 'var(--fg-1)',
          }}>
            See it before you <em style={{ fontStyle: 'italic' }}>commit</em>.
          </h2>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 17, lineHeight: 1.5, color: 'var(--fg-2)', margin: 0, maxWidth: 520 }}>
            Photoreal AI fitting room. Render any garment onto your build, in 4 seconds.
          </p>
        </div>

        <div style={{
          background: 'var(--bg-elev-1)',
          border: '1px solid var(--border)',
          borderRadius: 28,
          padding: 32,
          boxShadow: 'inset 0 1px 0 rgba(242,239,232,0.06), 0 60px 120px -40px rgba(0,0,0,0.8)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* ambient glow */}
          <div style={{
            position: 'absolute', left: '40%', top: '-20%',
            width: 500, height: 500, borderRadius: '50%',
            background: 'radial-gradient(closest-side, rgba(70,243,168,0.18), transparent 70%)',
            filter: 'blur(60px)', pointerEvents: 'none',
          }}/>

          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 260px', gap: 24, position: 'relative', minHeight: 520 }}>
            {/* LEFT — before */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--fg-3)' }}>· BEFORE</div>
              <Portrait label="ORIGINAL" tone="smoke" aspectRatio="3 / 4" style={{ borderRadius: 16 }}/>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-3)', lineHeight: 1.5 }}>
                Original portrait. Build, posture, palette extracted.
              </div>
            </div>

            {/* CENTER — after with rotating look */}
            <div style={{ position: 'relative' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--accent)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--accent)', boxShadow: '0 0 12px rgba(70,243,168,0.7)' }}/>
                · AFTER · LIVE RENDER
              </div>
              <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', aspectRatio: '3 / 4', maxHeight: 540 }}>
                {LOOKS.map((l, i) => (
                  <div key={i} style={{
                    position: 'absolute', inset: 0,
                    opacity: active === i ? 1 : 0,
                    transition: 'opacity 800ms cubic-bezier(0.2,0.8,0.2,1)',
                  }}>
                    <Portrait label="" tone={l.tone} aspectRatio="3 / 4" style={{ borderRadius: 20, height: '100%' }}/>
                  </div>
                ))}
                {/* scan line animation */}
                <div style={{
                  position: 'absolute', left: 0, right: 0, top: 0,
                  height: 2,
                  background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
                  boxShadow: '0 0 20px rgba(70,243,168,0.8)',
                  animation: 'scan 3s linear infinite',
                  pointerEvents: 'none',
                }}/>
                {/* corner ticks */}
                {[
                  {t:12,l:12,b:'auto',r:'auto', rot:'0deg'},
                  {t:12,r:12,b:'auto',l:'auto', rot:'90deg'},
                  {b:12,r:12,t:'auto',l:'auto', rot:'180deg'},
                  {b:12,l:12,t:'auto',r:'auto', rot:'270deg'},
                ].map((p, i) => (
                  <div key={i} style={{
                    position: 'absolute',
                    top: p.t, left: p.l, right: p.r, bottom: p.b,
                    width: 16, height: 16,
                    borderTop: '1px solid var(--accent)',
                    borderLeft: '1px solid var(--accent)',
                    transform: `rotate(${p.rot})`,
                  }}/>
                ))}
                {/* live score badge */}
                <div className="glass" style={{
                  position: 'absolute', right: 16, bottom: 16,
                  padding: '10px 14px', borderRadius: 12,
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.65)' }}>FIT SCORE</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--accent)' }}>{LOOKS[active].score}</span>
                </div>
              </div>
            </div>

            {/* RIGHT — look details + carousel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--fg-3)' }}>· LOOK</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontStyle: 'italic', fontSize: 28, lineHeight: 1.1, letterSpacing: '-0.01em', color: 'var(--fg-1)' }}>
                {LOOKS[active].name}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {LOOKS[active].items.map((it, i) => (
                  <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-1)' }}>
                    <span>{it}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>0{i+1}</span>
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--fg-3)' }}>· OTHER LOOKS</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {LOOKS.map((l, i) => (
                    <button key={i} onClick={() => setActive(i)} style={{
                      flex: 1, aspectRatio: '3 / 4', padding: 0,
                      border: `1px solid ${active === i ? 'rgba(70,243,168,0.5)' : 'var(--border)'}`,
                      borderRadius: 8, cursor: 'pointer',
                      background: 'transparent', overflow: 'hidden',
                      transition: 'all 300ms cubic-bezier(0.2,0.8,0.2,1)',
                      transform: active === i ? 'translateY(-2px)' : 'none',
                    }}>
                      <Portrait tone={l.tone} aspectRatio="3 / 4" label="" style={{ borderRadius: 6, height: '100%' }}/>
                    </button>
                  ))}
                </div>
                <button className="btn-primary" style={{ marginTop: 8 }}>Try this on me</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0%   { transform: translateY(0); }
          100% { transform: translateY(540px); }
        }
      `}</style>
    </section>
  );
};

Object.assign(window, { VirtualTryOn });
