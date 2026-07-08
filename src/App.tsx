import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import About from './components/About'
import Projects from './components/Projects'
import Experience from './components/Experience'
import SentimentQuiz from './components/SentimentQuiz'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollInkLine from './components/ScrollInkLine'
import CustomCursor from './components/CustomCursor'

function App() {
  return (
    <div>
      <ScrollInkLine />
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <About />
        <Projects />
        <Experience />
        <SentimentQuiz />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
