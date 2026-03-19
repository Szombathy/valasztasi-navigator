import { useState, useRef, useEffect } from 'react'
import { CATEGORIES, ICONS } from '../data/categories.jsx'
import { trackCategoryFilter } from '../lib/analytics.js'

export default function CategoryFilter({ activeCategory, onCategoryChange }) {
  const scrollRef = useRef(null)
  const [showRightHint, setShowRightHint] = useState(true)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const check = () => {
      setShowRightHint(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
    }
    check()
    el.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      el.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [])

  return (
    <div className="relative">
      {/* Desktop: wrap, Mobile: horizontal scroll */}
      <div
        ref={scrollRef}
        className="category-scroll flex gap-2 pb-2 -mx-4 px-4 flex-wrap sm:overflow-x-visible overflow-x-auto pr-10 sm:pr-4"
      >
        <button
          onClick={() => onCategoryChange(null)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !activeCategory
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
              : 'border border-dashed border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          aria-label="Összes kategória"
          aria-pressed={!activeCategory}
        >
          Mind
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => { trackCategoryFilter(cat.label); onCategoryChange(cat.id) }}
            className="shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5"
            style={
              activeCategory === cat.id
                ? { backgroundColor: cat.color, color: '#fff' }
                : { borderWidth: '1px', borderColor: cat.color, color: cat.color }
            }
            aria-label={`Szűrés: ${cat.label}`}
            aria-pressed={activeCategory === cat.id}
          >
            {ICONS[cat.icon]}
            {cat.label}
          </button>
        ))}
      </div>
      {/* Fade-out + scroll hint on right edge (mobile only) */}
      {showRightHint && (
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-5 bg-gradient-to-r from-transparent to-gray-50 dark:to-gray-950 sm:hidden flex items-center justify-end">
          <span className="text-gray-400 dark:text-gray-500 text-xs mr-0.5 pointer-events-none">&rsaquo;</span>
        </div>
      )}
    </div>
  )
}
