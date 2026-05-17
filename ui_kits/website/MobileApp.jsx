/* Mobile App Showcase — 3 phone mockups side-by-side */

const PhoneFrame = ({ children, style = {} }) => (
  <div style={{
    position: 'relative',
    width: 280, height: 580,
    borderRadius: 44,
    background: '#0A0D0C',
    border: '1px solid rgba(242,239,232,0.10)',
    boxShadow: 'inset 0 0 0 8px #050707, inset 0 1px 0 9px rgba(242,239,232,0.06), 0 40px 80px -20px rgba(0,0,0,0.7), 0 0 60px -20px rgba(70,243,168,0.2)',
    overflow: 'hidden',
    ...style,
  }}>
    {/* dynamic island */}
    <div style={{
      position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)',
      width: 100, height: 28, borderRadius: 999, background: '#020303',
      zIndex: 10,
    }}/>
    {/* status bar */}
    <div style={{
      position: 'absolute', top: 20, left: 24, right: 24,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 500, color: 'var(--fg-1)',
      zIndex: 11,
    }}>
      <span>9:41</span>
      <span style={{ fontSize: 10, color: 'var(--fg-2)' }}>● ▮</span>
    </div>
    {/* screen content */}
    <div style={{ position: 'absolute', inset: 8, borderRadius: 36, overflow: 'hidden', background: 'var(--bg)' }}>
      <div style={{ position: 'absolute', inset: 0, paddingTop: 56 }}>
        {children}
      </div>
    </div>
  </div>
);

/* Screen 1 — AI stylist chat */
const ChatScreen = () => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '0 14px 14px' }}>
    {/* header */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0 14px', borderBottom: '1px solid var(--border)' }}>
      <div style={{ width: 28, height: 28, borderRadius: 999, background: 'linear-gradient(135deg, #0A3A2E, #46F3A8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="sparkles" size={12} style={{ color: '#050707' }}/>
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 14, color: 'var(--fg-1)' }}>aura</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 4, height: 4, borderRadius: 999, background: 'var(--accent)', boxShadow: '0 0 6px var(--accent)' }}/>
          ONLINE
        </div>
      </div>
    </div>
    {/* messages */}
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 14, overflow: 'hidden' }}>
      <div style={{ alignSelf: 'flex-end', maxWidth: '78%', background: 'var(--accent)', color: 'var(--obsidian)', padding: '10px 14px', borderRadius: '14px 14px 4px 14px', fontFamily: 'var(--font-ui)', fontSize: 12, lineHeight: 1.35 }}>
        Gallery opening at 7. Cool 14°C.
      </div>
      <div style={{ alignSelf: 'flex-start', maxWidth: '85%', background: 'var(--bg-elev-2)', color: 'var(--fg-1)', padding: '10px 14px', borderRadius: '14px 14px 14px 4px', fontFamily: 'var(--font-ui)', fontSize: 12, lineHeight: 1.4, border: '1px solid var(--border)' }}>
        Read. Wool turtleneck, pleated trouser, suede loafer. Olive for the room\u2019s lighting.
      </div>
      <div style={{ alignSelf: 'flex-start', maxWidth: '60%', padding: 4 }}>
        <Portrait tone="jade" aspectRatio="3 / 4" label="LOOK 01" style={{ borderRadius: 12, height: 180 }}/>
      </div>
      <div style={{ alignSelf: 'flex-start', maxWidth: '85%', background: 'var(--bg-elev-2)', color: 'var(--fg-2)', padding: '8px 12px', borderRadius: '14px 14px 14px 4px', fontFamily: 'var(--font-ui)', fontSize: 11, lineHeight: 1.4, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ display: 'flex', gap: 3 }}>
          <span style={{ width: 4, height: 4, borderRadius: 999, background: 'var(--accent)', animation: 'pulse-soft 1.2s ease-in-out infinite' }}/>
          <span style={{ width: 4, height: 4, borderRadius: 999, background: 'var(--accent)', animation: 'pulse-soft 1.2s ease-in-out infinite 0.2s' }}/>
          <span style={{ width: 4, height: 4, borderRadius: 999, background: 'var(--accent)', animation: 'pulse-soft 1.2s ease-in-out infinite 0.4s' }}/>
        </span>
        rendering two more
      </div>
    </div>
    {/* composer */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'var(--bg-elev-2)', borderRadius: 999, border: '1px solid var(--border)', marginTop: 10 }}>
      <Icon name="plus" size={14} style={{ color: 'var(--fg-3)' }}/>
      <span style={{ flex: 1, fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-3)' }}>Tell pyvex\u2026</span>
      <div style={{ width: 22, height: 22, borderRadius: 999, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="arrow" size={12} style={{ color: 'var(--obsidian)' }}/>
      </div>
    </div>
  </div>
);

/* Screen 2 — Outfit generator (scrolling feed) */
const GenerateScreen = () => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '0 14px 14px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0 14px' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 18, color: 'var(--fg-1)' }}>today</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-3)', letterSpacing: '0.12em' }}>12 LOOKS · MILAN · 14\u00b0C</div>
      </div>
      <div style={{ width: 32, height: 32, borderRadius: 999, background: 'var(--bg-elev-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-1)' }}>
        <Icon name="user" size={14}/>
      </div>
    </div>
    {/* chips */}
    <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
      {[{l:'All',a:true},{l:'Editorial'},{l:'Tailored'},{l:'Quiet'}].map((c, i) => (
        <span key={i} style={{
          fontFamily: 'var(--font-ui)', fontSize: 10, padding: '5px 10px',
          borderRadius: 999,
          background: c.a ? 'rgba(70,243,168,0.10)' : 'transparent',
          color: c.a ? 'var(--accent)' : 'var(--fg-2)',
          border: `1px solid ${c.a ? 'rgba(70,243,168,0.3)' : 'rgba(242,239,232,0.08)'}`,
        }}>{c.l}</span>
      ))}
    </div>
    {/* grid */}
    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, overflow: 'hidden' }}>
      {[
        {tone:'jade',    score:'94'},
        {tone:'emerald', score:'91'},
        {tone:'smoke',   score:'88'},
        {tone:'bone',    score:'86'},
        {tone:'emerald', score:'84'},
        {tone:'smoke',   score:'81'},
      ].map((o, i) => (
        <div key={i} style={{ position: 'relative' }}>
          <Portrait tone={o.tone} aspectRatio="3 / 4" label="" style={{ borderRadius: 10 }}/>
          <div style={{
            position: 'absolute', top: 6, right: 6,
            background: 'rgba(5,7,7,0.7)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(70,243,168,0.3)', borderRadius: 999,
            padding: '2px 6px', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent)',
          }}>{o.score}</div>
        </div>
      ))}
    </div>
    <button style={{
      marginTop: 12, padding: '12px 0',
      background: 'var(--accent)', color: 'var(--obsidian)',
      border: 'none', borderRadius: 999,
      fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500,
      boxShadow: '0 0 20px rgba(70,243,168,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    }}>
      <Icon name="sparkles" size={14}/>
      Generate more
    </button>
  </div>
);

/* Screen 3 — Camera scan */
const ScanScreen = () => (
  <div style={{ height: '100%', position: 'relative' }}>
    {/* live "camera" feed = portrait */}
    <Portrait tone="emerald" aspectRatio="auto" label="" style={{ position: 'absolute', inset: 0, borderRadius: 0 }}/>
    {/* scan brackets */}
    <div style={{ position: 'absolute', inset: '20% 14% 30%', pointerEvents: 'none' }}>
      {[
        {t:0,l:0,br:0,rot:'0deg'},
        {t:0,r:0,bl:0,rot:'90deg'},
        {b:0,r:0,tl:0,rot:'180deg'},
        {b:0,l:0,tr:0,rot:'270deg'},
      ].map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: p.t, left: p.l, right: p.r, bottom: p.b,
          width: 20, height: 20,
          borderTop: '1.5px solid var(--accent)',
          borderLeft: '1.5px solid var(--accent)',
          transform: `rotate(${p.rot})`,
          boxShadow: '0 0 10px rgba(70,243,168,0.6)',
        }}/>
      ))}
    </div>
    {/* top bar */}
    <div style={{ position: 'absolute', top: 14, left: 14, right: 14, display: 'flex', justifyContent: 'space-between' }}>
      <div className="glass" style={{ padding: '6px 10px', borderRadius: 999, fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-1)', letterSpacing: '0.12em' }}>STYLE SCAN</div>
      <div className="glass" style={{ padding: '6px 10px', borderRadius: 999, fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent)' }}>● REC</div>
    </div>
    {/* detected items */}
    <div style={{ position: 'absolute', left: 14, right: 14, bottom: 80, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {[
        {label:'JACKET',  detail:'Wool · Storm grey · 92%'},
        {label:'TROUSER', detail:'Wide-leg · Bone · 88%'},
        {label:'SHOE',    detail:'Loafer · Patent · 91%'},
      ].map((d, i) => (
        <div key={i} className="glass" style={{ padding: '8px 12px', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', color: 'var(--accent)' }}>{d.label}</span>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: 'var(--fg-1)' }}>{d.detail}</span>
        </div>
      ))}
    </div>
    {/* shutter */}
    <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', width: 56, height: 56, borderRadius: 999, border: '2px solid rgba(242,239,232,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 42, height: 42, borderRadius: 999, background: 'var(--accent)', boxShadow: '0 0 24px rgba(70,243,168,0.6)' }}/>
    </div>
  </div>
);

const PHONES = [
  { title: 'AI stylist chat',  caption: 'Conversational dressing. The brief in, the look out.',         Screen: ChatScreen,     offset: 24 },
  { title: 'Daily generation', caption: 'Twelve looks every morning, ranked and shoppable.',            Screen: GenerateScreen, offset: 0  },
  { title: 'Camera scan',      caption: 'Point at any outfit. Detect, score, save to your closet.',     Screen: ScanScreen,     offset: 24 },
];

const MobileApp = () => (
  <section className="section" id="mobile">
    <div className="container">
      <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 64px' }}>
        <Eyebrow>· IN YOUR POCKET</Eyebrow>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 300,
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          lineHeight: 1.05, letterSpacing: '-0.02em',
          margin: '20px 0 16px', color: 'var(--fg-1)',
        }}>
          The studio, on your <em style={{ fontStyle: 'italic' }}>phone</em>.
        </h2>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 17, lineHeight: 1.5, color: 'var(--fg-2)', margin: 0 }}>
          Chat, generate, scan. Three motions, one app. iOS and Android.
        </p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {PHONES.map((p, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: p.offset }}>
            <PhoneFrame><p.Screen/></PhoneFrame>
            <div style={{ textAlign: 'center', maxWidth: 240, marginTop: 28 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 20, color: 'var(--fg-1)', letterSpacing: '-0.01em' }}>{p.title}</div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-2)', marginTop: 6, lineHeight: 1.45 }}>{p.caption}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 56 }}>
        <a className="glass" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '14px 22px', borderRadius: 14, cursor: 'pointer' }}>
          <Icon name="download" size={20}/>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-3)', letterSpacing: '0.18em' }}>DOWNLOAD ON</div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--fg-1)', marginTop: 2 }}>the App Store</div>
          </div>
        </a>
        <a className="glass" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '14px 22px', borderRadius: 14, cursor: 'pointer' }}>
          <Icon name="download" size={20}/>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-3)', letterSpacing: '0.18em' }}>GET IT ON</div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--fg-1)', marginTop: 2 }}>Google Play</div>
          </div>
        </a>
      </div>
    </div>
  </section>
);

Object.assign(window, { MobileApp });
