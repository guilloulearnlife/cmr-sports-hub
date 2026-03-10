'use client'

import Link from 'next/link'
import { Heart, Trash2, Trophy, Calendar, Bell, ChevronRight, Star } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BottomNav from '@/components/BottomNav'
import { useFavorites, FavoriteTeam } from '@/hooks/useFavorites'
import { getSportConfig } from '@/lib/utils'

export default function MesFavorisPage() {
  const { favorites, removeFavorite, isLoaded, count } = useFavorites()

  // Group by sport
  const favoritesBySport = favorites.reduce((acc, fav) => {
    if (!acc[fav.sport]) acc[fav.sport] = []
    acc[fav.sport].push(fav)
    return acc
  }, {} as Record<string, FavoriteTeam[]>)

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />

      {/* Hero section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cmr-red/10 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-60 h-60 bg-cmr-red/5 rounded-full blur-3xl animate-float" />
        
        <div className="relative max-w-screen-2xl mx-auto px-4">
          <div className="flex items-center gap-6 mb-8 animate-fade-up">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-cmr-red/20 flex items-center justify-center">
                <Heart className="text-cmr-red" size={40} fill="currentColor" />
              </div>
              {count > 0 && (
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-cmr-gold text-dark text-sm font-bold rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </div>
            
            <div>
              <h1 className="font-oswald font-black text-5xl tracking-widest text-white">
                MES <span className="text-cmr-red">FAVORIS</span>
              </h1>
              <p className="text-text-secondary mt-2">
                Suivez vos équipes préférées et ne manquez aucun match
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="max-w-screen-2xl mx-auto px-4">
          {!isLoaded ? (
            <LoadingState />
          ) : favorites.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-12">
              {Object.entries(favoritesBySport).map(([sport, teams]) => {
                const cfg = getSportConfig(sport as any)
                return (
                  <div key={sport} className="animate-fade-up">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-3xl">{cfg.emoji}</span>
                      <h2 className="font-oswald text-xl tracking-widest text-cmr-gold">
                        {cfg.label}
                      </h2>
                      <span className="text-xs text-text-muted bg-bg-surface px-2 py-1 rounded">
                        {teams.length} équipe{teams.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {teams.map((team, i) => (
                        <FavoriteTeamCard 
                          key={team.id} 
                          team={team} 
                          onRemove={() => removeFavorite(team.id)}
                          delay={i}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
              
              {/* Notification CTA */}
              <NotificationCTA />
            </div>
          )}
        </div>
      </section>

      <Footer />
      <BottomNav />
    </div>
  )
}

function FavoriteTeamCard({ 
  team, 
  onRemove,
  delay 
}: { 
  team: FavoriteTeam
  onRemove: () => void
  delay: number
}) {
  const cfg = getSportConfig(team.sport as any)
  
  return (
    <div 
      className="card card-glow group p-5 animate-fade-up"
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      <div className="flex items-start gap-4">
        {/* Team logo/badge */}
        {team.logo ? (
          <img 
            src={team.logo} 
            alt={team.nom} 
            className="w-14 h-14 rounded-xl object-cover border border-border-subtle"
          />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cmr-gold to-cmr-gold-dim flex items-center justify-center text-dark font-oswald font-bold">
            {team.sigle?.slice(0, 3) || team.nom.slice(0, 3)}
          </div>
        )}
        
        {/* Team info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-oswald text-white tracking-wider text-lg truncate group-hover:text-cmr-gold transition-colors">
            {team.nom}
          </h3>
          {team.sigle && (
            <p className="text-xs text-text-muted">{team.sigle}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg">{cfg.emoji}</span>
            <span className="text-xs text-text-muted capitalize">{team.sport}</span>
          </div>
        </div>
        
        {/* Remove button */}
        <button
          onClick={onRemove}
          className="w-9 h-9 rounded-xl bg-bg-surface/50 border border-border-subtle flex items-center justify-center text-text-muted hover:text-cmr-red hover:border-cmr-red/30 transition-all"
          title="Retirer des favoris"
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      {/* Quick actions */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-border-subtle">
        <Link 
          href={`/club/${team.id}`}
          className="flex-1 btn-glass text-xs py-2 text-center flex items-center justify-center gap-2"
        >
          <Trophy size={12} />
          Profil
        </Link>
        <Link 
          href={`/calendrier?team=${team.id}`}
          className="flex-1 btn-glass text-xs py-2 text-center flex items-center justify-center gap-2"
        >
          <Calendar size={12} />
          Matchs
        </Link>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="card p-16 text-center animate-fade-up">
      <div className="relative w-32 h-32 mx-auto mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-dashed border-cmr-red/30 animate-spin-slow" />
        <div className="absolute inset-4 rounded-full bg-bg-surface flex items-center justify-center">
          <Heart size={40} className="text-cmr-red/50" />
        </div>
      </div>
      
      <h3 className="font-oswald text-2xl tracking-widest text-cmr-gold mb-4">
        Aucun favori
      </h3>
      <p className="text-text-secondary max-w-md mx-auto mb-8">
        Ajoutez vos équipes préférées pour suivre leurs matchs et recevoir des notifications.
        Cliquez sur le ❤️ à côté d'une équipe pour la suivre.
      </p>
      
      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/football" className="btn-primary flex items-center gap-2">
          <Trophy size={18} />
          Explorer les équipes
        </Link>
        <Link href="/live" className="btn-outline flex items-center gap-2">
          Matchs en direct
        </Link>
      </div>
      
      {/* Help tips */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {[
          { icon: Heart, title: 'Suivez', desc: 'Cliquez sur ❤️ pour ajouter une équipe' },
          { icon: Bell, title: 'Alertes', desc: 'Recevez les scores en direct' },
          { icon: Star, title: 'Personnalisé', desc: 'Votre hub sportif sur mesure' },
        ].map((tip, i) => (
          <div key={i} className="glass rounded-xl p-4 text-center">
            <tip.icon size={24} className="text-cmr-gold mx-auto mb-2" />
            <div className="font-oswald text-white text-sm tracking-wider">{tip.title}</div>
            <div className="text-xs text-text-muted mt-1">{tip.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="card p-5 animate-shimmer">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-bg-surface" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-bg-surface rounded w-3/4" />
              <div className="h-3 bg-bg-surface rounded w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function NotificationCTA() {
  return (
    <div className="card p-8 text-center relative overflow-hidden animate-fade-up">
      <div className="absolute inset-0 bg-gradient-to-r from-cmr-green/5 via-cmr-gold/5 to-cmr-red/5" />
      <div className="relative">
        <Bell className="mx-auto text-cmr-gold mb-4" size={40} />
        <h3 className="font-oswald text-2xl tracking-widest text-white mb-3">
          Ne manquez plus rien
        </h3>
        <p className="text-text-secondary max-w-lg mx-auto mb-6">
          Activez les notifications pour être alerté dès que vos équipes favorites jouent.
          Scores en direct, résultats et moments clés.
        </p>
        <button className="btn-primary inline-flex items-center gap-2">
          <Bell size={18} />
          Activer les notifications
        </button>
      </div>
    </div>
  )
}
