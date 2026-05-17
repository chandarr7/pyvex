<h1 align="center">PYVEX</h1>

<p align="center">
  <em>Your personal AI stylist.</em><br/>
  A premium AI fashion intelligence platform — luxury fashion meets next-generation AI.
</p>

<p align="center">
  <a href="#quick-start"><img src="https://img.shields.io/badge/status-alpha-46F3A8?style=flat-square" alt="alpha"/></a>
  <img src="https://img.shields.io/badge/node-%E2%89%A520-0E1311?style=flat-square" alt="node 20+"/>
  <img src="https://img.shields.io/badge/auth-Clerk-46F3A8?style=flat-square" alt="Clerk"/>
  <img src="https://img.shields.io/badge/license-MIT-F2EFE8?style=flat-square" alt="MIT"/>
</p>

---

PYVEX helps users discover outfits, analyze style, generate AI looks, and receive personalized fashion recommendations based on body type, skin tone, gender, mood, weather, occasion, culture, trends, and budget.

This repository contains the **full design system**, a **working marketing-site UI kit** in React, and a **minimal Express backend** wired to Clerk for authentication.

## Repository map

```
.
├── README.md                   ← design system overview (this file points to it for detail)
├── SKILL.md                    ← Claude-Code-compatible skill manifest
├── LICENSE                     ← MIT
├── colors_and_type.css         ← the single source of truth for tokens
├── fonts/                      ← webfont @import notes (Google Fonts)
├── assets/icons/               ← Lucide SVG icon subset
├── preview/                    ← design-system preview cards (Type · Colors · Spacing · Components · Brand)
│
├── ui_kits/
│   └── website/                ← React + Babel marketing site
│       ├── index.html          ← full landing page
│       ├── login.html          ← Clerk-backed login / sign-up
│       ├── verify.html         ← OAuth redirect callback
│       ├── clerk.js            ← Clerk SDK loader (publishable key only)
│       ├── AUTH.md             ← auth integration docs
│       └── *.jsx               ← Hero, Features, Dashboard, VirtualTryOn, …
│
├── mcp-server/                 ← Model Context Protocol server (Node 20+)
│   ├── src/index.js            ← exposes 6 tools, 4 resources over stdio
│   ├── package.json
│   └── README.md
│
└── server/                     ← Node 20 + Express backend
    ├── index.js                ← verifies Clerk JWTs, exposes protected routes
    ├── package.json
    ├── .env.example            ← copy to .env and fill in your secret
    └── README.md
```

## Quick start

### Frontend (no build step)

The UI kit is plain HTML + React-via-Babel. Open `ui_kits/website/index.html` in any modern browser, or serve the project root over HTTP:

```bash
# anything that serves static files works
npx serve .
# → http://localhost:3000/ui_kits/website/index.html
```

### Backend (Express + Clerk)

```bash
cd server
cp .env.example .env
# Open .env and paste a FRESH CLERK_SECRET_KEY (see Security below).
npm install
npm run dev
# → http://localhost:4000
```

Smoke test:

```bash
curl http://localhost:4000/health
# → {"ok":true,"service":"pyvex",...}
```

## What's in the design system

- **Color** — obsidian field (`#050707`), three neutrals, one signature emerald (`#46F3A8`), one soft gold (`#D4B886`) — see `preview/color-*.html`.
- **Type** — Cormorant Garamond (display), Geist (UI), Geist Mono (data) — see `preview/type-*.html`.
- **Components** — buttons, inputs, eyebrows, chips, editorial cards, glass cards, scores, nav pill, AI indicators.
- **Motion** — single decelerated easing `cubic-bezier(0.2, 0.8, 0.2, 1)`; durations 180 / 300 / 600 / 1200ms.
- **Iconography** — Lucide outline icons at 1.5px stroke.

The full system definition lives in [`README.md`](./README.md) (this same file, scrolled further), [`colors_and_type.css`](./colors_and_type.css), and the cards under [`preview/`](./preview/).

## What's in the UI kit

The marketing site recreates PYVEX's full landing experience:

- Hero with rotating portrait + floating glass UI cards
- 12 AI capability cards
- 3-step method flow
- Mock product dashboard
- Skin-tone analyzer (live Claude integration)
- Virtual try-on fitting room
- Aesthetic engine (10 style worlds)
- Mobile app showcase (3 phone mockups)
- Social proof + testimonials
- Pricing (3 tiers)
- Final CTA + footer

Every component is a small, well-factored `.jsx` file exporting itself to `window`. No build step, no bundler.

## Security

> ⚠️ **Rotate `CLERK_SECRET_KEY` before deploying.** Earlier development pasted a `sk_test_...` value in chat; that key should be revoked in the Clerk dashboard and regenerated. Never commit a secret key, never put one in frontend code, never log it.

- The **publishable key** (`pk_test_…`) is safe to embed client-side — it identifies the Clerk instance.
- The **secret key** (`sk_test_…`) and **JWKS public key** are server-only and live in `server/.env` (gitignored).
- Backend CORS is restricted to `ALLOWED_ORIGINS` in `.env`.

Full integration notes: [`ui_kits/website/AUTH.md`](./ui_kits/website/AUTH.md) and [`server/README.md`](./server/README.md).

## License

[MIT](./LICENSE)

---

# Design System — full reference


# PYVEX — Design System

> An AI-powered personal fashion intelligence platform. Luxury fashion meets next-generation AI.

PYVEX is a premium AI fashion platform that helps users discover outfits, analyze style, and generate AI looks personalized to their body type, skin tone, mood, weather, occasion, culture, trends, and budget. The brand sits at the intersection of luxury fashion (think Prada, Bottega), Apple-level minimalism, and frontier AI (OpenAI, Tesla, Rabbit).

This design system is the canonical reference for typography, color, motion, iconography, and component patterns used across the PYVEX marketing site, web app, and future product surfaces.

## Sources

This system was built fresh from a written brief (no existing codebase or Figma file was provided for PYVEX). Reference materials for tone and visual aspiration:

- **Codebase attached:** `01_Career/` — Not related to PYVEX (personal career documents). Not used as a source.
- **Brand brief:** the prompt itself — luxury, cinematic, dark-emerald, glassmorphism, neon accents.
- **Aesthetic references** (informational only — not copied): Apple product pages, Prada editorial, OpenAI Sora marketing, Tesla site, Linear.app dark UI.

If/when production code or Figma comes online, this README should be updated with the live URLs and the UI kits regenerated against the real source of truth.

---

## Brand Personality

**Intelligent · Elegant · Powerful · Confident · Futuristic · Luxurious**

PYVEX is the well-dressed insider. It speaks with editorial restraint, never sells, never hypes. It assumes its reader has taste. The product is the proof.

**Audience:** Gen Z fashion enthusiasts, creators, influencers, professionals, and anyone treating personal style as personal branding.

---

## Content Fundamentals

### Voice
- **Editorial, not corporate.** Sentences are short. Statements are declarative. The brand does not hedge.
- **"Your", not "our".** The product orbits the user. We speak *to* them about *their* style.
- **No exclamation marks. Ever.** Confidence doesn't need volume.
- **No emoji.** Anywhere. The visual language carries the warmth.
- **No marketing verbs.** "Unlock", "supercharge", "revolutionize" are banned. Use real verbs: *generate*, *analyze*, *style*, *score*, *match*.

### Casing
- **Headlines:** Sentence case. Period at the end of declarative statements ("Your personal AI stylist.").
- **Buttons & CTAs:** Title Case, two-to-three words ("Try AI Stylist", "Generate My Look", "Begin Trial").
- **Labels & micro-copy:** lowercase or Title Case depending on weight — sparing use of ALL CAPS for eyebrow labels with letter-spacing.
- **Numbers:** always numerals ("100K+ users", "3 outfits", not "three").

### Tone examples

| ✗ Wrong | ✓ Right |
|---|---|
| "Unlock your style potential!" | "Your personal AI stylist." |
| "Our amazing AI helps you look great" | "Outfits engineered for your identity." |
| "Try it now! 🔥" | "Generate My Look" |
| "We analyze your body type" | "Style profiles built from how you actually move." |
| "Sign up today and save 50%" | "Begin trial. No card." |

### Section eyebrow pattern
Short ALL-CAPS label, tracked, with the emerald accent dot:
- `· INTELLIGENCE`
- `· THE WARDROBE`
- `· FOR THE FEW`

### Punctuation
- Em-dashes welcome, comma-light.
- "AI" is always capitalized; never "ai" or "Ai".
- No Oxford comma in marketing copy (editorial convention).

---

## Visual Foundations

### Color
The palette is **near-monochrome** with a single decisive accent.

- **Obsidian field:** `#050707` — the default page background. Not pure black; a hint of cool to read as deep night.
- **Carbon surface:** `#0E1311` — primary card / panel surface.
- **Graphite:** `#1A211E` — elevated surface, dividers.
- **Emerald deep:** `#0A3A2E` — for gradient floors and ambient washes.
- **Aura emerald (signature):** `#46F3A8` — the single neon accent. Use sparingly: one glow per viewport.
- **Jade gradient:** linear from `#0A3A2E` → `#15614A` → `#46F3A8` — for cinematic blooms behind hero subjects.
- **Bone:** `#F2EFE8` — off-white text/foreground. Never pure `#FFFFFF`; we want a slight warmth, like Prada paper stock.
- **Smoke:** `#8B928E` — secondary text.
- **Ash:** `#4A524E` — tertiary text, captions, disabled.

Imagery skews **cool, low-key, and grain-textured**, like cinematographic A24 color grading. Never warm, never punchy, never saturated. Black-and-white editorial photography is on-brand.

### Type
- **Display (serif):** **Cormorant Garamond** — italic and roman. Tight letter-spacing. Used for hero headlines, section titles, large numerals. This is the Prada voice.
- **UI (sans):** **Geist** — clean, technical, with crisp aperture. Used for body, buttons, UI chrome, dashboard surfaces. This is the Apple voice.
- **Mono:** **Geist Mono** — used for data, scores, timestamps, AI confidence values. This is the OpenAI voice.

Pairing rule: **serif speaks, sans operates.** Headlines and editorial moments in Cormorant. Everything functional in Geist. Numeric data in Geist Mono.

### Spacing
4-px base grid. Spacing tokens: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 192`.

Section gutters are generous — a hero section breathes with `192px` vertical padding on desktop. Density is *the opposite* of the brand.

### Backgrounds
- Default: solid obsidian (`#050707`) with a single drifting emerald blob (60vw, `blur(160px)`, 0.4 opacity).
- Section breaks: barely-visible 1px hairline in `rgba(242,239,232,0.06)`.
- Hero / showcase: **full-bleed cinematic image** with vignette + emerald bloom + film-grain overlay (8% noise SVG).
- No repeating patterns. No hand-drawn illustrations. No mesh gradients. No light themes.

### Motion & easing
- All easings: `cubic-bezier(0.2, 0.8, 0.2, 1)` (smooth, decelerated — "Apple curve").
- Durations: **300ms** for micro (hover), **600ms** for medium (card lift), **1200ms** for scroll-in reveals.
- Reveals: fade + 12px translate up. Never bounce. Never overshoot. Luxury is restrained.
- Continuous: an emerald glow blob drifts slowly behind the hero (8s loop, opacity-only pulse). The AI model rotates at 6deg/sec.

### Hover & press states
- **Hover (link / button):** background brightens by 6%, accent emerald glow ring fades in (0 → 24px spread, 0.3 opacity), 300ms.
- **Press:** scale `0.985`, no color change. Immediate (no transition on press).
- **Disabled:** 30% opacity, no glow.
- **Focus:** 1px emerald outline at 2px offset.

### Borders & dividers
Hairline only: `1px solid rgba(242,239,232,0.08)`. Cards use either no border (when they sit on contrast) or a single 1px hairline.

### Corner radii
- `2px` for inputs, small chips.
- `12px` for buttons and small cards.
- `20px` for medium cards and modals.
- `28px` for large feature panels.
- `999px` for pills and avatars.

Never larger than 28px on a flat surface — luxury reads as restrained.

### Shadows & glow
We use **glow, not shadow.** Black-on-black surfaces don't receive cast shadows well.

- **Soft glow (hover):** `0 0 0 1px rgba(70,243,168,0.2), 0 0 40px rgba(70,243,168,0.15)`
- **Inset depth:** `inset 0 1px 0 rgba(242,239,232,0.06)` — a 1px highlight on the top edge of cards, mimicking glass.
- **Modal lift:** `0 24px 60px rgba(0,0,0,0.6)` — the only cast shadow we use, only on truly elevated objects.

### Transparency & blur (glassmorphism)
- Glass surface: `background: rgba(14,19,17,0.6); backdrop-filter: blur(24px); border: 1px solid rgba(242,239,232,0.08);`
- Only over imagery or gradient — never over flat background (defeats the effect).
- Reserved for: nav bar, floating UI cards in hero, modal overlays.

### Cards
Two card archetypes:

1. **Editorial card (default).** Carbon surface (`#0E1311`), 20px radius, 1px hairline border, inset top highlight, no shadow, generous padding (32px+). Content-led.
2. **Glass card (floating).** Translucent over imagery, 24px blur, 16px radius, used sparingly for floating UI elements.

### Layout rules
- **Mobile-first.** Designed for 390px, adapted up to 1440px. Hero shows beautifully on phone first.
- **Max content width:** 1280px. Wider feels webby; tighter feels cramped.
- **Section padding:** 96px vertical mobile, 192px vertical desktop.
- **Type scale:** fluid via `clamp()` — the design must scale, not break.
- **Nav:** floating glass pill, top-center, never full-width-bar.

---

## Iconography

PYVEX uses **Lucide icons** as the primary icon system — a clean, geometric, 1.5px-stroke outline set that matches the technical-sans (Geist) ethos. Loaded via CDN: `https://unpkg.com/lucide-static@latest/icons/*.svg`.

**Substitution flag:** No icon set was specified in the brief. Lucide was chosen as the closest match to the "Apple + Prada + AI lab" aesthetic — geometric, restrained, 1.5px hairline, no fills. If you want a different system (e.g. Phosphor Thin, Heroicons Outline, or a custom set), let me know and I'll swap.

### Rules
- Stroke weight: always 1.5px. Never filled icons.
- Size: 16px for inline, 20px for buttons, 24px for navigation, 48px for hero / feature cards.
- Color: inherits text color (currentColor) at the same opacity as adjacent text.
- Emoji: **never**. Unicode symbols (·, →, ↗, ✓): allowed *sparingly* for editorial moments. The bullet "·" is part of our eyebrow pattern.
- Logo mark: AURA wordmark in Cormorant Garamond italic, with a small emerald dot replacing the dot on a lowercase "i" (when present) — but the wordmark is uppercase "AURA" with a luminous emerald "·" between letters in some lockups.

Icon assets live in `assets/icons/` (a curated subset copied from Lucide).

---

## Index — what's in this folder

| File | Purpose |
|---|---|
| `README.md` | This document. |
| `SKILL.md` | Cross-compatible skill manifest for Claude Code use. |
| `colors_and_type.css` | The single source of truth for tokens — CSS custom properties. |
| `fonts/` | Webfont files (or @import links) for Cormorant Garamond, Geist, Geist Mono. |
| `assets/` | Logos, icons, background imagery. |
| `assets/icons/` | Lucide SVGs used across the system. |
| `preview/` | HTML cards rendered in the Design System tab — type, color, spacing, components, brand. |
| `ui_kits/website/` | Marketing site UI kit — hero, features, dashboard preview, pricing, footer + a working `index.html`. |

---

## Open questions for the user

1. **Brand mark.** I've designed a wordmark-only logo ("AURA" in Cormorant). If you have a custom mark (monogram, sigil), please share.
2. **Fonts.** Cormorant Garamond, Geist, and Geist Mono are all loaded from Google Fonts CDN. If you have licensed alternatives (e.g. Söhne, GT America, NB International), drop the woff2 files in `fonts/` and I'll swap.
3. **Imagery.** Placeholder model imagery is used in the UI kit. Real AI-fashion model renders should replace these.
4. **Icon set.** Lucide is my best guess. Confirm or substitute.
