import { forwardRef, type ReactNode } from 'react'

// A tall wrapper (heightVh) holding a `sticky top-0 h-screen` inner element.
// Scrolling through the wrapper's height pins the inner element -- native
// scroll the whole way, no wheel-event capture or preventDefault. Touch
// momentum, keyboard scroll, and screen readers all keep working exactly as
// they do on a normal page. Purely presentational; pair with
// useScrollProgress for the scrub timeline itself.
const PinnedScene = forwardRef<HTMLDivElement, { heightVh: number; id?: string; children: ReactNode }>(
  ({ heightVh, id, children }, ref) => (
    <div ref={ref} id={id} data-pinned-scene style={{ height: `${heightVh}vh` }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden">{children}</div>
    </div>
  )
)
PinnedScene.displayName = 'PinnedScene'

export default PinnedScene
