import { useState } from 'react'

export default function FeedbackButton() {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')

  const handleSubmit = () => {
    if (!text.trim()) return
    const subject = encodeURIComponent('Választási Navigátor — Hiányzó kérdés')
    const body = encodeURIComponent(`Milyen kérdésre nem találtam választ:\n\n${text}\n\n---\nKüldve a Családi Választási Navigátorból`)
    window.location.href = `mailto:valasztasi.navigator@example.com?subject=${subject}&body=${body}`
    setText('')
    setOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
        aria-label="Visszajelzés küldése"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-80 max-w-[calc(100vw-3rem)] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Hiányzik valami?</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Milyen kérdésre nem találtál választ?
          </p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:outline-none focus:border-primary"
            rows={3}
            placeholder="Írd le a kérdésedet..."
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setOpen(false)}
              className="text-sm px-3 py-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Mégse
            </button>
            <button
              onClick={handleSubmit}
              className="text-sm px-4 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Küldés
            </button>
          </div>
        </div>
      )}
    </>
  )
}
