
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Calendar, MapPin } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function JoueurPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: joueur } = await supabase
    .from('joueurs')
    .select('*, clubs(nom, sigle, logo_url, slug)')
    .eq('id', id)
    .single()

  if (!joueur) notFound()

  const { data: stats } = await supabase
    .from('v_stats_joueurs')
    .select('*')
    .eq('id', id)

  const totalButs = stats?.reduce((acc, s) => acc + (s.buts ?? 0), 0) ?? 0
  const totalPasses = stats?.reduce((acc, s) => acc + (s.passes_decisives ?? 0), 0) ?? 0
  const totalMatchs = stats?.reduce((acc, s) => acc + (s.matchs_joues ?? 0), 0) ?? 0
  const totalCJ = stats?.reduce((acc, s) => acc + (s.cartons_jaunes ?? 0), 0) ?? 0
  const totalCR = stats?.reduce((acc, s) => acc + (s.cartons_rouges ?? 0), 0) ?? 0
  const totalMinutes = stats?.reduce((acc, s) => acc + (s.minutes_jouees ?? 0), 0) ?? 0

  const age = joueur.date_naissance
    ? Math.floor((Date.now() - new Date(joueur.date_naissance).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    : null

  return (
    <div className="min-h-screen bg-dark">
      <Navbar/>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/joueurs" className="flex items-center gap-2 text-green-muted text-sm font-oswald tracking-wider mb-6 hover:text-cmr-yellow transition-colors">
          <ArrowLeft size={16}/> JOUEURS
        </Link>

        {/* Profil */}
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-6">
            {joueur.photo_url ? (
              <img src={joueur.photo_url} alt={joueur.nom_complet} className="w-24 h-24 rounded-full object-cover border-2 border-cmr-yellow"/>
            ) : (
              <div className="w-24 h-24 rounded-full bg-green-mid flex items-center justify-center text-2xl font-oswald font-bold text-white border-2 border-cmr-yellow">
                {joueur.nom?.slice(0,2)?.toUpperCase()}
              </div>
            )}
            <div>
              <div className="font-oswald font-bold text-3xl text-cmr-yellow tracking-wider">{joueur.nom_complet}</div>
              {joueur.surnom && <div className="text-green-muted text-sm mt-1">"{joueur.surnom}"</div>}
              <div className="flex items-center gap-3 mt-2">
                {joueur.numero_maillot && (
                  <span className="bg-cmr-yellow text-dark font-oswald font-bold text-lg w-9 h-9 rounded-full flex items-center justify-center">
                    {joueur.numero_maillot}
                  </span>
                )}
                <span className="text-green-muted text-sm font-oswald">{joueur.poste}</span>
                <span className="text-green-dim text-xs">{joueur.sport}</span>
              </div>
            </div>
          </div>

          {/* Infos */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            {joueur.clubs && (
              <Link href={`/club/${joueur.clubs.slug}`} className="flex items-center gap-2 text-sm hover:text-cmr-yellow transition-colors">
                {joueur.clubs.logo_url && <img src={joueur.clubs.logo_url} className="w-6 h-6 rounded-full"/>}
                <span className="text-green-muted">Club :</span>
                <span>{joueur.clubs.nom}</span>
              </Link>
            )}
            {age && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={14} className="text-cmr-yellow"/>
                <span className="text-green-muted">Âge :</span>
                <span>{age} ans</span>
              </div>
            )}
            {joueur.nationalite && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-green-muted">Nationalité :</span>
                <span>{joueur.nationalite}</span>
              </div>
            )}
            {joueur.ville_origine && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={14} className="text-cmr-yellow"/>
                <span className="text-green-muted">Origine :</span>
                <span>{joueur.ville_origine}</span>
              </div>
            )}
            {joueur.taille_cm && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-green-muted">Taille :</span>
                <span>{joueur.taille_cm} cm</span>
              </div>
            )}
            {joueur.pied_fort && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-green-muted">Pied fort :</span>
                <span className="capitalize">{joueur.pied_fort}</span>
              </div>
            )}
          </div>

          {joueur.bio && (
            <p className="text-green-muted text-sm mt-4 border-t border-border pt-4">{joueur.bio}</p>
          )}
        </div>

        {/* Stats totales */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Matchs', val: totalMatchs, color: 'text-white' },
            { label: 'Buts', val: totalButs, color: 'text-cmr-yellow' },
            { label: 'Passes', val: totalPasses, color: 'text-green-400' },
            { label: 'Cartons J', val: totalCJ, color: 'text-yellow-400' },
            { label: 'Cartons R', val: totalCR, color: 'text-red-400' },
            { label: 'Minutes', val: `${totalMinutes}'`, color: 'text-green-muted' },
          ].map(s => (
            <div key={s.label} className="card p-4 text-center">
              <div className={`font-oswald font-bold text-2xl ${s.color}`}>{s.val}</div>
              <div className="text-xs text-green-muted font-oswald tracking-wider mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Stats par compétition */}
        {stats && stats.filter(s => s.competition_id).length > 0 && (
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-oswald tracking-wider text-white">Stats par compétition</h2>
            </div>
            <div className="divide-y divide-border">
              {stats.filter(s => s.competition_id).map(s => (
                <div key={s.competition_id} className="p-4 flex items-center justify-between">
                  <div className="font-barlow-condensed font-semibold text-sm">{s.competition_nom}</div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-green-muted">{s.matchs_joues} MJ</span>
                    <span className="text-cmr-yellow font-bold">{s.buts} ⚽</span>
                    <span className="text-green-400">{s.passes_decisives} 🎯</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
