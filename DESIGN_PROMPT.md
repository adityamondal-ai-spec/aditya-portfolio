# "Working Paper" — design system prompt

Copy-paste this to brief a fresh Claude session on this aesthetic, to extend this site or apply the same language elsewhere.

---

Build this in the "Working Paper" design language: a portfolio/site that reads like a researcher's working paper or lab notebook, not a SaaS landing page. The whole point is to reject the current default for "AI portfolio" — dark mode, one neon accent color, glassmorphism cards, a floating abstract 3D shape, animated gradient text. Everything here is the opposite of that: light, flat, ink-on-paper, and every visual element ties back to something real about the subject matter rather than being decorative.

## Tokens

Colors (6, all functional, none decorative):
- `paper` `#F7F3EA` — background, warm off-white, not pure white
- `paper-raised` `#F1ECDF` — slightly darker panel background for "raised" surfaces (charts, cards)
- `ink` `#1C1B17` — primary text, warm near-black
- `ink-dim` `#55524A` — secondary text
- `line` `#D9D2C0` — hairline rules and borders, never a shadow or gradient
- Plus a 3-color semantic set matching whatever the subject's own domain classifies into (here: `negative #A6402F` / `neutral #B8892E` / `positive #1F5C46`, literally the sentiment classifier's own class colors). If the subject doesn't have a natural 3-way split, don't force this — but always look for whether the domain itself has a real color language before inventing one.

Type (3 roles, no more):
- Display: **Fraunces** (serif, variable, has personality) — headlines only
- Body: **IBM Plex Sans** — everything readable
- Mono: **IBM Plex Mono** — data, labels, numbers, code links only, never decoratively

No gradients anywhere. No border-radius-and-glow. No centered hero text — everything left-aligned like a printed page.

## Layout

Single reading column, `max-w-3xl`, generous padding. Section labels are small mono eyebrows ("Introduction", "Case Studies", "Log"), not numbered 01/02/03 unless the number is real data (this site uses real accuracy figures and `n=` counts instead of arbitrary numbering). Hairline `border-top` between sections, never a shadow or fade. A narrow margin-rail (`grid-cols-[1fr_200px]`) for secondary metadata (education, skills) sitting beside the main prose, like annotations in a thesis margin.

## Signature elements (the load-bearing part — don't cut these, the rest is just template without them)

1. **A real data visualization as the hero centerpiece**, not a 3D shape. Here: "The Boundary" — a 2D canvas scatter plot of synthetic classifier data points, colored by the domain's real classes, with a hand-drawn-looking decision boundary curve (dashed, not solid, slightly wavy) separating them. Hover/tap surfaces a real example + its class. This replaces the generic "floating abstract 3D shape tracking your cursor" — it's 2D, cheap, and it's literally a picture of what the underlying system does, not a mood.
2. **A scroll-drawn ink line** in the left margin — an SVG path with deliberate hand-jitter (not a straight ruler), revealed via `stroke-dasharray`/`stroke-dashoffset` tied to scroll progress, with a small leading marker (quill tip / scroll roller) sitting at the current draw position.
3. **A custom cursor** on desktop only (`(hover: hover) and (pointer: fine)`, gated off for touch) — a small pen-nib shape with spring-lag (lerp toward the real pointer, not 1:1), tilts to face the direction of travel, grows slightly over interactive elements, small ink-blot pulse on click.
4. **An "unrolling scroll" reveal on the hero headline** — the actual first-5-seconds hook. A flat, ink-toned scroll-roller graphic (rod + end caps + torn parchment edge, NOT a photoreal texture) sits over the headline on load and peels back via `clip-path: inset()` synced to a moving `translateY`, revealing the text underneath. One-time load animation, not scroll-linked.
5. A tiny interactive quiz/demo tied to the actual subject matter (here: guess-the-sentiment on held-out-style examples) instead of a generic unrelated mini-game — the interactive moment should always be *about the actual work*, not an arbitrary distraction bolted on for "delight."

## Non-negotiable performance/accessibility discipline (this took real debugging to get right — don't skip it)

- **Every scroll/mousemove handler must be `requestAnimationFrame`-throttled** and gated on an `IntersectionObserver` visibility check — an ungated scroll listener anywhere on the page will keep doing full work even when its element is off-screen, which is real, measurable, wasted cost, not a hypothetical one.
- **Never call `getBoundingClientRect()` inside a raw `mousemove` handler** — it forces a synchronous layout read at up to 100+ Hz. Cache the rect on mount/resize/scroll instead.
- **Every animation loop must pause on `document.hidden`** (`visibilitychange`) and must **stop scheduling new frames once settled** (e.g., a spring-eased cursor sitting still should not keep calling `requestAnimationFrame` forever — check the delta against a small threshold and stop).
- **`prefers-reduced-motion` must be checked in every component that animates**, not just handled once globally in CSS — Framer Motion (or any JS-driven animation) doesn't obey a blanket CSS `transition-duration: 0.001ms !important` override, because it's not using CSS transitions. Check `useReducedMotion()` / `matchMedia('(prefers-reduced-motion: reduce)')` per component. For purely decorative effects (ink line, cursor), the right call under reduced motion is usually to disable entirely, not "simplify."
- **Never mix a CSS `transition` with a per-frame JS-driven update on the same property** — e.g. don't put `transition: transform 0.15s` on an element you're also setting `.style.transform` on every `requestAnimationFrame` tick, or the CSS engine fights the JS easing and produces a rubbery double-smoothed feel. Split concerns onto separate elements/layers if you need both a per-frame update and a discrete CSS-eased state change (like hover-grow).
- **Setting `cursor: none` on `<body>` does not suppress the native cursor over `<a>`/`<button>`** — browsers apply their own cursor to those elements with higher specificity than an inherited value. Use a universal `.custom-cursor-active, .custom-cursor-active * { cursor: none !important; }` rule instead.
- Drop any heavy 3D/WebGL dependency unless it's genuinely the signature element — a 2D canvas/SVG equivalent is almost always cheaper and, for a data-driven subject, more honest.

## Tone

Confident, direct, plain-spoken copy. No "passionate about," no exclamation points, no marketing language. Numbers are real numbers from real work, always labeled with what they actually measure (accuracy on which task, sample size, etc.) — never an unlabeled stat tile.
