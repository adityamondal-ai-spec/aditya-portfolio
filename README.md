# Interactive 3D Portfolio

**Live:** https://aditya-portfolio-dusky-seven.vercel.app

A personal portfolio site built as a single continuous, scroll-reactive experience — a real-time 3D particle field and rotating shape sit behind every section (not just the hero), tracking cursor movement on desktop and touch-drag on mobile, with parallax driven by scroll position.

## Features

- **3D background** — a Three.js/React Three Fiber scene (star field + rotating knot geometry) mounted once and fixed behind the entire page, so there's no hard seam between sections
- **Cursor & touch interactivity** — the 3D scene eases toward the mouse on desktop and toward touch-drag on mobile, purely passive (no click required)
- **Scroll-driven animations** — scroll progress bar, parallax hero text, scroll-triggered reveals, animated stat counters, an active-section navbar, and a magnetic-hover button effect, all via Framer Motion
- **Mini-game** — a lightweight canvas-based "tap to jump" endless runner (Chrome-dino-style mechanic) tucked in at the end of the page
- **Mobile-specific performance tuning** — reduced particle count, throttled frame rate, lower-poly 3D geometry, and disabled backdrop blur on small screens, since blurring an animated layer is one of the most expensive things a phone GPU can do
- **`prefers-reduced-motion` support** — animations are shortened/disabled site-wide when the user's OS setting requests it

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — build tool & dev server
- **Three.js** + **React Three Fiber** + **drei** — 3D scene
- **Framer Motion** — animation
- **Tailwind CSS v4** — styling (CSS-first config via `@tailwindcss/vite`, no `tailwind.config.js`)

Pure client-side rendering (CSR) — no backend, no SSR/SSG, deployed as a static build.

## Running locally

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

To build for production:

```bash
npm run build
```
