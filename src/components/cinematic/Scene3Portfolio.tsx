import { motion, useTransform } from 'framer-motion'
import PinnedScene from './PinnedScene'
import { useScrollProgress } from './useScrollProgress'
import { beatOpacity, beatY } from './scrollBeats'
import { Card } from './Scene2Model'
import { projects } from '../../data/resume'

const portfolioProject = projects[1]

// Real, durable engineering facts from this build -- not resume content, so
// kept local rather than added to resume.ts. The Lighthouse score/LCP is
// the validated pre-cinematic-rebuild baseline; the full 5-scene experience
// gets its own real Lighthouse pass in the next phase, not asserted here.
const receipts = [
  { value: '0 KB', label: 'WebGL cost until you click "Enter 3D"' },
  { value: '+16.79 KB', label: 'real gzip cost of the Bloom effect, measured not estimated' },
  { value: '97 / 1.3s', label: 'Lighthouse score / LCP, validated baseline' },
]

export default function Scene3Portfolio() {
  const { ref: wrapperRef, scrollYProgress: progress } = useScrollProgress<HTMLDivElement>()

  const introOpacity = useTransform(() => beatOpacity(progress.get(), 0, 0.1, 0.4, 0.08))
  const introY = useTransform(() => beatY(progress.get(), 0, 0.1))
  const introPointerEvents = useTransform(() => (progress.get() < 0.4 ? 'auto' : 'none'))

  const receiptsOpacity = useTransform(() => beatOpacity(progress.get(), 0.4, 0.1, 1, 0, true))
  const receiptsY = useTransform(() => beatY(progress.get(), 0.4, 0.1))
  const receiptsPointerEvents = useTransform(() => (progress.get() >= 0.4 ? 'auto' : 'none'))

  return (
    <PinnedScene heightVh={200} ref={wrapperRef}>
      <div
        className="relative w-full h-full flex items-center justify-center px-6"
        style={{ background: 'var(--paper)' }}
      >
        <motion.div
          style={{ opacity: introOpacity, y: introY, pointerEvents: introPointerEvents }}
          className="absolute max-w-lg text-center"
        >
          <p className="font-[var(--mono)] text-xs uppercase tracking-[0.08em] mb-3" style={{ color: 'var(--ink-dim)' }}>
            This portfolio, as a project
          </p>
          <h2 className="text-3xl sm:text-4xl italic mb-4" style={{ fontFamily: 'var(--display)', fontWeight: 500 }}>
            {portfolioProject.title}
          </h2>
          <p className="text-base leading-relaxed" style={{ color: 'var(--ink-dim)' }}>
            {portfolioProject.description}
          </p>
        </motion.div>

        <motion.div
          style={{ opacity: receiptsOpacity, y: receiptsY, pointerEvents: receiptsPointerEvents }}
          className="absolute max-w-lg"
        >
          <Card>
            <p className="font-[var(--mono)] text-xs uppercase tracking-[0.08em] mb-4" style={{ color: 'var(--ink-dim)' }}>
              Receipts, not assertions
            </p>
            <div className="space-y-4">
              {receipts.map((r) => (
                <div key={r.label}>
                  <p className="font-[var(--mono)] text-2xl" style={{ color: 'var(--ink)' }}>
                    {r.value}
                  </p>
                  <p className="mt-1 text-[11px] leading-snug" style={{ color: 'var(--ink-dim)' }}>
                    {r.label}
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
