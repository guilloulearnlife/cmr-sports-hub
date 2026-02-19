import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import MatchCard from '@/components/MatchCard'
import { supabase } from '@/lib/supabase'
import { getSportConfig } from '@/lib/utils'
import type { SportType, MatchView } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ sport: string; competition: string }>
}

export default async function CompetitionPage({ params }: Props) {
  const { sport, competition } = await params

  const { data: comp } = await supabase
    .from('competitions')
    .select('*, federations(*)')
    .eq('slug', competition)
    .single()

  if (!comp) notFound()

  const { data: matchs } = await supabase
    .from('v_matchs')
    .select('*')
    .eq('competition_id', comp.id)
    .order('date_match', { ascending: false })
    .limit(10)

  const cfg = getSportConfig(sport as SportType)
  const all = (matchs ?? []) as MatchView[]
  const live     = all.filter(m => m.statut === 'en_direct')
  const recents  = all.filter(m => m.statut === 'termine').slice(0, 6)
  const prochains = all.filter(m => m.statut === 'planifie').slice(0, 6)

  return (
    <div className="min-h-screen bg-dark">
      <Navbar/>

      {/* Breadcrumb */}
      <div className="border-b border-border bg-deep">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center gap-2 text-xs text-green-muted font-oswald tracking-wider">
          <Link href="/" className="hover:text-cmr-yellow">Accueil</Link>
          <span>/</span>
          <Link href={`/${sport}`} className="hover:text-cmr-yellow">{cfg.label}</Link>
          <span>/</span>
          <span className="text-white">{comp.nom_court ?? comp.nom}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="border-b border-border py-8"
               style={{ background: `linear-gradient(135deg, ${cfg.couleur}22 0%, #0a100d 70%)` }}>
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{cfg.emoji}</span>
            <div>
              <h1 className="font-oswald font-bold text-3xl tracking-widest text-cmr-yellow">{comp.nom}</h1>
              <p className="text-green-muted text-sm mt-1 capitalize">{comp.genre} · {comp.type} · {comp.statut}</p>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Link href={`/${sport}/${competition}/classement`} className="btn-primary text-sm">📊 Classement</Link>
            <Link href={`/${sport}/${competition}/calendrier`} className="btn-outline text-sm">📅 Calendrier complet</Link>
          </div>
        </div>
      </section>

      <div className="max-w-screen-2xl mx-auto px-4 py-8 space-y-8">
        {live.length > 0 && (
          <section>
            <h2 className="font-oswald text-xl tracking-widest text-white mb-4 flex items-center gap-2">
              <span className="badge-live">LIVE</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {live.map(m => <MatchCard key={m.id} match={m}/>)}
            </div>
          </section>
        )}

        {recents.length > 0 && (
          <section>
            <h2 className="font-oswald text-xl tracking-widest text-white mb-4">Derniers Résultats</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {recents.map(m => <MatchCard key={m.id} match={m}/>)}
            </div>
          </section>
        )}

        {prochains.length > 0 && (
          <section>
            <h2 className="font-oswald text-xl tracking-widest text-white mb-4">Prochains Matchs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {prochains.map(m => <MatchCard key={m.id} match={m}/>)}
            </div>
          </section>
        )}

        {!live.length && !recents.length && !prochains.length && (
          <div className="card p-12 text-center">
            <div className="text-4xl mb-4">{cfg.emoji}</div>
            <p className="text-green-muted font-oswald tracking-wider">Aucun match pour cette compétition</p>
          </div>
        )}
      </div>
    </div>
  )
}
