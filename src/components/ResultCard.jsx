import { useState } from 'react'
import { CATEGORY_MAP } from '../data/categories.jsx'
import AnswerView from './AnswerView.jsx'

function getPreview(answer) {
  const plain = answer.replace(/[#*_`\[\]()]/g, '').replace(/\n+/g, ' ')
  const sentences = plain.match(/[^.!?]+[.!?]+/g) || [plain]
  return sentences.slice(0, 2).join(' ').slice(0, 200)
}

export default function ResultCard({ item, index }) {
  const [expanded, setExpanded] = useState(false)
  const cat = CATEGORY_MAP[item.category]

  return (
    <div
      className="animate-fade-in bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
      onClick={() => setExpanded(!expanded)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') setExpanded(!expanded) }}
      aria-expanded={expanded}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white text-left flex-1">
          {item.question}
        </h3>
        {cat && (
          <span
            className="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full text-white"
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
        <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
          <span>{item.difficulty}</span>
          {item.sources && <span>{item.sources.length} forrás</span>}
        </div>
      )}

      {expanded && (
        <AnswerView item={item} onClose={(e) => { e?.stopPropagation?.(); setExpanded(false) }} />
      )}
    </div>
  )
}
