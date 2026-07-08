import { motion, useReducedMotion } from 'framer-motion'
import { profile, education, skills } from '../data/resume'

export default function About() {
  const reduceMotion = useReducedMotion()
  const fade = reduceMotion
    ? { initial: { opacity: 1 }, whileInView: { opacity: 1 }, transition: { duration: 0 } }
    : { initial: { opacity: 0, y: 14 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5 } }

  return (
    <section id="about" className="py-20 px-6">
      <div className="max-w-3xl mx-auto grid sm:grid-cols-[1fr_200px] gap-10">
        <motion.div {...fade} viewport={{ once: true, amount: 0.3 }}>
          <p className="font-[var(--mono)] text-xs uppercase tracking-[0.08em] mb-4" style={{ color: 'var(--ink-dim)' }}>
            Introduction
          </p>
          <p className="text-lg sm:text-xl leading-relaxed" style={{ fontFamily: 'var(--display)', fontWeight: 400 }}>
            {profile.summary}
          </p>
        </motion.div>

        <motion.div
          {...fade}
          viewport={{ once: true, amount: 0.3 }}
          className="sm:pl-6"
          style={{ borderLeft: 'none' }}
        >
          <div className="sm:border-l pl-0 sm:pl-6" style={{ borderColor: 'var(--line)' }}>
            <p className="font-[var(--mono)] text-[11px] uppercase tracking-[0.06em] mb-1.5" style={{ color: 'var(--ink-dim)' }}>
              Education
            </p>
            <p className="text-sm font-medium">{education.school}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--ink-dim)' }}>{education.degree}</p>
            <p className="text-xs mt-0.5 font-[var(--mono)]" style={{ color: 'var(--ink-dim)' }}>{education.graduation}</p>

            <p className="font-[var(--mono)] text-[11px] uppercase tracking-[0.06em] mb-1.5 mt-6" style={{ color: 'var(--ink-dim)' }}>
              Skills
            </p>
            {Object.entries(skills).map(([category, items]) => (
              <div key={category} className="mb-2 last:mb-0">
                <p className="text-[11px]" style={{ color: 'var(--ink-dim)' }}>{category}</p>
                <p className="text-xs">{items.join(', ')}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
