import type { SportType, MatchStatus } from './supabase'

export const SPORT_CONFIG: Record<SportType, {
  label:    string
  emoji:    string
  couleur:  string
  slug:     string
}> = {
  football:   { label: 'Football',    emoji: '⚽', couleur: '#006233', slug: 'football'   },
  basketball: { label: 'Basketball',  emoji: '🏀', couleur: '#1a237e', slug: 'basketball' },
  volleyball: { label: 'Volleyball',  emoji: '🏐', couleur: '#b71c1c', slug: 'volleyball' },
  handball:   { label: 'Handball',    emoji: '🤾', couleur: '#1b5e20', slug: 'handball'   },
  billard:    { label: 'Billard',     emoji: '🎱', couleur: '#1a4a2e', slug: 'billard'    },
  cyclisme:   { label: 'Cyclisme',    emoji: '🚴', couleur: '#263238', slug: 'cyclisme'   },
  boxe:       { label: 'Boxe',        emoji: '🥊', couleur: '#880e4f', slug: 'boxe'       },
  athletisme: { label: 'Athlétisme',  emoji: '🏃', couleur: '#e65100', slug: 'athletisme' },
  judo:       { label: 'Judo',        emoji: '🥋', couleur: '#212121', slug: 'judo'       },
  sambo:      { label: 'Sambo',       emoji: '🤼', couleur: '#37474f', slug: 'sambo'      },
  natation:   { label: 'Natation',    emoji: '🏊', couleur: '#0277bd', slug: 'natation'   },
  autre:      { label: 'Autre',       emoji: '🏅', couleur: '#546e7a', slug: 'autre'      },
}

export const MATCH_STATUS_CONFIG: Record<MatchStatus, {
  label:   string
  couleur: string
  bg:      string
}> = {
  planifie:   { label: 'À venir',    couleur: '#7a9c80', bg: 'rgba(122,156,128,.1)' },
  en_direct:  { label: 'En direct',  couleur: '#e74c3c', bg: 'rgba(231,76,60,.15)'  },
  termine:    { label: 'Terminé',    couleur: '#4a6e52', bg: 'rgba(74,110,82,.1)'   },
  reporte:    { label: 'Reporté',    couleur: '#f5c518', bg: 'rgba(245,197,24,.1)'  },
  annule:     { label: 'Annulé',     couleur: '#c0392b', bg: 'rgba(192,57,43,.1)'   },
  suspendu:   { label: 'Suspendu',   couleur: '#f5c518', bg: 'rgba(245,197,24,.1)'  },
}

export const ZONE_CONFIG = {
  qualif:     { label: 'Qualification',  couleur: '#27ae60', bg: 'rgba(39,174,96,.12)'   },
  playoff:    { label: 'Play-off',       couleur: '#f5c518', bg: 'rgba(245,197,24,.08)'  },
  barrage:    { label: 'Barrage',        couleur: '#e67e22', bg: 'rgba(230,126,34,.1)'   },
  relegation: { label: 'Relégation',     couleur: '#e74c3c', bg: 'rgba(231,76,60,.12)'   },
}

export function formatDate(dateStr: string, opts?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Africa/Douala',
    ...opts,
  }).format(new Date(dateStr))
}

export function formatHeure(dateStr: string) {
  return formatDate(dateStr, { hour: '2-digit', minute: '2-digit' })
}

export function formatDateCourte(dateStr: string) {
  return formatDate(dateStr, { weekday: 'short', day: 'numeric', month: 'short' })
}

export function formatDateLongue(dateStr: string) {
  return formatDate(dateStr, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export function getSportConfig(sport: SportType) {
  return SPORT_CONFIG[sport] ?? SPORT_CONFIG.autre
}

export function getInitiales(nom: string) {
  return nom.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase()
}

export function getFormeArray(forme: string): Array<'G'|'N'|'P'> {
  return (forme || '').split('').filter(c => ['G','N','P'].includes(c)) as Array<'G'|'N'|'P'>
}
