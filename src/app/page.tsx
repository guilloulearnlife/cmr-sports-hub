import { Suspense } from 'react'
import Link from 'next/link'
import { Trophy, Zap, Calendar, ArrowRight, TrendingUp } from 'lucide-react'
import Navbar from '@/components/Navbar'
import MatchCard from '@/components/MatchCard'
import { supabase, getMatchsLive, getMatchsDuJour, getProchainMatchs, getCompetitionsActives } from '@/lib/supabase'
import { getSportConfig, formatDateLongue } from '@/lib/utils'
import type { MatchView, Competition } from '@/lib/supabase'

// Revalidation toutes les 30 secondes pour les scores live
export const revalidate = 30

async function getData() {
  try {
    const [live, duJour, prochains, competitions] = await Promise.all([
      getMatchsLive(),
      getMatchsDuJour(),
      getProchainMatchs(),
      getCompetitionsActives(),
    ])
    return { live, duJour, prochains, competitions, error: null }
  } catch (error) {
    return { live: [], duJour: [], prochains: [], competitions: [], error }
  }
}

export default async function HomePage() {
  const { live, duJour, prochains, competitions } = await getData()
  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    timeZone: 'Africa/Douala'
  })

  // Grouper les compétitions par sport
  const compsBySport = competitions.reduce<Record<string, Competition[]>>((acc, c) => {
    if (!acc[c.sport]) acc[c.sport] = []
    acc[c.sport].push(c)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-dark">
      <Navbar/>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border"
               style={{ background: 'radial-gradient(ellipse at 30% 50%, #1a4a2e 0%, #0a100d 60%)' }}>
        <div className="absolute inset-0 opacity-5"
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #f5c518 1px, transparent 0)', backgroundSize: '32px 32px' }}/>

        <div className="max-w-screen-2xl mx-auto px-4 py-12 relative">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            <div className="flex-1 animate-fade-up">
              <div className="font-oswald text-green-muted text-sm tracking-widest uppercase mb-3">
                🇨🇲 Plateforme Nationale du Sport Camerounais
              </div>
              <h1 className="font-oswald font-bold text-5xl lg:text-6xl text-cmr-yellow leading-none tracking-widest mb-4">
                CMR SPORTS<br/>
                <span className="text-white">HUB</span>
              </h1>
              <p className="text-green-muted text-lg max-w-lg">
                Scores en direct, classements et calendriers de toutes les compétitions nationales camerounaises.
              </p>
              <div className="flex items-center gap-3 mt-6">
                <Link href="/live" className="btn-primary flex items-center gap-2">
                  <Zap size={16}/> Scores Live
                </Link>
                <Link href="/calendrier" className="btn-outline flex items-center gap-2">
                  <Calendar size={16}/> Calendrier
                </Link>
              </div>
            </div>

            {/* Stats globales */}
            <div className="grid grid-cols-2 gap-2 lg:gap-3 w-full lg:w-auto">
              {[
                { num: competitions.length, label: 'Compétitions actives' },
                { num: live.length, label: 'Matchs en direct', highlight: live.length > 0 },
                { num: duJour.length, label: "Matchs aujourd'hui" },
                { num: prochains.length, label: 'Prochains matchs (48h)' },
              ].map((s, i) => (
                <div key={i} className={`card p-4 text-center min-w-[120px] ${s.highlight ? 'border-cmr-live/50' : ''}`}>
                  <div className={`font-oswald font-bold text-3xl ${s.highlight ? 'text-cmr-live' : 'text-cmr-yellow'}`}>
                    {s.num}
                  </div>
                  <div className="text-xs text-green-muted mt-1 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-screen-2xl mx-auto px-4 py-8 space-y-10">

        {/* MATCHS EN DIRECT */}
        {live.length > 0 && (
          <section>
            <SectionHeader
              icon={<Zap size={18} className="text-cmr-live"/>}
              title="En Direct"
              badge={`${live.length} match${live.length > 1 ? 's' : ''}`}
              badgeColor="bg-cmr-live"
              href="/live"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {live.map(m => <MatchCard key={m.id} match={m}/>)}
            </div>
          </section>
        )}

        {/* MATCHS DU JOUR */}
        {duJour.length > 0 && (
          <section>
            <SectionHeader
              icon={<Calendar size={18} className="text-cmr-yellow"/>}
              title={`Aujourd'hui`}
              subtitle={today}
              href="/calendrier"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {duJour.slice(0, 6).map(m => <MatchCard key={m.id} match={m}/>)}
            </div>
            {duJour.length > 6 && (
              <div className="text-center mt-4">
                <Link href="/calendrier" className="btn-outline text-sm">
                  Voir tous les matchs du jour ({duJour.length})
                </Link>
              </div>
            )}
          </section>
        )}

        {/* COMPÉTITIONS PAR SPORT */}
        <section>
          <SectionHeader
            icon={<Trophy size={18} className="text-cmr-yellow"/>}
            title="Compétitions Nationales 2025-2026"
            href="/competitions"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {Object.entries(compsBySport).map(([sport, comps]) => {
              const cfg = getSportConfig(sport as any)
              return (
                <Link key={sport} href={`/${sport}`}
                      className="card p-4 hover:border-green-mid transition-all group hover:-translate-y-0.5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                         style={{ background: cfg.couleur + '33' }}>
                      {cfg.emoji}
                    </div>
                    <div>
                      <div className="font-oswald font-bold tracking-wider text-sm">{cfg.label}</div>
                      <div className="text-xs text-green-muted">{comps.length} compétition{comps.length > 1 ? 's' : ''}</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {comps.map(c => (
                      <div key={c.id} className="text-xs text-green-muted flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-green-dim flex-shrink-0"/>
                        {c.nom_court ?? c.nom}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 mt-3 text-xs text-cmr-yellow opacity-0 group-hover:opacity-100 transition-opacity font-oswald tracking-wider">
                    Voir <ArrowRight size={12}/>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* PROCHAINS MATCHS */}
        {prochains.length > 0 && (
          <section>
            <SectionHeader
              icon={<TrendingUp size={18} className="text-cmr-yellow"/>}
              title="Prochains Matchs (48h)"
              href="/calendrier"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {prochains.slice(0, 6).map(m => <MatchCard key={m.id} match={m}/>)}
            </div>
          </section>
        )}

        {/* Empty state si aucun match */}
        {!live.length && !duJour.length && !prochains.length && (
          <div className="card p-16 text-center">
            <div className="text-5xl mb-4">🏆</div>
            <h2 className="font-oswald text-2xl tracking-widest text-cmr-yellow mb-3">
              SAISON 2025-2026
            </h2>
            <p className="text-green-muted max-w-md mx-auto">
              Les compétitions démarrent bientôt. Retrouvez ici tous les scores, classements et calendriers en temps réel.
            </p>

          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="border-t border-border mt-16 bg-deep">
        <div className="max-w-screen-2xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="font-oswald text-cmr-yellow font-bold tracking-widest text-lg">CMR SPORTS HUB</div>
              <div className="text-xs text-green-dim mt-1">© 2026 — Toutes les compétitions nationales du Cameroun</div>
            </div>
            <div className="flex gap-6 text-xs text-green-dim font-oswald tracking-wider">
              <Link href="/about" className="hover:text-cmr-yellow transition-colors">À propos</Link>
              <Link href="/api-doc" className="hover:text-cmr-yellow transition-colors">API</Link>


            </div>
          </div>
        </div>
        <div className="flag-strip"><div className="fg"/><div className="fr"/><div className="fy"/></div>
      </footer>
    </div>
  )
}

function SectionHeader({
  icon, title, subtitle, badge, badgeColor, href
}: {
  icon:        React.ReactNode
  title:       string
  subtitle?:   string
  badge?:      string
  badgeColor?: string
  href?:       string
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="font-oswald font-bold text-xl tracking-widest text-white">{title}</h2>
        </div>
        {badge && (
          <span className={`text-xs text-white px-2 py-0.5 rounded font-oswald tracking-wider ${badgeColor ?? 'bg-green-mid'}`}>
            {badge}
          </span>
        )}
        {subtitle && <span className="text-sm text-green-muted hidden sm:block">{subtitle}</span>}
      </div>
      {href && (
        <Link href={href} className="text-xs text-green-muted hover:text-cmr-yellow font-oswald tracking-wider flex items-center gap-1 transition-colors">
          Tout voir <ArrowRight size={12}/>
        </Link>
      )}
    </div>
  )
}
