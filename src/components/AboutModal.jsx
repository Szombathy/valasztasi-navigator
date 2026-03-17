import { useEffect, useRef, useState, useCallback } from 'react'
import { getStats } from '../lib/analytics.js'

function StatsPanel() {
  const s = getStats()
  const mins = Math.floor(s.sessionDuration / 60)
  const secs = s.sessionDuration % 60

  return (
    <div className="mt-4 pt-4 border-t border-dashed border-gray-300 dark:border-gray-600">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Session statisztika</h3>
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">{s.totalSearches}</div>
          <div className="text-gray-500">keresés</div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">{s.totalOpens}</div>
          <div className="text-gray-500">megnyitott kérdés</div>
        </div>
      </div>
      <div className="text-xs text-gray-500 mb-2">Session: {mins}p {secs}mp</div>

      {s.topCategories.length > 0 && (
        <div className="mb-3">
          <div className="text-xs font-semibold text-gray-500 mb-1">Top kategóriák:</div>
          {s.topCategories.map(c => (
            <div key={c.name} className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>{c.name}</span><span className="font-mono">{c.count}×</span>
            </div>
          ))}
        </div>
      )}

      {s.topSearches.length > 0 && (
        <div className="mb-3">
          <div className="text-xs font-semibold text-gray-500 mb-1">Top keresések:</div>
          {s.topSearches.slice(0, 5).map(sr => (
            <div key={sr.query} className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span className="truncate mr-2">„{sr.query}"</span>
              <span className="font-mono shrink-0">{sr.count}× ({sr.resultsCount} találat)</span>
            </div>
          ))}
        </div>
      )}

      {s.topQuestions.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-gray-500 mb-1">Legtöbbet megnyitott:</div>
          {s.topQuestions.slice(0, 5).map(q => (
            <div key={q.id} className="flex justify-between text-xs text-gray-600 dark:text-gray-400 gap-2">
              <span className="truncate">{q.question}</span>
              <span className="font-mono shrink-0">{q.count}×</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AboutModal({ onClose }) {
  const ref = useRef(null)
  const [showStats, setShowStats] = useState(false)
  const bufferRef = useRef('')

  const handleKeyForStats = useCallback((e) => {
    if (e.key === 'Escape') { onClose(); return }
    if (e.key.length === 1) {
      bufferRef.current += e.key.toLowerCase()
      if (bufferRef.current.length > 10) bufferRef.current = bufferRef.current.slice(-10)
      if (bufferRef.current.endsWith('stats')) setShowStats(true)
    }
  }, [onClose])

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    document.addEventListener('keydown', handleKeyForStats)
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('keydown', handleKeyForStats)
      document.removeEventListener('mousedown', handleClick)
    }
  }, [onClose, handleKeyForStats])

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
      <div ref={ref} className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-6 shadow-xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Rólunk & Módszertan</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1" aria-label="Bezárás">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-3">
          <p>
            A <strong>Családi Választási Navigátor</strong> egy független, pártoktól mentes tájékoztató eszköz, amely a 2026-os magyarországi országgyűlési választás előtt segíti a családon belüli párbeszédet.
          </p>
          <p>
            <strong>Hogyan működik?</strong> Az alkalmazás egy előre összeállított, kérdés-válasz párokból álló adatbázisra épül. Minden válasz tényszerű, forrásokkal alátámasztott, és több szempont figyelembevételével készült.
          </p>
          <p>
            <strong>Ki készítette?</strong> Önkéntesek csapata, akik fontosnak tartják a tájékozott választást.
          </p>
          <p>
            <strong>Offline működés:</strong> Az app teljes egészében a telefonodon fut — nincs szükség internetre a kereséshez. Egyszer kell betölteni, utána bárhol használható.
          </p>
          <p>
            <strong>Adatvédelem:</strong> Semmilyen személyes adatot nem gyűjtünk. Cookie-mentes, GDPR-kompatibilis analitikát használunk (Cloudflare Web Analytics), amely kizárólag anonim, összesített látogatottsági adatokat mér.
          </p>
        </div>
        {showStats && <StatsPanel />}
      </div>
    </div>
  )
}
