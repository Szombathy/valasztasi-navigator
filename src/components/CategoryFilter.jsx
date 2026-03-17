import { CATEGORIES, ICONS } from '../data/categories.jsx'

export default function CategoryFilter({ activeCategory, onCategoryChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
      <button
        onClick={() => onCategoryChange(null)}
        className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          !activeCategory
            ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
            : 'border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        aria-label="Összes kategória"
      >
        Mind
      </button>
      {CATEGORIES.map(cat => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
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
  )
}
