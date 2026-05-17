# Contributing to PYVEX

Thanks for your interest in contributing.

## Working on the design system

- All tokens live in `colors_and_type.css`. **Don't hard-code hex values** in component code — pull from `var(--accent)`, `var(--bg-elev-1)`, etc.
- Every preview card under `preview/` should be ≤700px wide and ≤400px tall.
- Add new cards via `register_assets` if working through the design-system tooling.

## Working on the UI kit

- Files live under `ui_kits/website/`. Plain `.jsx` loaded via `<script type="text/babel">`.
- Each component file ends with `Object.assign(window, { ComponentName })` so other files can use it.
- **Never use a global `const styles = {…}`** — name your style object after the component (e.g. `heroStyles`) to avoid collisions.
- Keep files small. If a component grows past ~250 lines, split it.

## Working on the backend

- Keep `server/index.js` slim; move new routes into `server/routes/<name>.js` when there are more than three.
- Every mutating endpoint must call `requireAuth` before touching data.
- Never log tokens or full request bodies in production.

## Commit style

Plain conventional commits are fine:

```
feat: add Skin Tone Analyzer section
fix(login): handle Clerk OAuth redirect error
docs(server): add JWT verification example
```

## Security

If you find a security issue, **don't open a public issue.** Email the maintainer privately. Never paste secret keys, JWTs, or tokens into PRs, screenshots, or chat.
