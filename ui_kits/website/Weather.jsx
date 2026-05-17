/* PYVEX — Weather intelligence + city search.
 *
 * SECURITY: the RapidAPI key here is exposed to anyone viewing source. Fine
 * for a prototype; for production, proxy through your backend.
 *
 * City lookup uses Open-Meteo's free, no-key geocoding API.
 */

const RAPIDAPI_KEY  = '31e8baf904msh54c9ad0e8b23363p1117e9jsnb0271a9d0f5d';
const RAPIDAPI_HOST = 'open-weather13.p.rapidapi.com';
const GEOCODE_URL   = 'https://geocoding-api.open-meteo.com/v1/search';

// ─────────────────────────────────────────────────────────────────────────
// Shared store: lets the Hero card and the Weather section stay in sync
// when the user picks a new city.
// ─────────────────────────────────────────────────────────────────────────
const weatherStore = {
  location: null, // { lat, lon, label }
  listeners: new Set(),
  set(loc) {
    this.location = loc;
    if (loc) {
      try { localStorage.setItem('aura.weather.loc', JSON.stringify(loc)); } catch (_) {}
    }
    this.listeners.forEach(fn => fn(loc));
  },
  subscribe(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); },
  init() {
    try {
      const saved = localStorage.getItem('aura.weather.loc');
      if (saved) this.location = JSON.parse(saved);
    } catch (_) {}
  },
};
weatherStore.init();

// ─────────────────────────────────────────────────────────────────────────
// Condition → editorial copy + palette tint
// ─────────────────────────────────────────────────────────────────────────
const CONDITION_MAP = {
  Clear:        { label: 'clear',     mood: 'Crisp light. Lean editorial.',         accent: 'gold',     adds: [] },
  Clouds:       { label: 'overcast',  mood: 'Diffused tones. Quiet luxury.',        accent: 'emerald',  adds: [] },
  Rain:         { label: 'rain',      mood: 'Wet light. Architectural shapes.',     accent: 'emerald',  adds: ['umbrella', 'waterproof boot'] },
  Drizzle:      { label: 'drizzle',   mood: 'Soft mist. Layered knits.',            accent: 'emerald',  adds: ['compact umbrella'] },
  Thunderstorm: { label: 'storm',     mood: 'Tension in the air. Go bold.',         accent: 'emerald',  adds: ['waterproof shell', 'umbrella'] },
  Snow:         { label: 'snow',      mood: 'Bone wash. Heritage tailoring.',       accent: 'bone',     adds: ['shearling lining', 'wool scarf'] },
  Mist:         { label: 'mist',      mood: 'Veiled light. Go monochrome.',         accent: 'emerald',  adds: [] },
  Fog:          { label: 'fog',       mood: 'Veiled light. Go monochrome.',         accent: 'emerald',  adds: [] },
  Haze:         { label: 'haze',      mood: 'Honeyed sun. Soft warmth.',            accent: 'gold',     adds: ['sunglasses'] },
  Smoke:        { label: 'smoke',     mood: 'Diffused light. Go quiet.',            accent: 'emerald',  adds: [] },
  Dust:         { label: 'dust',      mood: 'Earth tones. Desert palette.',         accent: 'gold',     adds: ['lightweight scarf'] },
};

// ─────────────────────────────────────────────────────────────────────────
// Outfit recommendation by temperature band — head-to-toe pieces
// ─────────────────────────────────────────────────────────────────────────
const tempToLook = (f, condition) => {
  let look;
  if (f >= 85) {
    look = {
      band: 'HOT', headline: 'Linen, in motion.',
      palette: ['#F2EFE8','#D9C9B3','#A89784','#7A6657'],
      pieces: [
        { slot: 'TOP',    item: 'Linen camp shirt',          note: 'unbuttoned, bone' },
        { slot: 'BOTTOM', item: 'Pleated linen trouser',     note: 'wide leg, soft drape' },
        { slot: 'FOOT',   item: 'Suede driving loafer',      note: 'no sock' },
        { slot: 'EXTRA',  item: 'Sunglasses, woven belt',    note: '' },
      ],
    };
  } else if (f >= 70) {
    look = {
      band: 'WARM', headline: 'Soft tailoring.',
      palette: ['#A89784','#7A6657','#3F4A45','#2C2825'],
      pieces: [
        { slot: 'TOP',    item: 'Fine merino tee',           note: 'storm grey' },
        { slot: 'OUTER',  item: 'Unstructured silk blazer',  note: 'oversized' },
        { slot: 'BOTTOM', item: 'Pleated cotton trouser',    note: 'tapered ankle' },
        { slot: 'FOOT',   item: 'Suede penny loafer',        note: 'cognac' },
      ],
    };
  } else if (f >= 55) {
    look = {
      band: 'COOL', headline: 'The trench answers.',
      palette: ['#3F4A45','#1A211E','#0F2820','#46524C'],
      pieces: [
        { slot: 'OUTER',  item: 'Camel trench coat',         note: 'belted at waist' },
        { slot: 'TOP',    item: 'Merino turtleneck',         note: 'storm grey' },
        { slot: 'BOTTOM', item: 'Wide-leg wool trouser',     note: 'pleated, ankle-break' },
        { slot: 'FOOT',   item: 'Leather Chelsea boot',      note: 'black, polished' },
        { slot: 'EXTRA',  item: 'Silk scarf',                note: '' },
      ],
    };
  } else if (f >= 40) {
    look = {
      band: 'COLD', headline: 'Cashmere armor.',
      palette: ['#1A211E','#0A1410','#2C2825','#3F4A45'],
      pieces: [
        { slot: 'OUTER',  item: 'Long wool overcoat',        note: 'navy, double-breasted' },
        { slot: 'TOP',    item: 'Cashmere knit',             note: 'oat or bone' },
        { slot: 'BOTTOM', item: 'Heavy wool trouser',        note: 'pleated' },
        { slot: 'FOOT',   item: 'Leather lace boot',         note: 'cordovan' },
        { slot: 'EXTRA',  item: 'Fine leather glove · scarf',note: '' },
      ],
    };
  } else if (f >= 25) {
    look = {
      band: 'FREEZE', headline: 'Heritage, layered.',
      palette: ['#0E1311','#F2EFE8','#46524C','#2C2825'],
      pieces: [
        { slot: 'OUTER',  item: 'Shearling-collar overcoat', note: 'tobacco' },
        { slot: 'LAYER',  item: 'Cashmere zip-neck',         note: 'beneath' },
        { slot: 'BOTTOM', item: 'Lined wool trouser',        note: 'flannel' },
        { slot: 'FOOT',   item: 'Insulated leather boot',    note: 'commando sole' },
        { slot: 'EXTRA',  item: 'Wool felt hat · cashmere scarf', note: '' },
      ],
    };
  } else {
    look = {
      band: 'SUBZERO', headline: 'Architectural warmth.',
      palette: ['#0E1311','#F2EFE8','#A89784','#46524C'],
      pieces: [
        { slot: 'OUTER',  item: 'Long down parka',           note: 'arctic-grade' },
        { slot: 'LAYER',  item: 'Merino base + cashmere',    note: 'double layered' },
        { slot: 'BOTTOM', item: 'Insulated trouser',         note: 'wool-lined' },
        { slot: 'FOOT',   item: 'Shearling-lined boot',      note: 'rubber sole' },
        { slot: 'EXTRA',  item: 'Wool balaclava · gloves',   note: '' },
      ],
    };
  }
  // condition-driven add-ons
  const cmap = CONDITION_MAP[condition] || {};
  if (cmap.adds && cmap.adds.length) {
    const extra = look.pieces.find(p => p.slot === 'EXTRA');
    if (extra) {
      extra.item = extra.item + ' · ' + cmap.adds.join(' · ');
    } else {
      look.pieces.push({ slot: 'EXTRA', item: cmap.adds.join(' · '), note: '' });
    }
  }
  return look;
};

// ─────────────────────────────────────────────────────────────────────────
// Geocoding — type a city name, get lat/lon back
// ─────────────────────────────────────────────────────────────────────────
async function geocodeCity(query) {
  if (!query || !query.trim()) return [];
  const url = `${GEOCODE_URL}?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocode ${res.status}`);
  const json = await res.json();
  if (!json.results) return [];
  return json.results.map(r => ({
    lat: r.latitude,
    lon: r.longitude,
    label: [r.name, r.admin1, r.country_code].filter(Boolean).join(', '),
    name: r.name,
    country: r.country_code,
  }));
}

// ─────────────────────────────────────────────────────────────────────────
// Weather fetch
// ─────────────────────────────────────────────────────────────────────────
async function fetchWeather({ lat, lon }) {
  const url = `https://${RAPIDAPI_HOST}/fivedaysforcast?latitude=${lat}&longitude=${lon}&lang=EN`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'x-rapidapi-host': RAPIDAPI_HOST,
      'x-rapidapi-key': RAPIDAPI_KEY,
    },
  });
  if (!res.ok) throw new Error(`Weather API ${res.status}`);
  return res.json();
}

// ─────────────────────────────────────────────────────────────────────────
// useWeather — subscribes to the shared store + falls back to geo / NYC
// ─────────────────────────────────────────────────────────────────────────
function useWeather() {
  const [state, setState] = React.useState('loading');
  const [data, setData]   = React.useState(null);
  const [loc, setLoc]     = React.useState(weatherStore.location);

  // subscribe to store changes
  React.useEffect(() => {
    return weatherStore.subscribe((l) => setLoc(l));
  }, []);

  // when loc resolves, fetch weather
  React.useEffect(() => {
    let cancelled = false;

    const go = async (coords) => {
      setState('loading');
      try {
        const json = await fetchWeather(coords);
        if (cancelled) return;
        setData(json);
        setState('ready');
      } catch (e) {
        if (cancelled) return;
        console.error('Weather fetch failed:', e);
        setState('error');
      }
    };

    if (loc) {
      go({ lat: loc.lat, lon: loc.lon });
      return () => { cancelled = true; };
    }

    // no user-selected loc yet — try geo, then NYC fallback
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => go({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        ()    => go({ lat: 40.730610, lon: -73.935242 }),
        { timeout: 3000 }
      );
    } else {
      go({ lat: 40.730610, lon: -73.935242 });
    }

    return () => { cancelled = true; };
  }, [loc && loc.lat, loc && loc.lon]);

  // derive current + forecast
  let current = null, forecast = [];
  if (data && data.list && data.list.length) {
    const first = data.list[0];
    const cond  = first.weather && first.weather[0] && first.weather[0].main;
    const meta  = CONDITION_MAP[cond] || CONDITION_MAP.Clear;
    // open-weather13 returns Kelvin by default — convert to F/C
    const kelvin = first.main.temp;
    const tempF = Math.round((kelvin - 273.15) * 9 / 5 + 32);
    const tempC = Math.round(kelvin - 273.15);
    const look  = tempToLook(tempF, cond);
    current = {
      city: (loc && loc.name) || (data.city && data.city.name) || 'NEW YORK',
      country: (loc && loc.country) || (data.city && data.city.country) || '',
      cond, ...meta,
      tempF, tempC,
      feelsF: Math.round((first.main.feels_like - 273.15) * 9 / 5 + 32),
      humidity: first.main.humidity,
      wind: Math.round((first.wind && first.wind.speed) || 0),
      ...look,
    };
    forecast = data.list.filter((_, i) => i % 8 === 0).slice(0, 5).map(p => {
      const c = p.weather && p.weather[0] && p.weather[0].main;
      const m = CONDITION_MAP[c] || CONDITION_MAP.Clear;
      const k = p.main.temp;
      const tF = Math.round((k - 273.15) * 9 / 5 + 32);
      return {
        cond: c, label: m.label, accent: m.accent,
        tempF: tF, tempC: Math.round(k - 273.15),
        when: p.dt_txt ? p.dt_txt.slice(5, 10) : '',
      };
    });
  }

  return { state, data, current, forecast };
}

// ─────────────────────────────────────────────────────────────────────────
// Glyphs
// ─────────────────────────────────────────────────────────────────────────
const WeatherGlyph = ({ cond, size = 22 }) => {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (cond) {
    case 'Clear':
      return <svg {...common}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>;
    case 'Clouds':
      return <svg {...common}><path d="M17.5 19a4.5 4.5 0 1 0-1.4-8.78A6 6 0 0 0 4 12a4 4 0 0 0 .5 7.92Z"/></svg>;
    case 'Rain':
    case 'Drizzle':
      return <svg {...common}><path d="M4 14.8A4 4 0 0 0 8 19h9a4 4 0 1 0-.4-7.94A6 6 0 0 0 5 10"/><path d="M8 19v3"/><path d="M12 21v3"/><path d="M16 19v3"/></svg>;
    case 'Snow':
      return <svg {...common}><path d="M4 14.8A4 4 0 0 0 8 19h9a4 4 0 1 0-.4-7.94A6 6 0 0 0 5 10"/><path d="M8 20v.01"/><path d="M12 21v.01"/><path d="M16 20v.01"/></svg>;
    case 'Thunderstorm':
      return <svg {...common}><path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/><polyline points="13 11 9 17 15 17 11 23"/></svg>;
    default:
      return <svg {...common}><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/></svg>;
  }
};

// ─────────────────────────────────────────────────────────────────────────
// City search — typeahead with suggestions
// ─────────────────────────────────────────────────────────────────────────
const CitySearch = ({ onPick }) => {
  const [q, setQ] = React.useState('');
  const [results, setResults] = React.useState([]);
  const [busy, setBusy] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const tRef = React.useRef(null);

  React.useEffect(() => {
    if (!q.trim() || q.length < 2) { setResults([]); return; }
    setBusy(true);
    if (tRef.current) clearTimeout(tRef.current);
    tRef.current = setTimeout(async () => {
      try {
        const r = await geocodeCity(q);
        setResults(r);
        setOpen(true);
      } catch (e) { console.error(e); }
      finally { setBusy(false); }
    }, 280);
    return () => tRef.current && clearTimeout(tRef.current);
  }, [q]);

  const pick = (r) => {
    weatherStore.set({ lat: r.lat, lon: r.lon, label: r.label, name: r.name, country: r.country });
    setQ(r.label);
    setOpen(false);
    if (onPick) onPick(r);
  };

  const popular = ['Milan', 'Paris', 'New York', 'Tokyo', 'London', 'Seoul'];

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px',
        background: 'var(--bg-elev-2)',
        border: `1px solid ${focused ? 'rgba(70,243,168,0.4)' : 'var(--border)'}`,
        borderRadius: 12,
        transition: 'border-color 300ms cubic-bezier(0.2,0.8,0.2,1)',
      }}>
        <Icon name="search" size={16} style={{ color: focused ? 'var(--accent)' : 'var(--fg-3)' }}/>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => { setFocused(true); if (results.length) setOpen(true); }}
          onBlur={() => { setFocused(false); setTimeout(() => setOpen(false), 180); }}
          placeholder="Type your city — Milan, Paris, Tokyo…"
          style={{
            flex: 1, background: 'transparent', border: 'none',
            color: 'var(--fg-1)', fontFamily: 'var(--font-ui)', fontSize: 14,
            outline: 'none',
          }}
        />
        {busy && (
          <span style={{ display: 'flex', gap: 3 }}>
            <span style={{ width: 4, height: 4, borderRadius: 999, background: 'var(--accent)', animation: 'pulse-soft 1.2s ease-in-out infinite' }}/>
            <span style={{ width: 4, height: 4, borderRadius: 999, background: 'var(--accent)', animation: 'pulse-soft 1.2s ease-in-out infinite 0.2s' }}/>
            <span style={{ width: 4, height: 4, borderRadius: 999, background: 'var(--accent)', animation: 'pulse-soft 1.2s ease-in-out infinite 0.4s' }}/>
          </span>
        )}
      </div>

      {/* suggestions */}
      {open && results.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 20,
          background: 'rgba(14,19,17,0.92)',
          backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(242,239,232,0.10)',
          borderRadius: 12,
          boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
          padding: 4, maxHeight: 280, overflowY: 'auto',
        }}>
          {results.map((r, i) => (
            <button
              key={i}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(r)}
              style={{
                width: '100%', textAlign: 'left',
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '10px 12px', borderRadius: 8,
                display: 'flex', alignItems: 'center', gap: 12,
                color: 'var(--fg-1)',
                transition: 'background 200ms',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(70,243,168,0.08)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <Icon name="globe" size={14} style={{ color: 'var(--fg-3)' }}/>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13 }}>{r.label}</span>
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)' }}>{r.country}</span>
            </button>
          ))}
        </div>
      )}

      {/* popular shortcuts */}
      <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
        {popular.map(c => (
          <button key={c}
            onClick={async () => {
              const [first] = await geocodeCity(c);
              if (first) pick(first);
            }}
            style={{
              fontFamily: 'var(--font-ui)', fontSize: 11,
              padding: '5px 11px', borderRadius: 999,
              background: 'transparent', color: 'var(--fg-2)',
              border: '1px solid var(--border)', cursor: 'pointer',
              transition: 'all 200ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(70,243,168,0.4)'; e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--fg-2)'; }}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// Hero floating weather glass card
// ─────────────────────────────────────────────────────────────────────────
const WeatherHeroCard = ({ style = {} }) => {
  const { state, current } = useWeather();
  if (state === 'loading') {
    return (
      <div className="glass" style={{ padding: '14px 16px', borderRadius: 14, minWidth: 200, ...style }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: '0.20em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.65)', marginBottom: 6 }}>WEATHER</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--accent)', animation: 'pulse-soft 1.2s ease-in-out infinite' }}/>
          <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--accent)', animation: 'pulse-soft 1.2s ease-in-out infinite 0.2s' }}/>
          <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--accent)', animation: 'pulse-soft 1.2s ease-in-out infinite 0.4s' }}/>
        </div>
      </div>
    );
  }
  if (!current) return null;
  const accentColor = current.accent === 'gold' ? 'var(--aura-gold)' : 'var(--accent)';
  return (
    <div className="glass" style={{ padding: '14px 16px', borderRadius: 14, minWidth: 200, ...style }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: '0.20em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.65)' }}>WEATHER</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(242,239,232,0.7)' }}>{(current.city || '').toUpperCase().slice(0, 14)}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
        <div style={{ color: accentColor }}><WeatherGlyph cond={current.cond} size={32}/></div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 300, fontSize: 28, color: 'var(--fg-1)', lineHeight: 1 }}>
            {current.tempF}°<span style={{ fontSize: 13, color: 'rgba(242,239,232,0.5)' }}>F</span>
          </span>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-2)', marginTop: 2, textTransform: 'lowercase' }}>{current.label}</span>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// WeatherStrip — full section: search + report + outfit
// ─────────────────────────────────────────────────────────────────────────
const WeatherStrip = () => {
  const { state, current, forecast } = useWeather();

  const accentColor = current && current.accent === 'gold' ? 'var(--aura-gold)' : 'var(--accent)';
  const accentGlow  = current && current.accent === 'gold' ? 'rgba(212,184,134,0.25)' : 'rgba(70,243,168,0.25)';

  return (
    <section className="section" id="weather" style={{ paddingTop: 'clamp(64px, 10vw, 128px)', paddingBottom: 'clamp(64px, 10vw, 128px)' }}>
      <div className="container">
        <div style={{ marginBottom: 40, maxWidth: 760 }}>
          <Eyebrow>· WEATHER ADAPTIVE</Eyebrow>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 300,
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            lineHeight: 1.05, letterSpacing: '-0.02em',
            margin: '20px 0 16px', color: 'var(--fg-1)',
          }}>
            Type your city. <em style={{ fontStyle: 'italic' }}>Get dressed</em>.
          </h2>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 17, lineHeight: 1.5, color: 'var(--fg-2)', margin: 0, maxWidth: 540 }}>
            PYVEX reads the sky over your city, then composes a head-to-toe look engineered for it.
          </p>
        </div>

        {/* Search */}
        <div style={{ maxWidth: 560, marginBottom: 32 }}>
          <CitySearch />
        </div>

        {/* Report */}
        <div style={{
          position: 'relative',
          background: 'var(--bg-elev-1)',
          border: `1px solid ${current && current.accent === 'gold' ? 'rgba(212,184,134,0.25)' : 'var(--border)'}`,
          borderRadius: 24, padding: 32, overflow: 'hidden',
          boxShadow: `inset 0 1px 0 rgba(242,239,232,0.06), 0 0 80px -40px ${accentGlow}`,
          minHeight: 280,
        }}>
          <div aria-hidden style={{
            position: 'absolute', right: '-10%', top: '-50%',
            width: '50%', height: '180%',
            background: `radial-gradient(closest-side, ${accentGlow}, transparent 65%)`,
            opacity: 0.6, filter: 'blur(80px)', pointerEvents: 'none',
          }}/>

          {state === 'loading' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.18em' }}>
              <span style={{ display: 'flex', gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--accent)', animation: 'pulse-soft 1.2s ease-in-out infinite' }}/>
                <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--accent)', animation: 'pulse-soft 1.2s ease-in-out infinite 0.2s' }}/>
                <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--accent)', animation: 'pulse-soft 1.2s ease-in-out infinite 0.4s' }}/>
              </span>
              READING THE FIELD
            </div>
          )}

          {state === 'error' && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#ff7a7a' }}>Couldn't reach the weather service. Try another city.</div>
          )}

          {state === 'ready' && current && (
            <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.1fr 1.4fr', gap: 40, alignItems: 'start' }}>
              {/* LEFT — the read */}
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--fg-3)' }}>· {(current.city || '').toUpperCase()}{current.country ? ' · ' + current.country : ''}</div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginTop: 16 }}>
                  <div style={{ color: accentColor }}><WeatherGlyph cond={current.cond} size={56}/></div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 72, lineHeight: 0.95, color: 'var(--fg-1)', letterSpacing: '-0.03em' }}>
                      {current.tempF}<span style={{ fontSize: 30, color: 'var(--fg-3)' }}>°F</span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22, color: 'var(--fg-2)', marginTop: 4 }}>{current.label}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 24, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>
                  <div>°C <span style={{ color: 'var(--fg-1)' }}>{current.tempC}°</span></div>
                  <div>FEELS <span style={{ color: 'var(--fg-1)' }}>{current.feelsF}°F</span></div>
                  <div>HUM <span style={{ color: 'var(--fg-1)' }}>{current.humidity}%</span></div>
                  <div>WIND <span style={{ color: 'var(--fg-1)' }}>{current.wind}</span></div>
                </div>

                <p style={{
                  fontFamily: 'var(--font-display)', fontWeight: 400, fontStyle: 'italic',
                  fontSize: 22, lineHeight: 1.25, color: 'var(--fg-1)',
                  margin: '32px 0 0', letterSpacing: '-0.01em',
                  paddingTop: 24, borderTop: '1px solid var(--border)',
                }}>
                  &ldquo;{current.mood}&rdquo;
                </p>

                {forecast.length > 1 && (
                  <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--fg-3)', marginBottom: 12 }}>· 5-DAY OUTLOOK</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
                      {forecast.map((d, i) => (
                        <div key={i} style={{ textAlign: 'center', flex: 1 }}>
                          <div style={{ color: d.accent === 'gold' ? 'var(--aura-gold)' : 'var(--accent)', display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
                            <WeatherGlyph cond={d.cond} size={18}/>
                          </div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-1)' }}>{d.tempF}°</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-3)', marginTop: 2 }}>{d.when}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT — outfit */}
              <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: 40 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', color: accentColor, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: accentColor, boxShadow: `0 0 12px ${accentColor}` }}/>
                  · {current.band} · WEAR THIS
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontStyle: 'italic', fontSize: 32, lineHeight: 1.1, color: 'var(--fg-1)', letterSpacing: '-0.01em', marginBottom: 24 }}>
                  {current.headline}
                </div>

                {/* pieces list */}
                <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border)' }}>
                  {current.pieces.map((p, i) => (
                    <div key={i} style={{
                      display: 'grid', gridTemplateColumns: '80px 1fr auto',
                      gap: 12, alignItems: 'baseline',
                      padding: '14px 0',
                      borderBottom: '1px solid var(--border)',
                    }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--fg-3)' }}>{p.slot}</span>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--fg-1)' }}>{p.item}</span>
                      <span style={{ fontFamily: 'var(--font-ui)', fontStyle: 'italic', fontSize: 12, color: 'var(--fg-3)' }}>{p.note}</span>
                    </div>
                  ))}
                </div>

                {/* palette */}
                <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--fg-3)' }}>PALETTE</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {current.palette.map((c, i) => (
                      <div key={i} style={{ width: 28, height: 28, borderRadius: 6, background: c, border: '1px solid rgba(242,239,232,0.12)' }}/>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
                  <button className="btn-primary" style={{ fontSize: 13, padding: '12px 20px' }}>Generate this look</button>
                  <button className="btn-ghost"   style={{ fontSize: 13, padding: '11px 19px' }}>Save to wardrobe</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

Object.assign(window, { useWeather, WeatherHeroCard, WeatherStrip, WeatherGlyph, CitySearch, weatherStore });
