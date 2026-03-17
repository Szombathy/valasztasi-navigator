import { useRef, useEffect } from 'react'

export default function SearchBar({ query, onChange, onClear }) {
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClear()
      inputRef.current?.blur()
    }
  }

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
      </div>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Kérdezz bármit a választásról..."
        className="w-full pl-12 pr-10 py-3.5 text-base bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary dark:focus:border-primary focus:outline-none transition-colors placeholder:text-gray-400 text-gray-900 dark:text-white"
        aria-label="Keresés a kérdések között"
      />
      {query && (
        <button
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          aria-label="Keresés törlése"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      )}
    </div>
  )
}
