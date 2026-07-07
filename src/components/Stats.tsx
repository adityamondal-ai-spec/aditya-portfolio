import { motion } from 'framer-motion'
import Counter from './Counter'

const stats = [
  { value: 91, suffix: '%', label: 'Model accuracy on held-out reviews' },
  { value: 10000, suffix: '+', label: 'Reviews used to train the sentiment model' },
  { value: 15, suffix: '+', label: 'Students mentored in Python' },
  { value: 10, suffix: '+', label: 'Tools & technologies in active use' },
]

export default function Stats() {
  return (
    <section className="relative py-16 px-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="text-center sm:text-left"
          >
            <p className="text-4xl sm:text-5xl font-semibold gradient-text font-[var(--heading)]">
              <Counter value={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-2 text-xs sm:text-sm text-[var(--text-dim)] leading-snug">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
