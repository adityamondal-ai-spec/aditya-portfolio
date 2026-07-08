import { motion, useReducedMotion } from 'framer-motion'
import { profile } from '../data/resume'
import BoundaryViz from './BoundaryViz'
import ScrollReveal from './ScrollReveal'

export default function Hero() {
  const reduceMotion = useReducedMotion()
  const fadeUp = (delay: number) =>
    reduceMotion
      ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
      : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay } }

  return (
    <section id="top" className="relative pt-40 pb-24 px-6">
      <div className="max-w-3xl mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-12 items-start">
        <div>
          <motion.p
            {...fadeUp(0)}
            className="font-[var(--mono)] text-xs uppercase tracking-[0.08em]"
            style={{ color: 'var(--ink-dim)' }}
          >
            {profile.location} · {profile.role}
          </motion.p>
          <div className="mt-4">
            <ScrollReveal>
              <h1 className="text-4xl sm:text-5xl italic leading-[1.1]" style={{ fontWeight: 500 }}>
                Sorts language<br />into decisions.
              </h1>
            </ScrollReveal>
          </div>
          <motion.p
            {...fadeUp(0.16)}
            className="mt-6 text-base leading-relaxed max-w-md"
            style={{ color: 'var(--ink-dim)' }}
          >
            {profile.tagline}
          </motion.p>
          <motion.div {...fadeUp(0.24)} className="mt-8">
            <a
              href="#work"
              className="inline-flex items-center gap-1.5 text-sm font-medium border-b pb-0.5 transition-opacity hover:opacity-70"
              style={{ borderColor: 'var(--ink)' }}
            >
              Read the work <span aria-hidden>→</span>
            </a>
          </motion.div>
        </div>

        <motion.div {...fadeUp(0.1)}>
          <BoundaryViz />
          <p className="mt-2 text-[11px] font-[var(--mono)]" style={{ color: 'var(--ink-dim)' }}>
            A live sketch of how the sentiment model separates reviews — hover a point.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
