import { useState, useCallback, useRef, useEffect } from 'react'
import { search, browseCategory } from '../lib/search-engine.js'
import { trackSearch } from '../lib/analytics.js'

export function useSearch(questions) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [activeDifficulty, setActiveDifficulty] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const timerRef = useRef(null)

  const applyDifficultyFilter = useCallback((items, diff) => {
    if (!diff) return items
    return items.filter(q => q.difficulty === diff)
  }, [])

  const performSearch = useCallback((q, cat, diff) => {
    if (!questions || questions.length === 0) {
      setResults([])
      setIsSearching(false)
      return
    }
    if (!q && cat) {
      setResults(applyDifficultyFilter(browseCategory(questions, cat), diff))
      setIsSearching(false)
      return
    }
    const r = search(questions, q, cat)
    setResults(applyDifficultyFilter(r, diff))
    setIsSearching(false)
    if (q) trackSearch(q, r.length)
  }, [questions, applyDifficultyFilter])

  const handleQueryChange = useCallback((value) => {
    setQuery(value)
    setIsSearching(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      performSearch(value, activeCategory, activeDifficulty)
    }, 300)
  }, [activeCategory, activeDifficulty, performSearch])

  const handleCategoryChange = useCallback((cat) => {
    const newCat = cat === activeCategory ? null : cat
    setActiveCategory(newCat)
    performSearch(query, newCat, activeDifficulty)
  }, [activeCategory, activeDifficulty, query, performSearch])

  const handleDifficultyChange = useCallback((diff) => {
    setActiveDifficulty(diff)
    performSearch(query, activeCategory, diff)
  }, [activeCategory, query, performSearch])

  const clearSearch = useCallback(() => {
    setQuery('')
    setResults([])
    setActiveCategory(null)
    setActiveDifficulty(null)
    setIsSearching(false)
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return {
    query,
    results,
    activeCategory,
    activeDifficulty,
    isSearching,
    handleQueryChange,
    handleCategoryChange,
    handleDifficultyChange,
    clearSearch,
  }
}
