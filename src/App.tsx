import { useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollInkLine from './components/ScrollInkLine'
import CustomCursor from './components/CustomCursor'
import HeroFlow from './components/HeroFlow'
import ClassicExperience from './components/ClassicExperience'
import CinematicExperience from './components/cinematic/CinematicExperience'

type ExperienceMode = 'cinematic' | 'classic'

// Pinned scroll-scrub scenes are a bad fit on touch (the risk is the input
// method, not screen size -- a touch laptop at desktop width gets the same
// treatment as a phone) and are skipped entirely for reduced-motion, which
// gets the exact same classic document as mobile rather than a stripped-down
// cinematic mode.
function detectExperience(): ExperienceMode {
  if (typeof window === 'undefined') return 'classic'
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return 'classic'
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const isWideEnough = window.innerWidth >= 1024
  return isFinePointer && isWideEnough ? 'cinematic' : 'classic'
}

function App() {
  // Computed synchronously at init, same reasoning as Boundary.tsx's
  // canUse3D: deciding the render path post-mount would itself cause a
  // visible swap/layout jump, exactly what this decision is trying to avoid.
  const [experience] = useState(detectExperience)

  return (
    <div>
      {/* HeroFlow's ambient background sits behind everything at z-index
          -1 -- the cinematic scenes are opaque full-viewport panels that
          would hide it completely, so it only mounts for the classic path,
          where it's actually visible. */}
      {experience === 'classic' && <HeroFlow />}
      <ScrollInkLine />
      <CustomCursor />
      <Navbar />
      {experience === 'cinematic' ? <CinematicExperience /> : <ClassicExperience />}
      <Footer />
    </div>
  )
}

export default App
