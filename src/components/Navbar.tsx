import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 24)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const sections = links
      .map((l) => document.querySelector(l.href))
      .filter((el): el is Element => !!el)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive('#' + entry.target.id)
          }
        }
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4">
      <motion.nav
        animate={{
          maxWidth: scrolled ? 640 : 896,
          paddingTop: scrolled ? 8 : 12,
          paddingBottom: scrolled ? 8 : 12,
        }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="glass w-full rounded-full px-6 flex items-center justify-between"
      >
        <a href="#top" className="font-[var(--heading)] text-sm tracking-wide text-[var(--text-h)]">
          AM<span className="text-[var(--accent)]">.</span>
        </a>
        <div className="hidden sm:flex gap-6 text-sm text-[var(--text-dim)]">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`relative transition-colors ${
                active === l.href ? 'text-[var(--text-h)]' : 'hover:text-[var(--text-h)]'
              }`}
            >
              {l.label}
              {active === l.href && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full"
                  style={{ background: 'var(--accent-grad)' }}
                />
              )}
            </a>
          ))}
        </div>
        <a
          href="#contact"
          className="text-sm px-4 py-1.5 rounded-full text-white font-medium"
          style={{ background: 'var(--accent-grad)' }}
        >
          Let's talk
        </a>
      </motion.nav>
    </header>
  )
}
