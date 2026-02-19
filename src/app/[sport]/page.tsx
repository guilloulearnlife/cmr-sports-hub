import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import MatchCard from '@/components/MatchCard'
import StandingsTable from '@/components/StandingsTable'
import { supabase } from '@/lib/supabase'
import { getSportConfig } from '@/lib/utils'
import type { SportType, MatchView, ClassementView, Competition } from '@/lib/supabase'

export const revalidate = 60
export const dynamic = 'force-dynamic'

const SPORTS_VALIDES: SportType[] = [
  'football','basketball','volleyball','handball','billard','cyclisme','boxe','athletisme','judo','sambo'
]

interface Props {
  params: Promise<{ sport: string }>
}

async function getPageData(sport: SportType) {
  const [compsRes, matchsRes] = await Promise.all([
    supabase.from('competitions').select('*, federations(*)').eq('sport', sport).eq('statut', 'en_cours'),
    supabase.from('v_matchs').select('*').eq('sport', sport).order('date_match', { ascending: false }).limit(20),
  ])
  const competitions = compsRes.data ?? []
  const matchs = matchsRes.data ?? []
  const champ = competitions.find((c: any) => c.type === 'championnat')
  let classement: ClassementView[] = []
  if (champ) {
    const { data } = await supabase
      .from('v_classements')
      .select('*')
      .eq('competition_id', champ.id)
      .order('position')
    classement = data ?? []
  }
  return { competitions, matchs: matchs as MatchView[], classement, champ }
}

export default async function SportPage({ params }: Props) {
  const { sport } = await params
  if (!SPORTS_VALIDES.includes(sport as SportType)) notFound()
  const sportType = sport as SportType
  const cfg = getSportConfig(sportType)
  const { competitions, matchs, classement, champ } = await getPageData(sportType)
  const live      = matchs.filter(m => m.statut === 'en_direct')
  const recents   = matchs.filter(m => m.statut === 'termine').slice(0, 6)
  const prochains = matchs.filter(m => m.statut === 'planifie').slice(0, 6)

  return (
    <div className="min-h-screen bg-dark">
      <Navbar/>
      <section className="border-b border-border py-8"
               style={{ background: `linear-gradient(135deg, ${cfg.couleur}22 0%, #0a100d 70%)` }}>
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{cfg.emoji}</div>
            <div>
              <div className="text-xs font-oswald tracking-widest text-green-muted uppercase">CMR Sports Hub</div>
              <h1 className="font-oswald font-bold text-4xl tracking-widest text-cmr-yellow">{cfg.label.toUpperCase()}</h1>
              <div className="text-green-muted text-sm mt-1">{competitions.length} compétition{competitions.length !== 1 ? 's' : ''} active{competitions.length !== 1 ? 's' : ''} — Saison 2024-2025</div>
            </div>
          </div>
          {competitions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {competitions.map((c: any) => (
                <Link key={c.id} href={`/${sport}/${c.slug}`}
                      className="px-4 py-2 rounded border border-border bg-card hover:border-cmr-yellow hover:text-cmr-yellow font-oswald text-sm tracking-wider text-green-muted transition-all">
                  {c.nom_court ?? c.nom}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            {live.length > 0 && (
              <section>
                <h2 className="font-oswald text-xl tracking-widest text-white mb-4 flex items-center gap-2">
                  <span className="badge-live">LIVE</span> En Direct
                </h2>
                <div className="space-y-3">{live.map(m => <MatchCard key={m.id} match={m}/>)}</div>
              </section>
            )}
            {recents.length > 0 && (
              <section>
                <h2 className="font-oswald text-xl tracking-widest text-white mb-4">Derniers Résultats</h2>
                <div className="space-y-2">{recents.map(m => <MatchCard key={m.id} match={m} compact/>)}</div>
              </section>
            )}
            {prochains.length > 0 && (
              <section>
                <h2 className="font-oswald text-xl tracking-widest text-white mb-4">Prochains Matchs</h2>
                <div className="space-y-2">{prochains.map(m => <MatchCard key={m.id} match={m} compact/>)}</div>
              </section>
            )}
            {!live.length && !recents.length && !prochains.length && (
              <div className="card p-12 text-center">
                <div className="text-4xl mb-4">{cfg.emoji}</div>
                <p className="text-green-muted font-oswald tracking-wider">Aucun match enregistré pour l'instant</p>
                <Link href="/admin" className="btn-primary inline-flex mt-4">Ajouter des matchs</Link>
              </div>
            )}
          </div>
          <div className="space-y-6">
            {champ && classement.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-oswald text-lg tracking-widest text-cmr-yellow">
                    Classement · {(champ as any).nom_court}
                  </h2>
                  <Link href={`/${sport}/${(champ as any).slug}/classement`}
                        className="text-xs text-green-muted hover:text-cmr-yellow font-oswald tracking-wider transition-colors">
                    Complet →
                  </Link>
                </div>
                <StandingsTable classement={classement} showForme={false}/>
              </section>
            )}
            <section>
              <h2 className="font-oswald text-lg tracking-widest text-white mb-3">Compétitions</h2>
              <div className="space-y-2">
                {competitions.map((c: any) => (
                  <Link key={c.id} href={`/${sport}/${c.slug}`}
                        className="card p-3 flex items-center justify-between hover:border-green-mid transition-all group">
                    <div>
                      <div className="font-oswald text-sm tracking-wide">{c.nom}</div>
                      <div className="text-xs text-green-muted capitalize">{c.genre} · {c.type}</div>
                    </div>
                    <div className="text-xs text-green-dim group-hover:text-cmr-yellow transition-colors font-oswald">→</div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
