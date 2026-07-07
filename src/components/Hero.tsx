import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { profile } from '../data/resume'
import MagneticButton from './MagneticButton'

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const textY = useTransform(scrollYProgress, [0, 1], [0, -80])
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative min-h-[100svh] flex items-center overflow-hidden pt-24"
    >
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center pointer-events-none">
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="text-center lg:text-left order-2 lg:order-1 pointer-events-auto"
        >
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-[var(--mono)] text-sm text-[var(--accent-2)] tracking-widest uppercase mb-4"
          >
            {profile.location}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-semibold tracking-tight"
          >
            {profile.name}
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 text-lg sm:text-xl gradient-text font-medium"
          >
            {profile.role}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-6 text-base sm:text-lg text-[var(--text-dim)] leading-relaxed max-w-lg mx-auto lg:mx-0"
          >
            {profile.tagline}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-10 flex items-center justify-center lg:justify-start gap-4"
          >
            <MagneticButton
              href="#projects"
              className="px-6 py-3 rounded-full text-white font-medium text-sm inline-block"
              style={{ background: 'var(--accent-grad)' }}
            >
              View Projects
            </MagneticButton>
            <MagneticButton
              href="#contact"
              className="px-6 py-3 rounded-full glass text-sm font-medium text-[var(--text-h)] inline-block"
            >
              Get in touch
            </MagneticButton>
          </motion.div>
        </motion.div>

        <div className="order-1 lg:order-2" aria-hidden />
      </div>
    </section>
  )
}
