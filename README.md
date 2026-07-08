# Aditya Mondal — Portfolio

**Live:** https://aditya-portfolio-dusky-seven.vercel.app

## What's actually deployed

The live site is `static/index.html` — a single, self-contained, **hand-built vanilla HTML/CSS/JavaScript** page (no framework, no build step). Deployment is configured via `vercel.json`, which points Vercel at `static/` as the output directory and skips the build step entirely.

Features: a canvas-based constellation/particle background, a live in-browser sentiment classifier demo you can type into, a magnetic cursor that pulls toward links, a scroll-progress bar, and scroll-triggered reveals — all vanilla JS, no dependencies.

### Running it locally

It's a static file — just open it, or serve the `static/` folder with anything:

```bash
npx serve static
```

## `src/` — an undeployed React app

The `src/` directory contains a separate, complete **React 19 + TypeScript + Vite** implementation of this portfolio (the "Working Paper" design: a paper/ink editorial aesthetic with a canvas decision-boundary visualization, a scroll-drawn ink line, and a spring-eased custom cursor). It builds and runs correctly (`npm install && npm run dev`), but **it is not what's currently live** — the production deploy was switched to the static bundle above. It's kept in the repo in case work resumes on it; switching back means removing `vercel.json` (or pointing it at the Vite build output instead of `static/`).

## Other files

- `standalone.html` — a single-file, no-build export of the React app's design, for portability/sharing.
- `DESIGN_PROMPT.md` — a design-system brief for the React app's "Working Paper" aesthetic.
- `site-review/` — screenshots and notes from a visual audit of the live static site.
