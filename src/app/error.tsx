'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log l'erreur pour monitoring
    console.error('Erreur application:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="flag-strip fixed top-0 left-0 right-0">
        <div className="fg" /><div className="fr" /><div className="fy" />
      </div>

      <div className="text-center max-w-md animate-fade-up">
        <div className="w-20 h-20 rounded-full bg-cmr-live/20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={40} className="text-cmr-live" />
        </div>

        <h1 className="font-oswald font-bold text-3xl text-cmr-yellow tracking-widest mb-4">
          ERREUR TECHNIQUE
        </h1>

        <p className="text-green-muted mb-2">
          Une erreur inattendue s'est produite.
        </p>
        <p className="text-green-dim text-sm mb-8">
          Notre équipe a été notifiée. Veuillez réessayer.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="btn-primary flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Réessayer
          </button>
          <Link href="/" className="btn-outline flex items-center gap-2">
            <Home size={16} />
            Accueil
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mt-8 p-4 bg-red-900/20 border border-red-800 rounded-lg text-left">
            <p className="text-xs text-red-400 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-500 mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flag-strip fixed bottom-0 left-0 right-0">
        <div className="fg" /><div className="fr" /><div className="fy" />
      </div>
    </div>
  )
}
