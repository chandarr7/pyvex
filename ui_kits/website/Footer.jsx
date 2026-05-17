/* Footer — sleek minimal with newsletter + app downloads */
const Footer = () => (
  <footer className="section" style={{ paddingTop: 96, paddingBottom: 48, position: 'relative' }}>
    <div className="container">
      {/* newsletter row */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 64,
        paddingBottom: 64, marginBottom: 56, borderBottom: '1px solid var(--border)',
        alignItems: 'flex-end',
      }}>
        <div>
          <h3 style={{
            fontFamily: 'var(--font-display)', fontWeight: 300,
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            lineHeight: 1.05, letterSpacing: '-0.02em',
            margin: '0 0 16px', color: 'var(--fg-1)',
          }}>
            A dispatch from the <em style={{ fontStyle: 'italic' }}>studio</em>.
          </h3>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--fg-2)', margin: 0, maxWidth: 420 }}>
            Trends, capsules, and the occasional editorial. One Friday a month.
          </p>
        </div>
        <form style={{ display: 'flex', gap: 12, alignItems: 'center' }} onSubmit={e => e.preventDefault()}>
          <input
            placeholder="you@studio.com"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none', borderBottom: '1px solid var(--border-strong)',
              color: 'var(--fg-1)', fontFamily: 'var(--font-ui)', fontSize: 16,
              padding: '12px 0', outline: 'none',
            }}
          />
          <button className="btn-primary" type="submit" style={{ padding: '12px 22px' }}>Subscribe</button>
        </form>
      </div>

      {/* columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr repeat(4, 1fr)', gap: 32, marginBottom: 64 }}>
        <div>
          <a style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 28, color: 'var(--fg-1)', letterSpacing: '-0.01em' }}>
            pyvex<span style={{ color: 'var(--accent)', textShadow: '0 0 12px rgba(70,243,168,0.6)' }}>·</span>me
          </a>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-2)', maxWidth: 280, marginTop: 16, lineHeight: 1.55 }}>
            Personal AI for style.<br/>Engineered in Milan and Brooklyn.
          </p>
          {/* download badges */}
          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            {['iOS','Android'].map(p => (
              <a key={p} className="glass" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', borderRadius: 12,
                cursor: 'pointer',
              }}>
                <Icon name="download" size={16}/>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-3)', letterSpacing: '0.18em' }}>DOWNLOAD</span>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-1)' }}>{p}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
        {[
          { h: 'Product', l: ['AI Stylist','Wardrobe','Virtual Try-On','Trends','Pricing'] },
          { h: 'Studio',  l: ['Editorial','Capsules','Lookbooks','Press','Investors'] },
          { h: 'Company', l: ['About','Manifesto','Careers','Contact','Brand'] },
          { h: 'Legal',   l: ['Privacy','Terms','Cookies','Accessibility'] },
        ].map(col => (
          <div key={col.h}>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 14 }}>{col.h}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {col.l.map(item => (
                <li key={item}><a style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-2)', cursor: 'pointer' }}>{item}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* bottom bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 24, borderTop: '1px solid var(--border)',
        flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.08em' }}>
          © 2026 PYVEX STUDIOS · MILAN · BROOKLYN
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--accent)', boxShadow: '0 0 12px rgba(70,243,168,0.7)' }}/>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-2)', letterSpacing: '0.10em' }}>SYSTEM · OPERATIONAL</span>
          <span style={{ width: 1, height: 12, background: 'var(--border-strong)', margin: '0 4px' }}/>
          <div style={{ display: 'flex', gap: 10 }}>
            <a style={{ color: 'var(--fg-2)', cursor: 'pointer' }}><Icon name="instagram" size={16}/></a>
            <a style={{ color: 'var(--fg-2)', cursor: 'pointer' }}><Icon name="twitter" size={16}/></a>
            <a style={{ color: 'var(--fg-2)', cursor: 'pointer' }}><Icon name="globe" size={16}/></a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

Object.assign(window, { Footer });
