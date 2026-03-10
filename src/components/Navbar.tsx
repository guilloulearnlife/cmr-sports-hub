'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, Trophy, Calendar, Users, Settings, Zap, Search, ChevronDown } from 'lucide-react'
import { SPORT_CONFIG } from '@/lib/utils'
import type { SportType } from '@/lib/supabase'

const SPORTS_NAV: SportType[] = ['football', 'basketball', 'volleyball', 'handball', 'billard', 'boxe', 'athletisme']

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [sportMenu, setSportMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={`
        sticky top-0 z-50 transition-all duration-500
        ${scrolled 
          ? 'glass-strong shadow-lg' 
          : 'bg-gradient-to-b from-bg-primary/90 to-transparent backdrop-blur-sm'
        }
      `}
      data-testid="navbar"
    >
      {/* Flag strip */}
      <div className="flag-strip">
        <div className="fg" /><div className="fr" /><div className="fy" />
      </div>

      <nav className="max-w-screen-2xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0 group" data-testid="logo">
          <div className="relative">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cmr-gold to-cmr-gold-dim flex items-center justify-center text-xl shadow-lg group-hover:shadow-glow transition-shadow">
              🏆
            </div>
            <div className="absolute inset-0 rounded-full bg-cmr-gold/20 animate-ping opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <div className="font-oswald font-bold text-cmr-gold tracking-widest text-lg leading-none group-hover:text-gradient transition-all">
              CMR SPORTS
            </div>
            <div className="text-[10px] tracking-[0.2em] text-text-muted uppercase leading-none mt-0.5">
              Hub National
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1 ml-6">
          {/* Sports dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setSportMenu(true)}
            onMouseLeave={() => setSportMenu(false)}
          >
            <button 
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-oswald text-sm tracking-wider text-text-secondary hover:text-cmr-gold hover:bg-cmr-gold/5 transition-all"
              data-testid="competitions-menu"
            >
              <Trophy size={16} />
              Compétitions
              <ChevronDown size={14} className={`transition-transform ${sportMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown menu */}
            <div className={`
              absolute top-full left-0 mt-2 w-72 glass-strong rounded-2xl overflow-hidden shadow-2xl
              transition-all duration-300 origin-top
              ${sportMenu ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
            `}>
              <div className="p-2">
                {SPORTS_NAV.map((sport, i) => {
                  const cfg = SPORT_CONFIG[sport]
                  return (
                    <Link
                      key={sport}
                      href={`/${sport}`}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-cmr-gold/10 transition-all group"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform">
                        {cfg.emoji}
                      </span>
                      <div>
                        <div className="font-oswald text-sm tracking-wide text-white group-hover:text-cmr-gold transition-colors">
                          {cfg.label}
                        </div>
                        <div className="text-xs text-text-muted">
                          Classement · Calendrier
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          <NavLink href="/live" icon={<Zap size={16} />} label="En Direct" live />
          <NavLink href="/calendrier" icon={<Calendar size={16} />} label="Calendrier" />
          <NavLink href="/joueurs" icon={<Users size={16} />} label="Joueurs" />
          <NavLink href="/recherche" icon={<Search size={16} />} label="Recherche" />
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">
          {/* Live badge */}
          <Link 
            href="/live" 
            className="badge-live hidden sm:flex"
            data-testid="live-badge"
          >
            EN DIRECT
          </Link>

          {/* Admin button */}
          <Link
            href="/admin"
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border border-border-subtle text-text-muted hover:border-cmr-gold/50 hover:text-cmr-gold font-oswald text-xs tracking-wider transition-all"
            data-testid="admin-btn"
          >
            <Settings size={14} />
            ADMIN
          </Link>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-text-muted hover:text-white rounded-xl hover:bg-white/5 transition-all"
            onClick={() => setOpen(!open)}
            data-testid="mobile-menu-btn"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`
        lg:hidden overflow-hidden transition-all duration-300
        ${open ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="glass-strong border-t border-border-subtle">
          <div className="max-h-[70vh] overflow-y-auto py-4 px-4 space-y-1">
            {SPORTS_NAV.map((sport, i) => {
              const cfg = SPORT_CONFIG[sport]
              return (
                <Link
                  key={sport}
                  href={`/${sport}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-cmr-gold/10 transition-all"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <span className="text-xl">{cfg.emoji}</span>
                  <span className="font-oswald tracking-wide text-white">{cfg.label}</span>
                </Link>
              )
            })}
            
            <div className="h-px bg-border-subtle my-4" />
            
            <Link href="/live" onClick={() => setOpen(false)} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-accent-live/10 transition-all">
              <Zap size={20} className="text-accent-live" />
              <span className="font-oswald tracking-wide text-accent-live">En Direct</span>
            </Link>
            
            <Link href="/calendrier" onClick={() => setOpen(false)} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-cmr-gold/10 transition-all">
              <Calendar size={20} className="text-text-muted" />
              <span className="font-oswald tracking-wide">Calendrier</span>
            </Link>
            
            <Link href="/joueurs" onClick={() => setOpen(false)} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-cmr-gold/10 transition-all">
              <Users size={20} className="text-text-muted" />
              <span className="font-oswald tracking-wide">Joueurs</span>
            </Link>
            
            <Link href="/recherche" onClick={() => setOpen(false)} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-cmr-gold/10 transition-all">
              <Search size={20} className="text-text-muted" />
              <span className="font-oswald tracking-wide">Recherche</span>
            </Link>
            
            <Link href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-cmr-gold/10 transition-all">
              <Settings size={20} className="text-text-muted" />
              <span className="font-oswald tracking-wide">Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

function NavLink({ 
  href, 
  icon, 
  label, 
  live 
}: { 
  href: string
  icon: React.ReactNode
  label: string
  live?: boolean 
}) {
  const pathname = usePathname()
  const active = pathname === href || pathname.startsWith(href + '/')

  return (
    <Link
      href={href}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-xl font-oswald text-sm tracking-wider transition-all
        ${active
          ? 'bg-cmr-gold text-bg-primary font-bold shadow-glow'
          : live
            ? 'text-accent-live hover:bg-accent-live/10'
            : 'text-text-secondary hover:text-cmr-gold hover:bg-cmr-gold/5'
        }
      `}
    >
      {icon}
      {label}
    </Link>
  )
}
