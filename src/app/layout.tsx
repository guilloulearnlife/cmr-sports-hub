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
  title: {
    default: 'CMR Sports Hub — Le Sport au Cameroun en Direct',
    template: '%s | CMR Sports Hub'
  },
  description: 'Suivez le football (Elite One, Two), basketball et toutes les compétitions nationales au Cameroun. Scores en direct, classements et calendriers officiels.',
  keywords: ['sport cameroun', 'football cameroun', 'Elite One Cameroun', 'Ligue de football', 'FECAFOOT', 'scores en direct Cameroun', 'Yaoundé', 'Douala'],
  authors: [{ name: 'CMR Sports Hub Team' }],
  creator: 'CMR Sports Hub',
  metadataBase: new URL('https://cmr-sports-hub.vercel.app'), // Important pour les images OG
  alternates: {
    canonical: '/',
  },
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'CMR Sports Hub — Toutes les compétitions nationales',
    description: 'Vivez le sport camerounais comme jamais : scores, stats et actus en temps réel.',
    url: 'https://cmr-sports-hub.vercel.app',
    siteName: 'CMR Sports Hub',
    locale: 'fr_CM',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg', // Assure-toi d'avoir cette image dans ton dossier /public
        width: 1200,
        height: 630,
        alt: 'CMR Sports Hub - Sport Camerounais',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CMR Sports Hub',
    description: 'Le sport camerounais à portée de main.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${oswald.variable} ${barlow.variable} ${barlowCondensed.variable}`}>
      <body>{children}</body>
    </html>
  )
}
