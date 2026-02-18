import type { ClassementView } from '@/lib/supabase'
import { getFormeArray } from '@/lib/utils'
import clsx from 'clsx'

interface StandingsTableProps {
  classement: ClassementView[]
  showForme?: boolean
}

const FORME_COLOR = {
  G: 'bg-green-500',
  N: 'bg-green-dim',
  P: 'bg-cmr-live',
}

const ZONE_CLASS: Record<string, string> = {
  qualif:     'zone-qualif',
  playoff:    'zone-playoff',
  barrage:    'zone-barrage',
  relegation: 'zone-relg',
}

const RANK_COLOR: Record<number, string> = {
  1: 'text-cmr-yellow',
  2: 'text-gray-300',
  3: 'text-amber-600',
}

export default function StandingsTable({ classement, showForme = true }: StandingsTableProps) {
  if (!classement.length) {
    return (
      <div className="card p-12 text-center">
        <div className="text-4xl mb-4">📊</div>
        <p className="text-green-muted font-oswald tracking-wider">Classement pas encore disponible</p>
        <p className="text-xs text-green-dim mt-2">Les matchs doivent être joués pour générer le classement</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="standings-table w-full border-collapse">
        <thead>
          <tr>
            <th className="w-12">#</th>
            <th className="text-left pl-2">Équipe</th>
            <th>J</th>
            <th>G</th>
            <th>N</th>
            <th>P</th>
            <th>Bp</th>
            <th>Bc</th>
            <th>+/-</th>
            <th className="text-cmr-yellow">PTS</th>
            {showForme && <th className="hidden md:table-cell">Forme</th>}
          </tr>
        </thead>
        <tbody>
          {classement.map((row) => {
            const forme     = getFormeArray(row.forme)
            const zoneClass = row.zone ? ZONE_CLASS[row.zone] ?? '' : ''
            const rankColor = RANK_COLOR[row.position] ?? 'text-green-muted'

            return (
              <tr key={row.id} className={clsx('transition-colors', zoneClass)}>
                {/* Rang */}
                <td>
                  <span className={clsx('font-oswald font-bold text-lg', rankColor)}>
                    {row.position}
                  </span>
                </td>

                {/* Équipe */}
                <td className="text-left">
                  <div className="flex items-center gap-2">
                    <ClubBadge sigle={row.club_sigle} logo={row.club_logo}/>
                    <div>
                      <div className="font-barlow-condensed font-semibold text-sm">{row.club_nom}</div>
                      <div className="text-xs text-green-dim hidden sm:block">{row.club_ville}</div>
                    </div>
                  </div>
                </td>

                {/* Stats */}
                <td className="text-green-muted">{row.matchs_joues}</td>
                <td className="text-green-400">{row.victoires}</td>
                <td className="text-green-muted">{row.nuls}</td>
                <td className="text-cmr-red">{row.defaites}</td>
                <td className="text-green-muted">{row.score_pour}</td>
                <td className="text-green-muted">{row.score_contre}</td>
                <td className={row.difference >= 0 ? 'text-green-400' : 'text-cmr-live'}>
                  {row.difference >= 0 ? '+' : ''}{row.difference}
                </td>

                {/* Points */}
                <td>
                  <span className="font-oswald font-bold text-xl text-cmr-yellow">{row.points_nets}</span>
                </td>

                {/* Forme */}
                {showForme && (
                  <td className="hidden md:table-cell">
                    <div className="flex gap-1 justify-center">
                      {forme.slice(-5).map((r, i) => (
                        <div key={i}
                             className={clsx(
                               'w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-oswald font-bold',
                               FORME_COLOR[r]
                             )}>
                          {r}
                        </div>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Légende zones */}
      <div className="flex flex-wrap gap-4 p-3 border-t border-border bg-deep text-xs text-green-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-green-500"/>Qualification nationale
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-cmr-yellow"/>Play-off
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-orange-500"/>Barrage
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-cmr-live"/>Relégation
        </span>
      </div>
    </div>
  )
}

function ClubBadge({ sigle, logo }: { sigle?: string; logo?: string }) {
  if (logo) {
    return <img src={logo} alt={sigle} className="w-7 h-7 rounded-full object-cover border border-border flex-shrink-0"/>
  }
  return (
    <div className="w-7 h-7 rounded-full bg-green-mid flex items-center justify-center text-xs font-oswald font-bold text-white flex-shrink-0 border border-white/10">
      {sigle?.slice(0,3) ?? '?'}
    </div>
  )
}
