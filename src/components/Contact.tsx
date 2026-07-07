import { motion } from 'framer-motion'
import { profile, links } from '../data/resume'
import MagneticButton from './MagneticButton'

export default function Contact() {
  return (
    <section id="contact" className="relative py-32 px-6 max-w-3xl mx-auto text-center overflow-hidden">
      <div className="blob w-[400px] h-[400px] bg-[#7c5cff] opacity-[0.12] top-0 left-1/2 -translate-x-1/2" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <p className="font-[var(--mono)] text-sm text-[var(--accent-2)] mb-3">04 — Contact</p>
        <h2 className="text-3xl sm:text-4xl font-semibold mb-6">Let's build something.</h2>
        <p className="text-[var(--text-dim)] text-lg mb-10 max-w-xl mx-auto">
          Looking for a summer internship in AI/ML. If you have an opening or just want to talk
          about a project, reach out.
        </p>
        <MagneticButton
          href={`mailto:${profile.email}`}
          className="inline-block px-8 py-3 rounded-full text-white font-medium"
          style={{ background: 'var(--accent-grad)' }}
        >
          {profile.email}
        </MagneticButton>

        <div className="flex justify-center gap-6 mt-10 text-sm text-[var(--text-dim)]">
          {links.github ? (
            <a href={links.github} className="hover:text-[var(--text-h)]">GitHub</a>
          ) : (
            <span className="opacity-40 cursor-not-allowed">GitHub (coming soon)</span>
          )}
          {links.linkedin ? (
            <a href={links.linkedin} className="hover:text-[var(--text-h)]">LinkedIn</a>
          ) : (
            <span className="opacity-40 cursor-not-allowed">LinkedIn (coming soon)</span>
          )}
        </div>
      </motion.div>
    </section>
  )
}
