
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

const SPORT_CONFIG: Record<string, { label: string; emoji: string }> = {
  football: { label: 'Football', emoji: '⚽' },
  basketball: { label: 'Basketball', emoji: '🏀' },
  volleyball: { label: 'Volleyball', emoji: '🏐' },
  handball: { label: 'Handball', emoji: '🤾' },
  billard: { label: 'Billard', emoji: '🎱' },
  boxe: { label: 'Boxe', emoji: '🥊' },
  athletisme: { label: 'Athlétisme', emoji: '🏃' },
}

export const dynamic = 'force-dynamic'

export default async function CompetitionsPage() {
  const { data: competitions } = await supabase
    .from('competitions')
    .select('id, nom, sport, slug, statut, nb_journees, saison, type, genre')
    .order('sport')
    .order('nom')

  // Grouper par sport
  const bySport: Record<string, any[]> = {}
  for (const c of competitions ?? []) {
    if (!bySport[c.sport]) bySport[c.sport] = []
    bySport[c.sport].push(c)
  }

  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-screen-lg mx-auto px-4 py-10">
        <h1 className="font-oswald font-bold text-4xl text-cmr-yellow tracking-widest mb-2">
          🏆 COMPÉTITIONS
        </h1>
        <p className="text-green-muted text-sm mb-10">Toutes les compétitions sportives camerounaises</p>

        {Object.entries(bySport).map(([sport, comps]) => {
          const cfg = SPORT_CONFIG[sport] ?? { label: sport, emoji: '🏅' }
          return (
            <div key={sport} className="mb-10">
              <h2 className="font-oswald font-bold text-2xl text-white tracking-wider mb-4 flex items-center gap-2">
                {cfg.emoji} {cfg.label}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {comps.map(c => (
                  <Link key={c.id} href={`/${sport}/${c.slug}`}
                        className="card p-5 hover:border-cmr-yellow transition-all hover:scale-105">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="font-oswald font-bold text-white tracking-wide">{c.nom}</div>
                      <span className={`text-xs font-oswald px-2 py-0.5 rounded-full border ${
                        c.statut === 'en_cours' ? 'border-green-500 text-green-400' :
                        c.statut === 'planifie' ? 'border-blue-500 text-blue-400' :
                        'border-gray-500 text-gray-400'
                      }`}>
                        {c.statut === 'en_cours' ? '🟢 En cours' : c.statut === 'planifie' ? '📅 Planifié' : '✅ Terminé'}
                      </span>
                    </div>
                    <div className="text-xs text-green-muted font-oswald">
                      {c.type} · {c.genre} · {c.saison}
                    </div>
                    <div className="text-xs text-green-dim mt-1">{c.nb_journees} journées</div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
