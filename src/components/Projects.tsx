import { motion, useReducedMotion } from 'framer-motion'
import { projects } from '../data/resume'

// A small static decoration — same visual language as The Boundary, but
// cheap (no canvas/JS) since it's purely illustrative here.
function MiniThumb({ seed }: { seed: number }) {
  const colors = ['#1f5c46', '#b8892e', '#a6402f']
  const pts = Array.from({ length: 14 }, (_, i) => {
    const x = 6 + ((i * 37 + seed * 13) % 88)
    const y = 8 + ((i * 53 + seed * 29) % 44)
    return { x, y, c: colors[(i + seed) % 3] }
  })
  return (
    <svg width="100" height="60" viewBox="0 0 100 60" aria-hidden className="shrink-0">
      <path
        d={`M0,${30 + seed * 4} Q50,${10 + seed * 6} 100,${34 - seed * 3}`}
        stroke="rgba(28,27,23,0.3)"
        strokeWidth="1"
        strokeDasharray="3,3"
        fill="none"
      />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2.2" fill={p.c} />
      ))}
    </svg>
  )
}

export default function Projects() {
  const reduceMotion = useReducedMotion()
  const fade = reduceMotion
    ? { initial: { opacity: 1 }, whileInView: { opacity: 1 }, transition: { duration: 0 } }
    : { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5 } }

  return (
    <section id="work" className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="font-[var(--mono)] text-xs uppercase tracking-[0.08em] mb-8" style={{ color: 'var(--ink-dim)' }}>
          Case Studies
        </p>

        <div className="space-y-14">
          {projects.map((p, i) => (
            <motion.article
              key={p.title}
              {...fade}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ ...fade.transition, delay: reduceMotion ? 0 : i * 0.05 }}
              className="pt-10 first:pt-0"
              style={{ borderTop: i === 0 ? 'none' : '1px solid var(--line)' }}
            >
              <div className="flex items-start justify-between gap-6 flex-wrap">
                <div className="flex-1 min-w-[240px]">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <h3 className="text-2xl" style={{ fontFamily: 'var(--display)' }}>{p.title}</h3>
                    <span className="font-[var(--mono)] text-xs" style={{ color: 'var(--ink-dim)' }}>{p.period}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed max-w-lg" style={{ color: 'var(--ink-dim)' }}>
                    {p.description}
                  </p>
                  <ul className="mt-4 space-y-1.5">
                    {p.bullets.map((b) => (
                      <li key={b} className="text-sm leading-relaxed pl-4 relative">
                        <span className="absolute left-0" style={{ color: 'var(--ink-dim)' }}>—</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs font-[var(--mono)]" style={{ color: 'var(--ink-dim)' }}>
                    {p.stack.join(' · ')}
                  </p>
                  {p.link && (
                    <p className="mt-3 text-sm">
                      <span className="font-[var(--mono)]" style={{ color: 'var(--ink-dim)' }}>[{i + 1}]</span>{' '}
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noreferrer"
                        className="border-b hover:opacity-70 transition-opacity"
                        style={{ borderColor: 'var(--ink)' }}
                      >
                        {p.link.replace('https://', '')}
                      </a>
                    </p>
                  )}
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
