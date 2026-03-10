'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Zap, Calendar, Heart, User } from 'lucide-react'
import { useFavorites } from '@/hooks/useFavorites'

interface BottomNavProps {
  liveCount?: number
}

export default function BottomNav({ liveCount = 0 }: BottomNavProps) {
  const pathname = usePathname()
  const { count: favCount } = useFavorites()

  const items = [
    { href: '/', icon: Home, label: 'Accueil' },
    { href: '/live', icon: Zap, label: 'Live', badge: liveCount },
    { href: '/mes-favoris', icon: Heart, label: 'Favoris', badge: favCount, highlight: true },
    { href: '/calendrier', icon: Calendar, label: 'Matchs' },
    { href: '/admin', icon: User, label: 'Compte' },
  ]

  return (
    <nav className="bottom-nav md:hidden" data-testid="bottom-nav">
      <div className="flex justify-around items-center">
        {items.map(item => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`bottom-nav-item relative ${isActive ? 'active' : ''}`}
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              <div className="relative">
                <item.icon size={22} className={item.highlight && !isActive ? 'text-cmr-red' : ''} />
                {item.badge && item.badge > 0 && (
                  <span className={`absolute -top-1 -right-2 w-4 h-4 ${item.highlight ? 'bg-cmr-red' : 'bg-accent-live'} text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse`}>
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1">{item.label}</span>
              
              {/* Active indicator */}
              {isActive && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-cmr-gold rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
