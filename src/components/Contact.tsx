import { motion, useReducedMotion } from 'framer-motion'
import { profile, links } from '../data/resume'

export default function Contact() {
  const reduceMotion = useReducedMotion()
  const fade = reduceMotion
    ? { initial: { opacity: 1 }, whileInView: { opacity: 1 }, transition: { duration: 0 } }
    : { initial: { opacity: 0, y: 14 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5 } }

  return (
    <section id="contact" className="py-24 px-6">
      <motion.div {...fade} viewport={{ once: true, amount: 0.5 }} className="max-w-3xl mx-auto">
        <p className="font-[var(--mono)] text-xs uppercase tracking-[0.08em] mb-6" style={{ color: 'var(--ink-dim)' }}>
          Contact
        </p>
        <p className="text-xl sm:text-2xl leading-relaxed max-w-lg" style={{ fontFamily: 'var(--display)' }}>
          Looking for a summer internship in AI/ML. If you have an opening, or just want to talk
          about a project — write to me.
        </p>
        <p className="mt-6">
          <a
            href={`mailto:${profile.email}`}
            className="text-base border-b hover:opacity-70 transition-opacity"
            style={{ borderColor: 'var(--ink)' }}
          >
            {profile.email}
          </a>
        </p>

        <div className="flex gap-6 mt-8 text-sm">
          {links.github ? (
            <a href={links.github} className="border-b pb-0.5 hover:opacity-70 transition-opacity" style={{ borderColor: 'var(--line)' }}>
              GitHub
            </a>
          ) : (
            <span style={{ color: 'var(--ink-dim)', opacity: 0.5 }}>GitHub (coming soon)</span>
          )}
          {links.linkedin ? (
            <a href={links.linkedin} className="border-b pb-0.5 hover:opacity-70 transition-opacity" style={{ borderColor: 'var(--line)' }}>
              LinkedIn
            </a>
          ) : (
            <span style={{ color: 'var(--ink-dim)', opacity: 0.5 }}>LinkedIn (coming soon)</span>
          )}
        </div>
      </motion.div>
    </section>
  )
}
