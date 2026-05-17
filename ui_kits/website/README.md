# PYVEX — Website UI Kit

A working recreation of the PYVEX marketing site. Mounted in `index.html`; component code lives in sibling `.jsx` files. Loaded with React 18 + Babel-standalone — open the HTML file directly, no build step required.

## Surfaces covered

| File | Section | Purpose |
|---|---|---|
| `Background.jsx` | Ambient | Drifting emerald blobs + film-grain overlay. Renders fixed behind everything. |
| `Nav.jsx`        | Nav | Floating glass pill, top-center, sticky. |
| `Hero.jsx`       | Hero | Fullscreen cinematic with rotating portrait, headline, 2x CTA, and 3 floating glass UI cards (Aura Score · Color match · Confidence). |
| `Features.jsx`   | AI Features | 8 capability cards in a 4-col grid with hover-glow emerald bloom. |
| `HowItWorks.jsx` | Method | 3-step flow with glow rings + horizontal connector. |
| `Dashboard.jsx`  | Dashboard preview | Mock product UI: sidebar nav, recommended outfits grid, score sparkline, trend heatmap, wardrobe stats. |
| `SocialProof.jsx`| Proof | 3 testimonial cards + 4 creator cards with live-using glass chip. |
| `Pricing.jsx`    | Membership | 3 tiers — Free, Pro Stylist, Elite Concierge. Pro is featured with emerald bloom. |
| `Footer.jsx`     | Footer | Newsletter + 4 link columns + app download badges + system-status pulse. |
| `Shared.jsx`     | Utilities | `<Icon>` (Lucide-source), `<Eyebrow>`, `<Portrait>` editorial placeholder. |

## How to use these in other designs

- Each component exports itself to `window` at the end of its file, so once `Shared.jsx` is loaded the others can use `<Icon>`, `<Eyebrow>`, `<Portrait>` freely.
- Inline styles reference the design-token CSS custom properties from `../../colors_and_type.css` (imported by `site.css`). Don't hard-code hex values — pull from `var(--accent)`, `var(--bg-elev-1)`, etc.
- The `<Portrait>` component is a deliberate placeholder. Replace with real AI-generated model imagery before launch.

## Known gaps / placeholders

- **Model imagery.** Sculptural-gradient silhouettes stand in. Real photography drops in via the same component API.
- **Logo mark.** Wordmark-only ("pyvex·me"). No glyph mark designed yet.
- **Interaction depth.** Buttons and tabs are non-functional — this is a high-fidelity look, not a working app.
- **Mobile responsiveness.** Layouts assume ≥1024px desktop. Mobile breakpoints not yet implemented.

## Files

```
ui_kits/website/
├── index.html        ← entry — wires everything together
├── site.css          ← page-level helpers (extends colors_and_type.css)
├── Shared.jsx        ← Icon, Eyebrow, Portrait
├── Background.jsx
├── Nav.jsx
├── Hero.jsx
├── Features.jsx
├── HowItWorks.jsx
├── Dashboard.jsx
├── SocialProof.jsx
├── Pricing.jsx
└── Footer.jsx
```
