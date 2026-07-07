import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 639px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

// Shared, module-level (not React state) so updating it on every pointer move
// never triggers a re-render — Knot and ParticleField just read the current
// value inside their own useFrame loops.
const pointerTarget = { x: 0, y: 0 }

function usePointerTracking() {
  useEffect(() => {
    function updateFromClient(clientX: number, clientY: number) {
      pointerTarget.x = (clientX / window.innerWidth) * 2 - 1
      pointerTarget.y = -(clientY / window.innerHeight) * 2 + 1
    }
    function handleMouseMove(e: MouseEvent) {
      updateFromClient(e.clientX, e.clientY)
    }
    // Touch-drag drives the same parallax on phones — it doesn't call
    // preventDefault, so normal page scrolling is completely unaffected.
    function handleTouchMove(e: TouchEvent) {
      const touch = e.touches[0]
      if (touch) updateFromClient(touch.clientX, touch.clientY)
    }

    if (window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true })
    }
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])
}

// The stars and the knot both read window.scrollY directly each frame and
// drift upward as the page scrolls, so the scene feels like one continuous
// world instead of a hero-only canvas with a hard edge at the bottom. They
// also ease toward pointerTarget for a playful cursor-follow parallax.
// Phones render at a fraction of the frame rate everything else runs at —
// skipping frames this way cuts GPU work roughly in half on high-refresh-rate
// displays without the motion looking any different (it's still eased/lerped).
const MOBILE_FRAME_INTERVAL = 1 / 30
function useThrottledDelta(isMobile: boolean) {
  const acc = useRef(0)
  return (delta: number) => {
    if (!isMobile) return delta
    acc.current += delta
    if (acc.current < MOBILE_FRAME_INTERVAL) return 0
    const step = acc.current
    acc.current = 0
    return step
  }
}

function ParticleField({ isMobile }: { isMobile: boolean }) {
  const ref = useRef<THREE.Points>(null)
  const count = isMobile ? 260 : 1600
  const throttle = useThrottledDelta(isMobile)

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta) * 1.7
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 1.1
      pos[i * 3 + 2] = r * Math.cos(phi) * 0.6
    }
    return pos
  }, [])

  useFrame((_, rawDelta) => {
    if (!ref.current) return
    const delta = throttle(rawDelta)
    if (delta === 0) return
    ref.current.rotation.y += delta * 0.035 + pointerTarget.x * delta * 0.05
    ref.current.rotation.x += delta * 0.01 + pointerTarget.y * delta * 0.05
    ref.current.position.y = window.scrollY * 0.0016
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, pointerTarget.x * 0.6, 0.03)
    ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, pointerTarget.y * 0.3, 0.03)
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#7c5cff"
        size={0.022}
        sizeAttenuation
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  )
}

function KnotMesh({ isMobile, scale }: { isMobile: boolean; scale: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const throttle = useThrottledDelta(isMobile)

  useFrame((_, rawDelta) => {
    if (!meshRef.current) return
    const delta = throttle(rawDelta)
    if (delta === 0) return
    meshRef.current.rotation.x += delta * 0.22
    meshRef.current.rotation.y += delta * 0.32
  })

  return (
    <mesh ref={meshRef} scale={scale}>
      <torusKnotGeometry args={isMobile ? [1, 0.32, 90, 12] : [1, 0.32, 220, 32]} />
      <meshStandardMaterial
        color="#c7d2fe"
        roughness={0.25}
        metalness={0.7}
        emissive="#5b21b6"
        emissiveIntensity={0.2}
      />
    </mesh>
  )
}

function Knot({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const basePosition: [number, number, number] = isMobile ? [0, -2.4, -1.2] : [2.3, 0.3, 0]
  const scale = isMobile ? 0.32 : 0.6
  const throttle = useThrottledDelta(isMobile)

  useFrame((_, rawDelta) => {
    if (!groupRef.current) return
    const delta = throttle(rawDelta)
    if (delta === 0) return
    // Drifts up and out of view faster than the stars once you scroll past
    // the hero, so it never sits on top of later section content.
    groupRef.current.position.y = basePosition[1] + window.scrollY * 0.0034
    // Leans toward the cursor on top of its own spin, eased so it feels
    // like it's tracking you rather than snapping.
    const targetRotY = pointerTarget.x * 0.6
    const targetRotX = pointerTarget.y * 0.3
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05)
  })

  // Float (continuous bob/rotation) is a second animation loop on top of ours —
  // skip it on mobile, it's not worth the extra per-frame work.
  return (
    <group ref={groupRef} position={basePosition}>
      {isMobile ? (
        <KnotMesh isMobile={isMobile} scale={scale} />
      ) : (
        <Float speed={1.8} rotationIntensity={0.5} floatIntensity={1}>
          <KnotMesh isMobile={isMobile} scale={scale} />
        </Float>
      )}
    </group>
  )
}

export default function BackgroundScene() {
  const isMobile = useIsMobile()
  usePointerTracking()

  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 50 }}
      dpr={isMobile ? 0.8 : [1, 1.5]}
      gl={{
        antialias: !isMobile,
        alpha: false,
        // Off on mobile: keeping the drawing buffer around after each frame has a
        // real GPU cost, and is only needed here to make headless test screenshots
        // (this repo's own verification tooling) capture the canvas reliably.
        preserveDrawingBuffer: !isMobile,
        powerPreference: isMobile ? 'low-power' : 'default',
      }}
    >
      <color attach="background" args={['#06070d']} />
      <ambientLight intensity={0.8} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#a78bfa" />
      {!isMobile && <pointLight position={[-5, -3, -5]} intensity={1.5} color="#22d3ee" />}
      <ParticleField isMobile={isMobile} />
      <Knot isMobile={isMobile} />
    </Canvas>
  )
}
