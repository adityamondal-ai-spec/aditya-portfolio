import { useEffect, useRef, useState } from 'react'

type Status = 'idle' | 'playing' | 'over'

const GROUND_MARGIN = 28
const GRAVITY = 0.0028 // px/ms^2 (tuned for a ~60fps-equivalent feel)
const JUMP_VELOCITY = -0.72 // px/ms
const RUNNER_SIZE = 26
const RUNNER_X = 46
const BASE_SPEED = 0.28 // px/ms
const MAX_SPEED = 0.62

type Obstacle = { x: number; width: number; height: number }

const BOARD_HEIGHT = 220

export default function PlayZone() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const statusRef = useRef<Status>('idle')
  const [status, setStatus] = useState<Status>('idle')
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)

  // Mutable game state lives in refs so the physics loop never triggers a
  // React re-render — React state is only touched a few times a second, for
  // the score readout and status transitions.
  const runnerY = useRef(0)
  const velocity = useRef(0)
  const obstacles = useRef<Obstacle[]>([])
  const distance = useRef(0)
  const speed = useRef(BASE_SPEED)
  const nextSpawnAt = useRef(600)
  const rafId = useRef(0)
  const lastTime = useRef(0)
  const dims = useRef({ width: 600, height: BOARD_HEIGHT })
  const dots = useRef<{ x: number; y: number; r: number }[]>([])

  function resetGame() {
    runnerY.current = 0
    velocity.current = 0
    obstacles.current = []
    distance.current = 0
    speed.current = BASE_SPEED
    nextSpawnAt.current = 500 + Math.random() * 300
    setScore(0)
  }

  function jumpOrStart() {
    if (statusRef.current === 'idle') {
      resetGame()
      statusRef.current = 'playing'
      setStatus('playing')
      return
    }
    if (statusRef.current === 'over') {
      resetGame()
      statusRef.current = 'playing'
      setStatus('playing')
      return
    }
    // playing: jump, only while grounded
    if (runnerY.current === 0) {
      velocity.current = JUMP_VELOCITY
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const container = canvas.parentElement
    if (!container) return

    function fitCanvas() {
      const rect = container!.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      dims.current = { width: rect.width, height: BOARD_HEIGHT }
      canvas!.width = rect.width * dpr
      canvas!.height = BOARD_HEIGHT * dpr
      canvas!.style.width = `${rect.width}px`
      canvas!.style.height = `${BOARD_HEIGHT}px`
      const ctx = canvas!.getContext('2d')
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)

      // background constellation dots — generated once per resize, static,
      // echoing the same motif as the hero/OG image rather than a blank void
      const count = Math.round(rect.width / 26)
      dots.current = Array.from({ length: count }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * (BOARD_HEIGHT - 40),
        r: Math.random() * 1.2 + 0.4,
      }))
    }

    fitCanvas()
    window.addEventListener('resize', fitCanvas)

    const ctx = canvas.getContext('2d')!

    function spawnObstacle() {
      const h = 22 + Math.random() * 20
      obstacles.current.push({ x: dims.current.width + 20, width: 16, height: h })
    }

    function draw() {
      const { width, height } = dims.current
      const groundY = height - GROUND_MARGIN

      ctx.clearRect(0, 0, width, height)

      // solid base first — the canvas owns its own background rather than
      // relying on whatever glass/blur is behind it in the DOM
      ctx.fillStyle = '#0a0b12'
      ctx.fillRect(0, 0, width, height)

      // board background — a soft accent glow layered on top of the base
      const bg = ctx.createRadialGradient(width * 0.82, 26, 10, width * 0.82, 26, width * 0.7)
      bg.addColorStop(0, 'rgba(124,92,255,0.22)')
      bg.addColorStop(0.5, 'rgba(34,211,238,0.09)')
      bg.addColorStop(1, 'rgba(10,11,18,0)')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, width, height)

      // static constellation dots for texture
      ctx.fillStyle = 'rgba(199,210,254,0.35)'
      for (const d of dots.current) {
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fill()
      }

      // ground line — soft gradient instead of a flat white rule
      const groundGrad = ctx.createLinearGradient(0, 0, width, 0)
      groundGrad.addColorStop(0, 'rgba(124,92,255,0.55)')
      groundGrad.addColorStop(1, 'rgba(34,211,238,0.35)')
      ctx.strokeStyle = groundGrad
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(0, groundY)
      ctx.lineTo(width, groundY)
      ctx.stroke()
      // faint glow beneath the line
      ctx.fillStyle = 'rgba(124,92,255,0.05)'
      ctx.fillRect(0, groundY, width, height - groundY)

      // runner
      const runnerTop = groundY - RUNNER_SIZE - runnerY.current
      const grad = ctx.createLinearGradient(RUNNER_X, runnerTop, RUNNER_X + RUNNER_SIZE, runnerTop + RUNNER_SIZE)
      grad.addColorStop(0, '#7c5cff')
      grad.addColorStop(1, '#22d3ee')
      ctx.fillStyle = grad
      ctx.shadowColor = 'rgba(124,92,255,0.55)'
      ctx.shadowBlur = 14
      const r = 6
      ctx.beginPath()
      ctx.roundRect(RUNNER_X, runnerTop, RUNNER_SIZE, RUNNER_SIZE, r)
      ctx.fill()
      ctx.shadowBlur = 0

      // obstacles
      ctx.fillStyle = '#fb7185'
      for (const ob of obstacles.current) {
        const top = groundY - ob.height
        ctx.beginPath()
        ctx.moveTo(ob.x, groundY)
        ctx.lineTo(ob.x + ob.width / 2, top)
        ctx.lineTo(ob.x + ob.width, groundY)
        ctx.closePath()
        ctx.fill()
      }
    }

    function checkCollision(): boolean {
      const { height } = dims.current
      const groundY = height - GROUND_MARGIN
      const runnerLeft = RUNNER_X
      const runnerRight = RUNNER_X + RUNNER_SIZE
      const runnerBottom = groundY - runnerY.current

      for (const ob of obstacles.current) {
        const obLeft = ob.x
        const obRight = ob.x + ob.width
        const obTop = groundY - ob.height
        const overlapX = runnerRight > obLeft + 3 && runnerLeft < obRight - 3
        const overlapY = runnerBottom > obTop + 3
        if (overlapX && overlapY) return true
      }
      return false
    }

    function tick(now: number) {
      if (!lastTime.current) lastTime.current = now
      const dt = Math.min(now - lastTime.current, 40)
      lastTime.current = now

      if (statusRef.current === 'playing') {
        // physics
        velocity.current += GRAVITY * dt
        runnerY.current = Math.max(0, runnerY.current - velocity.current * dt)
        if (runnerY.current === 0) velocity.current = Math.min(velocity.current, 0)

        // difficulty ramp
        speed.current = Math.min(MAX_SPEED, BASE_SPEED + distance.current * 0.000012)
        distance.current += speed.current * dt

        // move + spawn obstacles
        for (const ob of obstacles.current) ob.x -= speed.current * dt
        obstacles.current = obstacles.current.filter((ob) => ob.x + ob.width > -10)
        if (distance.current > nextSpawnAt.current) {
          spawnObstacle()
          nextSpawnAt.current = distance.current + 380 + Math.random() * 420
        }

        if (checkCollision()) {
          statusRef.current = 'over'
          const finalScore = Math.floor(distance.current / 10)
          setScore(finalScore)
          setBest((b) => Math.max(b, finalScore))
          setStatus('over')
        } else {
          const liveScore = Math.floor(distance.current / 10)
          setScore((s) => (s !== liveScore ? liveScore : s))
        }
      }

      draw()
      rafId.current = requestAnimationFrame(tick)
    }

    rafId.current = requestAnimationFrame(tick)

    function handleKey(e: KeyboardEvent) {
      if (e.code === 'Space') {
        e.preventDefault()
        jumpOrStart()
      }
    }
    window.addEventListener('keydown', handleKey)

    return () => {
      cancelAnimationFrame(rafId.current)
      window.removeEventListener('resize', fitCanvas)
      window.removeEventListener('keydown', handleKey)
    }
  }, [])

  return (
    <section className="relative py-28 px-6 max-w-3xl mx-auto text-center overflow-hidden">
      <div className="blob w-[320px] h-[320px] bg-[#22d3ee] opacity-[0.08] top-10 right-0" />

      <p className="font-[var(--mono)] text-sm text-[var(--accent-2)] mb-3">One more thing</p>
      <h2 className="text-3xl sm:text-4xl font-semibold mb-4">Tap to jump.</h2>
      <p className="text-[var(--text-dim)] mb-10">
        Dodge the obstacles. Score goes up the longer you survive.
        {best > 0 && <span className="block mt-1 text-sm text-[var(--accent-2)]">Best: {best}</span>}
      </p>

      <div
        className="relative glass rounded-2xl mx-auto w-full max-w-[520px] overflow-hidden cursor-pointer select-none shadow-[0_0_0_1px_rgba(124,92,255,0.12),0_20px_60px_-20px_rgba(124,92,255,0.35)]"
        onClick={jumpOrStart}
        onTouchStart={(e) => {
          e.preventDefault()
          jumpOrStart()
        }}
      >
        <div className="absolute top-0 inset-x-0 h-[2px]" style={{ background: 'var(--accent-grad)' }} />

        <div
          className="absolute top-3 left-4 z-10 font-[var(--mono)] text-xs text-[var(--text-dim)] px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(6,7,10,0.55)', border: '1px solid var(--surface-border)' }}
        >
          Score: {score}
        </div>

        <canvas ref={canvasRef} className="block w-full" />

        {status === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="px-6 py-3 rounded-full text-white font-medium text-sm" style={{ background: 'var(--accent-grad)' }}>
              Tap to start
            </span>
          </div>
        )}

        {status === 'over' && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none"
            style={{ background: 'rgba(6,7,10,0.6)', backdropFilter: 'blur(3px)' }}
          >
            <p className="text-xl font-semibold text-[var(--text-h)]">Score: {score}</p>
            <span
              className="mt-1 px-6 py-2.5 rounded-full text-sm font-medium text-white"
              style={{ background: 'var(--accent-grad)' }}
            >
              Tap to retry
            </span>
          </div>
        )}
      </div>
    </section>
  )
}
