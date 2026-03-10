# 🏆 CMR Sports Hub — Frontend Next.js 14

Plateforme nationale multi-sports camerounaise connectée à Supabase.

## Stack Technique

- **Next.js 14** — App Router, Server Components, ISR
- **Supabase** — PostgreSQL + Realtime + Auth
- **Tailwind CSS** — Thème CMR personnalisé
- **TypeScript** — Types complets
- **PWA** — Installation mobile native

## Installation rapide

```bash
# 1. Cloner le repo
git clone https://github.com/guilloulearnlife/cmr-sports-hub.git
cd cmr-sports-hub

# 2. Copier les variables d'environnement
cp .env.example .env.local

# 3. Configurer vos clés Supabase dans .env.local
# NEXT_PUBLIC_SUPABASE_URL=votre_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé

# 4. Installer les dépendances
npm install

# 5. Lancer en développement
npm run dev

# 6. Ouvrir http://localhost:3000
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

## Variables d'environnement

Créez un fichier `.env.local` à la racine avec :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon
```

> ⚠️ Ne commitez jamais vos clés API ! Utilisez `.env.local` (gitignored)

## Déploiement (Vercel)

```bash
# Déployer sur Vercel (gratuit)
npx vercel deploy

# Définir les variables d'env sur Vercel Dashboard
# Settings > Environment Variables
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
| --- | --- | --- |
| `--yellow` | `#f5c518` | Titres, accents |
| `--dark` | `#0a100d` | Fond général |
| `--card` | `#162218` | Cartes |
| `--live` | `#e74c3c` | Badge LIVE |
| `--muted` | `#7a9c80` | Texte secondaire |

## Licence

MIT © 2026 CMR Sports Hub Team
