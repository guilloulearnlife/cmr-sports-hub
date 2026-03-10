import Link from 'next/link'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      {/* Flag strip top */}
      <div className="flag-strip fixed top-0 left-0 right-0">
        <div className="fg" /><div className="fr" /><div className="fy" />
      </div>

      <div className="text-center max-w-lg animate-fade-up">
        {/* 404 animation */}
        <div className="relative mb-8">
          <div className="text-[150px] md:text-[200px] font-oswald font-black text-gradient leading-none opacity-20">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-float">⚽</div>
          </div>
        </div>

        <h1 className="font-oswald font-bold text-3xl md:text-4xl tracking-widest text-white mb-4">
          PAGE NON TROUVÉE
        </h1>

        <p className="text-text-secondary mb-8 text-lg">
          Oups ! Cette page semble avoir quitté le terrain. 
          Le ballon est peut-être parti dans les tribunes...
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/" className="btn-primary flex items-center gap-2">
            <Home size={18} />
            Retour à l'accueil
          </Link>
          <Link href="/recherche" className="btn-outline flex items-center gap-2">
            <Search size={18} />
            Rechercher
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-12 pt-8 border-t border-border-subtle">
          <p className="text-text-muted text-sm mb-4">Pages populaires</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/live" className="badge-sport">🔴 En direct</Link>
            <Link href="/football" className="badge-sport">⚽ Football</Link>
            <Link href="/calendrier" className="badge-sport">📅 Calendrier</Link>
            <Link href="/joueurs" className="badge-sport">👥 Joueurs</Link>
          </div>
        </div>
      </div>

      {/* Flag strip bottom */}
      <div className="flag-strip fixed bottom-0 left-0 right-0">
        <div className="fg" /><div className="fr" /><div className="fy" />
      </div>
    </div>
  )
}
