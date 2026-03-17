import { marked } from 'marked'
import { useMemo } from 'react'
import DifficultyBadge from './DifficultyBadge.jsx'
import SourceLink from './SourceLink.jsx'

marked.setOptions({ breaks: true, gfm: true })

export default function AnswerView({ item, onClose }) {
  const html = useMemo(() => marked.parse(item.answer), [item.answer])

  const handleShare = async () => {
    const text = `${item.question}\n\n${item.answer.slice(0, 200)}...\n\n— Családi Választási Navigátor`
    if (navigator.share) {
      try {
        await navigator.share({ title: item.question, text })
      } catch {}
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(text)
      alert('A kérdés és válasz a vágólapra másolva!')
    }
  }

  return (
    <div className="animate-slide-down mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
      <div
        className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 text-left"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {item.sources && item.sources.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Források:</p>
          <div className="flex flex-wrap gap-2">
            {item.sources.map((s, i) => (
              <SourceLink key={i} source={s} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <DifficultyBadge difficulty={item.difficulty} />
        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Megosztás"
          >
            Megosztás
          </button>
          <button
            onClick={onClose}
            className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Bezárás
          </button>
        </div>
      </div>
    </div>
  )
}
