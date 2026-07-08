import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const [enabled] = useState(() => {
    if (typeof window === 'undefined') return false
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return fine && !reducedMotion
  })

  const dotRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: -100, y: -100 })
  const target = useRef({ x: -100, y: -100 })
  const rafId = useRef(0)
  const running = useRef(false)

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
      pos.current.x += dx * 0.18
      pos.current.y += dy * 0.18

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`
      }

      // Settle and stop — a perpetual 60fps loop for a cursor that's
      // sitting still is exactly the kind of always-on animation cost
      // we're trying to avoid elsewhere on this page.
      if (Math.abs(dx) < 0.15 && Math.abs(dy) < 0.15) {
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
    document.documentElement.addEventListener('mouseleave', handleMouseLeaveWindow)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.documentElement.classList.remove('custom-cursor-active')
      cancelAnimationFrame(rafId.current)
      window.removeEventListener('mousemove', handleMouseMove)
      document.documentElement.removeEventListener('mouseleave', handleMouseLeaveWindow)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [enabled])

  if (!enabled) return null

  return (
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
        width="18"
        height="22"
        viewBox="0 0 18 22"
        style={{ transform: 'translate(-9px, -22px) rotate(-12deg)', transformOrigin: '9px 22px' }}
      >
        <path d="M9 0 L16 13 Q9 22 9 22 Q9 22 2 13 Z" fill="var(--ink)" stroke="var(--paper)" strokeWidth="0.75" />
        <line x1="9" y1="4" x2="9" y2="17" stroke="var(--paper)" strokeWidth="0.6" />
      </svg>
    </div>
  )
}
