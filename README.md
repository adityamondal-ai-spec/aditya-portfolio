# Aditya Mondal — Portfolio

**Live:** https://aditya-portfolio-dusky-seven.vercel.app

## What's actually deployed

The live site is the **React 19 + TypeScript + Vite** app in `src/` — the "Working Paper" design: a paper/ink editorial aesthetic with a canvas decision-boundary visualization, a scroll-drawn ink line, a spring-eased custom cursor, and (on wide/fine-pointer desktops) a pinned cinematic scroll-story. Vercel builds it via `vercel.json` (`buildCommand: npm run build`, `outputDirectory: dist`).

### Running it locally

```bash
npm install && npm run dev
```

## `static/index.html` — an alternate vanilla build

`static/index.html` is a separate, self-contained **hand-built vanilla HTML/CSS/JavaScript** page (no framework, no build step) implementing the same portfolio. It was briefly the production deploy; the deploy has since been switched back to the React app above. It's kept in the repo as a no-dependency fallback — to serve it instead, point `vercel.json`'s `outputDirectory` back at `static/` (with `buildCommand: "true"`).

Serve it locally with:

```bash
npx serve static
```

## Other files

- `standalone.html` — a single-file, no-build export of the React app's design, for portability/sharing.
- `DESIGN_PROMPT.md` — a design-system brief for the React app's "Working Paper" aesthetic.
- `site-review/` — screenshots and notes from a visual audit of the live static site.

