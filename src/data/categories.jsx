export const CATEGORIES = [
  { id: 'megélhetés', label: 'Megélhetés', color: '#D85A30', icon: 'wallet' },
  { id: 'oktatás', label: 'Oktatás', color: '#534AB7', icon: 'book' },
  { id: 'egészségügy', label: 'Egészségügy', color: '#1D9E75', icon: 'heart' },
  { id: 'korrupció', label: 'Korrupció', color: '#E24B4A', icon: 'alert' },
  { id: 'eu-politika', label: 'EU-politika', color: '#185FA5', icon: 'globe' },
  { id: 'demokrácia', label: 'Demokrácia', color: '#D4537E', icon: 'scale' },
  { id: 'energia', label: 'Energia', color: '#BA7517', icon: 'zap' },
  { id: 'média', label: 'Média', color: '#639922', icon: 'tv' },
]

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map(c => [c.id, c]))

export const ICONS = {
  wallet: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect x="2" y="6" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M16 14h.01"/>
    </svg>
  ),
  book: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z"/>
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  alert: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  scale: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M12 3v18"/><path d="M3 7l3-4 3 4"/><path d="M3 7h6"/><path d="M15 7l3-4 3 4"/><path d="M15 7h6"/><path d="M5 17a2 2 0 1 0 4 0H5z"/><path d="M15 17a2 2 0 1 0 4 0h-4z"/>
    </svg>
  ),
  zap: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  tv: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/>
    </svg>
  ),
}
