# Használat:
# pip install sentence-transformers
# python scripts/generate-embeddings.py
#
# Ez a script a fejlesztő gépén fut EGYSZER, nem a felhasználó telefonján.
# A generált vektorok bekerülnek a JSON-be, amit a PWA használ.

import json
import os
from sentence_transformers import SentenceTransformer

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'public', 'qa-database.json')

def main():
    print('Modell betöltése...')
    model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

    print(f'Adatbázis betöltése: {DB_PATH}')
    with open(DB_PATH, 'r', encoding='utf-8') as f:
        db = json.load(f)

    questions = db['questions']
    print(f'{len(questions)} kérdés feldolgozása...')

    texts = []
    for q in questions:
        parts = [q['question']]
        parts.extend(q.get('tags', []))
        parts.extend(q.get('synonyms', []))
        texts.append(' '.join(parts))

    embeddings = model.encode(texts, show_progress_bar=True, normalize_embeddings=True)

    for i, q in enumerate(questions):
        q['embedding'] = embeddings[i].tolist()

    print(f'Mentés: {DB_PATH}')
    with open(DB_PATH, 'w', encoding='utf-8') as f:
        json.dump(db, f, ensure_ascii=False, indent=2)

    print('Kész! Az embedding vektorok bekerültek az adatbázisba.')

if __name__ == '__main__':
    main()
