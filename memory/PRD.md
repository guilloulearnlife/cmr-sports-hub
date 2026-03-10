# CMR Sports Hub - PRD (Product Requirements Document)

## Projet
**Nom**: CMR Sports Hub  
**URL Production**: https://cmr-sports-hub.vercel.app  
**Repository**: https://github.com/guilloulearnlife/cmr-sports-hub  
**Hébergement**: Vercel

## Stack Technique
- **Frontend**: Next.js 14 (App Router)
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Styling**: Tailwind CSS + CSS Custom
- **PWA**: next-pwa
- **Fonts**: Oswald, Barlow, Barlow Condensed

## User Personas
1. **Fan de sport camerounais** - Consulte scores, classements, calendriers
2. **Correspondant terrain** - Encode les scores en temps réel depuis mobile
3. **Admin régional** - Valide les scores, gère les compétitions de sa région
4. **Admin fédération** - Gère sa fédération (FECAFOOT, FECABASKET...)
5. **Super Admin** - Gestion complète de la plateforme

## Core Requirements (Static)
- Affichage scores en direct avec rafraîchissement automatique (15s)
- Classements par compétition avec zones colorées
- Calendrier des matchs
- Multi-sports (football, basketball, volleyball, handball, billard, boxe, athlétisme)
- Interface admin sécurisée avec rôles
- PWA pour accès mobile offline
- Design premium aux couleurs du Cameroun

## Implémenté (Mars 2026)

### Phase 1 - Optimisations Production
- [x] Sécurisation README (clés API supprimées)
- [x] `.env.example` créé pour documentation
- [x] `.gitignore` amélioré
- [x] `robots.txt` avec règles SEO
- [x] `manifest.json` PWA complet
- [x] `sitemap.ts` dynamique
- [x] Métadonnées SEO enrichies (Open Graph, Twitter Cards)
- [x] Headers de sécurité (X-Frame-Options, etc.)
- [x] Gestion d'erreurs robuste dans les requêtes Supabase

### Phase 2 - Refonte Design Complète
- [x] **Hero Section Immersive** - Gradient animé, orbes flottants, texte gradient
- [x] **Animations Premium** - fade-up, slide, scale, pulse, glow, float, shimmer
- [x] **Glassmorphism** - Effets glass sur navbar, cards, modals
- [x] **Nouvelle palette** - Couleurs plus profondes, accents dynamiques
- [x] **Cards avec glow effects** - Hover states, borders animés
- [x] **Badge LIVE pulsant** - Animation dramatique pour matchs en direct
- [x] **Score pulse animation** - Animation spectaculaire pour scores live
- [x] **Bottom Navigation Mobile** - Nav sticky avec badge live
- [x] **États vides engageants** - Animations Lottie-style, CTAs clairs
- [x] **Menu déroulant Sports** - Navigation enrichie avec tous les sports
- [x] **Footer premium** - 5 colonnes, réseaux sociaux, glassmorphism

### Phase 3 - Documentation Admin
- [x] Page `/admin-doc` avec documentation complète des rôles
- [x] Matrice des permissions par rôle
- [x] Workflow d'encodage des scores
- [x] Liste des fédérations et régions

### Phase 4 - Système de Favoris
- [x] Hook `useFavorites` avec localStorage
- [x] Composant `FavoriteButton` avec animation cœur
- [x] Composant `FavoritesBadge` avec compteur
- [x] Page `/mes-favoris` avec groupement par sport
- [x] Intégration dans Navbar (desktop + mobile)
- [x] Intégration dans BottomNav mobile
- [x] États vide et chargement stylisés

### Phase 5 - Système de Notifications Push
- [x] Hook `useNotifications` avec gestion permissions et préférences
- [x] Composant `NotificationSettings` avec toggles configurables
- [x] Composant `NotificationButton` pour navbar
- [x] Page `/notifications` avec documentation types d'alertes
- [x] Préférences : début match, buts, fin de match
- [x] Option "équipes favorites uniquement"
- [x] Bouton test notification
- [x] Gestion états : supported, denied, enabled
- [x] Intégration navbar et page d'accueil

### Pages Créées/Améliorées
- [x] `/` - Homepage avec hero immersif
- [x] `/live` - Page live avec empty state animé
- [x] `/admin-doc` - Documentation des rôles admin
- [x] `/mentions-legales` - Page légale
- [x] `/confidentialite` - Politique de confidentialité
- [x] `/not-found` - Page 404 stylisée
- [x] `/loading` - Loading state global
- [x] `/error` - Error boundary

### Composants Améliorés
- [x] `Navbar.tsx` - Menu dropdown, glass effect, scroll behavior
- [x] `Footer.tsx` - 5 colonnes, social links, fédérations
- [x] `MatchCard.tsx` - Glow effects, score pulse, progress bar live
- [x] `BottomNav.tsx` - Navigation mobile sticky
- [x] `loading.tsx` - Loader animé
- [x] `error.tsx` - Error boundary stylisé

## Système de Rôles (Recommandé)

| Rôle | Périmètre | Permissions Clés |
|------|-----------|------------------|
| super_admin | Global | Tout |
| admin_federation | Sa fédération | Compétitions, clubs, joueurs, validation |
| admin_competition | Sa compétition | Matchs, correspondants, validation |
| correspondant | Matchs assignés | Encodage uniquement |

## Backlog

### P0 (Critique)
- [ ] Renouveler clés Supabase (expirées)
- [ ] Générer favicon.ico et og-image.png réels (convertir SVG)

### P1 (Important)  
- [ ] Icônes PWA PNG (actuellement SVG)
- [ ] Tests E2E avec Playwright
- [ ] Monitoring erreurs (Sentry)
- [ ] Simplifier rôles (6 → 4)
- [ ] Filtrage par fédération dans admin

### P2 (Nice-to-have)
- [ ] Backend pour stocker subscriptions push (Supabase)
- [ ] Envoi notifications serveur lors d'événements
- [ ] Mode offline complet avec cache
- [ ] Partage social (WhatsApp, Facebook)
- [ ] Dark/Light mode toggle
- [ ] Countdown prochain match
- [ ] Activity feed temps réel
- [ ] Stats ticker défilant
- [ ] Filtrer matchs par équipes favorites
- [ ] Alertes personnalisées par équipe

## Notes Techniques

### Variables d'environnement requises
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### Déploiement
- Push vers GitHub → Build automatique Vercel
- Variables d'env sur Vercel Dashboard

### Fédérations Supportées
- FECAFOOT (Football)
- FECABASKET (Basketball)
- FECAVOLLEY (Volleyball)
- FECAHAND (Handball)
- FECABILLARD (Billard)
- FECABOXE (Boxe)
- FECATHLE (Athlétisme)

---
*Dernière mise à jour: Mars 2026*
