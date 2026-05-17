/* Ambient page background — drifting emerald blobs + grain overlay.
   Renders fixed behind everything. */
const Background = () => (
  <div aria-hidden="true" style={{
    position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
    overflow: 'hidden',
  }}>
    {/* large emerald bloom upper-left */}
    <div style={{
      position: 'absolute', left: '-15%', top: '-30%',
      width: '70vw', height: '90vh',
      background: 'radial-gradient(closest-side, #46F3A8, transparent 65%)',
      opacity: 0.18, filter: 'blur(120px)',
      animation: 'drift 14s var(--ease) infinite',
    }}/>
    {/* deep jade bloom lower-right */}
    <div style={{
      position: 'absolute', right: '-20%', bottom: '-40%',
      width: '70vw', height: '90vh',
      background: 'radial-gradient(closest-side, #15614A, transparent 65%)',
      opacity: 0.45, filter: 'blur(120px)',
      animation: 'drift 18s var(--ease) infinite reverse',
    }}/>
    {/* film grain */}
    <div style={{
      position: 'absolute', inset: 0,
      background: 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence baseFrequency="0.9" numOctaves="2"/></filter><rect width="220" height="220" filter="url(%23n)"/></svg>\')',
      opacity: 0.06,
      mixBlendMode: 'overlay',
    }}/>
  </div>
);

Object.assign(window, { Background });
