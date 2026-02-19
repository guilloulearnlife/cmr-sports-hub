'use client'
import Image from 'next/image'

interface ClubLogoProps {
  nom: string
  sigle?: string | null
  couleur?: string | null
  logo_url?: string | null
  size?: number
  className?: string
}

const CLUB_COLORS: Record<string, { bg: string; text: string }> = {
  CYD: { bg: '#006400', text: '#FFFFFF' },
  TKY: { bg: '#CC0000', text: '#FFFFFF' },
  COT: { bg: '#003087', text: '#FFFFFF' },
  CDL: { bg: '#003087', text: '#FFD700' },
  USD: { bg: '#FF6600', text: '#000000' },
  FOV: { bg: '#CC0000', text: '#000000' },
  ESL: { bg: '#006400', text: '#FFD700' },
  UNI: { bg: '#003087', text: '#FFFFFF' },
  BAM: { bg: '#006400', text: '#FFFFFF' },
  LAD: { bg: '#FFD700', text: '#000000' },
  PAN: { bg: '#111111', text: '#FFD700' },
  RFN: { bg: '#990000', text: '#FFFFFF' },
  DJK: { bg: '#FF5500', text: '#FFFFFF' },
  YSA: { bg: '#660000', text: '#FFFFFF' },
  SRM: { bg: '#005500', text: '#FFD700' },
  ASF: { bg: '#660099', text: '#FFFFFF' },
}

function getInitials(nom: string, sigle?: string | null): string {
  if (sigle) return sigle.slice(0, 3)
  return nom.split(' ').filter(w => w.length > 2).slice(0, 2).map(w => w[0]).join('').toUpperCase().slice(0, 3)
}

function getColors(sigle?: string | null, couleur?: string | null) {
  if (sigle && CLUB_COLORS[sigle]) return CLUB_COLORS[sigle]
  if (couleur) {
    const hex = couleur.replace('#', '')
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return { bg: couleur, text: luminance > 0.5 ? '#000000' : '#FFFFFF' }
  }
  return { bg: '#1a4a2e', text: '#FFD700' }
}

export default function ClubLogo({ nom, sigle, couleur, logo_url, size = 40, className = '' }: ClubLogoProps) {
  if (logo_url) {
    return (
      <div style={{ width: size, height: size, flexShrink: 0 }} className={`relative ${className}`}>
        <Image
          src={logo_url}
          alt={nom}
          width={size}
          height={size}
          className="object-contain rounded-full"
          style={{ background: 'white', padding: 2 }}
        />
      </div>
    )
  }

  const initials = getInitials(nom, sigle)
  const colors = getColors(sigle, couleur)
  const fontSize = size * 0.35

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} style={{ flexShrink: 0 }}>
      <circle cx="50" cy="50" r="48" fill={colors.bg} />
      <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
      <text x="50" y="50" textAnchor="middle" dominantBaseline="central"
            fill={colors.text} fontSize={fontSize} fontFamily="'Oswald', sans-serif"
            fontWeight="700" letterSpacing="1">
        {initials}
      </text>
    </svg>
  )
}
