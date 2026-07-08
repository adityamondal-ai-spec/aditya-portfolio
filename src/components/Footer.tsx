export default function Footer() {
  return (
    <footer
      className="py-8 px-6 text-center text-xs max-w-3xl mx-auto"
      style={{ color: 'var(--ink-dim)', borderTop: '1px solid var(--line)' }}
    >
      © {new Date().getFullYear()} Aditya Mondal. Built with React, TypeScript &amp; Tailwind.
    </footer>
  )
}
