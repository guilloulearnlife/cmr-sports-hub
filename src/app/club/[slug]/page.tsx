import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import MatchCard from '@/components/MatchCard'
import ClubLogo from '@/components/ClubLogo'
import { supabase } from '@/lib/supabase'
import { getSportConfig } from '@/lib/utils'
import type { SportType, MatchView } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ClubPage({ params }: Props) {
  const { slug } = await params

  const { data: club } = await supabase
    .from('clubs')
    .select('*, lieux(*), regions(*)')
    .eq('slug', slug)
    .single()

  if (!club) notFound()

  const cfg = getSportConfig(club.sport as SportType)

  // Derniers matchs
  const { data: matchs } = await supabase
    .from('v_matchs')
    .select('*')
    .or(`club_domicile_id.eq.${club.id},club_exterieur_id.eq.${club.id}`)
    .eq('statut', 'termine')
    .order('date_match', { ascending: false })
    .limit(5)

  // Position au classement
  const { data: classement } = await supabase
    .from('v_classements')
    .select('*')
    .eq('club_id', club.id)
    .single()

  const derniers = (matchs ?? []) as MatchView[]

  return (
    <div className="min-h-screen bg-dark">
      <Navbar/>

      {/* Hero */}
      <section className="border-b border-border py-10"
               style={{ background: `linear-gradient(135deg, ${club.couleur_maillot_dom ?? cfg.couleur}33 0%, #0a100d 70%)` }}>
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="flex items-center gap-6">
            <ClubLogo
              nom={club.nom}
              sigle={club.sigle}
              couleur={club.couleur_maillot_dom}
              logo_url={club.logo_url}
              size={80}
            />
            <div>
              <div className="text-xs font-oswald tracking-widest text-green-muted uppercase mb-1">
                {cfg.emoji} {cfg.label}
              </div>
              <h1 className="font-oswald font-bold text-4xl tracking-widest text-white">{club.nom}</h1>
              <div className="flex items-center gap-4 mt-2 text-green-muted text-sm">
                {club.ville && <span>📍 {club.ville}</span>}
                {club.date_fondation && <span>🗓️ Fondé en {new Date(club.date_fondation).getFullYear()}</span>}
                {club.lieux && <span>🏟️ {club.lieux.nom}</span>}
              </div>
            </div>
          </div>

          {/* Stats rapides */}
          {classement && (
            <div className="flex gap-6 mt-6">
              {[
                { label: 'Position', value: `${classement.position}e` },
                { label: 'Points', value: classement.points },
                { label: 'Victoires', value: classement.victoires },
                { label: 'Nuls', value: classement.nuls },
                { label: 'Défaites', value: classement.defaites },
                { label: 'Buts', value: `${classement.buts_pour}-${classement.buts_contre}` },
              ].map((s, i) => (
                <div key={i} className="card px-4 py-3 text-center">
                  <div className="font-oswald font-bold text-xl text-cmr-yellow">{s.value}</div>
                  <div className="text-xs text-green-muted">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="max-w-screen-2xl mx-auto px-4 py-8 grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Derniers matchs */}
        <div className="xl:col-span-2">
          <h2 className="font-oswald text-xl tracking-widest text-white mb-4">Derniers Matchs</h2>
          {derniers.length > 0 ? (
            <div className="space-y-3">
              {derniers.map(m => <MatchCard key={m.id} match={m}/>)}
            </div>
          ) : (
            <div className="card p-8 text-center text-green-muted font-oswald">
              Aucun match joué pour l'instant
            </div>
          )}
        </div>

        {/* Infos club */}
        <div className="space-y-4">
          <h2 className="font-oswald text-xl tracking-widest text-white mb-4">Informations</h2>
          <div className="card p-4 space-y-3">
            {[
              { label: 'Nom complet', value: club.nom },
              { label: 'Sigle', value: club.sigle },
              { label: 'Ville', value: club.ville },
              { label: 'Sport', value: cfg.label },
              { label: 'Stade', value: club.lieux?.nom },
              { label: 'Capacité', value: club.lieux?.capacite ? `${club.lieux.capacite.toLocaleString()} places` : null },
              { label: 'Fondation', value: club.date_fondation ? new Date(club.date_fondation).getFullYear() : null },
            ].filter(i => i.value).map((info, i) => (
              <div key={i} className="flex justify-between text-sm border-b border-border pb-2">
                <span className="text-green-muted font-oswald tracking-wide">{info.label}</span>
                <span className="text-white">{info.value}</span>
              </div>
            ))}
          </div>

          <Link href={`/${club.sport}`}
                className="btn-outline w-full text-center block font-oswald tracking-wider text-sm">
            ← Retour {cfg.label}
          </Link>
        </div>
      </div>
    </div>
  )
}
