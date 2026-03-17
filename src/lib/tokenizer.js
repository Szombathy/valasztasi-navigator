const STOP_WORDS = new Set([
  'a', 'az', 'es', 'is', 'de', 'hogy', 'nem', 'meg', 'mar', 'meg',
  'van', 'volt', 'vagy', 'mint', 'csak', 'fel', 'ki', 'be', 'el',
  'ha', 'ezt', 'azt', 'egy', 'ez', 'o', 'en', 'te', 'mi', 'ti', 'ok',
  'itt', 'ott', 'hol', 'mikor', 'miert', 'hogyan', 'igen', 'nem',
  'lesz', 'lett', 'lenne', 'kell', 'lehet', 'minden', 'sok', 'nagyon',
  'tud', 'fog', 'akar', 'volna', 'ami', 'aki', 'ahol', 'arra', 'erre',
  'abban', 'ebben', 'annak', 'ennek', 'ezek', 'azok', 'akkor', 'tehat',
  'mert', 'igy', 'ugy', 'most', 'hat', 'pedig', 'sem', 'se',
  'és', 'már', 'még', 'ő', 'én', 'ők', 'miért', 'tehát', 'így', 'úgy', 'hát',
])

const ACCENT_MAP = {
  'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ö': 'o', 'ő': 'o',
  'ú': 'u', 'ü': 'u', 'ű': 'u',
  'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ö': 'O', 'Ő': 'O',
  'Ú': 'U', 'Ü': 'U', 'Ű': 'U',
}

// Hungarian suffixes ordered longest-first for greedy matching
// Includes noun cases, verb conjugation endings, and plural markers
const SUFFIXES = [
  // Longer suffixes first
  'ként', 'kent',
  'anak', 'enek',
  'bol', 'bol',
  'ból', 'ből',
  'tól', 'től', 'tol', 'tol',
  'ról', 'ről', 'rol', 'rol',
  'nak', 'nek',
  'hoz', 'hez', 'höz',
  'ban', 'ben',
  'val', 'vel',
  'ért', 'ert',
  'jak', 'jek', 'jak', 'jek',
  'unk', 'unk',
  'tok', 'tek', 'tok',
  'unk', 'unk',
  'ják', 'jék',
  'ik',
  'ba', 'be',
  'ra', 're',
  'on', 'en', 'ön',
  'ul', 'ül',
  'ig',
  'ák', 'ék', 'ak', 'ek',
  'at', 'et', 'ot', 'öt',
  'ok', 'ek', 'ök',
  'ja', 'je',
  'ik',
  't',
]

export function normalizeAccents(text) {
  return text.replace(/[áéíóöőúüűÁÉÍÓÖŐÚÜŰ]/g, ch => ACCENT_MAP[ch] || ch)
}

/**
 * Simple Hungarian stemmer — strips common suffixes if remainder >= 3 chars
 */
export function stem(word) {
  for (const suffix of SUFFIXES) {
    if (word.endsWith(suffix) && (word.length - suffix.length) >= 3) {
      return word.slice(0, -suffix.length)
    }
  }
  return word
}

/**
 * Full normalization pipeline: lowercase, remove accents, remove punctuation, stem
 */
export function normalize(text) {
  return normalizeAccents(text.toLowerCase())
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
}

/**
 * Tokenize text: lowercase, remove punctuation, remove accents, stem, filter stops
 */
export function tokenize(text) {
  const cleaned = normalize(text)
  const raw = cleaned
    .split(/\s+/)
    .filter(t => t.length > 1)

  const tokens = []
  for (const t of raw) {
    const normalized = normalizeAccents(t)
    if (STOP_WORDS.has(normalized)) continue
    if (STOP_WORDS.has(t)) continue
    tokens.push(normalized)
  }
  return tokens
}

/**
 * Tokenize + stem for search. Returns unique stemmed tokens.
 */
export function tokenizeForSearch(text) {
  const tokens = tokenize(text)
  const stemmed = tokens.map(t => stem(t))
  // Return both unstemmed and stemmed, deduplicated
  return [...new Set([...tokens, ...stemmed])]
}
