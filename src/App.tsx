import { Suspense, lazy } from 'react'
import Navbar from './components/Navbar'
import ScrollProgress from './components/ScrollProgress'
import CursorGlow from './components/CursorGlow'
import Hero from './components/Hero'
import Stats from './components/Stats'
import About from './components/About'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Contact from './components/Contact'
import PlayZone from './components/PlayZone'
import Footer from './components/Footer'

const BackgroundScene = lazy(() => import('./components/three/BackgroundScene'))

function App() {
  return (
    <div>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Suspense fallback={null}>
          <BackgroundScene />
        </Suspense>
      </div>

      <ScrollProgress />
      <CursorGlow />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Stats />
        <About />
        <Projects />
        <Experience />
        <Contact />
        <PlayZone />
      </main>
      <Footer />
    </div>
  )
}

export default App
