import { Suspense } from 'react'
import Link from 'next/link'
import { Trophy, Zap, Calendar, ArrowRight, TrendingUp, ChevronRight, Bell, Tv, Users, Target } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MatchCard from '@/components/MatchCard'
import BottomNav from '@/components/BottomNav'
import { getMatchsLive, getMatchsDuJour, getProchainMatchs, getCompetitionsActives } from '@/lib/supabase'
import { getSportConfig, formatDateLongue } from '@/lib/utils'
import type { MatchView, Competition } from '@/lib/supabase'

export const revalidate = 30

export default async function Home() {
  const [live, duJour, prochains, competitions] = await Promise.all([
    getMatchsLive(),
    getMatchsDuJour(),
    getProchainMatchs(),
    getCompetitionsActives(),
  ])

  const stats = {
    competitions: competitions.length,
    live: live.length,
    aujourdhui: duJour.length,
    prochains: prochains.length,
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION — Immersive
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden hero-gradient noise">
        {/* Animated background elements */}
        <div className="absolute inset-0 hero-pattern opacity-50" />
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-cmr-gold/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cmr-green/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cmr-red/5 rounded-full blur-3xl animate-spin-slow" />
        
        <div className="relative z-10 max-w-screen-2xl mx-auto px-4 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left content */}
            <div className="space-y-8">
              {/* Live indicator */}
              {stats.live > 0 && (
                <div className="animate-fade-up">
                  <Link href="/live" className="badge-live inline-flex">
                    {stats.live} match{stats.live > 1 ? 's' : ''} en direct
                  </Link>
                </div>
              )}
              
              {/* Main title */}
              <div className="animate-fade-up-delay-1">
                <p className="text-text-secondary font-oswald tracking-[0.3em] text-sm mb-4 flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-cmr-gold" />
                  PLATEFORME NATIONALE
                </p>
                <h1 className="font-oswald font-black text-6xl md:text-7xl lg:text-8xl leading-none">
                  <span className="text-gradient">CMR</span>
                  <br />
                  <span className="text-white">SPORTS</span>
                  <br />
                  <span className="text-text-secondary text-4xl md:text-5xl lg:text-6xl">HUB</span>
                </h1>
              </div>
              
              {/* Description */}
              <p className="text-text-secondary text-lg md:text-xl max-w-lg animate-fade-up-delay-2 text-balance">
                Le cœur du sport camerounais bat ici. Scores en direct, classements et calendriers de toutes les compétitions nationales.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 animate-fade-up-delay-3">
                <Link href="/live" data-testid="btn-scores-live" className="btn-primary flex items-center gap-3 group">
                  <Zap size={20} className="group-hover:animate-pulse" />
                  Scores Live
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/calendrier" data-testid="btn-calendrier" className="btn-outline flex items-center gap-3">
                  <Calendar size={18} />
                  Calendrier
                </Link>
              </div>
              
              {/* Quick sports links */}
              <div className="flex flex-wrap gap-2 animate-fade-up-delay-4">
                {['football', 'basketball', 'volleyball', 'handball'].map(sport => {
                  const cfg = getSportConfig(sport as any)
                  return (
                    <Link key={sport} href={`/${sport}`} className="badge-sport">
                      <span>{cfg.emoji}</span>
                      <span>{cfg.label}</span>
                    </Link>
                  )
                })}
                <Link href="/sports" className="badge-sport hover:bg-cmr-gold/10">
                  <span>+4</span>
                  <span>autres</span>
                </Link>
              </div>
            </div>
            
            {/* Right content — Stats cards */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4 animate-slide-right">
                <StatsCard 
                  icon={<Trophy className="text-cmr-gold" />}
                  value={stats.competitions}
                  label="Compétitions actives"
                  delay={0}
                />
                <StatsCard 
                  icon={<Tv className="text-accent-live" />}
                  value={stats.live}
                  label="Matchs en direct"
                  highlight={stats.live > 0}
                  delay={1}
                />
                <StatsCard 
                  icon={<Target className="text-accent-cyan" />}
                  value={stats.aujourdhui}
                  label="Matchs aujourd'hui"
                  delay={2}
                />
                <StatsCard 
                  icon={<Calendar className="text-accent-orange" />}
                  value={stats.prochains}
                  label="Prochains matchs"
                  delay={3}
                />
              </div>
              
              {/* Next match countdown placeholder */}
              {prochains.length > 0 && (
                <div className="mt-6 glass rounded-2xl p-6 animate-fade-up" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-2 text-xs text-text-muted font-oswald tracking-widest mb-4">
                    <Bell size={14} />
                    PROCHAIN MATCH
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-sm font-semibold text-white">{prochains[0].dom_nom}</div>
                      <div className="text-xs text-text-muted">{prochains[0].dom_sigle}</div>
                    </div>
                    <div className="px-4">
                      <div className="text-2xl font-oswald text-cmr-gold">VS</div>
                      <div className="text-xs text-text-muted text-center">
                        {prochains[0].date_match && formatDateLongue(prochains[0].date_match)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-white">{prochains[0].ext_nom}</div>
                      <div className="text-xs text-text-muted">{prochains[0].ext_sigle}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-text-muted rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-cmr-gold rounded-full animate-fade-up" style={{ animationDuration: '1.5s', animationIterationCount: 'infinite' }} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          LIVE MATCHES SECTION
          ═══════════════════════════════════════════════════════════ */}
      {live.length > 0 && (
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-accent-live/5 to-transparent pointer-events-none" />
          <div className="max-w-screen-2xl mx-auto px-4 relative">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <span className="badge-live text-base px-6 py-2">EN DIRECT</span>
                <h2 className="font-oswald text-2xl tracking-widest text-white">
                  {live.length} Match{live.length > 1 ? 's' : ''} en cours
                </h2>
              </div>
              <Link href="/live" className="btn-glass flex items-center gap-2">
                Voir tout <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {live.slice(0, 3).map((match, i) => (
                <div key={match.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <MatchCard match={match} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          COMPETITIONS SECTION
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-bg-elevated/50">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-text-muted font-oswald tracking-widest text-sm mb-2">SAISON 2025-2026</p>
              <h2 className="font-oswald text-3xl tracking-widest text-white flex items-center gap-3">
                <Trophy className="text-cmr-gold" size={28} />
                Compétitions Nationales
              </h2>
            </div>
            <Link href="/competitions" className="btn-glass hidden md:flex items-center gap-2">
              Tout voir <ArrowRight size={16} />
            </Link>
          </div>

          {competitions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {competitions.slice(0, 8).map((comp, i) => (
                <CompetitionCard key={comp.id} competition={comp} delay={i} />
              ))}
            </div>
          ) : (
            <EmptyState 
              icon="🏆"
              title="Saison 2025-2026"
              description="Les compétitions démarrent bientôt. Retrouvez ici tous les scores, classements et calendriers en temps réel."
            />
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          UPCOMING MATCHES
          ═══════════════════════════════════════════════════════════ */}
      {prochains.length > 0 && (
        <section className="py-16">
          <div className="max-w-screen-2xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-oswald text-2xl tracking-widest text-white flex items-center gap-3">
                <Calendar className="text-accent-cyan" size={24} />
                Prochains Matchs
              </h2>
              <Link href="/calendrier" className="btn-glass flex items-center gap-2">
                Calendrier complet <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {prochains.slice(0, 6).map((match, i) => (
                <div key={match.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <MatchCard match={match} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          SPORTS GRID
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-bg-elevated/30">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-oswald text-3xl tracking-widest text-white mb-4">
              Explorez par Sport
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              7 fédérations sportives, des centaines de clubs, une seule plateforme.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {['football', 'basketball', 'volleyball', 'handball', 'billard', 'boxe', 'athletisme'].map((sport, i) => {
              const cfg = getSportConfig(sport as any)
              return (
                <Link 
                  key={sport} 
                  href={`/${sport}`}
                  className="card card-glow group p-6 text-center animate-fade-up hover:scale-105"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {cfg.emoji}
                  </div>
                  <div className="font-oswald text-sm tracking-wider text-text-secondary group-hover:text-cmr-gold transition-colors">
                    {cfg.label}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA SECTION
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cmr-green/10 via-cmr-gold/5 to-cmr-red/10" />
        <div className="max-w-screen-xl mx-auto px-4 text-center relative">
          <div className="inline-flex items-center gap-2 bg-cmr-gold/10 border border-cmr-gold/20 rounded-full px-4 py-2 mb-6">
            <Bell size={16} className="text-cmr-gold" />
            <span className="text-sm text-cmr-gold font-oswald tracking-wider">Restez informé</span>
          </div>
          <h2 className="font-oswald text-4xl md:text-5xl tracking-widest text-white mb-6">
            Ne manquez plus un seul match
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-8">
            Activez les notifications pour recevoir les scores en direct et les alertes des matchs de vos équipes favorites.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="btn-primary flex items-center gap-2">
              <Bell size={18} />
              Activer les notifications
            </button>
            <Link href="/about" className="btn-outline">
              En savoir plus
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <BottomNav liveCount={stats.live} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

function StatsCard({ 
  icon, 
  value, 
  label, 
  highlight = false,
  delay = 0 
}: { 
  icon: React.ReactNode
  value: number
  label: string
  highlight?: boolean
  delay?: number
}) {
  return (
    <div 
      className={`
        card p-6 group
        ${highlight ? 'card-live animate-pulse-live' : ''}
      `}
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <span className={`
          font-oswald font-black text-4xl
          ${highlight ? 'text-accent-live animate-score-pulse' : 'text-white'}
        `}>
          {value}
        </span>
      </div>
      <div className="text-text-muted text-sm font-oswald tracking-wider">
        {label}
      </div>
    </div>
  )
}

function CompetitionCard({ competition, delay }: { competition: Competition, delay: number }) {
  const cfg = getSportConfig(competition.sport)
  return (
    <Link 
      href={`/${competition.sport}/${competition.slug}`}
      className="card card-glow p-5 group animate-fade-up"
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      <div className="flex items-start gap-4">
        <div className="text-3xl">{cfg.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="font-oswald text-white tracking-wider group-hover:text-cmr-gold transition-colors truncate">
            {competition.nom_court || competition.nom}
          </div>
          <div className="text-xs text-text-muted mt-1 capitalize">
            {competition.genre} • {competition.statut}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="badge-gold text-xs">{cfg.label}</span>
            {competition.statut === 'en_cours' && (
              <span className="text-xs text-accent-cyan">En cours</span>
            )}
          </div>
        </div>
        <ChevronRight size={20} className="text-text-muted group-hover:text-cmr-gold group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  )
}

function EmptyState({ icon, title, description }: { icon: string, title: string, description: string }) {
  return (
    <div className="card p-16 text-center animate-fade-up">
      <div className="text-6xl mb-6 animate-float">{icon}</div>
      <h3 className="font-oswald text-2xl tracking-widest text-cmr-gold mb-4">
        {title}
      </h3>
      <p className="text-text-secondary max-w-md mx-auto">
        {description}
      </p>
    </div>
  )
}
