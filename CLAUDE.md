# aditya-portfolio — project notes for Claude

## ⚠️ Which site is LIVE (read first — easy to get wrong)
This repo contains **two separate implementations** of the portfolio:

| Path | What | Deployed? |
|------|------|-----------|
| **`static/index.html`** | DARK vanilla HTML/CSS/JS scroll-story (Anton + IBM Plex Mono, `#ff4d1f`). **Aditya's real/preferred design.** | **✅ LIVE** |
| `src/` | React 19 + Vite "Working Paper" (light) app | ❌ alternate, NOT live |

`vercel.json` controls this: `{"buildCommand":"true","outputDirectory":"static"}` → Vercel serves the `static/` folder. **Do NOT switch the deploy to the `src/` React build unless Aditya explicitly asks.** When editing "the site," edit **`static/index.html`**.

## Deploy
- **Canonical live URL:** https://aditya-portfolio-psi-self.vercel.app/ (git-connected — `git push origin main` auto-deploys it).
- `aditya-portfolio-dusky-seven.vercel.app` = a **duplicate** Vercel project (account `adityaa2`), git auto-deploy OFF, still serves the old React build. Not canonical.
- Use the `/deploy` command (`.claude/commands/deploy.md`) to push + verify the live site.

## Content
- `static/index.html` sections: `01 Hero → 02 Profile → 03 SHIPPED FOR REAL CLIENTS (Client Work) → 04 Projects → 05 Capabilities → 06 Contact`.
- **Client Work** (Jai Matadi Consultancy, Navraj Raja, Pandua Pharmacy, Munshi) lives in BOTH `static/index.html` (live) and `src/` (React).
- Known issue (pending): `static` section `s2` has a stat `data-count="2028"` labelled "B.Tech, AI/ML" — a graduation year shown as a count-up, which reads oddly. Candidate fix: replace with a real `data-count="3"` "Client sites live".

## Commands / stack
- Stack: Vite + React 19 + TypeScript + Three.js (@react-three/fiber) + framer-motion + Tailwind v4.
- `npm run dev` · `npm run build` (`tsc -b && vite build`) · `npm run lint` (**oxlint**).
- A PostToolUse hook (`.claude/settings.json`) runs oxlint on edited `src/**` `.ts`/`.tsx` files.
