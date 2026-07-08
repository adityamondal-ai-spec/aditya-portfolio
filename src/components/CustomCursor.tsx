import { useEffect, useRef, useState } from 'react'

const REST_ANGLE = -12

export default function CustomCursor() {
  const [enabled] = useState(() => {
    if (typeof window === 'undefined') return false
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return fine && !reducedMotion
  })

  const dotRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const groupRef = useRef<SVGGElement>(null)
  const blotRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: -100, y: -100 })
  const target = useRef({ x: -100, y: -100 })
  const angle = useRef(REST_ANGLE)
  const targetAngle = useRef(REST_ANGLE)
  const rafId = useRef(0)
  const running = useRef(false)
  const hoveringInteractive = useRef(false)

  useEffect(() => {
    if (!enabled) return

    // Plain body.style.cursor doesn't stick over links/buttons — browsers
    // apply their own cursor to <a>/<button>, which wins over an inherited
    // value. The class below carries a universal !important override.
    document.documentElement.classList.add('custom-cursor-active')

    function tick() {
      if (document.hidden) {
        running.current = false
        return
      }
      const dx = target.current.x - pos.current.x
      const dy = target.current.y - pos.current.y
      const speed = Math.sqrt(dx * dx + dy * dy)
      pos.current.x += dx * 0.18
      pos.current.y += dy * 0.18

      // Tilt into the direction of travel, like a nib dragged across
      // paper trails behind the point — only recompute the target angle
      // above a small speed threshold so it doesn't jitter at rest.
      if (speed > 1.2) {
        targetAngle.current = Math.atan2(dy, dx) * (180 / Math.PI) - 90
      }
      let diff = targetAngle.current - angle.current
      diff = ((diff + 180) % 360 + 360) % 360 - 180
      angle.current += diff * 0.2

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`
      }
      if (svgRef.current) {
        svgRef.current.style.transform = `translate(-9px, -22px) rotate(${angle.current}deg)`
      }

      // Settle and stop — a perpetual 60fps loop for a cursor that's
      // sitting still is exactly the kind of always-on animation cost
      // we're trying to avoid elsewhere on this page.
      if (speed < 0.15 && Math.abs(diff) < 0.3) {
        running.current = false
        return
      }
      rafId.current = requestAnimationFrame(tick)
    }

    function startLoop() {
      if (running.current) return
      running.current = true
      rafId.current = requestAnimationFrame(tick)
    }

    function handleMouseMove(e: MouseEvent) {
      target.current.x = e.clientX
      target.current.y = e.clientY
      if (dotRef.current) dotRef.current.style.opacity = '1'
      startLoop()
    }

    function handleMouseOver(e: MouseEvent) {
      const isInteractive = !!(e.target as Element).closest('a, button, input, textarea, [role="button"]')
      if (isInteractive !== hoveringInteractive.current) {
        hoveringInteractive.current = isInteractive
        // Scale is a discrete, occasional change — let CSS transition it
        // smoothly rather than fighting the per-frame JS rotation update.
        if (groupRef.current) {
          groupRef.current.style.transform = isInteractive ? 'scale(1.4)' : 'scale(1)'
        }
      }
    }

    function handleMouseDown(e: MouseEvent) {
      if (!blotRef.current) return
      blotRef.current.style.left = `${e.clientX}px`
      blotRef.current.style.top = `${e.clientY}px`
      blotRef.current.animate(
        [
          { transform: 'translate(-50%, -50%) scale(0.3)', opacity: 0.5 },
          { transform: 'translate(-50%, -50%) scale(1.6)', opacity: 0 },
        ],
        { duration: 380, easing: 'ease-out' }
      )
    }

    function handleMouseLeaveWindow() {
      if (dotRef.current) dotRef.current.style.opacity = '0'
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        cancelAnimationFrame(rafId.current)
        running.current = false
      } else {
        startLoop()
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseover', handleMouseOver, { passive: true })
    window.addEventListener('mousedown', handleMouseDown, { passive: true })
    document.documentElement.addEventListener('mouseleave', handleMouseLeaveWindow)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.documentElement.classList.remove('custom-cursor-active')
      cancelAnimationFrame(rafId.current)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      window.removeEventListener('mousedown', handleMouseDown)
      document.documentElement.removeEventListener('mouseleave', handleMouseLeaveWindow)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="fixed left-0 top-0 z-[100] pointer-events-none opacity-0"
        style={{ willChange: 'transform' }}
      >
        {/* The nib's tip (9,22) is the meaningful hotspot — it needs to land
            exactly on the real cursor position, not just somewhere near it,
            or the whole thing reads as disconnected from the actual pointer. */}
        <svg
          ref={svgRef}
          width="18"
          height="22"
          viewBox="0 0 18 22"
          style={{
            transform: `translate(-9px, -22px) rotate(${REST_ANGLE}deg)`,
            transformOrigin: '9px 22px',
          }}
        >
          {/* Scale lives on its own group so the hover-grow CSS transition
              doesn't fight the per-frame JS rotation update above. */}
          <g ref={groupRef} style={{ transformOrigin: '9px 22px', transition: 'transform 0.15s ease-out' }}>
            <path d="M9 0 L16 13 Q9 22 9 22 Q9 22 2 13 Z" fill="var(--ink)" stroke="var(--paper)" strokeWidth="0.75" />
            <line x1="9" y1="4" x2="9" y2="17" stroke="var(--paper)" strokeWidth="0.6" />
          </g>
        </svg>
      </div>
      <div
        ref={blotRef}
        aria-hidden
        className="fixed left-0 top-0 z-[99] pointer-events-none w-3 h-3 rounded-full opacity-0"
        style={{ background: 'var(--ink)', transform: 'translate(-50%, -50%)' }}
      />
    </>
  )
}
