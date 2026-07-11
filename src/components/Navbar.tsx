import { useEffect, useState } from 'react'

const links = [
  { label: 'Introduction', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Log', href: '#log' },
  { label: 'Contact', href: '#contact' },
]

// In the cinematic experience, a target section is a tall (100-350vh)
// pinned scene, and the browser's default anchor-jump behavior lands
// exactly at its top edge -- scroll progress 0, mid-fade-in, before any
// content is visible. These fractions land inside each scene's own "settled"
// hold window instead. Classic-experience sections (plain, viewport-height-
// ish) don't have this problem, so they're left to native anchor behavior
// (detected via the data-pinned-scene marker PinnedScene sets).
const SETTLED_FRACTIONS: Record<string, number> = {
  '#about': 0.3,
  '#work': 0.25,
  '#log': 0.15,
  '#contact': 0.2,
}

function handleAnchorClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (href === '#top') {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  const target = document.getElementById(href.slice(1))
  if (!target || !target.hasAttribute('data-pinned-scene')) return // native anchor behavior is fine here
  e.preventDefault()
  const fraction = SETTLED_FRACTIONS[href] ?? 0.25
  const rect = target.getBoundingClientRect()
  const sceneTop = window.scrollY + rect.top
  const scrubDistance = target.offsetHeight - window.innerHeight
  window.scrollTo({ top: sceneTop + fraction * scrubDistance, behavior: 'smooth' })
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    let raf = 0
    function handleScroll() {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        setScrolled(window.scrollY > 24)
      })
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (raf) cancelAnimationFrame(raf)
    }
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
    <header
      className="fixed top-0 inset-x-0 z-50 transition-colors"
      style={{
        background: scrolled ? 'var(--paper)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent',
      }}
    >
      <nav className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
        <a
          href="#top"
          onClick={(e) => handleAnchorClick(e, '#top')}
          className="font-[var(--display)] text-lg italic"
          style={{ color: 'var(--ink)' }}
        >
          Aditya Mondal
        </a>
        <div className="hidden sm:flex gap-6 text-sm font-[var(--mono)]">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => handleAnchorClick(e, l.href)}
              style={{
                color: active === l.href ? 'var(--ink)' : 'var(--ink-dim)',
                borderBottom: active === l.href ? '1px solid var(--ink)' : '1px solid transparent',
              }}
              className="pb-0.5 transition-colors hover:text-[var(--ink)]"
            >
              {l.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}
