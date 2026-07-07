export default function Footer() {
  return (
    <footer className="py-8 px-6 text-center text-xs text-[var(--text-dim)] border-t border-[var(--surface-border)]">
      © {new Date().getFullYear()} Aditya Mondal. Built with React, Three.js & Tailwind.
    </footer>
  )
}
