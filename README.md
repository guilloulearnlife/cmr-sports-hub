# 🏆 CMR Sports Hub — Frontend Next.js 14

Plateforme nationale multi-sports camerounaise connectée à Supabase.

## Stack Technique
- **Next.js 14** — App Router, Server Components, ISR
- **Supabase** — PostgreSQL + Realtime + Auth
- **Tailwind CSS** — Thème CMR personnalisé
- **TypeScript** — Types complets

## Installation rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer en développement
npm run dev

# 3. Ouvrir http://localhost:3000
```

## Structure des pages

```
/                          → Hub multi-sports (matchs du jour, live, compétitions)
/live                      → Scores en direct (refresh 15s)
/football                  → Page sport (classement + matchs)
/football/elite-one-2025   → Page compétition
/football/elite-one-2025/classement   → Classement complet
/football/elite-one-2025/calendrier   → Calendrier aller/retour
/admin                     → Panel admin (encoder scores, créer matchs/clubs)
```

## Variables d'environnement (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=https://lagsxqrtiuovkvvoqtst.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

## Workflow n8n → Supabase

Après encodage d'un score, n8n peut déclencher le recalcul du classement :

```
POST https://lagsxqrtiuovkvvoqtst.supabase.co/rest/v1/rpc/recalcule_classement
Authorization: Bearer {ANON_KEY}
Content-Type: application/json

{ "p_competition_id": "uuid-de-la-competition" }
```

## Déploiement (Vercel)

```bash
# Déployer sur Vercel (gratuit)
npx vercel deploy

# Définir les variables d'env sur Vercel Dashboard
```

## Pages sports disponibles
- `/football` — FECAFOOT (Elite One, Elite Two, Coupe CMR)
- `/basketball` — FECABASKET
- `/volleyball` — FECAVOLLEY
- `/handball` — FECAHAND
- `/billard` — FECABILLARD
- `/boxe` — FECABOXE
- `/athletisme` — FECATHLE

## Thème CMR
| Variable | Valeur | Usage |
|---|---|---|
| `--yellow` | `#f5c518` | Titres, accents |
| `--dark` | `#0a100d` | Fond général |
| `--card` | `#162218` | Cartes |
| `--live` | `#e74c3c` | Badge LIVE |
| `--muted` | `#7a9c80` | Texte secondaire |
