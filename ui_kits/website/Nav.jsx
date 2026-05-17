/* Floating glass nav pill — top-center, sticky */
const Nav = () => {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', f); return () => window.removeEventListener('scroll', f);
  }, []);

  const navStyle = {
    position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
    zIndex: 100,
    display: 'flex', alignItems: 'center', gap: 4,
    padding: '8px 8px 8px 24px',
    background: scrolled ? 'rgba(14,19,17,0.78)' : 'rgba(14,19,17,0.45)',
    backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(242,239,232,0.10)',
    borderRadius: 999,
    boxShadow: scrolled
      ? 'inset 0 1px 0 rgba(242,239,232,0.08), 0 16px 40px rgba(0,0,0,0.5)'
      : 'inset 0 1px 0 rgba(242,239,232,0.06)',
    transition: 'all 400ms cubic-bezier(0.2,0.8,0.2,1)',
  };
  const linkStyle = {
    fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-2)',
    padding: '8px 14px', borderRadius: 999,
    transition: 'color 300ms', cursor: 'pointer',
  };
  return (
    <nav style={navStyle}>
      <a style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 19, color: 'var(--fg-1)', letterSpacing: '-0.01em', marginRight: 8 }}>
        pyvex<span style={{ color: 'var(--accent)', textShadow: '0 0 12px rgba(70,243,168,0.6)' }}>·</span>me
      </a>
      <span style={{ width: 1, height: 14, background: 'rgba(242,239,232,0.16)', margin: '0 4px' }}/>
      <a style={{ ...linkStyle, color: 'var(--fg-1)' }}>Stylist</a>
      <a href="wardrobe.html" style={linkStyle}>Wardrobe</a>
      <a href="shop.html" style={linkStyle}>Shop</a>
      <a style={linkStyle}>Trends</a>
      <a style={linkStyle}>Pricing</a>
      <a href="login.html" style={{ ...linkStyle, marginRight: 4 }}>Sign in</a>
      <button className="btn-primary" style={{ marginLeft: 2, padding: '8px 16px', fontSize: 13 }}>Begin</button>
    </nav>
  );
};

Object.assign(window, { Nav });
