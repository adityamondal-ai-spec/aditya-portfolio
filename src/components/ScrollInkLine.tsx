import { useEffect, useRef } from 'react'

// A deterministic, gently wobbling vertical path — hand-drawn, not a ruler.
// Built once from a fixed seed so it's stable across mounts/reloads.
function buildInkPath(): string {
  let seed = 7
  function rand() {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }

  const points: { x: number; y: number }[] = []
  const steps = 24
  for (let i = 0; i <= steps; i++) {
    const y = (1000 / steps) * i
    const wobble = Math.sin(i * 0.9) * 3 + (rand() - 0.5) * 2.5
    points.push({ x: 12 + wobble, y })
  }

  let d = `M ${points[0].x},${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const midX = (prev.x + curr.x) / 2
    const midY = (prev.y + curr.y) / 2
    d += ` Q ${prev.x},${prev.y} ${midX},${midY}`
  }
  const last = points[points.length - 1]
  d += ` L ${last.x},${last.y}`
  return d
}

const PATH_D = buildInkPath()

export default function ScrollInkLine() {
  const pathRef = useRef<SVGPathElement>(null)
  const lengthRef = useRef(0)
  const rafId = useRef(0)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Purely decorative — for reduced-motion users we skip it entirely
    // rather than trying to tone it down.
    if (prefersReducedMotion) return

    const path = pathRef.current
    if (!path) return

    const length = path.getTotalLength()
    lengthRef.current = length
    path.style.strokeDasharray = `${length}`
    path.style.strokeDashoffset = `${length}`

    let ticking = false
    function update() {
      ticking = false
      if (document.hidden) return
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0
      path!.style.strokeDashoffset = `${lengthRef.current * (1 - progress)}`
    }

    function handleScroll() {
      if (ticking) return
      ticking = true
      rafId.current = requestAnimationFrame(update)
    }

    function handleVisibilityChange() {
      if (!document.hidden) handleScroll()
    }

    update()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      cancelAnimationFrame(rafId.current)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return (
    <svg
      aria-hidden
      className="fixed left-0 top-0 h-[100dvh] w-6 pointer-events-none z-40"
      viewBox="0 0 24 1000"
      preserveAspectRatio="none"
    >
      <path
        ref={pathRef}
        d={PATH_D}
        fill="none"
        stroke="var(--ink-dim)"
        strokeWidth="1.5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
