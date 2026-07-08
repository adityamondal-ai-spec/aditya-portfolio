import { motion, useReducedMotion } from 'framer-motion'
import { experience, certifications } from '../data/resume'

type LogEntry = {
  date: string
  title: string
  org: string
  bullets?: string[]
}

export default function Experience() {
  const reduceMotion = useReducedMotion()
  const fade = reduceMotion
    ? { initial: { opacity: 1 }, whileInView: { opacity: 1 }, transition: { duration: 0 } }
    : { initial: { opacity: 0, y: 12 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.4 } }

  const entries: LogEntry[] = [
    ...experience.map((e) => ({ date: e.period, title: e.title, org: e.org, bullets: e.bullets })),
    ...certifications.map((c) => ({ date: c.status, title: c.title, org: c.issuer })),
  ]

  return (
    <section id="log" className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="font-[var(--mono)] text-xs uppercase tracking-[0.08em] mb-8" style={{ color: 'var(--ink-dim)' }}>
          Log
        </p>

        <div>
          {entries.map((entry, i) => (
            <motion.div
              key={entry.title}
              {...fade}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ ...fade.transition, delay: reduceMotion ? 0 : i * 0.05 }}
              className="grid sm:grid-cols-[180px_1fr] gap-2 sm:gap-8 py-5"
              style={{ borderTop: '1px solid var(--line)' }}
            >
              <p className="font-[var(--mono)] text-xs pt-0.5" style={{ color: 'var(--ink-dim)' }}>
                {entry.date}
              </p>
              <div>
                <p className="text-sm font-semibold">
                  {entry.title} <span className="font-normal" style={{ color: 'var(--ink-dim)' }}>· {entry.org}</span>
                </p>
                {entry.bullets && (
                  <ul className="mt-2 space-y-1">
                    {entry.bullets.map((b) => (
                      <li key={b} className="text-sm leading-relaxed pl-4 relative">
                        <span className="absolute left-0" style={{ color: 'var(--ink-dim)' }}>—</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
