import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import MatchCard from '@/components/MatchCard'
import { supabase } from '@/lib/supabase'
import { getSportConfig, formatDateLongue } from '@/lib/utils'
import type { SportType, MatchView } from '@/lib/supabase'

export const revalidate = 60

interface Props {
  params: Promise<{ sport: string; competition: string }>
}

export default async function CalendrierPage({ params }: Props) {
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
    .order('journee')
    .order('date_match')

  const allMatchs = (matchs ?? []) as MatchView[]

  // Grouper par journée
  const parJournee = allMatchs.reduce<Record<number | string, MatchView[]>>((acc, m) => {
    const key = m.journee ?? 'Sans journée'
    if (!acc[key]) acc[key] = []
    acc[key].push(m)
    return acc
  }, {})

  const cfg = getSportConfig(sport as SportType)

  return (
    <div className="min-h-screen bg-dark">
      <Navbar/>

      {/* Breadcrumb */}
      <div className="border-b border-border bg-deep">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center gap-2 text-xs text-green-muted font-oswald tracking-wider">
          <Link href="/" className="hover:text-cmr-yellow">Accueil</Link>
          <span>/</span>
          <Link href={`/${sport}`} className="hover:text-cmr-yellow capitalize">{cfg.label}</Link>
          <span>/</span>
          <Link href={`/${sport}/${competition}`} className="hover:text-cmr-yellow">{comp.nom_court ?? comp.nom}</Link>
          <span>/</span>
          <span className="text-white">Calendrier</span>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <span className="text-3xl">{cfg.emoji}</span>
            <div>
              <h1 className="font-oswald font-bold text-3xl tracking-widest text-cmr-yellow">CALENDRIER</h1>
              <p className="text-green-muted font-oswald tracking-wider mt-1">{comp.nom}</p>
              <p className="text-xs text-green-dim mt-1">{allMatchs.length} matchs au total</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link href={`/${sport}/${competition}/classement`} className="btn-outline text-sm">
              📊 Classement
            </Link>
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Joués',   val: allMatchs.filter(m => m.statut === 'termine').length,   color: 'text-green-400' },
            { label: 'En cours', val: allMatchs.filter(m => m.statut === 'en_direct').length, color: 'text-cmr-live' },
            { label: 'À venir', val: allMatchs.filter(m => m.statut === 'planifie').length,  color: 'text-cmr-yellow' },
          ].map(s => (
            <div key={s.label} className="card p-4 text-center">
              <div className={`font-oswald font-bold text-3xl ${s.color}`}>{s.val}</div>
              <div className="text-xs text-green-muted font-oswald tracking-wider mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Matchs par journée */}
        {Object.keys(parJournee).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(parJournee).map(([journee, matchsList]) => {
              const firstDate = matchsList.find(m => m.date_match)?.date_match
              const joues     = matchsList.filter(m => m.statut === 'termine').length
              const total     = matchsList.length

              return (
                <section key={journee}>
                  {/* Header journée */}
                  <div className="flex items-center gap-4 mb-3 pb-3 border-b border-border">
                    <div className="bg-cmr-yellow text-dark font-oswald font-bold text-sm px-3 py-1.5 rounded tracking-widest">
                      {typeof journee === 'number' ? `J${journee}` : journee}
                    </div>
                    <div>
                      {firstDate && (
                        <div className="font-oswald tracking-wider text-sm text-white">
                          {formatDateLongue(firstDate)}
                        </div>
                      )}
                      <div className="text-xs text-green-dim">{joues}/{total} matchs joués</div>
                    </div>

                    {/* Barre progression */}
                    <div className="ml-auto flex items-center gap-2 hidden sm:flex">
                      <div className="w-24 h-1.5 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-cmr-yellow rounded-full transition-all"
                             style={{ width: `${total > 0 ? (joues/total)*100 : 0}%` }}/>
                      </div>
                      <span className="text-xs text-green-dim font-oswald">{Math.round(total > 0 ? (joues/total)*100 : 0)}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {matchsList.map(m => <MatchCard key={m.id} match={m}/>)}
                  </div>
                </section>
              )
            })}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <div className="text-4xl mb-4">📅</div>
            <p className="text-green-muted font-oswald tracking-wider">Aucun match planifié pour l'instant</p>
            <Link href="/admin" className="btn-primary inline-flex mt-4">Ajouter des matchs →</Link>
          </div>
        )}
      </div>
    </div>
  )
}
