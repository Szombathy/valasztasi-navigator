const LEVELS = {
  'egyszerű': { label: 'Egyszerű', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  'közepes': { label: 'Közepes', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  'haladó': { label: 'Haladó', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
}

export default function DifficultyBadge({ difficulty }) {
  const level = LEVELS[difficulty] || LEVELS['egyszerű']
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${level.className}`}>
      {level.label}
    </span>
  )
}
