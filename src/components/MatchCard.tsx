import Link from 'next/link'
import { Clock, MapPin, Tv, ChevronRight } from 'lucide-react'
import type { MatchView } from '@/lib/supabase'
import { formatHeure, formatDateCourte, getSportConfig } from '@/lib/utils'
import FavoriteButton from '@/components/FavoriteButton'
import ShareButton, { getMatchShareData } from '@/components/ShareButton'

interface MatchCardProps {
  match: MatchView
  compact?: boolean
}

export default function MatchCard({ match, compact = false }: MatchCardProps) {
  const isLive = match.statut === 'en_direct'
  const isTermine = match.statut === 'termine'
  const isPlanifie = match.statut === 'planifie'
  const sport = getSportConfig(match.sport)

  return (
    <Link 
      href={`/match/${match.id}`} 
      data-testid={`match-card-${match.id}`}
      className={`
        card group block cursor-pointer overflow-hidden
        transition-all duration-500 hover:scale-[1.02]
        ${isLive ? 'card-live' : ''}
      `}
    >
      {/* Live glow effect */}
      {isLive && (
        <div className="absolute inset-0 bg-gradient-to-r from-accent-live/10 via-transparent to-accent-live/10 animate-pulse" />
      )}
      
      {/* Progress bar for live matches */}
      {isLive && (
        <div className="h-1 bg-bg-surface overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cmr-green via-cmr-gold to-cmr-red animate-shimmer"
            style={{ 
              width: `${Math.min(((match.minute_actuelle || 0) / 90) * 100, 100)}%`,
              backgroundSize: '200% 100%'
            }}
          />
        </div>
      )}

      <div className="relative p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">{sport.emoji}</span>
            <span className="text-xs text-text-muted font-oswald tracking-widest uppercase truncate max-w-[150px]">
              {match.competition_nom}
            </span>
            {match.journee && (
              <span className="text-xs text-text-muted">J{match.journee}</span>
            )}
          </div>

          {isLive && (
            <div className="badge-live">
              {match.minute_actuelle ? `${match.minute_actuelle}'` : 'LIVE'}
            </div>
          )}

          {isTermine && (
            <span className="text-xs text-text-muted font-oswald tracking-wider bg-bg-surface px-2 py-1 rounded">
              Terminé
            </span>
          )}

          {isPlanifie && match.date_match && (
            <span className="text-xs text-text-secondary font-oswald tracking-wider flex items-center gap-1 bg-bg-surface px-2 py-1 rounded">
              <Clock size={12} />
              {formatHeure(match.date_match)}
            </span>
          )}
        </div>

        {/* Teams and Score */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* Home Team */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <ClubBadge 
                sigle={match.dom_sigle} 
                logo={match.dom_logo} 
                isWinner={isTermine && (match.dom_score ?? 0) > (match.ext_score ?? 0)}
              />
              <div className="absolute -bottom-1 -right-1">
                <FavoriteButton 
                  team={{ 
                    id: match.dom_id, 
                    nom: match.dom_nom, 
                    sigle: match.dom_sigle,
                    logo: match.dom_logo,
                    sport: match.sport 
                  }} 
                  size="sm"
                />
              </div>
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-sm text-white truncate group-hover:text-cmr-gold transition-colors">
                {match.dom_nom}
              </div>
              {!compact && (
                <div className="text-xs text-text-muted">{match.dom_sigle}</div>
              )}
            </div>
          </div>

          {/* Score */}
          <div className="text-center px-2">
            {(isLive || isTermine) && match.dom_score !== null && match.ext_score !== null ? (
              <div>
                <div className={`
                  score-display text-3xl font-black leading-none
                  ${isLive ? 'score-live animate-score-pulse' : 'text-white'}
                `}>
                  {match.dom_score} <span className="text-text-muted mx-1">-</span> {match.ext_score}
                </div>
                {match.date_match && (
                  <div className="text-xs text-text-muted mt-2">
                    {formatDateCourte(match.date_match)}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="score-display text-2xl text-cmr-gold font-bold">VS</div>
                {match.date_match && (
                  <div className="text-xs text-text-muted mt-2">
                    {formatDateCourte(match.date_match)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Away Team */}
          <div className="flex items-center gap-3 flex-row-reverse text-right">
            <div className="relative">
              <ClubBadge 
                sigle={match.ext_sigle} 
                logo={match.ext_logo}
                isWinner={isTermine && (match.ext_score ?? 0) > (match.dom_score ?? 0)}
              />
              <div className="absolute -bottom-1 -left-1">
                <FavoriteButton 
                  team={{ 
                    id: match.ext_id, 
                    nom: match.ext_nom, 
                    sigle: match.ext_sigle,
                    logo: match.ext_logo,
                    sport: match.sport 
                  }} 
                  size="sm"
                />
              </div>
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-sm text-white truncate group-hover:text-cmr-gold transition-colors">
                {match.ext_nom}
              </div>
              {!compact && (
                <div className="text-xs text-text-muted">{match.ext_sigle}</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer info */}
        {!compact && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-subtle">
            <div className="flex items-center gap-4">
              {match.lieu_ville && (
                <span className="flex items-center gap-1.5 text-xs text-text-muted">
                  <MapPin size={12} />
                  {match.lieu_nom ?? match.lieu_ville}
                </span>
              )}
              {match.diffusion_tv && (
                <span className="flex items-center gap-1.5 text-xs text-text-muted">
                  <Tv size={12} />
                  {match.diffusion_tv}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <ShareButton 
                data={getMatchShareData(match)} 
                size="sm"
              />
              <ChevronRight size={16} className="text-text-muted group-hover:text-cmr-gold group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}

function ClubBadge({ 
  sigle, 
  logo, 
  isWinner = false 
}: { 
  sigle?: string
  logo?: string
  isWinner?: boolean
}) {
  if (logo) {
    return (
      <div className={`
        relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0
        border-2 transition-all duration-300
        ${isWinner ? 'border-cmr-gold shadow-glow' : 'border-border-subtle'}
      `}>
        <img src={logo} alt={sigle} className="w-full h-full object-cover" />
        {isWinner && (
          <div className="absolute inset-0 bg-cmr-gold/10" />
        )}
      </div>
    )
  }
  
  return (
    <div className={`
      w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
      text-xs font-oswald font-bold text-white
      transition-all duration-300
      ${isWinner 
        ? 'bg-gradient-to-br from-cmr-gold to-cmr-gold-dim border-2 border-cmr-gold shadow-glow' 
        : 'bg-gradient-to-br from-bg-surface to-bg-card border border-border-subtle'
      }
    `}>
      {sigle?.slice(0, 3) ?? '?'}
    </div>
  )
}
