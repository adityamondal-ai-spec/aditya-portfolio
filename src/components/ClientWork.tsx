import { motion, useReducedMotion } from 'framer-motion'
import { clientWork } from '../data/resume'
import { MiniThumb } from './Projects'

// Real paid/shipped client work, kept as its own section ahead of the personal
// Case Studies -- same "Working Paper" card language as Projects.tsx, just a
// different data source. Every claim here is drawn from the live sites or the
// tool itself; there are no invented numbers.
export default function ClientWork() {
  const reduceMotion = useReducedMotion()
  const fade = reduceMotion
    ? { initial: { opacity: 1 }, whileInView: { opacity: 1 }, transition: { duration: 0 } }
    : { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5 } }

  return (
    <section id="clients" className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="font-[var(--mono)] text-xs uppercase tracking-[0.08em] mb-3" style={{ color: 'var(--ink-dim)' }}>
          Client Work
        </p>
        <p className="text-sm mb-8 max-w-lg" style={{ color: 'var(--ink-dim)' }}>
          Paid, shipped, and in daily use — not coursework.
        </p>

        <div className="space-y-14">
          {clientWork.map((c, i) => (
            <motion.article
              key={c.name}
              {...fade}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ ...fade.transition, delay: reduceMotion ? 0 : i * 0.05 }}
              className="pt-10 first:pt-0"
              style={{ borderTop: i === 0 ? 'none' : '1px solid var(--line)' }}
            >
              <div className="flex items-start justify-between gap-6 flex-wrap">
                <div className="flex-1 min-w-[240px]">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <h3 className="text-2xl" style={{ fontFamily: 'var(--display)' }}>{c.name}</h3>
                    <span className="font-[var(--mono)] text-xs" style={{ color: 'var(--ink-dim)' }}>
                      {c.kind}{c.period ? ` · ${c.period}` : ''}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed max-w-lg" style={{ color: 'var(--ink-dim)' }}>
                    {c.description}
                  </p>
                  <ul className="mt-4 space-y-1.5">
                    {c.bullets.map((b) => (
                      <li key={b} className="text-sm leading-relaxed pl-4 relative">
                        <span className="absolute left-0" style={{ color: 'var(--ink-dim)' }}>—</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs font-[var(--mono)]" style={{ color: 'var(--ink-dim)' }}>
                    {c.scope.join(' · ')}
                  </p>
                  <p className="mt-3 text-sm">
                    {c.link ? (
                      <>
                        <span className="font-[var(--mono)]" style={{ color: 'var(--ink-dim)' }}>[{i + 1}]</span>{' '}
                        <a
                          href={c.link}
                          target="_blank"
                          rel="noreferrer"
                          className="border-b hover:opacity-70 transition-opacity"
                          style={{ borderColor: 'var(--ink)' }}
                        >
                          {c.link.replace('https://', '')}
                        </a>
                      </>
                    ) : (
                      <span className="font-[var(--mono)] text-xs" style={{ color: 'var(--ink-dim)' }}>
                        {c.status}
                      </span>
                    )}
                  </p>
                </div>
                <MiniThumb seed={i} />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
