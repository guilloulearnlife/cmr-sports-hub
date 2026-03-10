import type { Metadata, Viewport } from 'next'
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

export const viewport: Viewport = {
  themeColor: '#f5c518',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: {
    default: 'CMR Sports Hub — Le Sport au Cameroun en Direct',
    template: '%s | CMR Sports Hub'
  },
  description: 'Suivez le football (Elite One, Two), basketball et toutes les compétitions nationales au Cameroun. Scores en direct, classements et calendriers officiels.',
  keywords: ['sport cameroun', 'football cameroun', 'Elite One Cameroun', 'Elite Two Cameroun', 'Ligue de football', 'FECAFOOT', 'FECABASKET', 'scores en direct Cameroun', 'Yaoundé', 'Douala', 'Lions Indomptables'],
  authors: [{ name: 'CMR Sports Hub Team' }],
  creator: 'CMR Sports Hub',
  publisher: 'CMR Sports Hub',
  metadataBase: new URL('https://cmr-sports-hub.vercel.app'),
  alternates: {
    canonical: '/',
    languages: {
      'fr-CM': '/',
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'CMR Sports Hub — Toutes les compétitions nationales',
    description: 'Vivez le sport camerounais comme jamais : scores, stats et actus en temps réel.',
    url: 'https://cmr-sports-hub.vercel.app',
    siteName: 'CMR Sports Hub',
    locale: 'fr_CM',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CMR Sports Hub - Sport Camerounais',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CMR Sports Hub',
    description: 'Le sport camerounais à portée de main. Scores live, classements, calendriers.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'votre-code-verification-google',
  },
  category: 'sports',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${oswald.variable} ${barlow.variable} ${barlowCondensed.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
