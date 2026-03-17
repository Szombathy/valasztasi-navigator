import { useEffect, useRef } from 'react'

export default function AboutModal({ onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    document.addEventListener('keydown', handleKey)
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.removeEventListener('mousedown', handleClick)
    }
  }, [onClose])

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
            <strong>Adatvédelem:</strong> Semmilyen személyes adatot nem gyűjtünk. Nincs nyomkövetés, nincs analitika, nincs cookie.
          </p>
        </div>
      </div>
    </div>
  )
}
