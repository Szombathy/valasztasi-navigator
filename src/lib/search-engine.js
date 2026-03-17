import { tokenizeForSearch, normalize, stem } from './tokenizer.js'
import synonymMap from './synonym-map.js'
import termEmbeddings from './term-embeddings.js'
import { cosineSimilarity } from './cosine.js'

/**
 * Expand query tokens using the synonym map.
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

    // Prefix match: if the token starts with a synonym key
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
 * Build a query embedding by averaging term embeddings for the expanded tokens.
 * Returns null if no term embeddings match.
 */
function buildQueryEmbedding(expandedTokens) {
  const matchedVecs = []

  for (const token of expandedTokens) {
    if (termEmbeddings[token]) {
      matchedVecs.push(termEmbeddings[token])
    }
  }

  if (matchedVecs.length === 0) return null

  // Average all matched vectors
  const dim = matchedVecs[0].length
  const avg = new Array(dim).fill(0)
  for (const vec of matchedVecs) {
    for (let i = 0; i < dim; i++) {
      avg[i] += vec[i]
    }
  }

  // Normalize to unit vector
  let mag = 0
  for (let i = 0; i < dim; i++) {
    avg[i] /= matchedVecs.length
    mag += avg[i] * avg[i]
  }
  mag = Math.sqrt(mag)
  if (mag > 0) {
    for (let i = 0; i < dim; i++) {
      avg[i] /= mag
    }
  }

  return avg
}

/**
 * Calculate multi-layer keyword relevance score.
 */
function calculateKeywordScore(queryTokens, expandedTokens, question) {
  let score = 0

  const normalizedQuestion = normalize(question.question)
  const normalizedTags = (question.tags || []).map(t => normalize(t))
  const normalizedSynonyms = (question.synonyms || []).map(s => normalize(s))
  const normalizedAnswer = normalize(question.answer)
  const normalizedCategory = normalize(question.category)
  const allText = normalizedQuestion + ' ' + normalizedTags.join(' ') + ' ' + normalizedSynonyms.join(' ')

  // A) Exact match in question text (+10)
  for (const token of queryTokens) {
    if (normalizedQuestion.includes(token)) score += 10
  }

  // B) Tag match (+8)
  for (const token of expandedTokens) {
    if (normalizedTags.some(tag => tag.includes(token) || token.includes(tag))) score += 8
  }

  // C) Synonym match from DB (+6)
  for (const token of expandedTokens) {
    if (normalizedSynonyms.some(syn => syn.includes(token) || token.includes(syn))) score += 6
  }

  // D) Answer text match (+3)
  for (const token of queryTokens) {
    if (normalizedAnswer.includes(token)) score += 3
  }

  // E) Category boost (+5)
  for (const token of expandedTokens) {
    if (normalizedCategory.includes(token) || token.includes(normalizedCategory)) {
      score += 5
      break
    }
  }

  // F) Partial/compound word match (+2)
  for (const token of queryTokens) {
    if (token.length >= 4 && allText.includes(token)) score += 2
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
    const fallback = normalize(query).split(/\s+/).filter(t => t.length > 1)
    if (fallback.length === 0) return []
    return searchWithTokens(questions, fallback, fallback, activeCategory)
  }

  const expandedTokens = expandTokens(queryTokens)
  return searchWithTokens(questions, queryTokens, expandedTokens, activeCategory)
}

function searchWithTokens(questions, queryTokens, expandedTokens, activeCategory) {
  // Build query embedding from expanded tokens
  const queryEmbedding = buildQueryEmbedding(expandedTokens)

  // Compute max possible keyword score for normalization
  // Rough estimate: each query token can contribute max ~29 points
  const maxKeyword = queryTokens.length * 29 + expandedTokens.length * 14
  const hasEmbeddings = queryEmbedding !== null

  const results = questions
    .filter(q => !activeCategory || q.category === activeCategory)
    .map(item => {
      const keywordScore = calculateKeywordScore(queryTokens, expandedTokens, item)
      const normalizedKeyword = maxKeyword > 0 ? Math.min(keywordScore / maxKeyword, 1) : 0

      let finalScore
      if (hasEmbeddings && item.embedding && item.embedding.length > 0) {
        // Blend keyword + semantic similarity
        const similarity = cosineSimilarity(queryEmbedding, item.embedding)
        // Clamp similarity to [0, 1]
        const clampedSim = Math.max(0, similarity)
        finalScore = 0.5 * normalizedKeyword + 0.5 * clampedSim
      } else {
        finalScore = normalizedKeyword
      }

      return { ...item, score: finalScore }
    })
    .filter(r => r.score > 0.01)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)

  return results
}

export function browseCategory(questions, category) {
  return questions
    .filter(q => q.category === category)
    .map(q => ({ ...q, score: 1 }))
}
