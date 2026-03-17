import { useDatabase } from './hooks/useDatabase.js'
import { useSearch } from './hooks/useSearch.js'
import { useOffline } from './hooks/useOffline.js'
import Header from './components/Header.jsx'
import SearchBar from './components/SearchBar.jsx'
import CategoryFilter from './components/CategoryFilter.jsx'
import ResultList from './components/ResultList.jsx'
import OfflineIndicator from './components/OfflineIndicator.jsx'
import FeedbackButton from './components/FeedbackButton.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const { data, loading, error } = useDatabase()
  const questions = data?.questions || []
  const {
    query, results, activeCategory, isSearching,
    handleQueryChange, handleCategoryChange, clearSearch,
  } = useSearch(questions)
  const isOffline = useOffline()

  const showWelcome = !query && !activeCategory && !isSearching

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <OfflineIndicator isOffline={isOffline} />
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
            Hiba történt az adatbázis betöltésekor: {error}
          </div>
        )}

        <div className="mb-4">
          <SearchBar query={query} onChange={handleQueryChange} onClear={clearSearch} />
        </div>

        <div className="mb-6">
          <CategoryFilter activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <div className="skeleton h-5 w-3/4 mb-3 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="skeleton h-4 w-full mb-2 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="skeleton h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {showWelcome && (
              <div className="text-center py-8">
                <div className="mb-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16 mx-auto text-primary/40">
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                  </svg>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                  Írd be, ami érdekel — például:
                </p>
                <p className="text-primary font-medium italic">
                  „miért drága az élet?"
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-4">
                  vagy válassz témakört a fenti gombokkal
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-600 mt-6">
                  {questions.length} kérdés-válasz pár az adatbázisban
                </p>
              </div>
            )}

            <ResultList
              results={results}
              isSearching={isSearching}
              query={query}
              activeCategory={activeCategory}
            />
          </>
        )}
      </main>

      <Footer />
      <FeedbackButton />
    </div>
  )
}
