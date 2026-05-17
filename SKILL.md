---
name: pyvex-design
description: Use this skill to generate well-branded interfaces and assets for PYVEX, a premium AI fashion intelligence platform. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping luxury dark-mode fashion-tech UI.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files (`colors_and_type.css`, `preview/`, `ui_kits/website/`, `assets/`).

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. Pull tokens from `colors_and_type.css` and components from `ui_kits/website/`.

If working on production code, you can copy assets and read the rules in `README.md` to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions (audience, surface, fidelity, mood), and act as an expert designer who outputs HTML artifacts *or* production code, depending on the need.

**Hard rules:**
- Dark only. No light theme. Default background `#050707`.
- One accent color: `#46F3A8` (Aura emerald). Use it sparingly — one glow per viewport.
- No emoji. No exclamation marks. Sentence-case headlines.
- Cormorant Garamond for display, Geist for UI, Geist Mono for numbers/data.
- Glow, not shadow. Hairline borders. 1.5px-stroke icons (Lucide).
