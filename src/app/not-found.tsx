import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar/>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="text-8xl mb-6">🏆</div>
        <h1 className="font-oswald font-bold text-6xl text-cmr-yellow tracking-widest mb-4">404</h1>
        <p className="text-green-muted text-xl font-oswald tracking-wide mb-2">Page introuvable</p>
        <p className="text-green-dim text-sm mb-8 max-w-sm">
          Cette page n'existe pas encore ou a été déplacée.
        </p>
        <div className="flex gap-4">
          <Link href="/"     className="btn-primary">🏠 Accueil</Link>
          <Link href="/live" className="btn-outline">⚡ En Direct</Link>
        </div>
      </div>
    </div>
  )
}
