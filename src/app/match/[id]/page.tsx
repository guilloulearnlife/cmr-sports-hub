
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'
import { Clock, MapPin, Tv, Users, ArrowLeft, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: match } = await supabase
    .from('v_matchs')
    .select('*')
    .eq('id', id)
    .single()

  if (!match) notFound()

  const isLive = match.statut === 'en_direct'
  const isTermine = match.statut === 'termine'

  return (
    <div className="min-h-screen bg-dark">
      <Navbar/>
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Retour */}
        <Link href="/live" className="flex items-center gap-2 text-green-muted text-sm font-oswald tracking-wider mb-6 hover:text-cmr-yellow transition-colors">
          <ArrowLeft size={16}/> RETOUR
        </Link>

        {/* Header compétition */}
        <div className="text-center mb-6">
          <div className="text-xs text-green-muted font-oswald tracking-widest uppercase mb-1">
            {match.competition_nom} · Journée {match.journee} · {match.est_aller ? 'Aller' : 'Retour'}
          </div>
          {isLive && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="badge-live">EN DIRECT</span>
              {match.minute_actuelle && (
                <span className="text-cmr-live font-oswald font-bold text-lg">{match.minute_actuelle}'</span>
              )}
            </div>
          )}
          {isTermine && (
            <span className="text-xs text-green-dim font-oswald tracking-wider">Match terminé</span>
          )}
          {!isLive && !isTermine && match.date_match && (
            <div className="flex items-center justify-center gap-2 text-green-muted text-sm mt-2">
              <Calendar size={14}/>
              {new Date(match.date_match).toLocaleDateString('fr-FR', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Douala'
              })}
            </div>
          )}
        </div>

        {/* Score principal */}
        <div className="card p-8 mb-6">
          {isLive && <div className="h-1 bg-cmr-live animate-pulse-live mb-6 rounded"/>}
          <div className="grid grid-cols-3 items-center gap-4">
            {/* Dom */}
            <div className="text-center">
              <ClubBadgeLarge nom={match.dom_nom} sigle={match.dom_sigle} logo={match.dom_logo} color="#1a6e3a"/>
            </div>

            {/* Score */}
            <div className="text-center">
              {(isLive || isTermine) && match.dom_score !== null ? (
                <div className={`font-oswald font-bold text-6xl ${isLive ? 'text-cmr-live' : 'text-white'}`}>
                  {match.dom_score} — {match.ext_score}
                </div>
              ) : (
                <div className="font-oswald font-bold text-4xl text-green-muted">VS</div>
              )}
            </div>

            {/* Ext */}
            <div className="text-center">
              <ClubBadgeLarge nom={match.ext_nom} sigle={match.ext_sigle} logo={match.ext_logo} color="#b03a2e"/>
            </div>
          </div>

          {/* Barre progression si live */}
          {isLive && match.minute_actuelle && (
            <div className="mt-6">
              <div className="flex justify-between text-xs text-green-muted mb-1">
                <span>0'</span>
                <span className="text-cmr-live font-bold">{match.minute_actuelle}'</span>
                <span>90'</span>
              </div>
              <div className="bg-dark rounded-full h-2 overflow-hidden">
                <div className="bg-cmr-live h-full rounded-full transition-all"
                  style={{ width: `${Math.min((match.minute_actuelle / 90) * 100, 100)}%` }}/>
              </div>
            </div>
          )}
        </div>

        {/* Cartons */}
        {(isLive || isTermine) && (
          <div className="card p-6 mb-6">
            <h2 className="font-oswald text-sm tracking-widest text-green-muted uppercase mb-4">Cartons</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-xs text-green-muted mb-3 font-oswald">{match.dom_sigle}</div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🟨</span>
                    <span className="font-oswald font-bold text-xl text-yellow-400">{match.cartons_jaunes_dom ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🟥</span>
                    <span className="font-oswald font-bold text-xl text-red-400">{match.cartons_rouges_dom ?? 0}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-green-muted mb-3 font-oswald">{match.ext_sigle}</div>
                <div className="flex gap-4 justify-end">
                  <div className="flex items-center gap-2">
                    <span className="font-oswald font-bold text-xl text-yellow-400">{match.cartons_jaunes_ext ?? 0}</span>
                    <span className="text-xl">🟨</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-oswald font-bold text-xl text-red-400">{match.cartons_rouges_ext ?? 0}</span>
                    <span className="text-xl">🟥</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Infos match */}
        <div className="card p-6 mb-6">
          <h2 className="font-oswald text-sm tracking-widest text-green-muted uppercase mb-4">Informations</h2>
          <div className="space-y-3">
            {match.date_match && (
              <div className="flex items-center gap-3 text-sm">
                <Clock size={16} className="text-cmr-yellow flex-shrink-0"/>
                <span className="text-green-muted">Date :</span>
                <span className="text-white">{new Date(match.date_match).toLocaleDateString('fr-FR', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                  hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Douala'
                })}</span>
              </div>
            )}
            {match.lieu_nom && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin size={16} className="text-cmr-yellow flex-shrink-0"/>
                <span className="text-green-muted">Lieu :</span>
                <span className="text-white">{match.lieu_nom}, {match.lieu_ville}</span>
              </div>
            )}
            {match.diffusion_tv && (
              <div className="flex items-center gap-3 text-sm">
                <Tv size={16} className="text-cmr-yellow flex-shrink-0"/>
                <span className="text-green-muted">Diffusion :</span>
                <span className="text-white">{match.diffusion_tv}</span>
              </div>
            )}
            {match.affluence && (
              <div className="flex items-center gap-3 text-sm">
                <Users size={16} className="text-cmr-yellow flex-shrink-0"/>
                <span className="text-green-muted">Affluence :</span>
                <span className="text-white">{match.affluence.toLocaleString()} spectateurs</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm">
              <span className="text-lg">🏆</span>
              <span className="text-green-muted">Fédération :</span>
              <span className="text-white">{match.federation}</span>
            </div>
          </div>
        </div>

        {/* Liens */}
        <div className="flex gap-3">
          <Link href={`/${match.sport}/${match.competition_nom?.toLowerCase().replace(/\s+/g, '-')}/classement`}
            className="btn-outline flex-1 text-center text-sm">
            Classement
          </Link>
          <Link href={`/${match.sport}/${match.competition_nom?.toLowerCase().replace(/\s+/g, '-')}/calendrier`}
            className="btn-outline flex-1 text-center text-sm">
            Calendrier
          </Link>
        </div>

      </div>
    </div>
  )
}

function ClubBadgeLarge({ nom, sigle, logo, color }: { nom?: string; sigle?: string; logo?: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      {logo ? (
        <img src={logo} alt={sigle} className="w-16 h-16 rounded-full object-cover border-2 border-border"/>
      ) : (
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-sm font-oswald font-bold text-white border border-white/10"
          style={{ background: color }}>
          {sigle?.slice(0, 3) ?? '?'}
        </div>
      )}
      <div className="font-barlow-condensed font-semibold text-sm text-center leading-tight">{nom}</div>
    </div>
  )
}
