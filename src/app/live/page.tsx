import { Suspense } from 'react'
import Link from 'next/link'
import { Zap, RefreshCw, Tv, Calendar, ChevronRight, Radio } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BottomNav from '@/components/BottomNav'
import MatchCard from '@/components/MatchCard'
import { getMatchsLive, getMatchsDuJour } from '@/lib/supabase'
import type { MatchView } from '@/lib/supabase'

export const revalidate = 15 // Refresh plus fréquent pour live

export default async function LivePage() {
  const [live, duJour] = await Promise.all([
    getMatchsLive(),
    getMatchsDuJour(),
  ])

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />

      {/* Hero section with live effect */}
      <section className="relative py-16 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-accent-live/10 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent-live/5 rounded-full blur-3xl animate-pulse" />
        </div>
        
        {/* Animated lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-accent-live/30 to-transparent w-full"
              style={{
                top: `${20 + i * 20}%`,
                animationDelay: `${i * 0.3}s`,
                animation: 'marquee 10s linear infinite'
              }}
            />
          ))}
        </div>

        <div className="relative max-w-screen-2xl mx-auto px-4">
          <div className="flex items-center gap-6 mb-8 animate-fade-up">
            {/* Pulsing live indicator */}
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-accent-live/20 flex items-center justify-center animate-pulse-live">
                <Zap className="text-accent-live" size={40} />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-live rounded-full animate-ping" />
            </div>
            
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-oswald font-black text-5xl md:text-6xl tracking-widest text-white">
                  EN <span className="text-accent-live">DIRECT</span>
                </h1>
                {live.length > 0 && (
                  <span className="badge-live text-lg px-6 py-2">
                    {live.length}
                  </span>
                )}
              </div>
              <p className="text-text-secondary mt-2 flex items-center gap-2">
                <Radio size={16} className="text-accent-live animate-pulse" />
                Scores actualisés toutes les 15 secondes
              </p>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-3 animate-fade-up-delay-1">
            <button className="btn-live">
              <Zap size={16} className="mr-2" />
              Live ({live.length})
            </button>
            <button className="btn-glass">
              <Calendar size={16} className="mr-2" />
              Aujourd'hui ({duJour.length})
            </button>
            <div className="ml-auto">
              <button className="btn-glass flex items-center gap-2 text-xs">
                <RefreshCw size={14} className="animate-spin-slow" />
                Auto-refresh
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Live matches */}
      <section className="py-8">
        <div className="max-w-screen-2xl mx-auto px-4">
          {live.length > 0 ? (
            <div className="space-y-4">
              <h2 className="font-oswald text-xl tracking-widest text-cmr-gold flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-accent-live animate-blink" />
                Matchs en cours
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {live.map((match, i) => (
                  <div key={match.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                    <MatchCard match={match} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyLiveState />
          )}
        </div>
      </section>

      {/* Today's matches */}
      {duJour.length > 0 && (
        <section className="py-8">
          <div className="max-w-screen-2xl mx-auto px-4">
            <h2 className="font-oswald text-xl tracking-widest text-text-secondary flex items-center gap-3 mb-6">
              <Calendar size={20} />
              Matchs du jour
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {duJour.map((match, i) => (
                <div key={match.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <MatchCard match={match} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="card p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cmr-green/5 via-cmr-gold/5 to-cmr-red/5" />
            <div className="relative">
              <Tv className="mx-auto text-cmr-gold mb-6" size={48} />
              <h3 className="font-oswald text-3xl tracking-widest text-white mb-4">
                Suivez tous les matchs en direct
              </h3>
              <p className="text-text-secondary max-w-lg mx-auto mb-8">
                Elite One, Elite Two, Basketball, Volleyball et plus encore. 
                Tous les scores du sport camerounais en temps réel.
              </p>
              <Link href="/calendrier" className="btn-primary inline-flex items-center gap-2">
                <Calendar size={18} />
                Voir le calendrier complet
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BottomNav liveCount={live.length} />
    </div>
  )
}

function EmptyLiveState() {
  return (
    <div className="card p-16 text-center animate-fade-up">
      {/* Animated stadium */}
      <div className="relative w-32 h-32 mx-auto mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-dashed border-text-muted/30 animate-spin-slow" />
        <div className="absolute inset-4 rounded-full bg-bg-surface flex items-center justify-center">
          <span className="text-5xl animate-float">⚽</span>
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-2 bg-text-muted/20 rounded-full blur-sm" />
      </div>
      
      <h3 className="font-oswald text-2xl tracking-widest text-cmr-gold mb-4">
        Pas de match en direct
      </h3>
      <p className="text-text-secondary max-w-md mx-auto mb-8">
        Les Lions sont au repos. Consultez le calendrier pour voir les prochaines rencontres 
        ou explorez les derniers résultats.
      </p>
      
      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/calendrier" className="btn-primary flex items-center gap-2">
          <Calendar size={18} />
          Calendrier
        </Link>
        <Link href="/" className="btn-outline flex items-center gap-2">
          Derniers résultats
        </Link>
      </div>
      
      {/* Notification CTA */}
      <div className="mt-10 p-6 glass rounded-2xl max-w-md mx-auto">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cmr-gold/10 flex items-center justify-center flex-shrink-0">
            <Zap className="text-cmr-gold" size={24} />
          </div>
          <div className="text-left">
            <div className="text-white font-semibold text-sm">Soyez alerté instantanément</div>
            <div className="text-text-muted text-xs">Activez les notifications pour ne manquer aucun match</div>
          </div>
        </div>
        <button className="btn-primary w-full mt-4 text-sm">
          Activer les notifications
        </button>
      </div>
    </div>
  )
}
