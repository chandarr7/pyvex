# PYVEX — Backend

Minimal Express server that verifies Clerk session tokens and serves protected API routes.

## Quick start

```bash
cd server
cp .env.example .env
# Open .env and paste a FRESH CLERK_SECRET_KEY (rotate the leaked one first).
npm install
npm run dev
```

Server boots on `http://localhost:4000`.

## Endpoints

| Method | Path                  | Auth | Purpose                                |
|--------|-----------------------|------|----------------------------------------|
| GET    | `/health`             | —    | Service health probe                   |
| GET    | `/me`                 | ✓    | Current Clerk user                     |
| GET    | `/wardrobe`           | ✓    | List the user's wardrobe (mock)        |
| POST   | `/wardrobe/items`     | ✓    | Add an item — `{kind, name, tone}`     |
| POST   | `/stylist/generate`   | ✓    | Mock outfit generation                  |

Protected routes require `Authorization: Bearer <session-jwt>`.

## How auth works

```
┌──────────────────┐   1. user signs in via Clerk    ┌──────────────────┐
│   Frontend       │ ──────────────────────────────► │   Clerk          │
│   (login.html)   │                                  │   (immune-bison) │
└──────────────────┘ ◄──────── session JWT ────────── └──────────────────┘
         │
         │ 2. await window.Clerk.session.getToken()
         │
         │ 3. fetch('/wardrobe', { headers: { Authorization: 'Bearer ' + jwt } })
         ▼
┌──────────────────────────────────────────────────────┐
│   This server                                        │
│                                                      │
│   verifyToken(jwt, { secretKey })                    │
│     → checks signature against Clerk's JWKS          │
│     → checks expiry, issuer, audience                │
│     → returns { sub: userId, sid: sessionId, ... }   │
│                                                      │
│   req.auth = { userId, sessionId, claims }           │
└──────────────────────────────────────────────────────┘
```

The publishable key (`pk_test_...`) identifies your Clerk instance; the secret key (`sk_test_...`) authorizes server-side calls and JWT verification.

## Calling from the frontend

In any page that loads `clerk.js`, get a token and attach it:

```js
const clerk = await window.loadClerk();
const token = await clerk.session.getToken();
const res = await fetch('http://localhost:4000/wardrobe', {
  headers: { Authorization: `Bearer ${token}` },
});
const { items } = await res.json();
```

## Security checklist

- [x] Secret key only in `.env` (gitignored). Never in `package.json`, never logged.
- [x] CORS restricted to `ALLOWED_ORIGINS`.
- [x] All mutating routes require auth.
- [ ] **You must rotate `sk_test_Za8b27...`** — it was pasted in chat.
- [ ] When deploying, use platform env vars (Fly secrets, Vercel env, Railway, etc.), not committed files.

## Replacing the mock store

The in-memory `wardrobes` map lives only as long as the process. Swap it for whatever DB you prefer — Postgres + Prisma, Supabase, Mongo, etc. The auth boundary stays the same: `req.auth.userId` is your foreign key.
