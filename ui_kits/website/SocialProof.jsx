/* Social Proof — testimonials + creator cards */
const TESTIMONIALS = [
  { quote: 'It reads the room before I walk in.', name: 'Naomi Okafor', handle: '@naomiok', role: 'Editor, ATELIER' },
  { quote: 'The first time my closet has felt curated, not collected.', name: 'Liang Wei', handle: '@liang.studio', role: 'Architect' },
  { quote: 'I stopped second-guessing what to wear three months ago.', name: 'Iris Bellamy', handle: '@irisbellamy', role: 'Creator, 2.1M' },
];

const CREATORS = [
  { name: 'Naomi Okafor',   handle: '@naomiok',     followers: '847K', tone: 'jade' },
  { name: 'Iris Bellamy',   handle: '@irisbellamy', followers: '2.1M', tone: 'emerald' },
  { name: 'Yusuf Demir',    handle: '@yusufdemir',  followers: '1.4M', tone: 'smoke' },
  { name: 'Mira Castellan', handle: '@miracst',     followers: '612K', tone: 'bone' },
];

const SocialProof = () => (
  <section className="section" id="creators">
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 64, gap: 24, flexWrap: 'wrap' }}>
        <div>
          <Eyebrow>· FOR THE FEW</Eyebrow>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 300,
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            lineHeight: 1.05, letterSpacing: '-0.02em',
            margin: '20px 0 0', color: 'var(--fg-1)',
          }}>
            Trusted by <em style={{ fontStyle: 'italic' }}>100K+</em>.
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex' }}>
            {['#0A3A2E','#15614A','#46F3A8','#0A3A2E','#15614A'].map((c,i) => (
              <div key={i} style={{ width: 32, height: 32, borderRadius: 999, background: c, border: '2px solid var(--bg)', marginLeft: i ? -10 : 0 }}/>
            ))}
          </div>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-2)' }}>+ 99,847 styled this month</span>
        </div>
      </div>

      {/* testimonials row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {TESTIMONIALS.map(t => (
          <div key={t.name} className="card-editorial" style={{ padding: 28 }}>
            <div style={{ color: 'var(--accent)', marginBottom: 16 }}>
              <Icon name="sparkles" size={16}/>
            </div>
            <p style={{
              fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 22,
              lineHeight: 1.25, letterSpacing: '-0.01em',
              margin: '0 0 28px', color: 'var(--fg-1)',
            }}>
              &ldquo;{t.quote}&rdquo;
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 999, background: 'var(--bg-elev-2)', border: '1px solid var(--border)' }}/>
              <div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500 }}>{t.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>{t.handle} · {t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* creators marquee */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {CREATORS.map(c => (
          <div key={c.handle} style={{ position: 'relative' }}>
            <Portrait label={c.name.toUpperCase()} tone={c.tone} aspectRatio="1 / 1" style={{ borderRadius: 16 }}/>
            <div style={{
              position: 'absolute', left: 12, bottom: 12, right: 12,
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 15, color: 'var(--fg-1)' }}>{c.handle}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-2)', letterSpacing: '0.12em' }}>{c.followers} FOLLOWERS</div>
              </div>
              <div className="glass" style={{ padding: '4px 8px', borderRadius: 999, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }}/>
                using
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

Object.assign(window, { SocialProof });
