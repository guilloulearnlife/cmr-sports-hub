'use client'

import { Heart } from 'lucide-react'
import { useFavorites, FavoriteTeam } from '@/hooks/useFavorites'

interface FavoriteButtonProps {
  team: Omit<FavoriteTeam, 'addedAt'>
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export default function FavoriteButton({ 
  team, 
  size = 'md', 
  showLabel = false,
  className = ''
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, isLoaded } = useFavorites()
  const isActive = isFavorite(team.id)

  const sizes = {
    sm: { icon: 14, btn: 'w-7 h-7' },
    md: { icon: 18, btn: 'w-9 h-9' },
    lg: { icon: 22, btn: 'w-11 h-11' },
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(team)
  }

  if (!isLoaded) {
    return (
      <div className={`${sizes[size].btn} rounded-full bg-bg-surface animate-pulse ${className}`} />
    )
  }

  return (
    <button
      onClick={handleClick}
      className={`
        group relative ${sizes[size].btn} rounded-full
        flex items-center justify-center gap-2
        transition-all duration-300 
        ${isActive 
          ? 'bg-cmr-red/20 border border-cmr-red/50 text-cmr-red' 
          : 'bg-bg-surface/50 border border-border-subtle text-text-muted hover:text-cmr-red hover:border-cmr-red/30'
        }
        ${showLabel ? 'w-auto px-4' : ''}
        ${className}
      `}
      title={isActive ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      data-testid={`favorite-btn-${team.id}`}
    >
      {/* Heart icon with animation */}
      <Heart 
        size={sizes[size].icon} 
        className={`
          transition-all duration-300
          ${isActive ? 'fill-cmr-red scale-110' : 'group-hover:scale-110'}
        `}
      />
      
      {/* Pulse effect on active */}
      {isActive && (
        <span className="absolute inset-0 rounded-full bg-cmr-red/20 animate-ping opacity-50" />
      )}
      
      {/* Label */}
      {showLabel && (
        <span className="text-xs font-oswald tracking-wider">
          {isActive ? 'FAVORI' : 'SUIVRE'}
        </span>
      )}
    </button>
  )
}

// Badge showing favorites count
export function FavoritesBadge({ className = '' }: { className?: string }) {
  const { count, isLoaded } = useFavorites()
  
  if (!isLoaded || count === 0) return null
  
  return (
    <span className={`
      inline-flex items-center justify-center
      min-w-[20px] h-5 px-1.5 rounded-full
      bg-cmr-red text-white text-xs font-bold
      animate-scale-in
      ${className}
    `}>
      {count}
    </span>
  )
}
