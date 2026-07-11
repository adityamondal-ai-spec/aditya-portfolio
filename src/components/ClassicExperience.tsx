import Hero from './Hero'
import Stats from './Stats'
import About from './About'
import Projects from './Projects'
import Experience from './Experience'
import SentimentQuiz from './SentimentQuiz'
import Contact from './Contact'

// The normal scrolling document -- used for prefers-reduced-motion (any
// device) and for touch/narrow viewports, where pinned scroll-scrub scenes
// are a bad fit rather than just a smaller version of the desktop treatment.
export default function ClassicExperience() {
  return (
    <main>
      <Hero />
      <Stats />
      <About />
      <Projects />
      <Experience />
      <SentimentQuiz />
      <Contact />
    </main>
  )
}
