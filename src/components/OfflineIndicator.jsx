import { useState } from 'react'

export default function OfflineIndicator({ isOffline }) {
  const [dismissed, setDismissed] = useState(false)

  if (!isOffline || dismissed) return null

  return (
    <div className="bg-primary text-white text-sm text-center py-2 px-4 flex items-center justify-center gap-2">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <path d="M1 1l22 22"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.56 9"/><path d="M1.42 9a16 16 0 0 1 4.25-2.82"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/>
      </svg>
      <span>Offline mód — a keresés továbbra is működik</span>
      <button onClick={() => setDismissed(true)} className="ml-2 hover:opacity-80" aria-label="Bezárás">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
  )
}
