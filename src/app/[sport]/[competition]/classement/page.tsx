import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import StandingsTable from '@/components/StandingsTable'
import { supabase } from '@/lib/supabase'
import { getSportConfig } from '@/lib/utils'
import type { SportType, ClassementView } from '@/lib/supabase'

export const revalidate = 60
export const dynamic = "force-dynamic"
export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ sport: string; competition: string }>
}

export default async function ClassementPage({ params }: Props) {
  const { sport, competition } = await params

  // Récupérer la compétition
  const { data: comp } = await supabase
    .from('competitions')
    .select('*, federations(*)')
    .eq('slug', competition)
    .single()

  if (!comp) notFound()

  // Récupérer le classement
  const { data: classement } = await supabase
    .from('v_classements')
    .select('*')
    .eq('competition_id', comp.id)
    .order('position')

  // Récupérer les journées disponibles
  const { data: journees } = await supabase
    .from('classements')
    .select('journee')
    .eq('competition_id', comp.id)
    .order('journee', { ascending: false })

  const journeesUniques = [...new Set(journees?.map(j => j.journee) ?? [])]
  const derniereJournee = journeesUniques[0]

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
          <span className="text-white">Classement</span>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <span className="text-3xl">{cfg.emoji}</span>
            <div>
              <h1 className="font-oswald font-bold text-3xl tracking-widest text-cmr-yellow">
                CLASSEMENT
              </h1>
              <p className="text-green-muted font-oswald tracking-wider mt-1">{comp.nom}</p>
              {derniereJournee && (
                <p className="text-xs text-green-dim mt-1">Journée {derniereJournee} / {comp.nb_journees ?? '?'}</p>
              )}
            </div>
          </div>

          {/* Navigation journées */}
          {journeesUniques.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-green-muted font-oswald tracking-wider">Journée :</span>
              <div className="flex gap-1 flex-wrap">
                {journeesUniques.slice(0, 10).map(j => (
                  <Link key={j}
                        href={`/${sport}/${competition}/classement?journee=${j}`}
                        className={`w-8 h-8 rounded flex items-center justify-center text-xs font-oswald transition-all
                          ${j === derniereJournee
                            ? 'bg-cmr-yellow text-dark font-bold'
                            : 'bg-card border border-border text-green-muted hover:border-cmr-yellow hover:text-cmr-yellow'
                          }`}>
                    {j}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Table classement */}
        <StandingsTable classement={(classement ?? []) as ClassementView[]} showForme={true}/>

        {/* Info saison */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Type', val: comp.type },
            { label: 'Genre', val: comp.genre },
            { label: 'Journées', val: `${derniereJournee ?? 0} / ${comp.nb_journees ?? '?'}` },
            { label: 'Sponsor', val: comp.sponsor_principal ?? '—' },
          ].map(({ label, val }) => (
            <div key={label} className="card p-3 text-center">
              <div className="text-xs text-green-dim font-oswald tracking-wider uppercase">{label}</div>
              <div className="font-oswald font-semibold mt-1 capitalize text-sm">{val}</div>
            </div>
          ))}
        </div>

        {/* Lien vers le calendrier */}
        <div className="flex justify-center mt-8">
          <Link href={`/${sport}/${competition}/calendrier`}
                className="btn-outline flex items-center gap-2">
            📅 Voir le calendrier complet
          </Link>
        </div>
      </div>
    </div>
  )
}
