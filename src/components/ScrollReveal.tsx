import { useEffect, useRef, type ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'

// A flat, ink-toned scroll roller — deliberately not a photoreal parchment
// texture, so it stays inside the paper/ink palette instead of clashing
// with it. Deckle (torn-edge) bottom suggests unrolled parchment hanging
// just below the rod.
function RollerGraphic() {
  return (
    <svg
      viewBox="0 0 400 56"
      preserveAspectRatio="none"
      className="w-full h-full"
      aria-hidden
    >
      <rect x="0" y="10" width="400" height="20" rx="10" fill="var(--ink)" />
      <line x1="0" y1="20" x2="400" y2="20" stroke="var(--paper)" strokeWidth="1" opacity="0.5" />
      <circle cx="10" cy="20" r="13" fill="var(--ink)" />
      <circle cx="390" cy="20" r="13" fill="var(--ink)" />
      <circle cx="10" cy="20" r="5" fill="var(--paper)" opacity="0.6" />
      <circle cx="390" cy="20" r="5" fill="var(--paper)" opacity="0.6" />
      <path
        d="M0,32 Q10,38 22,33 T46,35 T70,32 T94,36 T118,33 T142,35 T166,32 T190,36
           T214,33 T238,35 T262,32 T286,36 T310,33 T334,35 T358,32 T382,36 L400,33 L400,56 L0,56 Z"
        fill="var(--paper-raised)"
      />
    </svg>
  )
}

export default function ScrollReveal({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion()
  const clipRef = useRef<HTMLDivElement>(null)
  const rollerRef = useRef<HTMLDivElement>(null)
  const rafId = useRef(0)

  useEffect(() => {
    if (reduceMotion) return
    const clipEl = clipRef.current
    const roller = rollerRef.current
    if (!clipEl || !roller) return

    const DURATION = 1100
    const DELAY = 150
    const start = performance.now() + DELAY

    function tick(now: number) {
      if (document.hidden) {
        rafId.current = requestAnimationFrame(tick)
        return
      }
      const elapsed = now - start
      const t = Math.min(1, Math.max(0, elapsed / DURATION))
      const eased = 1 - Math.pow(1 - t, 3)
      clipEl!.style.clipPath = `inset(0 0 ${(1 - eased) * 100}% 0)`
      roller!.style.transform = `translateY(${-eased * 100}%)`
      roller!.style.opacity = `${1 - Math.max(0, (t - 0.7) / 0.3)}`
      if (t < 1) rafId.current = requestAnimationFrame(tick)
    }
    rafId.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId.current)
  }, [reduceMotion])

  if (reduceMotion) return <>{children}</>

  return (
    <div className="relative">
      <div ref={clipRef} style={{ clipPath: 'inset(0 0 100% 0)' }}>
        {children}
      </div>
      <div
        ref={rollerRef}
        aria-hidden
        className="absolute inset-x-0 top-0 h-14 pointer-events-none"
        style={{ transform: 'translateY(0%)' }}
      >
        <RollerGraphic />
      </div>
    </div>
  )
}
