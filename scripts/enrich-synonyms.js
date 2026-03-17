/**
 * Szinonima-bővítő script
 *
 * Beolvassa a qa-database.json-t, és minden kérdéshez hozzáad extra
 * szinonimákat és tageket a kérdés tartalmából és a synonym-map alapján.
 *
 * Futtatás: node scripts/enrich-synonyms.js
 */
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_PATH = resolve(__dirname, '../public/qa-database.json')

// Inline the synonym map (since we can't easily import from src in a script)
// This is a simplified version — the full map lives in src/lib/synonym-map.js
const ACCENT_MAP = {
  'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ö': 'o', 'ő': 'o',
  'ú': 'u', 'ü': 'u', 'ű': 'u',
}

function normalize(text) {
  return text.toLowerCase()
    .replace(/[áéíóöőúüű]/g, ch => ACCENT_MAP[ch] || ch)
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
}

// Category → relevant extra keywords to look for in question text
const CATEGORY_KEYWORDS = {
  'megélhetés': {
    keywords: ['infláció', 'ár', 'drága', 'drágulás', 'forint', 'bér', 'fizetés', 'kereset',
      'minimálbér', 'lakás', 'albérlet', 'rezsi', 'nyugdíj', 'adó', 'szegénység',
      'megélhetés', 'hitel', 'bank', 'munkabér', 'jövedelem', 'élelmiszer',
      'üzemanyag', 'benzin', 'gáz', 'rezsicsökkentés', 'pénz', 'költség'],
    extraSynonyms: ['pénzromlás', 'áremelkedés', 'drágulás', 'gazdaság', 'költségek'],
  },
  'oktatás': {
    keywords: ['iskola', 'tanár', 'pedagógus', 'diák', 'egyetem', 'oktatás',
      'közoktatás', 'felsőoktatás', 'tanárhiány', 'tankönyv', 'sztrájk',
      'hallgató', 'CEU', 'PISA', 'ösztöndíj'],
    extraSynonyms: ['képzés', 'tanulás', 'tudás', 'oktatási rendszer'],
  },
  'egészségügy': {
    keywords: ['kórház', 'orvos', 'beteg', 'egészségügy', 'várolista', 'gyógyszer',
      'ápoló', 'háziorvos', 'műtét', 'sürgősségi', 'egészségbiztosítás',
      'orvoshiány', 'ápolóhiány', 'mentő', 'járvány'],
    extraSynonyms: ['ellátás', 'gyógyítás', 'egészségügyi rendszer', 'betegellátás'],
  },
  'korrupció': {
    keywords: ['korrupció', 'közbeszerzés', 'oligarcha', 'közpénz', 'lopás',
      'Mészáros', 'NER', 'stadion', 'vagyonnyilatkozat', 'ÁSZ',
      'átláthatóság', 'uniós pénz', 'felülbírálat'],
    extraSynonyms: ['mutyizás', 'haverok', 'rendszer', 'visszaélés', 'sikkasztás'],
  },
  'EU-politika': {
    keywords: ['EU', 'Brüsszel', 'európai', 'unió', 'tagállam', 'kohéziós',
      'jogállamiság', 'vétó', 'bizottság', 'parlament', 'szankció',
      'hetes cikkely', 'támogatás'],
    extraSynonyms: ['Európa', 'uniós', 'tagság', 'integráció'],
  },
  'demokrácia': {
    keywords: ['demokrácia', 'jogállam', 'választás', 'szavazás', 'sajtószabadság',
      'szabadság', 'emberi jogok', 'bíróság', 'ügyészség', 'ellenzék',
      'parlament', 'tüntetés', 'Orbán', 'Fidesz', 'kormány'],
    extraSynonyms: ['önkényuralom', 'diktatúra', 'szabadságjogok', 'politikai rendszer'],
  },
  'energia': {
    keywords: ['energia', 'Paks', 'atomerőmű', 'gáz', 'földgáz', 'megújuló',
      'napenergia', 'szélenergia', 'Rosatom', 'nukleáris', 'függőség',
      'klíma', 'zöld', 'áram', 'villany'],
    extraSynonyms: ['erőmű', 'energiaforrás', 'fosszilis', 'fenntartható'],
  },
  'média': {
    keywords: ['média', 'sajtó', 'újságíró', 'propaganda', 'cenzúra', 'közmédia',
      'MTVA', 'álhír', 'dezinformáció', 'televízió', 'rádió', 'online'],
    extraSynonyms: ['tájékoztatás', 'hírek', 'médiabirodalom', 'kormánymédia'],
  },
}

function enrichQuestion(q) {
  const questionNorm = normalize(q.question)
  const answerNorm = normalize(q.answer)
  const fullText = questionNorm + ' ' + answerNorm

  const existingSynonyms = new Set((q.synonyms || []).map(s => s.toLowerCase()))
  const existingTags = new Set((q.tags || []).map(t => t.toLowerCase()))

  const newSynonyms = []
  const newTags = []

  // Get category config
  const catConfig = CATEGORY_KEYWORDS[q.category]
  if (!catConfig) return q

  // Check if any category keywords appear in the question/answer text
  for (const kw of catConfig.keywords) {
    const kwNorm = normalize(kw)
    if (fullText.includes(kwNorm)) {
      // Add as tag if not already present
      if (!existingTags.has(kw.toLowerCase()) && !existingSynonyms.has(kw.toLowerCase())) {
        newTags.push(kw)
        existingTags.add(kw.toLowerCase())
      }
    }
  }

  // Add extra synonyms from category
  for (const syn of catConfig.extraSynonyms) {
    if (!existingSynonyms.has(syn.toLowerCase()) && !existingTags.has(syn.toLowerCase())) {
      newSynonyms.push(syn)
      existingSynonyms.add(syn.toLowerCase())
    }
  }

  // Limit additions: max 5 new synonyms, 3 new tags
  const finalSynonyms = [...(q.synonyms || []), ...newSynonyms.slice(0, 5)]
  const finalTags = [...(q.tags || []), ...newTags.slice(0, 3)]

  return {
    ...q,
    synonyms: finalSynonyms,
    tags: finalTags,
  }
}

// Main
const raw = readFileSync(DB_PATH, 'utf-8')
const db = JSON.parse(raw)

console.log(`Loaded ${db.questions.length} questions`)

let enrichedCount = 0
db.questions = db.questions.map(q => {
  const enriched = enrichQuestion(q)
  if (enriched.synonyms.length > q.synonyms.length || enriched.tags.length > q.tags.length) {
    enrichedCount++
  }
  return enriched
})

console.log(`Enriched ${enrichedCount} questions with additional synonyms/tags`)

writeFileSync(DB_PATH, JSON.stringify(db, null, 2) + '\n', 'utf-8')
console.log(`Written to ${DB_PATH}`)
