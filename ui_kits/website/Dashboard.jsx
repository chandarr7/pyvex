/* Dashboard preview — mock UI showing recommended outfits, analytics, heatmap, score */
const Dashboard = () => (
  <section className="section" id="dashboard" style={{ paddingTop: 'clamp(64px, 10vw, 128px)' }}>
    <div className="container">
      <div style={{ marginBottom: 64, maxWidth: 720 }}>
        <Eyebrow>· THE DASHBOARD</Eyebrow>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 300,
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          lineHeight: 1.05, letterSpacing: '-0.02em',
          margin: '20px 0 16px', color: 'var(--fg-1)',
        }}>
          Your <em style={{ fontStyle: 'italic' }}>wardrobe intelligence</em>.
        </h2>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 17, lineHeight: 1.5, color: 'var(--fg-2)', margin: 0, maxWidth: 520 }}>
          Style analytics. Saved looks. Trend heatmaps. One canvas to operate from.
        </p>
      </div>

      {/* dashboard frame */}
      <div style={{
        background: 'var(--bg-elev-1)',
        border: '1px solid var(--border)',
        borderRadius: 24,
        padding: 24,
        boxShadow: 'inset 0 1px 0 rgba(242,239,232,0.06), 0 60px 120px -40px rgba(0,0,0,0.8)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* window chrome */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 999, background: '#3A4441' }}/>
            <div style={{ width: 10, height: 10, borderRadius: 999, background: '#3A4441' }}/>
            <div style={{ width: 10, height: 10, borderRadius: 999, background: '#3A4441' }}/>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', marginLeft: 8 }}>pyvex.me · stylist</div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--accent)', boxShadow: '0 0 12px rgba(70,243,168,0.6)' }}/>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-2)', letterSpacing: '0.1em' }}>LIVE</span>
          </div>
        </div>

        {/* main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 320px', gap: 20 }}>
          {/* sidebar */}
          <div>
            {/* user */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 4px', marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 999, background: 'linear-gradient(135deg,#0A3A2E,#46F3A8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#050707', fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 16 }}>r</div>
              <div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500 }}>Rose Tanaka</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)' }}>elite member</div>
              </div>
            </div>
            {[
              { icon: 'sparkles', label: 'Today', active: true },
              { icon: 'shirt',    label: 'Wardrobe' },
              { icon: 'heart',    label: 'Saved looks' },
              { icon: 'trending', label: 'Trends' },
              { icon: 'calendar', label: 'Schedule' },
              { icon: 'wallet',   label: 'Budget' },
            ].map((it, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 10,
                background: it.active ? 'rgba(70,243,168,0.08)' : 'transparent',
                color: it.active ? 'var(--accent)' : 'var(--fg-2)',
                marginBottom: 2, fontFamily: 'var(--font-ui)', fontSize: 13,
                cursor: 'pointer',
              }}>
                <Icon name={it.icon} size={16}/>
                <span>{it.label}</span>
              </div>
            ))}
          </div>

          {/* center — recommended outfits */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 20, letterSpacing: '-0.01em' }}>Recommended today</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>milan · 14°C · gallery opening · 19:00</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {['Editorial','Tailored','Quiet'].map((c, i) => (
                  <span key={c} style={{
                    fontFamily: 'var(--font-ui)', fontSize: 11, padding: '6px 10px',
                    borderRadius: 999,
                    background: i===0 ? 'rgba(70,243,168,0.10)' : 'transparent',
                    color: i===0 ? 'var(--accent)' : 'var(--fg-2)',
                    border: `1px solid ${i===0 ? 'rgba(70,243,168,0.3)' : 'rgba(242,239,232,0.08)'}`,
                  }}>{c}</span>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[
                {tone:'jade',    score:'94', label:'LOOK 01'},
                {tone:'emerald', score:'91', label:'LOOK 02'},
                {tone:'smoke',   score:'88', label:'LOOK 03'},
                {tone:'bone',    score:'86', label:'LOOK 04'},
                {tone:'emerald', score:'84', label:'LOOK 05'},
                {tone:'smoke',   score:'81', label:'LOOK 06'},
              ].map((o, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <Portrait label={o.label} tone={o.tone} aspectRatio="3 / 4" style={{ borderRadius: 12 }}/>
                  <div style={{
                    position: 'absolute', top: 8, right: 8,
                    background: 'rgba(5,7,7,0.7)', backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(70,243,168,0.3)', borderRadius: 999,
                    padding: '3px 8px', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)',
                  }}>{o.score}</div>
                </div>
              ))}
            </div>
          </div>

          {/* right — analytics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* score block */}
            <div style={{ background: 'var(--bg-elev-2)', border: '1px solid var(--border)', borderRadius: 14, padding: 16, boxShadow: 'inset 0 1px 0 rgba(242,239,232,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>AURA SCORE</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)' }}>↗ +12.4</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 300, fontSize: 40, lineHeight: 1, color: 'var(--fg-1)', marginTop: 8 }}>94.3</div>
              {/* sparkline */}
              <svg viewBox="0 0 200 40" style={{ width: '100%', height: 36, marginTop: 8 }}>
                <path d="M0 30 L20 28 L40 24 L60 26 L80 18 L100 20 L120 14 L140 10 L160 12 L180 6 L200 4" stroke="#46F3A8" strokeWidth="1.5" fill="none"/>
                <path d="M0 30 L20 28 L40 24 L60 26 L80 18 L100 20 L120 14 L140 10 L160 12 L180 6 L200 4 L200 40 L0 40 Z" fill="url(#sg)" opacity="0.3"/>
                <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#46F3A8"/><stop offset="100%" stopColor="#46F3A8" stopOpacity="0"/></linearGradient></defs>
              </svg>
            </div>

            {/* trend heatmap */}
            <div style={{ background: 'var(--bg-elev-2)', border: '1px solid var(--border)', borderRadius: 14, padding: 16, boxShadow: 'inset 0 1px 0 rgba(242,239,232,0.06)' }}>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 10 }}>TREND HEATMAP · 28D</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(14, 1fr)', gap: 3 }}>
                {Array.from({length: 28}, (_, i) => {
                  const v = Math.abs(Math.sin(i * 1.3) + Math.cos(i * 0.7)) / 2;
                  return <div key={i} style={{ aspectRatio: '1', borderRadius: 2, background: `rgba(70,243,168,${0.05 + v * 0.85})` }}/>;
                })}
              </div>
            </div>

            {/* wardrobe stats */}
            <div style={{ background: 'var(--bg-elev-2)', border: '1px solid var(--border)', borderRadius: 14, padding: 16, boxShadow: 'inset 0 1px 0 rgba(242,239,232,0.06)' }}>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 12 }}>WARDROBE</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div><div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, color: 'var(--fg-1)' }}>147</div><div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-3)' }}>pieces</div></div>
                <div><div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, color: 'var(--fg-1)' }}>42</div><div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-3)' }}>outfits</div></div>
                <div><div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, color: 'var(--fg-1)' }}>9.2</div><div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-3)' }}>confidence</div></div>
                <div><div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, color: 'var(--accent)' }}>A+</div><div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-3)' }}>palette</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

Object.assign(window, { Dashboard });
