import ResultCard from './ResultCard.jsx'

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
      {results.map((item, i) => (
        <ResultCard key={item.id} item={item} index={i} />
      ))}
    </div>
  )
}
