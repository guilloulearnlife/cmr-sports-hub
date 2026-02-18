import type { Metadata } from 'next'
import { Oswald, Barlow, Barlow_Condensed } from 'next/font/google'
import './globals.css'

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
})

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['300','400','500','600','700'],
  variable: '--font-barlow',
  display: 'swap',
})

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['300','400','500','600','700'],
  variable: '--font-barlow-condensed',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CMR Sports Hub — Toutes les compétitions nationales',
  description: 'La plateforme officielle du sport camerounais. Scores en direct, classements et calendriers de toutes les compétitions nationales.',
  keywords: ['sport cameroun', 'football cameroun', 'elite one', 'classement', 'scores live'],
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'CMR Sports Hub',
    description: 'Toutes les compétitions sportives nationales du Cameroun',
    locale: 'fr_CM',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${oswald.variable} ${barlow.variable} ${barlowCondensed.variable}`}>
      <body className="bg-dark text-white antialiased">{children}</body>
    </html>
  )
}
