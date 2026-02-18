import { Zap, RefreshCw } from 'lucide-react'
import Navbar from '@/components/Navbar'
import MatchCard from '@/components/MatchCard'
import { getMatchsLive, getMatchsDuJour } from '@/lib/supabase'

export const revalidate = 15  // refresh toutes les 15s

export default async function LivePage() {
  const [live, duJour] = await Promise.all([getMatchsLive(), getMatchsDuJour()])
  const enAttente = duJour.filter(m => m.statut === 'planifie')
  const termines  = duJour.filter(m => m.statut === 'termine')

  return (
    <div className="min-h-screen bg-dark">
      <Navbar/>

      <div className="max-w-screen-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-oswald font-bold text-4xl tracking-widest text-cmr-yellow flex items-center gap-3">
              <Zap className="text-cmr-live"/> EN DIRECT
            </h1>
            <p className="text-green-muted mt-1">Rafraîchissement automatique toutes les 15 secondes</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-green-dim font-oswald tracking-wider">
            <RefreshCw size={12} className="animate-spin" style={{ animationDuration: '3s' }}/>
            AUTO-REFRESH
          </div>
        </div>

        {/* Matchs live */}
        {live.length > 0 ? (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="badge-live">EN COURS</span>
              <span className="text-green-muted text-sm">{live.length} match{live.length > 1 ? 's' : ''} en direct</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {live.map(m => <MatchCard key={m.id} match={m}/>)}
            </div>
          </section>
        ) : (
          <div className="card p-12 text-center mb-10">
            <div className="text-4xl mb-4">📺</div>
            <h2 className="font-oswald text-xl tracking-widest text-green-muted">Aucun match en direct pour l'instant</h2>
            <p className="text-xs text-green-dim mt-2">La page se rafraîchit automatiquement</p>
          </div>
        )}

        {/* Matchs planifiés aujourd'hui */}
        {enAttente.length > 0 && (
          <section className="mb-10">
            <h2 className="font-oswald text-xl tracking-widest text-white mb-4">
              Prochains matchs aujourd'hui ({enAttente.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {enAttente.map(m => <MatchCard key={m.id} match={m}/>)}
            </div>
          </section>
        )}

        {/* Résultats du jour */}
        {termines.length > 0 && (
          <section>
            <h2 className="font-oswald text-xl tracking-widest text-white mb-4">
              Résultats du jour ({termines.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {termines.map(m => <MatchCard key={m.id} match={m}/>)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
