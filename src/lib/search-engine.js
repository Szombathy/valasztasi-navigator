import { tokenizeForSearch, normalizeAccents } from './tokenizer.js'

function computeKeywordScore(queryTokens, item) {
  let score = 0
  const questionLower = item.question.toLowerCase()
  const questionNorm = normalizeAccents(questionLower)
  const tags = (item.tags || []).map(t => t.toLowerCase())
  const tagsNorm = tags.map(t => normalizeAccents(t))
  const synonyms = (item.synonyms || []).map(s => s.toLowerCase())
  const synonymsNorm = synonyms.map(s => normalizeAccents(s))

  for (const token of queryTokens) {
    const tokenNorm = normalizeAccents(token)

    // Exact word match in question
    if (questionLower.includes(token) || questionNorm.includes(tokenNorm)) {
      score += 3
    }

    // Tag exact match
    if (tags.some(t => t === token) || tagsNorm.some(t => t === tokenNorm)) {
      score += 2
    } else if (tags.some(t => t.includes(token)) || tagsNorm.some(t => t.includes(tokenNorm))) {
      score += 1
    }

    // Synonym match
    if (synonyms.some(s => s.includes(token)) || synonymsNorm.some(s => s.includes(tokenNorm))) {
      score += 2
    }

    // Partial match in question (substring)
    const words = questionLower.split(/\s+/)
    const wordsNorm = questionNorm.split(/\s+/)
    for (let i = 0; i < words.length; i++) {
      if (words[i] !== token && words[i].includes(token)) {
        score += 1
        break
      }
      if (wordsNorm[i] !== tokenNorm && wordsNorm[i].includes(tokenNorm)) {
        score += 1
        break
      }
    }

    // Answer match (lower weight)
    const answerLower = item.answer.toLowerCase()
    const answerNorm = normalizeAccents(answerLower)
    if (answerLower.includes(token) || answerNorm.includes(tokenNorm)) {
      score += 0.5
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
  if (queryTokens.length === 0) return []

  const results = questions
    .filter(q => !activeCategory || q.category === activeCategory)
    .map(item => {
      const keywordScore = computeKeywordScore(queryTokens, item)
      const maxPossible = queryTokens.length * 6
      const normalizedKeyword = maxPossible > 0 ? keywordScore / maxPossible : 0

      let finalScore
      if (item.embedding && item.embedding.length > 0) {
        // If embeddings exist, blend scores
        // For now, without query embedding, just use keyword
        finalScore = normalizedKeyword
      } else {
        finalScore = normalizedKeyword
      }

      return { ...item, score: finalScore }
    })
    .filter(r => r.score > 0.05)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  return results
}

export function browseCategory(questions, category) {
  return questions
    .filter(q => q.category === category)
    .map(q => ({ ...q, score: 1 }))
}
