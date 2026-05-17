// PYVEX — minimal Express backend wired to Clerk for session verification.
//
// Endpoints:
//   GET  /health           — public health check
//   GET  /me               — protected; returns the signed-in Clerk user
//   GET  /wardrobe         — protected; returns the user's wardrobe (mock)
//   POST /wardrobe/items   — protected; adds an item to the wardrobe
//   POST /stylist/generate — protected; mock outfit-generation endpoint
//
// Security:
//   - Reads CLERK_SECRET_KEY from .env (NEVER hard-code).
//   - Verifies session JWTs against Clerk's JWKS via @clerk/backend.
//   - CORS restricted to ALLOWED_ORIGINS.

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createClerkClient, verifyToken } from '@clerk/backend';

// ─── Config ──────────────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT) || 4000;
const SECRET_KEY = process.env.CLERK_SECRET_KEY;
const PUBLISHABLE_KEY = process.env.CLERK_PUBLISHABLE_KEY;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',').map(s => s.trim()).filter(Boolean);

if (!SECRET_KEY || SECRET_KEY.includes('REPLACE_ME')) {
  console.error('\n[fatal] CLERK_SECRET_KEY is missing or still the placeholder.');
  console.error('         Copy server/.env.example to server/.env and fill in a fresh secret.\n');
  process.exit(1);
}

const clerk = createClerkClient({
  secretKey: SECRET_KEY,
  publishableKey: PUBLISHABLE_KEY,
});

// ─── App ─────────────────────────────────────────────────────────────────────
const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);          // server-to-server / curl
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

// ─── Auth middleware ─────────────────────────────────────────────────────────
// Extracts the Bearer token from the Authorization header, verifies it with
// Clerk, and stores { userId, sessionId, claims } on req.auth.
async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'missing_token' });

    const payload = await verifyToken(token, { secretKey: SECRET_KEY });
    req.auth = {
      userId: payload.sub,
      sessionId: payload.sid,
      claims: payload,
    };
    next();
  } catch (err) {
    console.warn('[auth] token verification failed:', err.message);
    return res.status(401).json({ error: 'invalid_token', detail: err.message });
  }
}

// ─── Routes ──────────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'pyvex', time: new Date().toISOString() });
});

// Return the current Clerk user
app.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await clerk.users.getUser(req.auth.userId);
    res.json({
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress ?? null,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error('[/me] error:', err);
    res.status(500).json({ error: 'user_fetch_failed' });
  }
});

// ─── In-memory mock wardrobe (replace with a real DB) ────────────────────────
const wardrobes = new Map();           // userId → [items]
const seed = (userId) => ([
  { id: 'i_001', kind: 'jacket',  name: 'Wool turtleneck',      tone: 'bone',    addedAt: Date.now() - 6e6 },
  { id: 'i_002', kind: 'trouser', name: 'Pleated wide-leg',     tone: 'smoke',   addedAt: Date.now() - 5e6 },
  { id: 'i_003', kind: 'shoe',    name: 'Suede loafer',          tone: 'jade',    addedAt: Date.now() - 3e6 },
]);

app.get('/wardrobe', requireAuth, (req, res) => {
  const { userId } = req.auth;
  if (!wardrobes.has(userId)) wardrobes.set(userId, seed(userId));
  res.json({ items: wardrobes.get(userId) });
});

app.post('/wardrobe/items', requireAuth, (req, res) => {
  const { userId } = req.auth;
  const { kind, name, tone } = req.body || {};
  if (!kind || !name) return res.status(400).json({ error: 'kind_and_name_required' });
  if (!wardrobes.has(userId)) wardrobes.set(userId, seed(userId));
  const item = {
    id: 'i_' + Math.random().toString(36).slice(2, 8),
    kind, name, tone: tone || 'smoke', addedAt: Date.now(),
  };
  wardrobes.get(userId).push(item);
  res.status(201).json(item);
});

// Mock stylist endpoint — your real implementation would call your AI model.
app.post('/stylist/generate', requireAuth, (req, res) => {
  const { occasion = 'casual', weatherC = 18, mood = 'neutral' } = req.body || {};
  res.json({
    generatedAt: new Date().toISOString(),
    forUserId: req.auth.userId,
    context: { occasion, weatherC, mood },
    looks: [
      { id: 'l_1', name: 'The Capsule',   score: 94, items: ['Wool turtleneck','Pleated trouser','Loafer'] },
      { id: 'l_2', name: 'The Editorial', score: 91, items: ['Cashmere coat','Silk shirt','Tapered slack'] },
      { id: 'l_3', name: 'The Off-Duty',  score: 88, items: ['Bouclé jacket','Wide jean','Suede boot'] },
    ],
  });
});

// ─── Boot ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\npyvex · server up on http://localhost:${PORT}`);
  console.log(`  health      GET  /health`);
  console.log(`  me          GET  /me               (auth)`);
  console.log(`  wardrobe    GET  /wardrobe         (auth)`);
  console.log(`  add item    POST /wardrobe/items   (auth)`);
  console.log(`  stylist     POST /stylist/generate (auth)\n`);
  console.log(`  CORS allowed origins: ${ALLOWED_ORIGINS.join(', ') || '(none)'}\n`);
});
