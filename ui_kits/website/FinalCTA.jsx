/* Final CTA — large emotional closing */

const FinalCTA = () => (
  <section className="section" id="cta" style={{ paddingTop: 'clamp(96px, 14vw, 192px)', paddingBottom: 'clamp(96px, 14vw, 192px)' }}>
    <div className="container">
      <div style={{
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(10,58,46,0.4) 0%, rgba(14,19,17,0.6) 60%, rgba(14,19,17,0.4) 100%)',
        border: '1px solid rgba(70,243,168,0.25)',
        borderRadius: 32,
        padding: 'clamp(64px, 10vw, 128px) clamp(32px, 6vw, 96px)',
        overflow: 'hidden',
        textAlign: 'center',
        boxShadow: 'inset 0 1px 0 rgba(70,243,168,0.15), 0 0 120px -40px rgba(70,243,168,0.4)',
      }}>
        {/* ambient blobs */}
        <div style={{
          position: 'absolute', left: '-10%', top: '-30%',
          width: '50%', height: '120%',
          background: 'radial-gradient(closest-side, #46F3A8, transparent 65%)',
          opacity: 0.18, filter: 'blur(80px)', pointerEvents: 'none',
          animation: 'drift 14s cubic-bezier(0.2,0.8,0.2,1) infinite',
        }}/>
        <div style={{
          position: 'absolute', right: '-10%', bottom: '-30%',
          width: '50%', height: '120%',
          background: 'radial-gradient(closest-side, #D4B886, transparent 65%)',
          opacity: 0.12, filter: 'blur(80px)', pointerEvents: 'none',
          animation: 'drift 18s cubic-bezier(0.2,0.8,0.2,1) infinite reverse',
        }}/>
        {/* grain */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><filter id="n"><feTurbulence baseFrequency="0.9" numOctaves="2"/></filter><rect width="200" height="200" filter="url(%23n)"/></svg>\')',
          opacity: 0.06, mixBlendMode: 'overlay', pointerEvents: 'none',
        }}/>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 880, margin: '0 auto' }}>
          <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'center' }}>
            <Eyebrow>· THE NEXT WARDROBE</Eyebrow>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 300,
            fontSize: 'clamp(3rem, 7vw, 6rem)',
            lineHeight: 1.0, letterSpacing: '-0.025em',
            margin: '0 0 32px', color: 'var(--fg-1)',
          }}>
            Upgrade your appearance.<br/>
            <em style={{ fontStyle: 'italic' }}>Upgrade your identity</em>.
          </h2>
          <p style={{
            fontFamily: 'var(--font-ui)', fontSize: 'clamp(1rem, 1.3vw, 1.25rem)',
            lineHeight: 1.55, color: 'var(--fg-2)',
            maxWidth: 540, margin: '0 auto 48px',
          }}>
            Join the future of fashion intelligence. Built for the few who treat style as signal.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" style={{ padding: '16px 28px', fontSize: 15 }}>
              Begin AI styling
            </button>
            <button className="btn-ghost" style={{ padding: '15px 27px', fontSize: 15 }}>
              View demo
            </button>
          </div>
          <div style={{
            marginTop: 40,
            display: 'flex', gap: 24, justifyContent: 'center', alignItems: 'center',
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em',
            color: 'var(--fg-3)', textTransform: 'uppercase', flexWrap: 'wrap',
          }}>
            <span>FREE FOREVER PLAN</span>
            <span style={{ width: 1, height: 12, background: 'var(--border-strong)' }}/>
            <span>NO CARD</span>
            <span style={{ width: 1, height: 12, background: 'var(--border-strong)' }}/>
            <span>4-SECOND ANALYSIS</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

Object.assign(window, { FinalCTA });
