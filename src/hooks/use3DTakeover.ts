import { useEffect, useState, type ComponentType } from 'react'

type Label = 'negative' | 'neutral' | 'positive'
type Point = { x: number; y: number; z: number; label: Label; pred: Label; text: string }
export type DecisionSpaceData = { classes: Label[]; points: Point[] }
export type DecisionSpaceProps = { data: DecisionSpaceData; fullscreen?: boolean }

// Desktop gets the full-viewport takeover; mobile keeps the embedded box.
// Phase 3's Lighthouse numbers there are already borderline, and a
// full-screen takeover is a heavier interaction pattern on small screens
// regardless of raw performance cost.
function detectDesktop(): boolean {
  return typeof window !== 'undefined' && window.innerWidth >= 768
}

// Shared "Enter 3D" lazy-load + full-viewport takeover logic -- originally
// lived only in Boundary.tsx, extracted so the cinematic Scene 2 can offer
// the same upgrade path without duplicating the lazy-load/scroll-lock/
// escape-key handling.
export function use3DTakeover() {
  const [mode, setMode] = useState<'2d' | '3d'>('2d')
  const [loading, setLoading] = useState(false)
  const [Scene, setScene] = useState<ComponentType<DecisionSpaceProps> | null>(null)
  const [data, setData] = useState<DecisionSpaceData | null>(null)
  const [takeover, setTakeover] = useState(false)

  function enter3D() {
    setMode('3d')
    setLoading(true)
    setTakeover(detectDesktop())
    // The module import and the data fetch start in the same tick, in
    // parallel — waiting for the chunk to finish loading and mount before
    // starting the JSON fetch from inside its own useEffect is a real
    // network waterfall on a slow connection, not just a simulation artifact.
    Promise.all([
      import('../components/DecisionSpace3D'),
      fetch('/data/decision-space.json').then((r) => r.json()),
    ]).then(([mod, json]) => {
      setScene(() => mod.default)
      setData(json)
      setLoading(false)
    })
  }

  function exit3D() {
    setMode('2d')
    setTakeover(false)
  }

  // The full-viewport takeover needs: body scroll lock (the page behind it
  // shouldn't scroll), an Escape hatch, and HeroFlow's ambient background
  // canvas paused — it sits at z-index -1 behind the takeover, fully
  // hidden, but its rAF loop would otherwise keep costing CPU/GPU for
  // something nobody can see.
  useEffect(() => {
    if (!takeover) return
    // Locking scroll removes the scrollbar, which widens the viewport's
    // content area by the scrollbar's own width and shifts every
    // fixed-position element sideways — a real, measured CLS regression
    // caught via Lighthouse. Padding the body by that same width before
    // hiding overflow cancels the shift.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    const prevOverflow = document.body.style.overflow
    const prevPaddingRight = document.body.style.paddingRight
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${scrollbarWidth}px`
    document.documentElement.setAttribute('data-3d-takeover', '1')
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') exit3D()
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.body.style.paddingRight = prevPaddingRight
      document.documentElement.removeAttribute('data-3d-takeover')
      window.removeEventListener('keydown', handleKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [takeover])

  return { mode, loading, Scene, data, takeover, enter3D, exit3D }
}
