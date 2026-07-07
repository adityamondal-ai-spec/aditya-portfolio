import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { projects, type Project } from '../data/resume'

function TiltCard({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<React.CSSProperties>({})

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setStyle({
      transform: `perspective(900px) rotateX(${(-y * 10).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg) translateZ(0)`,
    })
  }

  function handleMouseLeave() {
    setStyle({ transform: 'perspective(900px) rotateX(0deg) rotateY(0deg)' })
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ ...style, transition: 'transform 0.15s ease-out' }}
      className="relative glass rounded-2xl p-8 will-change-transform overflow-hidden"
    >
      <span
        aria-hidden
        className="absolute -top-6 -right-4 text-[9rem] font-bold leading-none select-none pointer-events-none font-[var(--heading)]"
        style={{ color: 'rgba(124,92,255,0.06)' }}
      >
        01
      </span>
      <div className="relative flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-[var(--text-h)]">{project.title}</h3>
        <span className="font-[var(--mono)] text-xs text-[var(--accent-2)]">{project.period}</span>
      </div>
      <p className="relative text-[var(--text-dim)] mb-5">{project.description}</p>
      <ul className="relative space-y-2 mb-6">
        {project.bullets.map((b) => (
          <li key={b} className="text-sm text-[var(--text)] flex gap-2">
            <span className="text-[var(--accent)]">›</span>
            {b}
          </li>
        ))}
      </ul>
      <div className="relative flex flex-wrap gap-2">
        {project.stack.map((s) => (
          <span
            key={s}
            className="text-xs px-3 py-1 rounded-full border border-[var(--surface-border)] text-[var(--text-dim)]"
          >
            {s}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="relative py-28 px-6 max-w-5xl mx-auto overflow-hidden">
      <div className="blob w-[300px] h-[300px] bg-[#7c5cff] opacity-[0.08] top-1/3 -left-32" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-[var(--mono)] text-sm text-[var(--accent-2)] mb-3">02 — Projects</p>
        <h2 className="text-3xl sm:text-4xl font-semibold mb-12">Things I've built</h2>
      </motion.div>

      <div className="grid sm:grid-cols-1 gap-8">
        {projects.map((p) => (
          <TiltCard key={p.title} project={p} />
        ))}
      </div>
    </section>
  )
}
