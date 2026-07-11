import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion'
import PinnedScene from './PinnedScene'
import { useScrollProgress } from './useScrollProgress'
import { beatOpacity, beatY } from './scrollBeats'
import BoundaryViz from '../BoundaryViz'
import { profile } from '../../data/resume'

// Must match BoundaryViz's own embedded-variant height class exactly
// (h-[380px] at the sm breakpoint and up, which this scene always renders
// at since it's desktop-cinematic-only) -- a mismatch here left a ~40px
// gap between this wrapper's box and BoundaryViz's actual rendered content,
// which became a visible full-viewport-height shortfall once scaled up
// (measured: landed at 766px of 900px, not true full height).
const BOX_WIDTH = 380
const BOX_HEIGHT = 380

export default function Scene1Intro() {
  const { ref: wrapperRef, scrollYProgress } = useScrollProgress<HTMLDivElement>()
  const boxRef = useRef<HTMLDivElement>(null)
  const scaleTargetX = useMotionValue(window.innerWidth / BOX_WIDTH)
  const scaleTargetY = useMotionValue(window.innerHeight / BOX_HEIGHT)
  const refitFired = useRef(false)

  // The box scales up to exactly fill the viewport. Computed from the
  // known, fixed BOX_WIDTH/BOX_HEIGHT constants and window size directly --
  // deliberately NOT from getBoundingClientRect() on the scaled wrapper,
  // since that element's rect changes AS it scales, and this same effect
  // also fires on the synthetic 'resize' event dispatched below (for
  // BoundaryViz's canvas refit). Measuring the live rect created a feedback
  // loop: the synthetic resize fired while the box was already partway
  // scaled up, re-measured its now-larger rect, and computed a corrupted,
  // much-too-small remaining target. Static known dimensions sidestep this.
  useEffect(() => {
    function measure() {
      scaleTargetX.set(window.innerWidth / BOX_WIDTH)
      scaleTargetY.set(window.innerHeight / BOX_HEIGHT)
    }
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Function-form useTransform throughout -- see scrollBeats.ts for why the
  // array form (useTransform(progress, input, output)) isn't used: it was
  // found to sometimes not sync its computed value to the DOM after a
  // programmatic (non-wheel) scroll jump, such as the nav's anchor-click
  // handler landing directly on a mid-scene scroll position.
  const titleOpacity = useTransform(() => beatOpacity(scrollYProgress.get(), 0, 0.2, 1, 0.3))
  const titleY = useTransform(() => {
    const p = scrollYProgress.get()
    if (p < 0.7) return beatY(p, 0, 0.2, 24)
    return -16 * Math.min(1, (p - 0.7) / 0.3)
  })
  const scaleX = useTransform(() => {
    const local = Math.min(1, Math.max(0, (scrollYProgress.get() - 0.7) / 0.3))
    return 1 + (scaleTargetX.get() - 1) * local
  })
  const scaleY = useTransform(() => {
    const local = Math.min(1, Math.max(0, (scrollYProgress.get() - 0.7) / 0.3))
    return 1 + (scaleTargetY.get() - 1) * local
  })

  // Once the box has (almost) finished scaling up, ask BoundaryViz to refit
  // its canvas backing buffer to the now-much-larger rendered size -- it
  // already listens for window 'resize' and re-measures via
  // getBoundingClientRect(), which correctly reports the transform-scaled
  // size. Cheaper than resizing continuously during the scrub: the canvas
  // stays at its original resolution (just visually stretched via the CSS
  // transform) until the transition settles, then snaps to crisp.
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v > 0.995 && !refitFired.current) {
      refitFired.current = true
      window.dispatchEvent(new Event('resize'))
    } else if (v < 0.995 && refitFired.current) {
      refitFired.current = false
    }
  })

  return (
    <PinnedScene heightVh={250} id="about" ref={wrapperRef}>
      <div
        className="w-full h-full flex flex-col items-center justify-center gap-10 px-6"
        style={{ background: 'var(--paper)' }}
      >
        <motion.div style={{ opacity: titleOpacity, y: titleY }} className="text-center z-10">
          <p className="font-[var(--mono)] text-xs uppercase tracking-[0.08em]" style={{ color: 'var(--ink-dim)' }}>
            {profile.location} &middot; {profile.role}
          </p>
          <h1 className="mt-4 text-5xl sm:text-6xl italic" style={{ fontWeight: 500 }}>
            {profile.name}
          </h1>
          <p className="mt-4 text-base max-w-md mx-auto" style={{ color: 'var(--ink-dim)' }}>
            {profile.tagline}
          </p>
        </motion.div>

        <motion.div ref={boxRef} style={{ scaleX, scaleY, transformOrigin: 'center center' }} className="relative z-0">
          <div style={{ width: BOX_WIDTH, height: BOX_HEIGHT }}>
            <BoundaryViz />
          </div>
        </motion.div>
      </div>
    </PinnedScene>
  )
}
