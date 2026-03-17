# Családi Választási Navigátor

Tényalapú válaszok a 2026-os magyar országgyűlési választásról — offline is működik.

## Mi ez?

Egy teljesen kliensoldali, statikus PWA alkalmazás, amely egy előre szerkesztett kérdés-válasz adatbázis segítségével segíti a családon belüli politikai tájékozódást a 2026. április 12-i választás előtt.

**Főbb jellemzők:**
- Kliensoldali szemantikus keresés (kulcsszó + embedding alapú)
- Progresszív Webalkalmazás — telepíthető telefonra
- Teljes offline működés Service Worker-rel
- Világos/sötét mód
- Nincs adatgyűjtés, nincs tracking, nincs backend

## Telepítés és fejlesztés

```bash
# Függőségek telepítése
npm install

# Fejlesztői szerver indítása
npm run dev

# Production build
npm run build
```

A `npm run build` parancs a `dist/` mappába generálja a statikus fájlokat.

## Deploy

A `dist/` mappa tartalma feltölthető bármely statikus hosting szolgáltatásra:

- **Cloudflare Pages**: Git push → automatikus deploy
- **GitHub Pages**: `dist/` mappa tartalmát push-old a `gh-pages` branch-re
- **Netlify**: Git push → automatikus deploy

## Embedding generálás (opcionális)

A keresőmotor kulcsszó alapon is működik, de a szemantikus keresés javításához generálhatsz embedding vektorokat:

```bash
pip install sentence-transformers
python scripts/generate-embeddings.py
```

Ez frissíti a `public/qa-database.json` fájl `embedding` mezőit.

## Tartalom bővítés

Új kérdés hozzáadása a `public/qa-database.json` fájlhoz:

1. Adj hozzá egy új objektumot a `questions` tömbhöz
2. Töltsd ki az összes mezőt (id, question, answer, category, tags, synonyms, sources, difficulty)
3. Az `embedding` mező legyen üres tömb `[]` (vagy futtasd a generate-embeddings.py scriptet)
4. Build-elj és deploy-olj újra

## Kategóriák

| Kategória | Témák |
|-----------|-------|
| Megélhetés | Infláció, élelmiszerárak, lakhatás, bérek |
| Oktatás | Pedagógushiány, PISA, tanterv, egyetemek |
| Egészségügy | Orvoshiány, várólisták, kórházbezárások |
| Korrupció | EU-pénzek, közbeszerzés, átláthatóság |
| EU-politika | Jogállamiság, befagyasztott források, Schengen |
| Demokrácia | Sajtószabadság, bírói függetlenség, civil szféra |
| Energia | Rezsicsökkentés, Paks II, megújulók, gázfüggőség |
| Média | Állami média, KESMA, sajtószabadság-index |

## Technológiák

- React 18+ (Vite build)
- Tailwind CSS v4
- Service Worker (offline PWA)
- Marked (markdown renderelés)

## Licensz

MIT
