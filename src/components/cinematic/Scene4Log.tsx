import { motion, useTransform } from 'framer-motion'
import PinnedScene from './PinnedScene'
import { useScrollProgress } from './useScrollProgress'
import { beatOpacity, beatY } from './scrollBeats'
import { Card } from './Scene2Model'
import { experience, certifications, skills } from '../../data/resume'

export default function Scene4Log() {
  const { ref: wrapperRef, scrollYProgress: progress } = useScrollProgress<HTMLDivElement>()

  const experienceOpacity = useTransform(() => beatOpacity(progress.get(), 0, 0.08, 0.35, 0.05))
  const experienceY = useTransform(() => beatY(progress.get(), 0, 0.08))
  const experiencePointerEvents = useTransform(() => (progress.get() < 0.35 ? 'auto' : 'none'))

  const certOpacity = useTransform(() => beatOpacity(progress.get(), 0.35, 0.07, 0.65, 0.05))
  const certY = useTransform(() => beatY(progress.get(), 0.35, 0.07))
  const certPointerEvents = useTransform(() => (progress.get() >= 0.35 && progress.get() < 0.65 ? 'auto' : 'none'))

  const skillsOpacity = useTransform(() => beatOpacity(progress.get(), 0.65, 0.08, 1, 0, true))
  const skillsY = useTransform(() => beatY(progress.get(), 0.65, 0.08))
  const skillsPointerEvents = useTransform(() => (progress.get() >= 0.65 ? 'auto' : 'none'))

  return (
    <PinnedScene heightVh={200} id="log" ref={wrapperRef}>
      <div
        className="relative w-full h-full flex items-center justify-center px-6"
        style={{ background: 'var(--paper)' }}
      >
        <p
          className="absolute top-16 font-[var(--mono)] text-xs uppercase tracking-[0.08em]"
          style={{ color: 'var(--ink-dim)' }}
        >
          The log
        </p>

        <motion.div
          style={{ opacity: experienceOpacity, y: experienceY, pointerEvents: experiencePointerEvents }}
          className="absolute max-w-lg"
        >
          <Card>
            <p className="font-[var(--mono)] text-xs uppercase tracking-[0.08em] mb-1" style={{ color: 'var(--ink-dim)' }}>
              {experience[0].period}
            </p>
            <h3 className="text-xl italic mb-1" style={{ fontFamily: 'var(--display)', fontWeight: 500 }}>
              {experience[0].title}
            </h3>
            <p className="text-sm mb-3" style={{ color: 'var(--ink-dim)' }}>
              {experience[0].org}
            </p>
            <ul className="space-y-1.5">
              {experience[0].bullets.map((b) => (
                <li key={b} className="text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>
                  {b}
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>

        <motion.div
          style={{ opacity: certOpacity, y: certY, pointerEvents: certPointerEvents }}
          className="absolute max-w-lg"
        >
          <Card>
            <p className="font-[var(--mono)] text-xs uppercase tracking-[0.08em] mb-1" style={{ color: 'var(--ink-dim)' }}>
              {certifications[0].status}
            </p>
            <h3 className="text-xl italic mb-1" style={{ fontFamily: 'var(--display)', fontWeight: 500 }}>
              {certifications[0].title}
            </h3>
            <p className="text-sm" style={{ color: 'var(--ink-dim)' }}>
              {certifications[0].issuer}
            </p>
          </Card>
        </motion.div>

        <motion.div
          style={{ opacity: skillsOpacity, y: skillsY, pointerEvents: skillsPointerEvents }}
          className="absolute max-w-lg"
        >
          <Card>
            <p className="font-[var(--mono)] text-xs uppercase tracking-[0.08em] mb-4" style={{ color: 'var(--ink-dim)' }}>
              Working with
            </p>
            <div className="space-y-3">
              {Object.entries(skills).map(([group, items]) => (
                <div key={group}>
                  <p className="text-[11px] uppercase tracking-wide mb-1" style={{ color: 'var(--ink-dim)' }}>
                    {group}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--ink)' }}>
                    {items.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </PinnedScene>
  )
}
