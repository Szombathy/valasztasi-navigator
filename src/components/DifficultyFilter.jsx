const LEVELS = [
  { id: 'egyszerű', label: 'Egyszerű', desc: 'rövid, közérthető válasz' },
  { id: 'közepes', label: 'Közepes', desc: 'részletesebb, számokkal' },
  { id: 'részletes', label: 'Részletes', desc: 'mélyebb elemzés, háttér' },
]

export default function DifficultyFilter({ activeDifficulty, onDifficultyChange }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {LEVELS.map(level => (
        <button
          key={level.id}
          onClick={() => onDifficultyChange(activeDifficulty === level.id ? null : level.id)}
          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
            activeDifficulty === level.id
              ? 'bg-gray-700 text-white dark:bg-gray-200 dark:text-gray-900'
              : 'border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          aria-label={`Szűrés: ${level.label} — ${level.desc}`}
          aria-pressed={activeDifficulty === level.id}
          title={level.desc}
        >
          {level.label}
        </button>
      ))}
    </div>
  )
}
