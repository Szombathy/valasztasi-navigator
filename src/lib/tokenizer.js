const STOP_WORDS = new Set([
  'a', 'az', 'és', 'is', 'de', 'hogy', 'nem', 'meg', 'már', 'még',
  'van', 'volt', 'vagy', 'mint', 'csak', 'fel', 'ki', 'be', 'el',
  'ha', 'ezt', 'azt', 'egy', 'nem', 'igen', 'lesz', 'lett', 'volna',
  'ami', 'aki', 'ahol', 'arra', 'erre', 'abban', 'ebben', 'annak',
  'ennek', 'ezek', 'azok', 'akkor', 'tehát', 'mert', 'így', 'úgy',
  'itt', 'ott', 'most', 'igen', 'hát', 'pedig', 'sem', 'se',
])

const ACCENT_MAP = {
  'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ö': 'o', 'ő': 'o',
  'ú': 'u', 'ü': 'u', 'ű': 'u',
}

export function normalizeAccents(text) {
  return text.replace(/[áéíóöőúüű]/g, ch => ACCENT_MAP[ch] || ch)
}

export function tokenize(text) {
  const lower = text.toLowerCase().trim()
  const tokens = lower
    .replace(/[^\wáéíóöőúüű\s-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && !STOP_WORDS.has(t))
  return tokens
}

export function tokenizeForSearch(text) {
  const tokens = tokenize(text)
  const normalized = tokens.map(t => normalizeAccents(t))
  return [...new Set([...tokens, ...normalized])]
}
