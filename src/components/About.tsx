import { motion } from 'framer-motion'
import { profile, education, skills } from '../data/resume'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

export default function About() {
  return (
    <section id="about" className="relative py-28 px-6 max-w-5xl mx-auto overflow-hidden">
      <div className="blob w-[320px] h-[320px] bg-[#22d3ee] opacity-[0.08] -top-24 right-10" />
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        variants={fadeUp}
      >
        <p className="font-[var(--mono)] text-sm text-[var(--accent-2)] mb-3">01 — About</p>
        <h2 className="text-3xl sm:text-4xl font-semibold mb-6">Who I am</h2>
        <p className="text-[var(--text-dim)] text-lg leading-relaxed max-w-2xl">
          {profile.summary}
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-8 mt-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          variants={fadeUp}
          className="glass glass-hover rounded-2xl p-8"
        >
          <h3 className="text-xl font-semibold mb-4 text-[var(--text-h)]">Education</h3>
          <p className="font-medium text-[var(--text-h)]">{education.school}</p>
          <p className="text-[var(--text-dim)] mt-1">{education.degree}</p>
          <div className="flex gap-6 mt-4 text-sm font-[var(--mono)] text-[var(--accent-2)]">
            <span>{education.graduation}</span>
            <span>CGPA {education.cgpa}</span>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          variants={fadeUp}
          className="glass glass-hover rounded-2xl p-8"
        >
          <h3 className="text-xl font-semibold mb-4 text-[var(--text-h)]">Skills</h3>
          <div className="space-y-4">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category}>
                <p className="text-xs uppercase tracking-wide text-[var(--text-dim)] mb-2">
                  {category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-3 py-1 rounded-full border border-[var(--surface-border)] text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text-h)]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
