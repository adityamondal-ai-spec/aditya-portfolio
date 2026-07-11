import type { ComponentType, CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import type { DecisionSpaceData, DecisionSpaceProps } from '../hooks/use3DTakeover'

export function LoadingLabel({ className, style }: { className: string; style?: CSSProperties }) {
  return (
    <div className={`${className} flex items-center justify-center text-xs font-[var(--mono)]`} style={style}>
      Loading 3D&hellip;
    </div>
  )
}

export function Takeover3DPortal({
  loading,
  Scene,
  data,
  onClose,
}: {
  loading: boolean
  Scene: ComponentType<DecisionSpaceProps> | null
  data: DecisionSpaceData | null
  onClose: () => void
}) {
  return createPortal(
    <div className="fixed inset-0 z-[90]" style={{ background: 'var(--paper)' }}>
      {loading || !Scene || !data ? (
        <LoadingLabel className="w-full h-full" style={{ color: 'var(--ink-dim)' }} />
      ) : (
        <Scene data={data} fullscreen />
      )}
      <button
        onClick={onClose}
        aria-label="Close 3D view"
        className="absolute top-5 right-5 z-10 px-3 py-1.5 text-[11px] font-[var(--mono)] uppercase tracking-wide transition-opacity hover:opacity-70"
        style={{ border: '1px solid var(--line)', background: 'var(--paper)', color: 'var(--ink-dim)' }}
      >
        &times; Close
      </button>
    </div>,
    document.body
  )
}
