# CMR Sports Hub - PRD (Product Requirements Document)

## Projet
**Nom**: CMR Sports Hub  
**URL Production**: https://cmr-sports-hub.vercel.app  
**Repository**: https://github.com/guilloulearnlife/cmr-sports-hub

## Stack Technique
- **Frontend**: Next.js 14 (App Router)
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Styling**: Tailwind CSS
- **Hébergement**: Vercel
- **PWA**: next-pwa

## User Personas
1. **Fan de sport camerounais** - Consulte scores, classements, calendriers
2. **Correspondant terrain** - Encode les scores en temps réel depuis mobile
3. **Admin régional** - Valide les scores, gère les compétitions
4. **Super Admin** - Gestion complète de la plateforme

## Core Requirements (Static)
- Affichage scores en direct avec rafraîchissement automatique
- Classements par compétition
- Calendrier des matchs
- Multi-sports (football, basketball, volleyball, handball, billard, boxe, athlétisme)
- Interface admin sécurisée
- PWA pour accès mobile offline

## Implémenté (Mars 2026)
### Optimisations Production
- [x] Sécurisation README (clés API supprimées)
- [x] `.env.example` créé pour documentation
- [x] `.gitignore` amélioré
- [x] `robots.txt` avec règles SEO
- [x] `manifest.json` PWA complet
- [x] `sitemap.ts` dynamique
- [x] Métadonnées SEO enrichies (Open Graph, Twitter Cards)
- [x] Headers de sécurité (X-Frame-Options, etc.)
- [x] Page `error.tsx` (gestion d'erreurs gracieuse)
- [x] Page `loading.tsx` (skeleton)
- [x] Composant `Footer.tsx` réutilisable
- [x] Pages légales (`mentions-legales`, `confidentialite`)
- [x] Gestion d'erreurs robuste dans les requêtes Supabase
- [x] Fix bugs TypeScript (dashboardHref)
- [x] Suppression fichiers orphelins racine
- [x] Configuration images optimisée

## Backlog
### P0 (Critique)
- [ ] Obtenir nouvelles clés Supabase valides (anciennes expirées)
- [ ] Ajouter favicon.ico et og-image.png réels

### P1 (Important)  
- [ ] Implémenter icônes PWA PNG (actuellement SVG)
- [ ] Tests E2E avec Playwright
- [ ] Monitoring erreurs (Sentry)

### P2 (Nice-to-have)
- [ ] Notifications push pour scores live
- [ ] Mode offline complet avec cache
- [ ] Partage social (WhatsApp, Facebook)
- [ ] Dark/Light mode toggle
- [ ] Internationalisation (anglais)

## Notes Déploiement
- Variables d'environnement sur Vercel Dashboard
- Build automatique sur push `main`
- Domaine: cmr-sports-hub.vercel.app
