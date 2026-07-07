import type { ReactNode } from 'react'

export default function Marquee({
  items,
  reverse = false,
  speed = 28,
}: {
  items: ReactNode[]
  reverse?: boolean
  speed?: number
}) {
  return (
    <div className="relative overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div
        className="flex w-max gap-4"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {[...items, ...items].map((item, i) => (
          <div key={i} className="shrink-0">
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
