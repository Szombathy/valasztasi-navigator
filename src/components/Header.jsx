import { useState } from 'react'
import ThemeToggle from './ThemeToggle.jsx'
import AboutModal from './AboutModal.jsx'

export default function Header() {
  const [showAbout, setShowAbout] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              Családi Választási Navigátor
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              2026. április 12. — Országgyűlési választás
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            <button
              onClick={() => setShowAbout(true)}
              className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Rólunk és módszertan"
            >
              Rólunk
            </button>
          </div>
        </div>
      </header>
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </>
  )
}
