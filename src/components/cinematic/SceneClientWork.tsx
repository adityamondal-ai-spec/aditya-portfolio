import { motion, useTransform } from 'framer-motion'
import PinnedScene from './PinnedScene'
import { useScrollProgress } from './useScrollProgress'
import { beatOpacity, beatY } from './scrollBeats'
import { Card } from './Scene2Model'
import { clientWork } from '../../data/resume'

// Sixth cinematic beat, slotted between "this portfolio as a project" and the
// credentials Log: the real, paid client work. Same choreography vocabulary as
// the other scenes (PinnedScene + useScrollProgress + beatOpacity/beatY + the
// shared Card) -- no new design language, just a new beat in the story. Uses
// the short `tagline` per client so all four cards fit one screen; the full
// descriptions live in the classic ClientWork section.
export default function SceneClientWork() {
  const { ref: wrapperRef, scrollYProgress: progress } = useScrollProgress<HTMLDivElement>()

  const introOpacity = useTransform(() => beatOpacity(progress.get(), 0, 0.1, 0.28, 0.06))
  const introY = useTransform(() => beatY(progress.get(), 0, 0.1))
  const introPointerEvents = useTransform(() => (progress.get() < 0.28 ? 'auto' : 'none'))

  const cardsOpacity = useTransform(() => beatOpacity(progress.get(), 0.28, 0.1, 1, 0, true))
  const cardsY = useTransform(() => beatY(progress.get(), 0.28, 0.1))
  const cardsPointerEvents = useTransform(() => (progress.get() >= 0.28 ? 'auto' : 'none'))

  return (
    <PinnedScene heightVh={280} id="clients" ref={wrapperRef}>
      <div
        className="relative w-full h-full flex items-center justify-center px-6"
        style={{ background: 'var(--paper)' }}
      >
        <motion.div
          style={{ opacity: introOpacity, y: introY, pointerEvents: introPointerEvents }}
          className="absolute max-w-lg text-center"
        >
          <p className="font-[var(--mono)] text-xs uppercase tracking-[0.08em] mb-3" style={{ color: 'var(--ink-dim)' }}>
            Real client work
          </p>
          <h2 className="text-3xl sm:text-4xl italic mb-4" style={{ fontFamily: 'var(--display)', fontWeight: 500 }}>
            Paid, shipped, in use.
          </h2>
          <p className="text-base leading-relaxed" style={{ color: 'var(--ink-dim)' }}>
            Four real engagements — a consultancy, a trainer, a college, and an internal automation tool that runs every day.
          </p>
        </motion.div>

        <motion.div
          style={{ opacity: cardsOpacity, y: cardsY, pointerEvents: cardsPointerEvents }}
          className="absolute w-full max-w-3xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {clientWork.map((c) => (
              <Card key={c.name}>
                <h3 className="text-xl" style={{ fontFamily: 'var(--display)' }}>{c.name}</h3>
                <p className="mt-1 font-[var(--mono)] text-[10px] uppercase tracking-[0.06em]" style={{ color: 'var(--ink-dim)' }}>
                  {c.kind}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed" style={{ color: 'var(--ink)' }}>
                  {c.tagline}
                </p>
                <p className="mt-3 text-[11px]">
                  {c.link ? (
                    <a
                      href={c.link}
                      target="_blank"
                      rel="noreferrer"
                      className="border-b hover:opacity-70 transition-opacity font-[var(--mono)]"
                      style={{ borderColor: 'var(--ink)', color: 'var(--ink)' }}
                    >
                      {c.link.replace('https://', '')}
                    </a>
                  ) : (
                    <span className="font-[var(--mono)]" style={{ color: 'var(--ink-dim)' }}>{c.status}</span>
                  )}
                </p>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </PinnedScene>
  )
}
