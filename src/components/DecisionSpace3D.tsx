import { lazy, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { OrbitControls as OrbitControlsImpl } from 'three/examples/jsm/controls/OrbitControls.js'
import { Color, Vector3, BufferGeometry, BufferAttribute, CanvasTexture, AdditiveBlending } from 'three'

// Lazy so @react-three/postprocessing only loads for the desktop takeover
// that actually uses it -- see BloomEffect.tsx.
const BloomEffect = lazy(() => import('./BloomEffect'))

type Label = 'negative' | 'neutral' | 'positive'
type Point = { x: number; y: number; z: number; label: Label; pred: Label; text: string }
type DecisionSpaceData = { classes: Label[]; points: Point[] }
type ColorMode = 'true' | 'pred'

// Same class colors used everywhere else on the site (BoundaryViz, HeroFlow).
const COLORS: Record<Label, Color> = {
  negative: new Color('#a6402f'),
  neutral: new Color('#b8892e'),
  positive: new Color('#1f5c46'),
}
const COLOR_HEX: Record<Label, string> = {
  negative: '#a6402f',
  neutral: '#b8892e',
  positive: '#1f5c46',
}

// Points stay alpha-blended (not additive) everywhere except the single
// hovered spotlight below -- additive blending brightens overlapping points
// toward white, which would wash out the neutral-class confusion cluster
// that's the actual point of this visualization.
const ENTRANCE_DURATION = 1.3 // seconds each point takes once its own delay elapses
const ENTRANCE_MAX_DELAY = 0.7 // seconds, staggered per point so they don't move as one rigid block

function buildColorArray(points: Point[], mode: ColorMode): Float32Array {
  const arr = new Float32Array(points.length * 3)
  points.forEach((p, i) => {
    const c = COLORS[mode === 'true' ? p.label : p.pred]
    arr[i * 3] = c.r
    arr[i * 3 + 1] = c.g
    arr[i * 3 + 2] = c.b
  })
  return arr
}

// A soft radial-falloff dot instead of a hard-edged square, built once at
// runtime on an offscreen canvas -- no new image asset or dependency.
function makeGlowTexture(): CanvasTexture {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.4, 'rgba(255,255,255,0.55)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  const tex = new CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

// Hand-rolled instead of @react-three/drei's <OrbitControls> — drei pulls in
// a large dependency tree (troika-three-text, hls.js, mediapipe, zustand...)
// that tree-shaking didn't eliminate even using only 2 of its ~100 exports.
// three.js ships its own OrbitControls addon; wrapping it directly cut the
// lazy-loaded chunk enough to fix a real mobile TBT regression measured via
// Lighthouse (see the Phase 3 report).
function Controls({ autoRotate }: { autoRotate: boolean }) {
  const { camera, gl } = useThree()
  const controls = useMemo(() => {
    const c = new OrbitControlsImpl(camera, gl.domElement)
    c.enableDamping = true
    c.dampingFactor = 0.08
    c.enablePan = false
    c.minDistance = 4
    c.maxDistance = 16
    c.autoRotateSpeed = 0.9
    return c
  }, [camera, gl])

  useEffect(() => {
    controls.autoRotate = autoRotate
  }, [controls, autoRotate])

  useEffect(() => () => controls.dispose(), [controls])

  useFrame(() => controls.update())

  return null
}

// Hand-rolled instead of drei's <Html> — same rationale. Projects a 3D
// point to screen space every frame and writes it directly to a DOM node's
// transform (bypassing React state, so this doesn't trigger a re-render at
// 60fps).
function TooltipTracker({ point, targetRef }: { point: Point | null; targetRef: React.RefObject<HTMLDivElement | null> }) {
  const { camera, size } = useThree()
  const vec = useMemo(() => new Vector3(), [])
  useFrame(() => {
    if (!point || !targetRef.current) return
    vec.set(point.x, point.y, point.z).project(camera)
    const x = (vec.x * 0.5 + 0.5) * size.width
    const y = (-vec.y * 0.5 + 0.5) * size.height
    targetRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, calc(-100% - 14px))`
  })
  return null
}

function PointCloud({
  points,
  colorMode,
  setHoveredIndex,
  pointSize,
  glowTexture,
}: {
  points: Point[]
  colorMode: ColorMode
  setHoveredIndex: (i: number | null) => void
  pointSize: number
  glowTexture: CanvasTexture
}) {
  const { gl } = useThree()

  // Scattered start positions for the entrance animation: each point starts
  // on a large sphere and flies inward to its real decision_function
  // coordinate. Boundary.tsx never mounts this component for
  // prefers-reduced-motion users (see detectCanUse3D there), so there's no
  // separate reduced-motion branch needed here.
  const startPositions = useMemo(() => {
    const arr = new Float32Array(points.length * 3)
    for (let i = 0; i < points.length; i++) {
      const r = 22 + Math.random() * 14
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [points])

  const targetPositions = useMemo(() => {
    const arr = new Float32Array(points.length * 3)
    points.forEach((p, i) => {
      arr[i * 3] = p.x
      arr[i * 3 + 1] = p.y
      arr[i * 3 + 2] = p.z
    })
    return arr
  }, [points])

  const delays = useMemo(() => Float32Array.from(points, () => Math.random() * ENTRANCE_MAX_DELAY), [points])
  const entranceDone = useRef(false)

  const geometry = useMemo(() => {
    entranceDone.current = false
    const geo = new BufferGeometry()
    // .slice() so the position buffer doesn't alias startPositions itself —
    // otherwise the per-frame write below would corrupt its own lerp source.
    geo.setAttribute('position', new BufferAttribute(startPositions.slice(), 3))
    geo.setAttribute('color', new BufferAttribute(buildColorArray(points, 'true'), 3))
    return geo
  }, [points, startPositions])

  // Swap the color buffer in place when the toggle changes, rather than
  // rebuilding the whole geometry (keeps toggling instant, no re-upload of
  // positions).
  useEffect(() => {
    const colorAttr = geometry.getAttribute('color') as BufferAttribute
    colorAttr.set(buildColorArray(points, colorMode))
    colorAttr.needsUpdate = true
  }, [colorMode, points, geometry])

  useFrame((state) => {
    if (entranceDone.current) return
    const elapsed = state.clock.elapsedTime
    const posAttr = geometry.getAttribute('position') as BufferAttribute
    const arr = posAttr.array as Float32Array
    let allDone = true
    for (let i = 0; i < points.length; i++) {
      const t = Math.min(1, Math.max(0, (elapsed - delays[i]) / ENTRANCE_DURATION))
      if (t < 1) allDone = false
      const eased = 1 - Math.pow(1 - t, 3)
      arr[i * 3] = startPositions[i * 3] + (targetPositions[i * 3] - startPositions[i * 3]) * eased
      arr[i * 3 + 1] = startPositions[i * 3 + 1] + (targetPositions[i * 3 + 1] - startPositions[i * 3 + 1]) * eased
      arr[i * 3 + 2] = startPositions[i * 3 + 2] + (targetPositions[i * 3 + 2] - startPositions[i * 3 + 2]) * eased
    }
    posAttr.needsUpdate = true
    if (allDone) entranceDone.current = true
  })

  function handlePointerMove(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation()
    if (e.index !== undefined) {
      setHoveredIndex(e.index)
      gl.domElement.style.cursor = 'pointer'
    }
  }
  function handlePointerOut() {
    setHoveredIndex(null)
    gl.domElement.style.cursor = 'auto'
  }

  return (
    <points geometry={geometry} onPointerMove={handlePointerMove} onPointerOut={handlePointerOut}>
      <pointsMaterial
        vertexColors
        map={glowTexture}
        size={pointSize}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </points>
  )
}

// A single additive-blended spotlight sprite over the hovered point — the
// one deliberate exception to "no additive blending," since it only ever
// affects one point at a time and can't wash out the cluster-mixing signal.
function HoverGlow({ point, glowTexture }: { point: Point | null; glowTexture: CanvasTexture }) {
  if (!point) return null
  return (
    <sprite position={[point.x, point.y, point.z]} scale={[0.5, 0.5, 0.5]}>
      <spriteMaterial
        map={glowTexture}
        color={COLOR_HEX[point.label]}
        blending={AdditiveBlending}
        transparent
        depthWrite={false}
      />
    </sprite>
  )
}

function ToggleButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="px-2.5 py-1 text-[11px] uppercase tracking-wide font-[var(--mono)] transition-colors"
      style={{
        border: '1px solid var(--line)',
        background: active ? 'var(--ink)' : 'var(--paper)',
        color: active ? 'var(--paper)' : 'var(--ink-dim)',
      }}
    >
      {children}
    </button>
  )
}

// data is fetched by the parent (Boundary.tsx), in parallel with this
// module's own dynamic import, rather than fetched here in an effect that
// only starts running once the chunk has already finished loading and
// mounted -- that ordering is a real, avoidable network waterfall.
export default function DecisionSpace3D({ data, fullscreen = false }: { data: DecisionSpaceData; fullscreen?: boolean }) {
  const [colorMode, setColorMode] = useState<ColorMode>('true')
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const glowTexture = useMemo(() => makeGlowTexture(), [])

  // Mobile devices get fewer points -- not primarily for the point render
  // cost itself (a few thousand instanced points is cheap on any GPU), but
  // for touch-drag smoothness alongside the raycasting-on-pointer-move hover
  // check running every frame while dragging.
  const points = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    return isMobile ? data.points.filter((_, i) => i % 3 === 0) : data.points
  }, [data])

  const hovered = hoveredIndex !== null ? points[hoveredIndex] ?? null : null

  // The full-viewport takeover shows the same world-space point cloud in a
  // much wider frame — a camera tuned for a ~340x380 embedded box leaves it
  // looking small and centered with empty margin on a real monitor, so the
  // takeover moves the camera closer and reads points slightly larger.
  const cameraPosition: [number, number, number] = fullscreen ? [0, 0, 7] : [0, 0, 9]
  const cameraFov = fullscreen ? 50 : 45
  const pointSize = fullscreen ? 0.095 : 0.075

  // Bloom is desktop/takeover-only -- see the Pass 1 plan's measured cost
  // (+16.76KB gzip, real FPS impact at full-viewport resolution). dpr is
  // capped to 1 for that same combo: fragment-shader-bound cost (which
  // bloom and point rendering both are) scales with pixel count, and a 2x
  // DPR full-viewport canvas is a lot more pixels than the embedded box
  // this was originally tuned on.
  const dpr: number | [number, number] = fullscreen ? 1 : [1, 2]

  return (
    <div className="w-full h-full relative" style={{ background: 'var(--paper)' }}>
      <Canvas camera={{ position: cameraPosition, fov: cameraFov }} dpr={dpr}>
        <Controls autoRotate={hoveredIndex === null} />
        <PointCloud
          points={points}
          colorMode={colorMode}
          setHoveredIndex={setHoveredIndex}
          pointSize={pointSize}
          glowTexture={glowTexture}
        />
        <HoverGlow point={hovered} glowTexture={glowTexture} />
        <TooltipTracker point={hovered} targetRef={tooltipRef} />
        {fullscreen && (
          <Suspense fallback={null}>
            <BloomEffect />
          </Suspense>
        )}
      </Canvas>

      {hovered && (
        <div
          ref={tooltipRef}
          className="absolute top-0 left-0 px-3 py-2 text-xs max-w-[220px] pointer-events-none"
          style={{
            background: 'var(--paper)',
            border: '1px solid var(--line)',
            fontFamily: 'var(--mono)',
            color: 'var(--ink)',
            boxShadow: '0 6px 20px rgba(28,27,23,0.15)',
            willChange: 'transform',
          }}
        >
          <div className="flex items-center gap-2 mb-1.5 text-[10px] uppercase font-semibold">
            <span style={{ color: COLOR_HEX[hovered.label] }}>true: {hovered.label}</span>
            {hovered.pred !== hovered.label && (
              <span style={{ color: COLOR_HEX[hovered.pred] }}>&rarr; pred: {hovered.pred}</span>
            )}
          </div>
          <div style={{ color: 'var(--ink-dim)' }}>&ldquo;{hovered.text}&rdquo;</div>
        </div>
      )}

      <div className="absolute bottom-6 right-6 z-10 flex gap-2">
        <ToggleButton active={colorMode === 'true'} onClick={() => setColorMode('true')}>
          True label
        </ToggleButton>
        <ToggleButton active={colorMode === 'pred'} onClick={() => setColorMode('pred')}>
          Predicted
        </ToggleButton>
      </div>
    </div>
  )
}
