import Link from 'next/link'
import { Clock, MapPin, Tv } from 'lucide-react'
import type { MatchView } from '@/lib/supabase'
import { formatHeure, formatDateCourte, getSportConfig } from '@/lib/utils'
import clsx from 'clsx'

interface MatchCardProps {
  match:    MatchView
  compact?: boolean
}

export default function MatchCard({ match, compact = false }: MatchCardProps) {
  const isLive    = match.statut === 'en_direct'
  const isTermine = match.statut === 'termine'
  const isPlanifie = match.statut === 'planifie'
  const sport     = getSportConfig(match.sport)

  return (
    <Link href={`/match/${match.id}`} className={clsx(
      'card transition-all duration-200 hover:border-green-mid overflow-hidden group block cursor-pointer',
      isLive && 'border-cmr-live/40 hover:border-cmr-live/70',
    )}>
      {/* Barre live */}
      {isLive && <div className="h-0.5 bg-cmr-live animate-pulse-live"/>}

      <div className="p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm">{sport.emoji}</span>
            <span className="font-oswald text-xs tracking-widest text-green-muted uppercase">
              {match.competition_nom}
              {match.journee && ` · J${match.journee}`}
            </span>
            <span className={clsx(
              'text-xs px-2 py-0.5 rounded font-oswald tracking-wider',
              match.est_aller ? 'bg-green-mid/30 text-green-muted' : 'bg-cmr-yellow/10 text-cmr-yellow'
            )}>
              {match.est_aller ? 'Aller' : 'Retour'}
            </span>
          </div>

          {isLive && (
            <span className="badge-live text-xs">
              {match.minute_actuelle ? `${match.minute_actuelle}'` : 'LIVE'}
            </span>
          )}

          {isTermine && (
            <span className="text-xs text-green-dim font-oswald tracking-wider">Terminé</span>
          )}

          {isPlanifie && match.date_match && (
            <span className="text-xs text-green-muted font-oswald tracking-wider flex items-center gap-1">
              <Clock size={11}/>{formatHeure(match.date_match)}
            </span>
          )}
        </div>

        {/* Score row */}
        <div className="grid grid-cols-3 items-center gap-2">
          {/* Équipe Domicile */}
          <div className="flex items-center gap-2">
            <ClubBadge sigle={match.dom_sigle} logo={match.dom_logo} color="#1a6e3a"/>
            <div>
              <div className="font-barlow-condensed font-semibold text-sm leading-tight">
                {match.dom_nom}
              </div>
              {!compact && (
                <div className="text-xs text-green-muted">{match.dom_sigle}</div>
              )}
            </div>
          </div>

          {/* Score / VS */}
          <div className="text-center">
            {(isLive || isTermine) && match.dom_score !== null && match.ext_score !== null ? (
              <div>
                <div className={clsx(
                  'score-display text-2xl leading-none',
                  isLive ? 'text-cmr-live' : 'text-white'
                )}>
                  {match.dom_score} — {match.ext_score}
                </div>
                {match.date_match && (
                  <div className="text-xs text-green-dim mt-1">{formatDateCourte(match.date_match)}</div>
                )}
              </div>
            ) : (
              <div>
                <div className="score-display text-xl text-green-muted">VS</div>
                {match.date_match && (
                  <div className="text-xs text-green-muted mt-1">
                    {formatDateCourte(match.date_match)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Équipe Extérieur */}
          <div className="flex items-center gap-2 flex-row-reverse text-right">
            <ClubBadge sigle={match.ext_sigle} logo={match.ext_logo} color="#b03a2e"/>
            <div>
              <div className="font-barlow-condensed font-semibold text-sm leading-tight">
                {match.ext_nom}
              </div>
              {!compact && (
                <div className="text-xs text-green-muted">{match.ext_sigle}</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer infos */}
        {!compact && (match.lieu_ville || match.diffusion_tv) && (
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
            {match.lieu_ville && (
              <span className="flex items-center gap-1 text-xs text-green-dim">
                <MapPin size={11}/>
                {match.lieu_nom ?? match.lieu_ville}
              </span>
            )}
            {match.diffusion_tv && (
              <span className="flex items-center gap-1 text-xs text-green-dim">
                <Tv size={11}/>{match.diffusion_tv}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}

function ClubBadge({ sigle, logo, color }: { sigle?: string; logo?: string; color: string }) {
  if (logo) {
    return (
      <img src={logo} alt={sigle} className="w-8 h-8 rounded-full object-cover border border-border flex-shrink-0"/>
    )
  }
  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-oswald font-bold text-white flex-shrink-0 border border-white/10"
         style={{ background: color }}>
      {sigle?.slice(0,3) ?? '?'}
    </div>
  )
}
