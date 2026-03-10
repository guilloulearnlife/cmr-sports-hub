'use client'

import { useState, useEffect, useCallback } from 'react'

export interface NotificationPreferences {
  enabled: boolean
  matchStart: boolean      // Notifier au début du match
  goals: boolean           // Notifier à chaque but
  matchEnd: boolean        // Notifier à la fin du match
  favoriteTeamsOnly: boolean // Seulement pour les équipes favorites
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  enabled: false,
  matchStart: true,
  goals: true,
  matchEnd: true,
  favoriteTeamsOnly: true,
}

const STORAGE_KEY = 'cmr-sports-notifications'

export type PermissionState = 'default' | 'granted' | 'denied' | 'unsupported'

export function useNotifications() {
  const [permission, setPermission] = useState<PermissionState>('default')
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES)
  const [isLoaded, setIsLoaded] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)

  // Check browser support and permission on mount
  useEffect(() => {
    // Check if notifications are supported
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPermission('unsupported')
      setIsLoaded(true)
      return
    }

    // Get current permission
    setPermission(Notification.permission as PermissionState)

    // Load preferences from localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setPreferences(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error)
    }

    // Check for existing subscription
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.getSubscription().then(sub => {
          setSubscription(sub)
        })
      })
    }

    setIsLoaded(true)
  }, [])

  // Save preferences to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
      } catch (error) {
        console.error('Error saving notification preferences:', error)
      }
    }
  }, [preferences, isLoaded])

  // Request permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (permission === 'unsupported') {
      return false
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result as PermissionState)
      
      if (result === 'granted') {
        // Subscribe to push notifications
        await subscribeToPush()
        setPreferences(prev => ({ ...prev, enabled: true }))
        return true
      }
      return false
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }, [permission])

  // Subscribe to push notifications
  const subscribeToPush = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return null
    }

    try {
      const registration = await navigator.serviceWorker.ready
      
      // Get VAPID public key (would come from backend in production)
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      
      if (!vapidPublicKey) {
        console.log('VAPID key not configured, using local notifications only')
        return null
      }

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource
      })
      
      setSubscription(sub)
      
      // Send subscription to backend
      // await fetch('/api/notifications/subscribe', {
      //   method: 'POST',
      //   body: JSON.stringify(sub),
      //   headers: { 'Content-Type': 'application/json' }
      // })
      
      return sub
    } catch (error) {
      console.error('Error subscribing to push:', error)
      return null
    }
  }, [])

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async () => {
    if (subscription) {
      try {
        await subscription.unsubscribe()
        setSubscription(null)
        setPreferences(prev => ({ ...prev, enabled: false }))
      } catch (error) {
        console.error('Error unsubscribing:', error)
      }
    }
  }, [subscription])

  // Update preferences
  const updatePreferences = useCallback((updates: Partial<NotificationPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }))
  }, [])

  // Send a local notification (for testing/fallback)
  const sendLocalNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (permission !== 'granted') return

    try {
      new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-96x96.png',
        ...options,
      })
    } catch (error) {
      console.error('Error sending notification:', error)
    }
  }, [permission])

  // Send match notification
  const notifyMatchEvent = useCallback((
    type: 'start' | 'goal' | 'end',
    matchData: {
      homeTeam: string
      awayTeam: string
      homeScore?: number
      awayScore?: number
      competition?: string
      scorer?: string
    }
  ) => {
    if (permission !== 'granted' || !preferences.enabled) return

    // Check preference for this type
    if (type === 'start' && !preferences.matchStart) return
    if (type === 'goal' && !preferences.goals) return
    if (type === 'end' && !preferences.matchEnd) return

    const { homeTeam, awayTeam, homeScore, awayScore, competition, scorer } = matchData

    let title = ''
    let body = ''
    let tag = ''

    switch (type) {
      case 'start':
        title = '🏟️ Match en cours !'
        body = `${homeTeam} vs ${awayTeam}${competition ? ` • ${competition}` : ''}`
        tag = `match-start-${homeTeam}-${awayTeam}`
        break
      case 'goal':
        title = '⚽ BUUUUT !'
        body = `${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}${scorer ? `\n🎯 ${scorer}` : ''}`
        tag = `goal-${homeTeam}-${awayTeam}-${homeScore}-${awayScore}`
        break
      case 'end':
        title = '🏁 Match terminé'
        body = `${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}`
        tag = `match-end-${homeTeam}-${awayTeam}`
        break
    }

    sendLocalNotification(title, {
      body,
      tag,
      requireInteraction: type === 'goal',
    } as NotificationOptions)
  }, [permission, preferences, sendLocalNotification])

  return {
    permission,
    preferences,
    subscription,
    isLoaded,
    isSupported: permission !== 'unsupported',
    isEnabled: permission === 'granted' && preferences.enabled,
    requestPermission,
    unsubscribe,
    updatePreferences,
    sendLocalNotification,
    notifyMatchEvent,
  }
}

// Helper to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
