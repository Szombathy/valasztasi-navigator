import { useState } from 'react'
import ResultCard from './ResultCard.jsx'

function DifficultyLegend() {
  const [show, setShow] = useState(false)
  return (
    <span className="relative inline-flex items-center">
      <button
        onClick={() => setShow(!show)}
        className="ml-1 w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 text-[10px] leading-none flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="Nehézségi szintek magyarázata"
      >
        i
      </button>
      {show && (
        <div className="absolute left-6 top-0 z-10 w-64 p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg text-xs text-gray-600 dark:text-gray-300 space-y-1">
          <p><span className="font-semibold text-green-600 dark:text-green-400">Egyszerű</span> = rövid, közérthető válasz</p>
          <p><span className="font-semibold text-amber-600 dark:text-amber-400">Közepes</span> = részletesebb, számokkal</p>
          <p><span className="font-semibold text-red-600 dark:text-red-400">Részletes</span> = mélyebb elemzés, háttér</p>
        </div>
      )}
    </span>
  )
}

export default function ResultList({ results, isSearching, query, activeCategory }) {
  if (isSearching) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <div className="skeleton h-5 w-3/4 mb-3 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="skeleton h-4 w-full mb-2 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="skeleton h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (results.length === 0 && (query || activeCategory)) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M8 11h6"/>
          </svg>
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          Erre sajnos nem találtam választ az adatbázisban.
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Próbálj más kulcsszavakat, vagy javasolj egy új kérdést!
        </p>
      </div>
    )
  }

  if (results.length === 0) return null

  return (
    <div className="space-y-3.5">
      <div className="flex items-center text-xs text-gray-400 dark:text-gray-500">
        <span>{results.length} találat</span>
        <DifficultyLegend />
      </div>
      {results.map((item, i) => (
        <ResultCard key={item.id} item={item} index={i} />
      ))}
    </div>
  )
}
