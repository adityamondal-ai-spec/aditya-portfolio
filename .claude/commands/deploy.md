---
description: Deploy the portfolio to production (psi-self) and verify the live site
---

Deploy this portfolio to production. Steps:

1. `git status -sb` — if there are uncommitted changes, show them and **ask Aditya before committing** (don't commit silently). Commit only the intended files.
2. `git push origin main` — this **auto-deploys the canonical Vercel project** (`aditya-portfolio-psi-self.vercel.app`, git-connected).
3. Wait ~30–60s for Vercel, then verify the LIVE site serves the intended **static** build with Client Work:
   ```bash
   curl -s -L --compressed "https://aditya-portfolio-psi-self.vercel.app/?cb=$RANDOM" | grep -o "SHIPPED FOR REAL CLIENTS" && echo "OK: Client Work live" || echo "NOT yet — re-check in ~30s"
   ```
   Poll a few times if needed (deploy can lag).
4. Report: the deployed commit SHA + the live verification result.

Guardrails:
- Live deploy = `static/index.html` (`vercel.json` → `outputDirectory: static`). Do **not** switch to the `src/` React build unless explicitly asked.
- `dusky-seven` is a duplicate project (not canonical) — ignore it here.
- Never force-push. If the push is rejected, `git pull --rebase` and retry.
