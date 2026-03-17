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

const EXAMPLE_SEARCHES = [
  'Miért drága minden?',
  'Mi a helyzet az egészségügyben?',
  'Hogyan működik a választás?',
  'Mennyit keresnek a tanárok?',
]

export default function App() {
  const { data, loading, error } = useDatabase()
  const questions = data?.questions || []
  const {
    query, results, activeCategory, isSearching,
    handleQueryChange, handleCategoryChange, clearSearch,
  } = useSearch(questions)
  const isOffline = useOffline()

  const showWelcome = !query && !activeCategory && !isSearching

  const handleExampleClick = (text) => {
    handleQueryChange(text)
  }

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
              <div className="text-center">
                <p className="text-sm text-gray-400 dark:text-gray-500 mb-3">
                  Például:
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {EXAMPLE_SEARCHES.map((text) => (
                    <button
                      key={text}
                      onClick={() => handleExampleClick(text)}
                      className="text-sm px-3 py-1.5 rounded-full border border-primary/30 bg-[rgba(0,0,0,0.04)] text-primary hover:bg-[rgba(0,0,0,0.08)] dark:border-primary/40 dark:bg-[rgba(255,255,255,0.08)] dark:text-emerald-400 dark:hover:bg-[rgba(255,255,255,0.14)] transition-colors"
                    >
                      {text}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                  vagy böngéssz témák szerint:
                </p>
                <div className="mb-2">
                  <CategoryFilter activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-600 mt-6">
                  {questions.length} kérdés-válasz pár az adatbázisban
                </p>
              </div>
            )}

            {!showWelcome && (
              <div className="mb-6">
                <CategoryFilter activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
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
