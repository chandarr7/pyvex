/* PYVEX — shared bits: Icon, Eyebrow, Portrait placeholder */
/* Loaded as Babel JSX. Exports to window. */

const ICON_PATHS = {
  sparkles: <><path d="m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></>,
  shirt:    <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>,
  wand:     <><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></>,
  palette:  <><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></>,
  calendar: <><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M3 10h18"/><path d="M8 2v4"/></>,
  trending: <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>,
  wallet:   <><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></>,
  heart:    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/>,
  camera:   <><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></>,
  arrow:    <><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>,
  arrowUp:  <><path d="M7 7h10v10"/><path d="M7 17 17 7"/></>,
  search:   <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>,
  user:     <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  star:     <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
  check:    <path d="M20 6 9 17l-5-5"/>,
  menu:     <><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></>,
  plus:     <><path d="M5 12h14"/><path d="M12 5v14"/></>,
  mood:     <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>,
  weather:  <><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/></>,
  globe:    <><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></>,
  download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></>,
  twitter:  <path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497-3.753c-.001-.249 1.51-2.772 1.818-4.013z"/>,
  instagram:<><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></>,
};

const Icon = ({ name, size = 20, stroke = 1.5, style = {} }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size} height={size}
    viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={stroke}
    strokeLinecap="round" strokeLinejoin="round"
    style={style}
  >
    {ICON_PATHS[name] || null}
  </svg>
);

const Eyebrow = ({ children }) => (
  <span className="eyebrow">{children}</span>
);

/* Editorial portrait placeholder — sculptural gradient + figure silhouette. */
const Portrait = ({ label = "PORTRAIT", aspectRatio = "3 / 4", style = {}, tone = "emerald" }) => {
  const palettes = {
    emerald: {a:"#0F2820",b:"#040806", g:"rgba(70,243,168,0.18)"},
    bone:    {a:"#221F1A",b:"#0E0C09", g:"rgba(242,239,232,0.10)"},
    jade:    {a:"#0A3A2E",b:"#040806", g:"rgba(70,243,168,0.30)"},
    smoke:   {a:"#1A211E",b:"#0A1410", g:"rgba(122,255,194,0.08)"},
  };
  const p = palettes[tone] || palettes.emerald;
  return (
    <div className="portrait" style={{
      aspectRatio,
      borderRadius: 16,
      background: `radial-gradient(120% 80% at 30% 18%, ${p.g}, transparent 60%), linear-gradient(180deg, ${p.a} 0%, ${p.b} 100%)`,
      ...style,
    }}>
      {/* sculptural figure silhouette */}
      <svg className="portrait-figure" viewBox="0 0 100 140" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
        <defs>
          <linearGradient id={`figure-${label}`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="rgba(242,239,232,0.55)"/>
            <stop offset="100%" stopColor="rgba(242,239,232,0)"/>
          </linearGradient>
        </defs>
        {/* head */}
        <ellipse cx="50" cy="22" rx="11" ry="14" fill={`url(#figure-${label})`}/>
        {/* shoulders/torso */}
        <path d="M28 50 Q50 38 72 50 L 70 90 Q 65 100 65 130 L 55 138 L 52 95 L 48 95 L 45 138 L 35 130 Q 35 100 30 90 Z" fill={`url(#figure-${label})`}/>
      </svg>
      <span className="portrait-label">{label}</span>
    </div>
  );
};

Object.assign(window, { Icon, Eyebrow, Portrait });
