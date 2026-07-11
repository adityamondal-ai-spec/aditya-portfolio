import { motion, useTransform } from 'framer-motion'
import PinnedScene from './PinnedScene'
import { useScrollProgress } from './useScrollProgress'
import { beatOpacity, beatY } from './scrollBeats'
import BoundaryViz from '../BoundaryViz'
import SentimentQuiz from '../SentimentQuiz'
import { Takeover3DPortal } from '../Takeover3DPortal'
import { use3DTakeover } from '../../hooks/use3DTakeover'
import { metrics, projects } from '../../data/resume'

// The full, unedited bullets (with the exact accuracy/dataset numbers) live
// in resume.ts's projects[0] and are still shown verbatim in the classic
// experience's Projects list. Here, the stats beat immediately above
// already showed those same numbers as big type -- restating them again in
// prose reads as redundant once both are on screen in sequence, so this
// scene's version references them instead of repeating them.
const pipelineBullets = [
  projects[0].bullets[0],
  'Trained on the same stratified sample shown above — the Yelp Review Full dataset, not a toy set.',
  'Same real numbers, same held-out test set — no cherry-picking.',
]

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="max-w-md px-6 py-5"
      style={{ background: 'var(--paper)', border: '1px solid var(--line)', boxShadow: '0 8px 28px rgba(28,27,23,0.12)' }}
    >
      {children}
    </div>
  )
}

export default function Scene2Model() {
  const { ref: wrapperRef, scrollYProgress: progress } = useScrollProgress<HTMLDivElement>()
  const takeover3D = use3DTakeover()

  // Every scroll-driven style value here uses the function form of
  // useTransform (reads progress.get() directly) rather than the array
  // form (useTransform(progress, input, output)) -- see scrollBeats.ts for
  // why. Proven-reliable pattern, not a one-off workaround.
  const statsOpacity = useTransform(() => beatOpacity(progress.get(), 0.15, 0.07, 0.45, 0.05))
  const statsY = useTransform(() => beatY(progress.get(), 0.15, 0.07))
  const statsPointerEvents = useTransform(() => (progress.get() >= 0.15 && progress.get() < 0.45 ? 'auto' : 'none'))

  const bulletsOpacity = useTransform(() => beatOpacity(progress.get(), 0.45, 0.07, 0.7, 0.05))
  const bulletsY = useTransform(() => beatY(progress.get(), 0.45, 0.07))
  const bulletsPointerEvents = useTransform(() => (progress.get() >= 0.45 && progress.get() < 0.7 ? 'auto' : 'none'))

  const quizOpacity = useTransform(() => beatOpacity(progress.get(), 0.7, 0.08, 1, 0, true))
  const quizY = useTransform(() => beatY(progress.get(), 0.7, 0.08))
  const quizPointerEvents = useTransform(() => (progress.get() >= 0.7 ? 'auto' : 'none'))

  return (
    <PinnedScene heightVh={350} id="work" ref={wrapperRef}>
      <div className="relative w-full h-full">
        <BoundaryViz variant="fullbleed" />

        {/* Real accuracy numbers -- same metrics as Stats.tsx, staged as a
            cinematic reveal instead of a static strip. */}
        <motion.div
          style={{ opacity: statsOpacity, y: statsY, pointerEvents: statsPointerEvents }}
          className="absolute bottom-10 left-10 z-10"
        >
          <Card>
            <div className="grid grid-cols-2 gap-4">
              {metrics.slice(0, 3).map((m) => (
                <div key={m.label}>
                  <p className="font-[var(--mono)] text-2xl sm:text-3xl" style={{ color: 'var(--ink)' }}>
                    {m.value}
                  </p>
                  <p className="mt-1 text-[11px] leading-snug" style={{ color: 'var(--ink-dim)' }}>
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Pipeline, straight from the real project entry -- unedited. */}
        <motion.div
          style={{ opacity: bulletsOpacity, y: bulletsY, pointerEvents: bulletsPointerEvents }}
          className="absolute bottom-10 left-10 z-10"
        >
          <Card>
            <p className="font-[var(--mono)] text-xs uppercase tracking-[0.08em] mb-3" style={{ color: 'var(--ink-dim)' }}>
              How it works
            </p>
            <ul className="space-y-2.5">
              {pipelineBullets.map((b) => (
                <li key={b} className="text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>
                  {b}
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>

        {/* Closing beat: the quiz, plus the same "Enter 3D" upgrade path
            that exists in the classic experience. */}
        <motion.div
          style={{ opacity: quizOpacity, y: quizY, pointerEvents: quizPointerEvents }}
          className="absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-3 px-6"
        >
          <div className="w-full max-w-lg" style={{ boxShadow: '0 8px 28px rgba(28,27,23,0.12)' }}>
            <SentimentQuiz />
          </div>
          <button
            onClick={takeover3D.enter3D}
            className="text-[11px] font-[var(--mono)] uppercase tracking-wide underline underline-offset-2"
            style={{ color: 'var(--ink-dim)' }}
          >
            Enter 3D &rarr;
          </button>
        </motion.div>

        {takeover3D.mode === '3d' && takeover3D.takeover && (
          <Takeover3DPortal
            loading={takeover3D.loading}
            Scene={takeover3D.Scene}
            data={takeover3D.data}
            onClose={takeover3D.exit3D}
          />
        )}
      </div>
    </PinnedScene>
  )
}
