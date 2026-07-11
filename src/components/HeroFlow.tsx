import { useEffect, useRef } from 'react'

const INK = 'rgba(28,27,23,'
// Same three class colors as BoundaryViz — top-to-bottom bands, so a node's
// vertical position echoes the classifier concept rather than being decorative.
const CLASS_COLORS = ['#1f5c46', '#b8892e', '#a6402f']

type Ribbon = {
  baseY: number
  amp: number
  freq: number
  speed: number
  phase: number
  ink: boolean
  color: string
  alpha: number
  width: number
}

type Node = { x: number; y: number; vx: number; vy: number }

function classColorForY(yFrac: number) {
  if (yFrac < 0.34) return CLASS_COLORS[0]
  if (yFrac < 0.67) return CLASS_COLORS[1]
  return CLASS_COLORS[2]
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export default function HeroFlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let ribbons: Ribbon[] = []
    let nodes: Node[] = []
    const mouse = { x: -9999, y: -9999 }
    let rafId = 0

    function makeRibbons() {
      ribbons = [
        { baseY: 0.26, amp: 0.05, freq: 1.6, speed: 0.1, phase: 0, ink: true, color: '', alpha: 0.035, width: 0.8 },
        { baseY: 0.5, amp: 0.06, freq: 1.1, speed: 0.07, phase: 1.8, ink: true, color: '', alpha: 0.03, width: 0.8 },
        { baseY: 0.74, amp: 0.045, freq: 1.9, speed: 0.09, phase: 3.4, ink: true, color: '', alpha: 0.035, width: 0.8 },
        { baseY: 0.16, amp: 0.035, freq: 2.4, speed: 0.05, phase: 0.6, ink: false, color: CLASS_COLORS[0], alpha: 0.03, width: 0.9 },
        { baseY: 0.5, amp: 0.04, freq: 2.0, speed: 0.06, phase: 2.2, ink: false, color: CLASS_COLORS[1], alpha: 0.028, width: 0.9 },
        { baseY: 0.84, amp: 0.035, freq: 2.2, speed: 0.055, phase: 4.1, ink: false, color: CLASS_COLORS[2], alpha: 0.03, width: 0.9 },
      ]
    }

    function makeNodes() {
      const count = Math.min(60, Math.floor((w * h) / 16000))
      nodes = []
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
        })
      }
    }

    function fit() {
      w = window.innerWidth
      h = window.innerHeight
      canvas!.width = w * dpr
      canvas!.height = h * dpr
      canvas!.style.width = `${w}px`
      canvas!.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      makeRibbons()
      makeNodes()
    }
    fit()

    function drawRibbon(r: Ribbon, t: number) {
      const steps = 90
      const grad = ctx.createLinearGradient(0, 0, w, 0)
      if (r.ink) {
        grad.addColorStop(0, `${INK}0)`)
        grad.addColorStop(0.14, `${INK}${r.alpha})`)
        grad.addColorStop(0.86, `${INK}${r.alpha})`)
        grad.addColorStop(1, `${INK}0)`)
      } else {
        const [rr, gg, bb] = hexToRgb(r.color)
        grad.addColorStop(0, `rgba(${rr},${gg},${bb},0)`)
        grad.addColorStop(0.16, `rgba(${rr},${gg},${bb},${r.alpha})`)
        grad.addColorStop(0.84, `rgba(${rr},${gg},${bb},${r.alpha})`)
        grad.addColorStop(1, `rgba(${rr},${gg},${bb},0)`)
      }
      ctx.strokeStyle = grad
      ctx.lineWidth = r.width
      ctx.beginPath()
      for (let i = 0; i <= steps; i++) {
        const xn = i / steps
        const px = xn * w
        const py =
          (r.baseY +
            r.amp * Math.sin(xn * Math.PI * 2 * r.freq + r.phase + t * r.speed) +
            r.amp * 0.4 * Math.sin(xn * Math.PI * r.freq - r.phase * 1.3 + t * r.speed * 0.6)) *
          h
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.stroke()
    }

    function draw(t: number) {
      ctx.clearRect(0, 0, w, h)
      for (const r of ribbons) drawRibbon(r, t)

      for (const n of nodes) {
        const dx = mouse.x - n.x
        const dy = mouse.y - n.y
        const d2 = dx * dx + dy * dy
        if (d2 < 22000 && d2 > 1) {
          const f = 0.5 / Math.sqrt(d2)
          n.vx += dx * f * 0.018
          n.vy += dy * f * 0.018
        }
        n.x += n.vx
        n.y += n.vy
        n.vx *= 0.985
        n.vy *= 0.985
        if (n.x < 0 || n.x > w) n.vx *= -1
        if (n.y < 0 || n.y > h) n.vy *= -1
        n.x = Math.max(0, Math.min(w, n.x))
        n.y = Math.max(0, Math.min(h, n.y))
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 < 9000) {
            const o = (1 - d2 / 9000) * 0.18
            ctx.strokeStyle = `${INK}${o})`
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      for (const n of nodes) {
        const dx = n.x - mouse.x
        const dy = n.y - mouse.y
        const near = dx * dx + dy * dy < 22000
        ctx.fillStyle = near ? classColorForY(n.y / h) : `${INK}0.3)`
        ctx.beginPath()
        ctx.arc(n.x, n.y, near ? 2.3 : 1.4, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function handleMouseMove(e: MouseEvent) {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    function handleMouseOut(e: MouseEvent) {
      if (!e.relatedTarget) {
        mouse.x = -9999
        mouse.y = -9999
      }
    }
    function handleResize() {
      fit()
      if (prefersReducedMotion) draw(0)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseout', handleMouseOut)
    window.addEventListener('resize', handleResize)

    if (prefersReducedMotion) {
      draw(0)
    } else {
      const start = performance.now()
      const tick = (now: number) => {
        rafId = requestAnimationFrame(tick)
        if (document.hidden) return
        // Boundary.tsx sets this while its full-viewport 3D takeover is
        // open — this canvas sits at z-index -1 behind it, fully hidden,
        // so there's no reason to keep spending CPU/GPU redrawing it.
        if (document.documentElement.hasAttribute('data-3d-takeover')) return
        draw((now - start) / 1000)
      }
      rafId = requestAnimationFrame(tick)
    }

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseout', handleMouseOut)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex: -1 }} aria-hidden="true">
      <canvas ref={canvasRef} className="block w-full h-full" style={{ pointerEvents: 'none' }} />
    </div>
  )
}
