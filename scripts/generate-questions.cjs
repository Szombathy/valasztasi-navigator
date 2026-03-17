const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'public', 'qa-database.json');

// Load existing database
const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
console.log(`Meglévő kérdések: ${db.questions.length}`);

// Load batch files
const batchFiles = [
  'batch1-megelhetes-oktatas.cjs',
  'batch2-egeszsegugy-korrupcio.cjs',
  'batch3-eupolitika-demokracia.cjs',
  'batch4-energia-media.cjs',
];

let newQuestions = [];
for (const file of batchFiles) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.error(`HIBA: ${file} nem található!`);
    process.exit(1);
  }
  const batch = require(`./${file}`);
  console.log(`  ${file}: ${batch.length} kérdés`);
  newQuestions = newQuestions.concat(batch);
}

console.log(`\nÚj kérdések összesen: ${newQuestions.length}`);

// Merge
db.questions = db.questions.concat(newQuestions);
console.log(`Összes kérdés: ${db.questions.length}`);

// Verify unique IDs
const ids = db.questions.map(q => q.id);
const uniqueIds = new Set(ids);
if (uniqueIds.size !== ids.length) {
  console.error(`FIGYELEM: ${ids.length - uniqueIds.size} duplikált ID!`);
}

// Category breakdown
const cats = {};
for (const q of db.questions) {
  cats[q.category] = (cats[q.category] || 0) + 1;
}
console.log('\nKategóriánkénti megoszlás:');
for (const [cat, count] of Object.entries(cats).sort()) {
  console.log(`  ${cat}: ${count}`);
}

// Validate all questions have required fields
const requiredFields = ['id', 'question', 'answer', 'category', 'tags', 'synonyms', 'sources', 'difficulty', 'embedding', 'last_updated'];
let errors = 0;
for (const q of db.questions) {
  for (const field of requiredFields) {
    if (!(field in q)) {
      console.error(`HIBA: "${q.question?.slice(0, 50)}..." - hiányzó mező: ${field}`);
      errors++;
    }
  }
}
if (errors > 0) {
  console.error(`\n${errors} hiba találva, javítsd ki a batch fájlokat!`);
  process.exit(1);
}

// Update version
db.generated = '2026-03-16';

// Write output
fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
console.log(`\nSikeres mentés: ${DB_PATH}`);
console.log(`Fájlméret: ${(fs.statSync(DB_PATH).size / 1024).toFixed(0)} KB`);
