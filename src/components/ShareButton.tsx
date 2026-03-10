'use client'

import { useState, useCallback } from 'react'
import { Share2, Twitter, Facebook, MessageCircle, Link2, Check, X } from 'lucide-react'

export interface ShareData {
  title: string
  text: string
  url?: string
  hashtags?: string[]
}

interface ShareButtonProps {
  data: ShareData
  variant?: 'icon' | 'button' | 'full'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// WhatsApp icon component
const WhatsAppIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

export default function ShareButton({ data, variant = 'icon', size = 'md', className = '' }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const sizes = {
    sm: { icon: 14, btn: 'w-8 h-8', text: 'text-xs' },
    md: { icon: 18, btn: 'w-10 h-10', text: 'text-sm' },
    lg: { icon: 22, btn: 'w-12 h-12', text: 'text-base' },
  }

  const shareUrl = data.url || (typeof window !== 'undefined' ? window.location.href : '')
  const shareText = `${data.title}\n${data.text}`
  const hashtags = data.hashtags?.join(',') || 'CMRSports,Cameroun'

  // Native share (mobile)
  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.title,
          text: data.text,
          url: shareUrl,
        })
        return true
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err)
        }
      }
    }
    return false
  }, [data, shareUrl])

  // Copy link
  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }, [shareUrl])

  // Social share URLs
  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=${hashtags}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
  }

  const handleShare = async () => {
    // Try native share first (mobile)
    const shared = await handleNativeShare()
    if (!shared) {
      setIsOpen(true)
    }
  }

  // Icon only button
  if (variant === 'icon') {
    return (
      <>
        <button
          onClick={handleShare}
          className={`
            ${sizes[size].btn} rounded-xl flex items-center justify-center
            bg-bg-surface/50 border border-border-subtle
            text-text-muted hover:text-cmr-gold hover:border-cmr-gold/30
            transition-all duration-300 hover:scale-105
            ${className}
          `}
          title="Partager"
          data-testid="share-btn"
        >
          <Share2 size={sizes[size].icon} />
        </button>
        
        <ShareModal 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)}
          shareLinks={shareLinks}
          onCopy={handleCopyLink}
          copied={copied}
          data={data}
        />
      </>
    )
  }

  // Button with text
  if (variant === 'button') {
    return (
      <>
        <button
          onClick={handleShare}
          className={`
            btn-glass flex items-center gap-2 ${sizes[size].text}
            ${className}
          `}
          data-testid="share-btn"
        >
          <Share2 size={sizes[size].icon} />
          Partager
        </button>
        
        <ShareModal 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)}
          shareLinks={shareLinks}
          onCopy={handleCopyLink}
          copied={copied}
          data={data}
        />
      </>
    )
  }

  // Full share bar with all options visible
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs text-text-muted font-oswald tracking-wider">PARTAGER</span>
      
      <a
        href={shareLinks.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/20 transition-all hover:scale-105"
        title="WhatsApp"
      >
        <WhatsAppIcon size={18} />
      </a>
      
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-xl bg-[#1DA1F2]/10 border border-[#1DA1F2]/30 flex items-center justify-center text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition-all hover:scale-105"
        title="Twitter"
      >
        <Twitter size={18} />
      </a>
      
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-xl bg-[#1877F2]/10 border border-[#1877F2]/30 flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2]/20 transition-all hover:scale-105"
        title="Facebook"
      >
        <Facebook size={18} />
      </a>
      
      <button
        onClick={handleCopyLink}
        className={`
          w-9 h-9 rounded-xl border flex items-center justify-center transition-all hover:scale-105
          ${copied 
            ? 'bg-cmr-green/20 border-cmr-green/50 text-cmr-green' 
            : 'bg-bg-surface/50 border-border-subtle text-text-muted hover:text-cmr-gold hover:border-cmr-gold/30'
          }
        `}
        title={copied ? 'Copié !' : 'Copier le lien'}
      >
        {copied ? <Check size={18} /> : <Link2 size={18} />}
      </button>
    </div>
  )
}

// Share Modal
function ShareModal({
  isOpen,
  onClose,
  shareLinks,
  onCopy,
  copied,
  data,
}: {
  isOpen: boolean
  onClose: () => void
  shareLinks: { whatsapp: string; twitter: string; facebook: string }
  onCopy: () => void
  copied: boolean
  data: ShareData
}) {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-up"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm bg-bg-card border border-border-subtle rounded-2xl overflow-hidden animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-border-subtle flex items-center justify-between">
          <h3 className="font-oswald text-white tracking-wider">Partager</h3>
          <button onClick={onClose} className="text-text-muted hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Preview */}
        <div className="p-4 bg-bg-surface/50">
          <div className="text-sm font-semibold text-white mb-1">{data.title}</div>
          <div className="text-xs text-text-muted line-clamp-2">{data.text}</div>
        </div>

        {/* Share options */}
        <div className="p-4 grid grid-cols-4 gap-3">
          <ShareOption
            href={shareLinks.whatsapp}
            icon={<WhatsAppIcon size={24} />}
            label="WhatsApp"
            color="#25D366"
          />
          <ShareOption
            href={shareLinks.twitter}
            icon={<Twitter size={24} />}
            label="Twitter"
            color="#1DA1F2"
          />
          <ShareOption
            href={shareLinks.facebook}
            icon={<Facebook size={24} />}
            label="Facebook"
            color="#1877F2"
          />
          <button
            onClick={onCopy}
            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-bg-surface transition-colors"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${copied ? 'bg-cmr-green/20 text-cmr-green' : 'bg-bg-surface text-text-muted'}`}>
              {copied ? <Check size={24} /> : <Link2 size={24} />}
            </div>
            <span className="text-xs text-text-muted">{copied ? 'Copié !' : 'Copier'}</span>
          </button>
        </div>

        {/* Hashtags */}
        {data.hashtags && data.hashtags.length > 0 && (
          <div className="px-4 pb-4">
            <div className="flex flex-wrap gap-2">
              {data.hashtags.map(tag => (
                <span key={tag} className="text-xs text-cmr-gold bg-cmr-gold/10 px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ShareOption({
  href,
  icon,
  label,
  color,
}: {
  href: string
  icon: React.ReactNode
  label: string
  color: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-bg-surface transition-colors"
    >
      <div 
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {icon}
      </div>
      <span className="text-xs text-text-muted">{label}</span>
    </a>
  )
}

// Quick share functions for specific content types
export function getMatchShareData(match: {
  dom_nom: string
  ext_nom: string
  dom_score?: number | null
  ext_score?: number | null
  competition_nom?: string
  statut?: string
}): ShareData {
  const isLive = match.statut === 'en_direct'
  const isTermine = match.statut === 'termine'
  const hasScore = match.dom_score !== null && match.ext_score !== null

  let title = ''
  let text = ''

  if (isLive && hasScore) {
    title = `⚽ EN DIRECT : ${match.dom_nom} ${match.dom_score} - ${match.ext_score} ${match.ext_nom}`
    text = `Suivez le match en direct sur CMR Sports Hub !`
  } else if (isTermine && hasScore) {
    title = `🏁 RÉSULTAT : ${match.dom_nom} ${match.dom_score} - ${match.ext_score} ${match.ext_nom}`
    text = `Match terminé${match.competition_nom ? ` • ${match.competition_nom}` : ''}`
  } else {
    title = `📅 ${match.dom_nom} vs ${match.ext_nom}`
    text = `Prochain match${match.competition_nom ? ` • ${match.competition_nom}` : ''}`
  }

  return {
    title,
    text,
    hashtags: ['CMRSports', 'Cameroun', 'Football', 'EliteOne'],
  }
}

export function getStandingsShareData(competition: string, leader: string): ShareData {
  return {
    title: `🏆 Classement ${competition}`,
    text: `${leader} en tête du classement ! Voir le classement complet sur CMR Sports Hub.`,
    hashtags: ['CMRSports', 'Cameroun', 'Classement'],
  }
}
