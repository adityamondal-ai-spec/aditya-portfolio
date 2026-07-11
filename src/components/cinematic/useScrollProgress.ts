import { useRef } from 'react'
import { useScroll } from 'framer-motion'

// A tall wrapper's scroll progress, 0 (wrapper top hits viewport top) to 1
// (wrapper bottom hits viewport bottom) -- the driver for every pinned
// scene's scrub timeline. Real hook (not a render-prop callback) so every
// caller can call useTransform/useMotionValueEvent directly in its own
// component body, where React's rules of hooks actually apply cleanly.
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  return { ref, scrollYProgress }
}
