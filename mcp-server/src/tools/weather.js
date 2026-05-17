/* Weather lookup — geocode a city, then fetch forecast.
 * Returns simplified, MCP-friendly JSON. */

const GEOCODE_URL  = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_HOST = 'open-weather13.p.rapidapi.com';

const CONDITION_MAP = {
  Clear:        { label: 'clear',     mood: 'Crisp light. Lean editorial.' },
  Clouds:       { label: 'overcast',  mood: 'Diffused tones. Quiet luxury.' },
  Rain:         { label: 'rain',      mood: 'Wet light. Architectural shapes.' },
  Drizzle:      { label: 'drizzle',   mood: 'Soft mist. Layered knits.' },
  Thunderstorm: { label: 'storm',     mood: 'Tension in the air. Go bold.' },
  Snow:         { label: 'snow',      mood: 'Bone wash. Heritage tailoring.' },
  Mist:         { label: 'mist',      mood: 'Veiled light. Go monochrome.' },
  Fog:          { label: 'fog',       mood: 'Veiled light. Go monochrome.' },
  Haze:         { label: 'haze',      mood: 'Honeyed sun. Soft warmth.' },
  Smoke:        { label: 'smoke',     mood: 'Diffused light. Go quiet.' },
  Dust:         { label: 'dust',      mood: 'Earth tones. Desert palette.' },
};

export async function geocodeCity(query) {
  const url = `${GEOCODE_URL}?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);
  const json = await res.json();
  if (!json.results || !json.results.length) {
    throw new Error(`City not found: "${query}". Try a fuller name like "Paris, France".`);
  }
  const r = json.results[0];
  return {
    name: r.name,
    country: r.country_code,
    label: [r.name, r.admin1, r.country_code].filter(Boolean).join(', '),
    lat: r.latitude,
    lon: r.longitude,
  };
}

export async function fetchWeather(lat, lon) {
  const key = process.env.RAPIDAPI_KEY;
  if (!key) throw new Error('RAPIDAPI_KEY env var is not set. Copy .env.example to .env and fill it in.');

  const url = `https://${WEATHER_HOST}/fivedaysforcast?latitude=${lat}&longitude=${lon}&lang=EN`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'x-rapidapi-host': WEATHER_HOST,
      'x-rapidapi-key': key,
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Weather API ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

export async function getWeather({ city }) {
  const loc = await geocodeCity(city);
  const raw = await fetchWeather(loc.lat, loc.lon);

  // open-weather13 returns Kelvin
  const kToF = (k) => Math.round((k - 273.15) * 9 / 5 + 32);
  const kToC = (k) => Math.round(k - 273.15);

  const first = raw.list && raw.list[0];
  if (!first) throw new Error('Weather API returned no data points.');

  const cond = first.weather && first.weather[0] && first.weather[0].main;
  const meta = CONDITION_MAP[cond] || CONDITION_MAP.Clear;

  const forecast = (raw.list || [])
    .filter((_, i) => i % 8 === 0)
    .slice(0, 5)
    .map(p => ({
      when: p.dt_txt ? p.dt_txt.slice(0, 10) : null,
      condition: p.weather && p.weather[0] && p.weather[0].main,
      tempF: kToF(p.main.temp),
      tempC: kToC(p.main.temp),
    }));

  return {
    location: loc.label,
    coordinates: { lat: loc.lat, lon: loc.lon },
    current: {
      condition: cond,
      label: meta.label,
      mood: meta.mood,
      tempF: kToF(first.main.temp),
      tempC: kToC(first.main.temp),
      feelsLikeF: kToF(first.main.feels_like),
      humidity: first.main.humidity,
      windMph: Math.round((first.wind && first.wind.speed) || 0),
    },
    forecast,
  };
}
