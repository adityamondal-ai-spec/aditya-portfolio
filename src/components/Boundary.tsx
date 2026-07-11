import { useEffect, useState } from 'react'
import BoundaryViz from './BoundaryViz'
import { use3DTakeover } from '../hooks/use3DTakeover'
import { Takeover3DPortal, LoadingLabel } from './Takeover3DPortal'

function detectCanUse3D(): boolean {
  if (typeof window === 'undefined') return false
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return false
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

// Internal testing hook only (not documented/linked anywhere): ?force3d=1
// auto-triggers the 3D load path so Lighthouse can measure that state
// directly, without needing a scripted click-through.
function detectForce3D(): boolean {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('force3d') === '1'
}

const BOX_CLASS = 'relative w-full h-[320px] sm:h-[380px]'

export default function Boundary() {
  // Computed synchronously at init (not in an effect) so it's correct on
  // the very first render — flipping it post-mount would itself cause the
  // "Enter 3D" row to pop in and shift layout, the exact thing this whole
  // component is trying to avoid.
  const [canUse3D] = useState(detectCanUse3D)
  const { mode, loading, Scene, data, takeover, enter3D, exit3D } = use3DTakeover()

  useEffect(() => {
    if (detectForce3D() && canUse3D) enter3D()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      {mode === '2d' && <BoundaryViz />}

      {mode === '3d' &&
        !takeover &&
        (loading || !Scene || !data ? (
          <LoadingLabel
            className={BOX_CLASS}
            style={{ background: 'var(--paper-raised)', border: '1px solid var(--line)', color: 'var(--ink-dim)' }}
          />
        ) : (
          <div className={BOX_CLASS} style={{ border: '1px solid var(--line)' }}>
            <Scene data={data} />
          </div>
        ))}

      {mode === '3d' && takeover && (
        <Takeover3DPortal loading={loading} Scene={Scene} data={data} onClose={exit3D} />
      )}

      {/* Fixed-height row reserved up front, same as the box above, so
          nothing shifts once canUse3D resolves (it already has, synchronously). */}
      <div className="mt-2 h-[22px] flex justify-end">
        {canUse3D &&
          (mode === '2d' ? (
            <button
              onClick={enter3D}
              className="text-[11px] font-[var(--mono)] uppercase tracking-wide underline underline-offset-2"
              style={{ color: 'var(--ink-dim)' }}
            >
              Enter 3D &rarr;
            </button>
          ) : (
            <button
              onClick={exit3D}
              className="text-[11px] font-[var(--mono)] uppercase tracking-wide underline underline-offset-2"
              style={{ color: 'var(--ink-dim)' }}
            >
              &larr; Back to 2D
            </button>
          ))}
      </div>
    </div>
  )
}
