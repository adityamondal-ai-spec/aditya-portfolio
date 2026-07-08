import { useEffect, useRef, useState } from 'react'

type Cls = 'positive' | 'neutral' | 'negative'
type Point = { x: number; y: number; cls: Cls; snippet: string }

const COLORS: Record<Cls, string> = {
  positive: '#1f5c46',
  neutral: '#b8892e',
  negative: '#a6402f',
}

const SNIPPETS: Record<Cls, string[]> = {
  positive: [
    '"Exactly what I was hoping for."',
    '"Would order again without hesitation."',
    '"Better than expected, honestly."',
  ],
  neutral: [
    '"It was fine. Nothing special."',
    '"Did the job, no complaints, no praise."',
    '"Average — matches the price."',
  ],
  negative: [
    '"Not worth the money."',
    '"Wouldn\'t recommend this one."',
    '"Disappointing given the reviews."',
  ],
}

function makePoints(): Point[] {
  const pts: Point[] = []
  const bands: { cls: Cls; center: number }[] = [
    { cls: 'positive', center: 0.165 },
    { cls: 'neutral', center: 0.5 },
    { cls: 'negative', center: 0.835 },
  ]
  let seed = 42
  function rand() {
    // deterministic PRNG so the scatter is stable across renders/reloads
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return (seed / 0x7fffffff)
  }
  for (const band of bands) {
    for (let i = 0; i < 24; i++) {
      const x = 0.04 + rand() * 0.92
      const noise = (rand() - 0.5) * 0.22
      const y = Math.min(0.97, Math.max(0.03, band.center + noise))
      const snippets = SNIPPETS[band.cls]
      pts.push({ x, y, cls: band.cls, snippet: snippets[i % snippets.length] })
    }
  }
  return pts
}

export default function BoundaryViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const points = useRef<Point[]>(makePoints())
  const dims = useRef({ width: 480, height: 380 })
  const progress = useRef(0)
  const scrollAmp = useRef(0.05)
  const hovered = useRef<Point | null>(null)
  const rafId = useRef(0)
  const isVisible = useRef(false)
  const canvasRect = useRef({ left: 0, top: 0 })
  const pointerRaf = useRef(0)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; point: Point } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')!
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function fitCanvas() {
      const rect = container!.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      dims.current = { width: rect.width, height: rect.height }
      canvasRect.current = { left: rect.left, top: rect.top }
      canvas!.width = rect.width * dpr
      canvas!.height = rect.height * dpr
      canvas!.style.width = `${rect.width}px`
      canvas!.style.height = `${rect.height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    fitCanvas()

    function curveTop(x: number) {
      return 0.33 + scrollAmp.current * Math.sin(x * Math.PI * 2.6 + 0.4)
    }
    function curveBottom(x: number) {
      return 0.67 + scrollAmp.current * Math.sin(x * Math.PI * 2.2 + 1.2)
    }

    function draw() {
      const { width, height } = dims.current
      ctx.clearRect(0, 0, width, height)

      // boundary curves — thin ink lines, not class-colored (they separate,
      // they don't belong to a class)
      ctx.strokeStyle = 'rgba(28,27,23,0.35)'
      ctx.lineWidth = 1.25
      ctx.setLineDash([4, 4])
      const revealX = width * Math.min(1, progress.current * 1.15)

      for (const curve of [curveTop, curveBottom]) {
        ctx.beginPath()
        const steps = 60
        for (let i = 0; i <= steps; i++) {
          const xn = i / steps
          const px = xn * width
          if (px > revealX) break
          const py = curve(xn) * height
          if (i === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.stroke()
      }
      ctx.setLineDash([])

      // points
      const pts = points.current
      const visibleCount = Math.ceil(pts.length * Math.min(1, progress.current * 1.3))
      for (let i = 0; i < visibleCount; i++) {
        const p = pts[i]
        const cx = p.x * width
        const cy = p.y * height
        const isHovered = hovered.current === p
        const r = isHovered ? 5.5 : 3.4
        const localFade = Math.min(1, (visibleCount - i) / 3)
        ctx.globalAlpha = prefersReducedMotion ? 1 : localFade
        ctx.fillStyle = COLORS[p.cls]
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.fill()
        if (isHovered) {
          ctx.strokeStyle = COLORS[p.cls]
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.arc(cx, cy, r + 4, 0, Math.PI * 2)
          ctx.stroke()
        }
        ctx.globalAlpha = 1
      }
    }

    function findNearest(px: number, py: number): Point | null {
      const { width, height } = dims.current
      let best: Point | null = null
      let bestDist = Infinity
      for (const p of points.current) {
        const dx = p.x * width - px
        const dy = p.y * height - py
        const d = dx * dx + dy * dy
        if (d < bestDist) {
          bestDist = d
          best = p
        }
      }
      return bestDist < 30 * 30 ? best : null
    }

    function handlePointer(clientX: number, clientY: number) {
      // Uses the cached rect from fitCanvas/scroll rather than calling
      // getBoundingClientRect() here — that call forces a synchronous
      // layout read, and doing it on every raw mousemove event (which can
      // fire 100+ times/sec) is a real, measurable source of jank.
      const px = clientX - canvasRect.current.left
      const py = clientY - canvasRect.current.top
      const nearest = findNearest(px, py)
      if (nearest !== hovered.current) {
        hovered.current = nearest
        draw()
        setTooltip(nearest ? { x: px, y: py, point: nearest } : null)
      }
    }

    function handleMouseMove(e: MouseEvent) {
      if (pointerRaf.current) return
      const { clientX, clientY } = e
      pointerRaf.current = requestAnimationFrame(() => {
        pointerRaf.current = 0
        handlePointer(clientX, clientY)
      })
    }
    function handleTouchStart(e: TouchEvent) {
      const t = e.touches[0]
      if (t) handlePointer(t.clientX, t.clientY)
    }
    function handleMouseLeave() {
      hovered.current = null
      setTooltip(null)
      draw()
    }

    // The canvas only ever needs to redraw on scroll while it's actually
    // on screen — without this gate, every scroll event anywhere on the
    // page (including deep in the Log or Contact sections, long after
    // this canvas has scrolled out of view) was still triggering a full
    // redraw. IntersectionObserver + the tab-visibility check below make
    // that work disappear entirely once it's not visible.
    let scrollRaf = 0
    function handleScroll() {
      if (!isVisible.current || document.hidden) return
      if (scrollRaf) return
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0
        const rect = container!.getBoundingClientRect()
        canvasRect.current = { left: rect.left, top: rect.top }
        const scrollable = document.documentElement.scrollHeight - window.innerHeight
        const t = scrollable > 0 ? window.scrollY / scrollable : 0
        scrollAmp.current = 0.05 - t * 0.03
        draw()
      })
    }

    function handleResize() {
      fitCanvas()
      draw()
    }

    function handleVisibilityChange() {
      if (document.hidden && scrollRaf) {
        cancelAnimationFrame(scrollRaf)
        scrollRaf = 0
      }
    }

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        isVisible.current = entries[0]?.isIntersecting ?? false
      },
      { threshold: 0 }
    )
    intersectionObserver.observe(container)

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    if (prefersReducedMotion) {
      progress.current = 1
      draw()
    } else {
      const start = performance.now()
      const DURATION = 1400
      function tick(now: number) {
        if (document.hidden) {
          // Tab is backgrounded mid-entrance — pick back up rather than
          // burning frames (or the perception of a jump) while hidden.
          rafId.current = requestAnimationFrame(tick)
          return
        }
        progress.current = Math.min(1, (now - start) / DURATION)
        draw()
        if (progress.current < 1) {
          rafId.current = requestAnimationFrame(tick)
        }
      }
      rafId.current = requestAnimationFrame(tick)
    }

    return () => {
      cancelAnimationFrame(rafId.current)
      if (scrollRaf) cancelAnimationFrame(scrollRaf)
      if (pointerRaf.current) cancelAnimationFrame(pointerRaf.current)
      intersectionObserver.disconnect()
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      canvas.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[320px] sm:h-[380px]"
      style={{ background: 'var(--paper-raised)', border: '1px solid var(--line)' }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
      {tooltip && (
        <div
          className="absolute pointer-events-none px-3 py-2 text-xs max-w-[200px]"
          style={{
            left: Math.min(tooltip.x + 12, dims.current.width - 210),
            top: Math.max(tooltip.y - 46, 8),
            background: 'var(--paper)',
            border: '1px solid var(--line)',
            fontFamily: 'var(--mono)',
            color: 'var(--ink)',
          }}
        >
          <div style={{ color: COLORS[tooltip.point.cls] }} className="font-semibold uppercase text-[10px] mb-1">
            {tooltip.point.cls}
          </div>
          {tooltip.point.snippet}
        </div>
      )}
    </div>
  )
}
