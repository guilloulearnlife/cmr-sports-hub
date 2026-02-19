'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Trophy, Calendar, Users, Settings, Zap } from 'lucide-react'
import { SPORT_CONFIG } from '@/lib/utils'
import type { SportType } from '@/lib/supabase'

const SPORTS_NAV: SportType[] = ['football','basketball','volleyball','handball','billard','boxe','athletisme']

export default function Navbar() {
  const pathname  = usePathname()
  const [open, setOpen] = useState(false)
  const [sportMenu, setSportMenu] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b-2 border-cmr-yellow" style={{ background: 'linear-gradient(135deg, #0c2218 0%, #091510 100%)' }}>

      {/* Bande drapeau Cameroun */}
      <div className="flag-strip">
        <div className="fg"/><div className="fr"/><div className="fy"/>
      </div>

      <nav className="max-w-screen-2xl mx-auto px-4 h-16 flex items-center gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-cmr-yellow flex items-center justify-center text-xl shadow-lg"
               style={{ boxShadow: '0 0 20px rgba(245,197,24,.3)' }}>
            🏆
          </div>
          <div>
            <div className="font-oswald font-bold text-cmr-yellow tracking-widest text-lg leading-none">CMR SPORTS</div>
            <div className="text-xs tracking-widest text-green-muted uppercase leading-none mt-0.5">Hub National</div>
          </div>
        </Link>

        {/* Nav desktop */}
        <div className="hidden lg:flex items-center gap-1 ml-4">

          {/* Sports dropdown */}
          <div className="relative" onMouseEnter={() => setSportMenu(true)} onMouseLeave={() => setSportMenu(false)}>
            <button className="flex items-center gap-2 px-3 py-2 rounded font-oswald text-sm tracking-wider text-green-muted hover:text-cmr-yellow hover:bg-green-mid/20 transition-all">
              <Trophy size={15}/>
              Compétitions
              <span className="text-xs">▾</span>
            </button>

            {sportMenu && (
              <div className="absolute top-full left-0 mt-1 w-64 rounded-lg border border-border overflow-hidden shadow-2xl z-50"
                   style={{ background: '#0e1a12' }}>
                {SPORTS_NAV.map(sport => {
                  const cfg = SPORT_CONFIG[sport]
                  return (
                    <Link key={sport} href={`/${sport}`}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-card transition-colors border-b border-border last:border-0">
                      <span className="text-lg">{cfg.emoji}</span>
                      <div>
                        <div className="font-oswald text-sm tracking-wide text-white">{cfg.label}</div>
                        <div className="text-xs text-green-muted">Classement · Calendrier</div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          <NavLink href="/live" icon={<Zap size={15}/>} label="En Direct" live/>
          <NavLink href="/calendrier" icon={<Calendar size={15}/>} label="Calendrier"/>
          <NavLink href="/equipes" icon={<Users size={15}/>} label="Équipes"/>
          <NavLink href="/api-doc" icon={<Code size={15}/>} label="API"/>
        </div>

        {/* Live badge */}
        <div className="ml-auto flex items-center gap-3">
          <Link href="/live" className="badge-live text-xs hidden sm:flex items-center gap-1">
            EN DIRECT
          </Link>

          {/* Admin */}
          <Link href="/admin"
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded border border-border text-green-muted hover:border-cmr-yellow hover:text-cmr-yellow font-oswald text-xs tracking-wider transition-all">
            <Settings size={13}/>
            ADMIN
          </Link>

          {/* Burger mobile */}
          <button className="lg:hidden text-green-muted hover:text-white" onClick={() => setOpen(!open)}>
            {open ? <X size={22}/> : <Menu size={22}/>}
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      {open && (
        <div className="lg:hidden border-t border-border bg-deep">
          {SPORTS_NAV.map(sport => {
            const cfg = SPORT_CONFIG[sport]
            return (
              <Link key={sport} href={`/${sport}`} onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-6 py-3 border-b border-border hover:bg-card transition-colors">
                <span>{cfg.emoji}</span>
                <span className="font-oswald tracking-wide">{cfg.label}</span>
              </Link>
            )
          })}
          <Link href="/live"    onClick={() => setOpen(false)} className="flex items-center gap-3 px-6 py-3 border-b border-border hover:bg-card">
            <Zap size={16} className="text-cmr-live"/><span className="font-oswald tracking-wide text-cmr-live">En Direct</span>
          </Link>
          <Link href="/admin"   onClick={() => setOpen(false)} className="flex items-center gap-3 px-6 py-3 hover:bg-card">
            <Settings size={16} className="text-green-muted"/><span className="font-oswald tracking-wide">Admin</span>
          </Link>
        </div>
      )}
    </header>
  )
}

function NavLink({ href, icon, label, live }: { href: string; icon: React.ReactNode; label: string; live?: boolean }) {
  const pathname = usePathname()
  const active   = pathname === href || pathname.startsWith(href + '/')
  return (
    <Link href={href}
          className={`flex items-center gap-2 px-3 py-2 rounded font-oswald text-sm tracking-wider transition-all
            ${active
              ? 'bg-cmr-yellow text-dark font-bold'
              : 'text-green-muted hover:text-cmr-yellow hover:bg-green-mid/20'
            }
            ${live ? 'text-cmr-live hover:text-cmr-live' : ''}`}>
      {icon}{label}
    </Link>
  )
}
