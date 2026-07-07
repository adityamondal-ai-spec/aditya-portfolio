import { motion } from 'framer-motion'
import { experience, certifications } from '../data/resume'
import Marquee from './Marquee'

export default function Experience() {
  return (
    <section id="experience" className="relative py-28 px-6 max-w-5xl mx-auto overflow-hidden">
      <div className="blob w-[360px] h-[360px] bg-[#7c5cff] opacity-[0.08] top-10 -right-32" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-[var(--mono)] text-sm text-[var(--accent-2)] mb-3">03 — Experience</p>
        <h2 className="text-3xl sm:text-4xl font-semibold mb-12">Where I've worked</h2>
      </motion.div>

      <div className="relative mb-20">
        <div className="absolute left-[7px] sm:left-[9px] top-2 bottom-2 w-px bg-[var(--surface-border)]" />
        <div className="space-y-10">
          {experience.map((item, i) => (
            <motion.div
              key={item.title + i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative pl-8 sm:pl-10"
            >
              <span
                className="absolute left-0 top-1.5 w-[15px] h-[15px] sm:w-[19px] sm:h-[19px] rounded-full border-2"
                style={{ borderColor: 'var(--accent-2)', background: 'var(--bg)' }}
              />
              <div className="glass glass-hover rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8">
                <div className="sm:w-56 shrink-0">
                  <p className="font-semibold text-[var(--text-h)]">{item.title}</p>
                  <p className="text-sm text-[var(--text-dim)]">{item.org}</p>
                  <p className="font-[var(--mono)] text-xs text-[var(--accent-2)] mt-1">{item.period}</p>
                </div>
                <ul className="space-y-2 flex-1">
                  {item.bullets.map((b) => (
                    <li key={b} className="text-sm text-[var(--text)] flex gap-2">
                      <span className="text-[var(--accent)]">›</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.h3
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="text-xl font-semibold mb-6 text-[var(--text-h)]"
      >
        Certifications
      </motion.h3>
      <Marquee
        speed={22}
        items={certifications.map((c) => (
          <div
            key={c.title}
            className="glass glass-hover rounded-xl px-6 py-5 w-72"
          >
            <p className="font-medium text-[var(--text-h)]">{c.title}</p>
            <p className="text-sm text-[var(--text-dim)]">{c.issuer}</p>
            <p className="font-[var(--mono)] text-xs text-[var(--accent-2)] mt-2">{c.status}</p>
          </div>
        ))}
      />
    </section>
  )
}
