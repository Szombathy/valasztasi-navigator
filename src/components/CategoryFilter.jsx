import { CATEGORIES, ICONS } from '../data/categories.jsx'
import { trackCategoryFilter } from '../lib/analytics.js'

export default function CategoryFilter({ activeCategory, onCategoryChange }) {
  return (
    <div className="relative">
      <div className="category-scroll flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
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
      {/* Fade-out hint on right edge */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-gray-50 dark:to-gray-950" />
    </div>
  )
}
