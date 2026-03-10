'use client'

import { useState } from 'react'
import { Bell, BellOff, Check, X, Zap, Trophy, Flag, Heart, AlertCircle } from 'lucide-react'
import { useNotifications, NotificationPreferences } from '@/hooks/useNotifications'

interface NotificationSettingsProps {
  compact?: boolean
  onClose?: () => void
}

export default function NotificationSettings({ compact = false, onClose }: NotificationSettingsProps) {
  const {
    permission,
    preferences,
    isLoaded,
    isSupported,
    isEnabled,
    requestPermission,
    unsubscribe,
    updatePreferences,
    notifyMatchEvent,
  } = useNotifications()

  const [isRequesting, setIsRequesting] = useState(false)

  const handleEnable = async () => {
    setIsRequesting(true)
    await requestPermission()
    setIsRequesting(false)
  }

  const handleDisable = async () => {
    await unsubscribe()
  }

  const handleTestNotification = () => {
    notifyMatchEvent('goal', {
      homeTeam: 'Canon Yaoundé',
      awayTeam: 'Coton Sport',
      homeScore: 2,
      awayScore: 1,
      competition: 'Elite One',
      scorer: 'Jean-Pierre Nsame'
    })
  }

  if (!isLoaded) {
    return (
      <div className={`${compact ? 'p-4' : 'p-6'} animate-shimmer rounded-2xl`}>
        <div className="h-8 bg-bg-surface rounded w-1/2 mb-4" />
        <div className="h-4 bg-bg-surface rounded w-3/4" />
      </div>
    )
  }

  // Not supported
  if (!isSupported) {
    return (
      <div className={`card ${compact ? 'p-4' : 'p-6'} text-center`}>
        <AlertCircle className="mx-auto text-accent-orange mb-3" size={32} />
        <h3 className="font-oswald text-lg text-white tracking-wider mb-2">
          Notifications non supportées
        </h3>
        <p className="text-text-muted text-sm">
          Votre navigateur ne supporte pas les notifications push.
          Essayez Chrome, Firefox ou Safari.
        </p>
      </div>
    )
  }

  // Permission denied
  if (permission === 'denied') {
    return (
      <div className={`card ${compact ? 'p-4' : 'p-6'} text-center`}>
        <BellOff className="mx-auto text-cmr-red mb-3" size={32} />
        <h3 className="font-oswald text-lg text-white tracking-wider mb-2">
          Notifications bloquées
        </h3>
        <p className="text-text-muted text-sm mb-4">
          Les notifications ont été bloquées. Pour les activer, modifiez les paramètres de votre navigateur.
        </p>
        <div className="text-xs text-text-muted bg-bg-surface rounded-lg p-3">
          <strong className="text-cmr-gold">Comment débloquer :</strong><br/>
          Cliquez sur l'icône 🔒 dans la barre d'adresse → Autoriser les notifications
        </div>
      </div>
    )
  }

  // Main settings
  return (
    <div className={`card overflow-hidden ${compact ? '' : 'max-w-lg mx-auto'}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-cmr-gold/10 to-cmr-green/10 p-4 border-b border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isEnabled ? 'bg-cmr-gold/20' : 'bg-bg-surface'}`}>
            {isEnabled ? (
              <Bell className="text-cmr-gold" size={20} />
            ) : (
              <BellOff className="text-text-muted" size={20} />
            )}
          </div>
          <div>
            <h3 className="font-oswald text-white tracking-wider">Notifications</h3>
            <p className="text-xs text-text-muted">
              {isEnabled ? 'Activées' : 'Désactivées'}
            </p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-text-muted hover:text-white">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Enable/Disable toggle */}
        {!isEnabled ? (
          <button
            onClick={handleEnable}
            disabled={isRequesting}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isRequesting ? (
              <>
                <div className="w-5 h-5 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                Activation...
              </>
            ) : (
              <>
                <Bell size={18} />
                Activer les notifications
              </>
            )}
          </button>
        ) : (
          <>
            {/* Preferences */}
            <div className="space-y-3">
              <PreferenceToggle
                icon={<Zap size={16} />}
                label="Début de match"
                description="Soyez alerté quand un match commence"
                checked={preferences.matchStart}
                onChange={(checked) => updatePreferences({ matchStart: checked })}
              />
              <PreferenceToggle
                icon={<Trophy size={16} />}
                label="Buts"
                description="Notification à chaque but marqué"
                checked={preferences.goals}
                onChange={(checked) => updatePreferences({ goals: checked })}
                highlight
              />
              <PreferenceToggle
                icon={<Flag size={16} />}
                label="Fin de match"
                description="Score final à la fin du match"
                checked={preferences.matchEnd}
                onChange={(checked) => updatePreferences({ matchEnd: checked })}
              />
              <PreferenceToggle
                icon={<Heart size={16} />}
                label="Équipes favorites uniquement"
                description="Notifications seulement pour vos favoris"
                checked={preferences.favoriteTeamsOnly}
                onChange={(checked) => updatePreferences({ favoriteTeamsOnly: checked })}
              />
            </div>

            {/* Test button */}
            <div className="pt-4 border-t border-border-subtle space-y-3">
              <button
                onClick={handleTestNotification}
                className="btn-glass w-full text-sm flex items-center justify-center gap-2"
              >
                <Bell size={14} />
                Tester une notification
              </button>
              
              <button
                onClick={handleDisable}
                className="w-full text-center text-xs text-text-muted hover:text-cmr-red transition-colors"
              >
                Désactiver les notifications
              </button>
            </div>
          </>
        )}

        {/* Info */}
        {!isEnabled && (
          <p className="text-xs text-text-muted text-center">
            Recevez les scores en direct, les alertes de buts et les résultats de vos équipes favorites.
          </p>
        )}
      </div>
    </div>
  )
}

// Toggle component
function PreferenceToggle({
  icon,
  label,
  description,
  checked,
  onChange,
  highlight = false,
}: {
  icon: React.ReactNode
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
  highlight?: boolean
}) {
  return (
    <label className={`
      flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all
      ${checked 
        ? highlight 
          ? 'bg-cmr-gold/10 border border-cmr-gold/30' 
          : 'bg-bg-surface/50 border border-border-subtle'
        : 'bg-bg-surface/30 border border-transparent hover:border-border-subtle'
      }
    `}>
      <div className={`
        w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
        ${checked 
          ? highlight ? 'bg-cmr-gold text-dark' : 'bg-cmr-gold/20 text-cmr-gold' 
          : 'bg-bg-surface text-text-muted'
        }
      `}>
        {icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium ${checked ? 'text-white' : 'text-text-secondary'}`}>
          {label}
        </div>
        <div className="text-xs text-text-muted truncate">{description}</div>
      </div>
      
      {/* Toggle switch */}
      <div className={`
        relative w-11 h-6 rounded-full transition-colors flex-shrink-0
        ${checked ? 'bg-cmr-gold' : 'bg-bg-surface'}
      `}>
        <div className={`
          absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform
          ${checked ? 'translate-x-6' : 'translate-x-1'}
        `}>
          {checked && <Check size={10} className="text-cmr-gold m-0.5" />}
        </div>
      </div>
    </label>
  )
}

// Compact notification button for embedding elsewhere
export function NotificationButton({ className = '' }: { className?: string }) {
  const { isEnabled, isSupported, requestPermission } = useNotifications()
  const [showSettings, setShowSettings] = useState(false)

  if (!isSupported) return null

  return (
    <>
      <button
        onClick={() => isEnabled ? setShowSettings(true) : requestPermission()}
        className={`
          relative flex items-center gap-2 px-4 py-2 rounded-xl
          transition-all duration-300
          ${isEnabled 
            ? 'bg-cmr-gold/10 border border-cmr-gold/30 text-cmr-gold' 
            : 'glass text-text-muted hover:text-cmr-gold hover:border-cmr-gold/30'
          }
          ${className}
        `}
      >
        <Bell size={16} className={isEnabled ? 'animate-bounce' : ''} />
        <span className="text-xs font-oswald tracking-wider">
          {isEnabled ? 'ALERTES ON' : 'ALERTES'}
        </span>
        {isEnabled && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-cmr-green rounded-full animate-pulse" />
        )}
      </button>

      {/* Settings modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-up">
          <div className="w-full max-w-md">
            <NotificationSettings onClose={() => setShowSettings(false)} />
          </div>
        </div>
      )}
    </>
  )
}
