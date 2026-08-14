# Aditya Mondal — Portfolio

**Live:** https://aditya-portfolio-psi-self.vercel.app

## What's actually deployed

The live site is `static/index.html` — a single, self-contained **hand-built vanilla HTML/CSS/JavaScript** scroll-story (dark editorial aesthetic, Anton/IBM Plex Mono, no framework, no build step). Vercel serves it via `vercel.json` (`buildCommand: "true"`, `outputDirectory: static`). Sections: hero → profile → **client work** → projects → capabilities → contact.

### Running it locally

It's a static file — just open it, or serve the `static/` folder:

```bash
npx serve static
```

## `src/` — an alternate React app (not deployed)

The `src/` directory is a separate **React 19 + TypeScript + Vite** implementation (the light "Working Paper" design with a canvas decision-boundary visualization and a pinned cinematic scroll-story). It builds and runs (`npm install && npm run dev`) but **is not what's currently live** — to deploy it instead, point `vercel.json` at the Vite build (`buildCommand: npm run build`, `outputDirectory: dist`).

## Other files

- `standalone.html` — a single-file, no-build export of the React app's design, for portability/sharing.
- `DESIGN_PROMPT.md` — a design-system brief for the React app's "Working Paper" aesthetic.
- `site-review/` — screenshots and notes from a visual audit of the live static site.

