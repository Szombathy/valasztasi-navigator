import { useState } from 'react'
import ThemeToggle from './ThemeToggle.jsx'
import AboutModal from './AboutModal.jsx'

export default function Header() {
  const [showAbout, setShowAbout] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between">
          <div className="min-w-0 flex items-baseline gap-2 sm:block">
            <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
              Családi Választási Navigátor
            </h1>
            <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
              2026. április 12. — Országgyűlési választás
            </p>
            <span className="sm:hidden text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
              ápr. 12.
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <ThemeToggle />
            <button
              onClick={() => setShowAbout(true)}
              className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
