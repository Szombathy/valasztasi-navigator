import { tokenizeForSearch, normalize, stem } from './tokenizer.js'
import synonymMap from './synonym-map.js'

/**
 * Expand query tokens using the synonym map.
 * Returns { queryTokens, expandedTokens } where expandedTokens includes originals + synonyms.
 */
function expandTokens(queryTokens) {
  const expanded = new Set(queryTokens)
  const synonymKeys = Object.keys(synonymMap)

  for (const token of queryTokens) {
    const stemmed = stem(token)
    expanded.add(stemmed)

    // Check both the token and its stemmed form in synonym map (exact match)
    for (const key of [token, stemmed]) {
      if (synonymMap[key]) {
        for (const syn of synonymMap[key]) {
          expanded.add(syn)
        }
      }
    }

    // Prefix/contains match: if the token starts with a synonym key (or vice versa)
    // This helps with conjugated forms like "hulyitik" matching "hulyit"
    for (const key of synonymKeys) {
      if (key.length >= 3 && (token.startsWith(key) || stemmed.startsWith(key))) {
        for (const syn of synonymMap[key]) {
          expanded.add(syn)
        }
      }
    }
  }

  return [...expanded]
}

/**
 * Calculate multi-layer relevance score for a question against query tokens.
 */
function calculateScore(queryTokens, expandedTokens, question) {
  let score = 0

  const normalizedQuestion = normalize(question.question)
  const normalizedTags = (question.tags || []).map(t => normalize(t))
  const normalizedSynonyms = (question.synonyms || []).map(s => normalize(s))
  const normalizedAnswer = normalize(question.answer)
  const normalizedCategory = normalize(question.category)

  // Combine all text for partial matching
  const allText = normalizedQuestion + ' ' + normalizedTags.join(' ') + ' ' + normalizedSynonyms.join(' ')

  // A) Exact match in question text (highest weight) — original tokens only
  for (const token of queryTokens) {
    if (normalizedQuestion.includes(token)) {
      score += 10
    }
  }

  // B) Tag match (high weight — tags are hand-curated)
  for (const token of expandedTokens) {
    if (normalizedTags.some(tag => tag.includes(token) || token.includes(tag))) {
      score += 8
    }
  }

  // C) Synonym match from database (medium weight)
  for (const token of expandedTokens) {
    if (normalizedSynonyms.some(syn => syn.includes(token) || token.includes(syn))) {
      score += 6
    }
  }

  // D) Answer text match (lower weight) — original tokens only
  for (const token of queryTokens) {
    if (normalizedAnswer.includes(token)) {
      score += 3
    }
  }

  // E) Category boost — if expanded tokens match the category name
  for (const token of expandedTokens) {
    if (normalizedCategory.includes(token) || token.includes(normalizedCategory)) {
      score += 5
      break // Only one category boost per question
    }
  }

  // F) Partial/substring match bonus for compound words
  for (const token of queryTokens) {
    if (token.length >= 4 && allText.includes(token)) {
      score += 2
    }
  }

  return score
}

export function search(questions, query, activeCategory = null) {
  if (!query || query.trim().length < 2) {
    if (activeCategory) {
      return questions
        .filter(q => q.category === activeCategory)
        .slice(0, 20)
        .map(q => ({ ...q, score: 1 }))
    }
    return []
  }

  const queryTokens = tokenizeForSearch(query)
  if (queryTokens.length === 0) {
    // If all tokens were stop words, try with just normalized words (no stop word filtering)
    const fallback = normalize(query).split(/\s+/).filter(t => t.length > 1)
    if (fallback.length === 0) return []
    // Use fallback tokens
    return searchWithTokens(questions, fallback, fallback, activeCategory)
  }

  const expandedTokens = expandTokens(queryTokens)
  return searchWithTokens(questions, queryTokens, expandedTokens, activeCategory)
}

function searchWithTokens(questions, queryTokens, expandedTokens, activeCategory) {
  const results = questions
    .filter(q => !activeCategory || q.category === activeCategory)
    .map(item => {
      const score = calculateScore(queryTokens, expandedTokens, item)
      return { ...item, score }
    })
    .filter(r => r.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)

  return results
}

export function browseCategory(questions, category) {
  return questions
    .filter(q => q.category === category)
    .map(q => ({ ...q, score: 1 }))
}
