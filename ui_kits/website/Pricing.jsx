/* Pricing — three futuristic cards, middle tier is emerald-accented */
const TIERS = [
  {
    name: 'Free',
    price: '0',
    period: '· forever',
    pitch: 'Begin the conversation.',
    features: [
      'Three AI outfits per week',
      'Basic style profile',
      'Mobile app · iOS / Android',
      'Public trend feed',
    ],
    cta: 'Begin trial',
    featured: false,
  },
  {
    name: 'Pro Stylist',
    price: '24',
    period: '/ month',
    pitch: 'For those building a personal brand.',
    features: [
      'Unlimited AI outfits',
      'Virtual try-on · all garments',
      'Smart closet · 500 pieces',
      'Real-time trend AI',
      'Saved looks · unlimited',
      'Priority generation queue',
    ],
    cta: 'Begin Pro',
    featured: true,
  },
  {
    name: 'Elite Concierge',
    price: '120',
    period: '/ month',
    pitch: 'White-glove AI styling.',
    features: [
      'Everything in Pro',
      'Dedicated AI fashion concierge',
      'Celebrity style recall',
      'Personal shopper integrations',
      'Early access to capsule drops',
      'Quarterly editorial calls',
    ],
    cta: 'Request access',
    featured: false,
  },
];

const PricingCard = ({ tier }) => {
  const featured = tier.featured;
  return (
    <div style={{
      position: 'relative',
      background: featured
        ? 'linear-gradient(180deg, rgba(70,243,168,0.06) 0%, rgba(14,19,17,0.6) 60%)'
        : 'var(--bg-elev-1)',
      border: `1px solid ${featured ? 'rgba(70,243,168,0.4)' : 'var(--border)'}`,
      borderRadius: 24,
      padding: 32,
      boxShadow: featured
        ? 'inset 0 1px 0 rgba(70,243,168,0.2), 0 0 80px rgba(70,243,168,0.15)'
        : 'inset 0 1px 0 rgba(242,239,232,0.06)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {featured && (
        <div style={{
          position: 'absolute', right: -40, top: -40,
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(closest-side, rgba(70,243,168,0.35), transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }}/>
      )}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 18, color: featured ? 'var(--accent)' : 'var(--fg-2)' }}>{tier.name}</div>
          {featured && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: '4px 10px', border: '1px solid rgba(70,243,168,0.4)', color: 'var(--accent)', borderRadius: 999, letterSpacing: '0.18em' }}>MOST CHOSEN</span>}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: 36, lineHeight: 1, color: 'var(--fg-1)', letterSpacing: '-0.02em', margin: '24px 0 12px' }}>
          {tier.pitch}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 28 }}>
          By invitation
        </div>
        <div style={{ height: 1, background: 'var(--border)', margin: '0 0 24px' }}/>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
          {tier.features.map(f => (
            <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--fg-1)', lineHeight: 1.4 }}>
              <span style={{ color: 'var(--accent)', marginTop: 2 }}><Icon name="check" size={14} stroke={2}/></span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <button
          className={featured ? 'btn-primary' : 'btn-ghost'}
          style={{ width: '100%', marginTop: 32 }}
        >{tier.cta}</button>
      </div>
    </div>
  );
};

const Pricing = () => (
  <section className="section" id="pricing">
    <div className="container">
      <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 64px' }}>
        <Eyebrow>· MEMBERSHIP</Eyebrow>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 300,
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          lineHeight: 1.05, letterSpacing: '-0.02em',
          margin: '20px 0 16px', color: 'var(--fg-1)',
        }}>
          A wardrobe at <em style={{ fontStyle: 'italic' }}>every level</em>.
        </h2>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 17, lineHeight: 1.5, color: 'var(--fg-2)', margin: 0 }}>
          Begin free. Upgrade when the algorithm has earned it.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, alignItems: 'stretch' }}>
        {TIERS.map(t => <PricingCard key={t.name} tier={t}/>)}
      </div>
    </div>
  </section>
);

Object.assign(window, { Pricing });
