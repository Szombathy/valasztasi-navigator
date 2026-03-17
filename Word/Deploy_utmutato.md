# Deploy a Választási Navigátort Cloudflare Pages-re

A `valasztasi-navigator` app kész, a `dist/` mappa tartalmazza a production buildet. Most tegyük élesbe.

## 1. Git repo inicializálás

Ha még nincs git repo a projektben:

```bash
cd valasztasi-navigator
git init
```

Hozz létre egy `.gitignore` fájlt:

```
node_modules/
.DS_Store
*.log
```

Majd commitold az egész projektet:

```bash
git add .
git commit -m "Családi Választási Navigátor v1.0 — 400 kérdés, PWA, offline"
```

## 2. GitHub repo létrehozás és push

```bash
# Hozd létre a repot GitHub-on (gh CLI kell hozzá: sudo apt install gh && gh auth login)
gh repo create valasztasi-navigator --public --source=. --push

# VAGY ha nincs gh CLI, kézzel:
# 1. Menj a github.com-ra, hozz létre egy "valasztasi-navigator" nevű repot
# 2. Aztán:
git remote add origin https://github.com/FELHASZNALONEV/valasztasi-navigator.git
git branch -M main
git push -u origin main
```

## 3. Cloudflare Pages összekapcsolás

Ez a rész a böngészőben történik:

1. Menj a https://dash.cloudflare.com oldalra (regisztrálj ha még nincs fiókod — ingyenes)
2. Bal menüben: "Workers & Pages" → "Create" → "Pages" → "Connect to Git"
3. Válaszd ki a GitHub repot: "valasztasi-navigator"
4. Build settings:
   - Framework preset: **None**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/` (hagyod üresen)
5. Kattints "Save and Deploy"

Az első build ~1-2 perc. Utána kapsz egy URL-t: `valasztasi-navigator.pages.dev`

## 4. Egyedi domain (opcionális)

Ha van saját domained (pl. valasztasnavigator.hu):
1. Cloudflare Pages → Custom domains → Add domain
2. A domain registrárnál állítsd be a CNAME rekordot: `valasztasnavigator.hu → valasztasi-navigator.pages.dev`
3. Az SSL automatikusan bekapcsol

## 5. Ellenőrzés

Miután a deploy kész, nyisd meg a kapott URL-t és ellenőrizd:
- Betöltődik a keresőfelület
- Keresés működik (próbáld: "egészségügy")
- Kategóriaszűrés működik
- Sötét mód működik
- Mobilon is jól néz ki (telefonon nyisd meg, vagy F12 → mobilnézet)
- Offline mód: töltsd be egyszer, majd kapcsold ki a netet és próbáld újra

## A deploy után

Minden további frissítéshez:
```bash
# Módosítod a fájlokat, majd:
git add .
git commit -m "Tartalom frissítés"
git push
# A Cloudflare Pages automatikusan újraépíti az oldalt (~30 mp)
```
