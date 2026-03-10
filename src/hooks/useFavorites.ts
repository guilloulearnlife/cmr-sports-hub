'use client'

import { useState, useEffect, useCallback } from 'react'

export interface FavoriteTeam {
  id: string
  nom: string
  sigle?: string
  logo?: string
  sport: string
  addedAt: string
}

const STORAGE_KEY = 'cmr-sports-favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteTeam[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setFavorites(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
      } catch (error) {
        console.error('Error saving favorites:', error)
      }
    }
  }, [favorites, isLoaded])

  const addFavorite = useCallback((team: Omit<FavoriteTeam, 'addedAt'>) => {
    setFavorites(prev => {
      if (prev.some(f => f.id === team.id)) return prev
      return [...prev, { ...team, addedAt: new Date().toISOString() }]
    })
  }, [])

  const removeFavorite = useCallback((teamId: string) => {
    setFavorites(prev => prev.filter(f => f.id !== teamId))
  }, [])

  const toggleFavorite = useCallback((team: Omit<FavoriteTeam, 'addedAt'>) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === team.id)
      if (exists) {
        return prev.filter(f => f.id !== team.id)
      }
      return [...prev, { ...team, addedAt: new Date().toISOString() }]
    })
  }, [])

  const isFavorite = useCallback((teamId: string) => {
    return favorites.some(f => f.id === teamId)
  }, [favorites])

  const getFavoritesBySport = useCallback((sport: string) => {
    return favorites.filter(f => f.sport === sport)
  }, [favorites])

  return {
    favorites,
    isLoaded,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    getFavoritesBySport,
    count: favorites.length,
  }
}
