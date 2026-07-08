import { motion, useReducedMotion } from 'framer-motion'

const metrics = [
  { label: 'reviews trained on', value: 'n = 15,000' },
  { label: 'accuracy — 3-class (pos/neu/neg)', value: '0.673' },
  { label: 'accuracy — binary (pos/neg)', value: '0.895' },
  { label: 'projects shipped', value: 'n = 2' },
]

export default function Stats() {
  const reduceMotion = useReducedMotion()

  return (
    <section
      className="py-10 px-6"
      style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}
    >
      <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.4, delay: reduceMotion ? 0 : i * 0.06 }}
            className="py-2 sm:py-0 px-2 sm:px-4 first:pl-0"
            style={{ borderLeft: i === 0 ? 'none' : undefined }}
          >
            <p className="font-[var(--mono)] text-xl sm:text-2xl" style={{ color: 'var(--ink)' }}>
              {m.value}
            </p>
            <p className="mt-1 text-[11px] leading-snug" style={{ color: 'var(--ink-dim)' }}>
              {m.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
