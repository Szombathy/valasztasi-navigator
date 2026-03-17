import { useState, useCallback, useRef, useEffect } from 'react'
import { search, browseCategory } from '../lib/search-engine.js'

export function useSearch(questions) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const timerRef = useRef(null)

  const performSearch = useCallback((q, cat) => {
    if (!questions || questions.length === 0) {
      setResults([])
      setIsSearching(false)
      return
    }
    if (!q && cat) {
      setResults(browseCategory(questions, cat))
      setIsSearching(false)
      return
    }
    const r = search(questions, q, cat)
    setResults(r)
    setIsSearching(false)
  }, [questions])

  const handleQueryChange = useCallback((value) => {
    setQuery(value)
    setIsSearching(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      performSearch(value, activeCategory)
    }, 300)
  }, [activeCategory, performSearch])

  const handleCategoryChange = useCallback((cat) => {
    const newCat = cat === activeCategory ? null : cat
    setActiveCategory(newCat)
    performSearch(query, newCat)
  }, [activeCategory, query, performSearch])

  const clearSearch = useCallback(() => {
    setQuery('')
    setResults([])
    setActiveCategory(null)
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
    isSearching,
    handleQueryChange,
    handleCategoryChange,
    clearSearch,
  }
}
