/**
 * Kliensoldali session analytics modul.
 * Nincs szerver — minden adat a memóriában marad a session idejére.
 */

const stats = {
  searches: [],       // [{ query, resultsCount, timestamp }]
  questions: {},      // { [id]: { id, category, question, count } }
  categories: {},     // { [name]: count }
  totalSearches: 0,
  totalOpens: 0,
  sessionStart: Date.now(),
}

export function trackSearch(query, resultsCount) {
  if (!query || !query.trim()) return
  const q = query.trim().toLowerCase()
  stats.totalSearches++
  const existing = stats.searches.find(s => s.query === q)
  if (existing) {
    existing.count++
    existing.resultsCount = resultsCount
    existing.timestamp = Date.now()
  } else {
    stats.searches.push({ query: q, count: 1, resultsCount, timestamp: Date.now() })
  }
}

export function trackQuestionOpen(questionId, category, question) {
  stats.totalOpens++
  if (stats.questions[questionId]) {
    stats.questions[questionId].count++
  } else {
    stats.questions[questionId] = { id: questionId, category, question, count: 1 }
  }
}

export function trackCategoryFilter(category) {
  stats.categories[category] = (stats.categories[category] || 0) + 1
}

export function getStats() {
  const topSearches = [...stats.searches]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  const topQuestions = Object.values(stats.questions)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  const topCategories = Object.entries(stats.categories)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  return {
    totalSearches: stats.totalSearches,
    totalOpens: stats.totalOpens,
    sessionStart: stats.sessionStart,
    sessionDuration: Math.round((Date.now() - stats.sessionStart) / 1000),
    topSearches,
    topQuestions,
    topCategories,
  }
}
