import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CursorGlow() {
  const [enabled, setEnabled] = useState(false)
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const springX = useSpring(x, { stiffness: 60, damping: 20, mass: 0.6 })
  const springY = useSpring(y, { stiffness: 60, damping: 20, mass: 0.6 })

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    setEnabled(isFinePointer)
    if (!isFinePointer) return

    function handleMove(e: MouseEvent) {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 z-0 pointer-events-none"
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        width: 420,
        height: 420,
        borderRadius: '50%',
        background:
          'radial-gradient(circle, rgba(124,92,255,0.14) 0%, rgba(34,211,238,0.06) 45%, transparent 70%)',
        filter: 'blur(10px)',
      }}
    />
  )
}
