import { motion, useTransform } from 'framer-motion'
import PinnedScene from './PinnedScene'
import { useScrollProgress } from './useScrollProgress'
import { beatOpacity, beatY } from './scrollBeats'
import { profile, links } from '../../data/resume'

export default function Scene5Contact() {
  const { ref: wrapperRef, scrollYProgress: progress } = useScrollProgress<HTMLDivElement>()

  // Short, closing scene -- one beat that fades in and holds through the
  // end rather than fading out into anything (Footer follows in normal,
  // un-pinned document flow once this scene releases).
  const opacity = useTransform(() => beatOpacity(progress.get(), 0, 0.15, 1, 0, true))
  const y = useTransform(() => beatY(progress.get(), 0, 0.15))
  const pointerEvents = useTransform(() => (progress.get() >= 0.1 ? 'auto' : 'none'))

  return (
    <PinnedScene heightVh={150} id="contact" ref={wrapperRef}>
      <div
        className="relative w-full h-full flex items-center justify-center px-6"
        style={{ background: 'var(--paper)' }}
      >
        <motion.div style={{ opacity, y, pointerEvents }} className="max-w-lg">
          <p className="font-[var(--mono)] text-xs uppercase tracking-[0.08em] mb-6" style={{ color: 'var(--ink-dim)' }}>
            Contact
          </p>
          <p className="text-xl sm:text-2xl leading-relaxed" style={{ fontFamily: 'var(--display)' }}>
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
              <a
                href={links.github}
                className="border-b pb-0.5 hover:opacity-70 transition-opacity"
                style={{ borderColor: 'var(--line)' }}
              >
                GitHub
              </a>
            ) : (
              <span style={{ color: 'var(--ink-dim)', opacity: 0.5 }}>GitHub (coming soon)</span>
            )}
            {links.linkedin ? (
              <a
                href={links.linkedin}
                className="border-b pb-0.5 hover:opacity-70 transition-opacity"
                style={{ borderColor: 'var(--line)' }}
              >
                LinkedIn
              </a>
            ) : (
              <span style={{ color: 'var(--ink-dim)', opacity: 0.5 }}>LinkedIn (coming soon)</span>
            )}
          </div>
        </motion.div>
      </div>
    </PinnedScene>
  )
}
