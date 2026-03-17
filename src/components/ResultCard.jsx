import { useState, useEffect, useCallback } from 'react'
import { CATEGORY_MAP } from '../data/categories.jsx'
import AnswerView from './AnswerView.jsx'
import { trackQuestionOpen } from '../lib/analytics.js'

const DIFFICULTY_COLORS = {
  'egyszerű': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'közepes': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'részletes': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'haladó': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

function getPreview(answer) {
  const plain = answer.replace(/[#*_`\[\]()]/g, '').replace(/\n+/g, ' ')
  const sentences = plain.match(/[^.!?]+[.!?]+/g) || [plain]
  return sentences.slice(0, 2).join(' ').slice(0, 200)
}

export default function ResultCard({ item, index }) {
  const [expanded, setExpanded] = useState(false)
  const cat = CATEGORY_MAP[item.category]

  const handleClose = useCallback((e) => {
    e?.stopPropagation?.()
    setExpanded(false)
  }, [])

  // Escape closes expanded card
  useEffect(() => {
    if (!expanded) return
    const handleKey = (e) => { if (e.key === 'Escape') setExpanded(false) }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [expanded])

  const sourceNames = item.sources?.map(s => s.name.replace(/ - .*/, '')).slice(0, 3).join(', ')
  const diffClass = DIFFICULTY_COLORS[item.difficulty] || DIFFICULTY_COLORS['egyszerű']

  return (
    <div
      className="animate-fade-in bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all duration-200"
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: 'backwards',
        borderLeftWidth: '4px',
        borderLeftColor: cat?.color || '#999',
      }}
      onClick={() => {
        if (!expanded) trackQuestionOpen(item.id, item.category, item.question)
        setExpanded(!expanded)
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') setExpanded(!expanded) }}
      aria-expanded={expanded}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white text-left flex-1 min-w-0">
            {item.question}
          </h3>
          {cat && (
            <span
              className="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full text-white max-w-[110px] sm:max-w-none truncate"
              style={{ backgroundColor: cat.color }}
            >
              {cat.label}
            </span>
          )}
        </div>

        {!expanded && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-left line-clamp-2">
            {getPreview(item.answer)}
          </p>
        )}

        {!expanded && (
          <div className="mt-2 flex items-center gap-3 text-xs text-gray-400 flex-wrap">
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded font-medium ${diffClass}`}>
              {item.difficulty}
            </span>
            {sourceNames && <span className="truncate max-w-[200px] sm:max-w-none">{sourceNames}</span>}
          </div>
        )}

        {expanded && (
          <AnswerView item={item} onClose={handleClose} />
        )}
      </div>
    </div>
  )
}
