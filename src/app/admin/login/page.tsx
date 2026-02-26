'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Shield, Eye, EyeOff, RefreshCw } from 'lucide-react'

export default function LoginPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email ou mot de passe incorrect.')
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (!profile || !['super_admin', 'admin_regional', 'admin_federation', 'admin_competition', 'operateur_match'].includes(profile.role)) {
      await supabase.auth.signOut()
      setError('Accès refusé. Vous n\'avez pas les droits administrateur.')
      setLoading(false)
      return
    }

    window.location.href = '/admin'
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4"
         style={{ background: 'radial-gradient(ellipse at center, #1a4a2e22 0%, #0a100d 70%)' }}>
      <div className="fixed top-0 left-0 right-0 flag-strip z-50">
        <div className="fg"/><div className="fr"/><div className="fy"/>
      </div>

      <div className="w-full max-w-sm animate-fade-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-cmr-yellow flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg"
               style={{ boxShadow: '0 0 40px rgba(245,197,24,.3)' }}>🏆</div>
          <h1 className="font-oswald font-bold text-3xl text-cmr-yellow tracking-widest">CMR SPORTS HUB</h1>
          <p className="text-green-muted text-sm mt-1 font-oswald tracking-wider">ESPACE ADMINISTRATEUR</p>
        </div>

        <div className="card p-8 border-green-mid">
          <div className="flex items-center gap-2 mb-6">
            <Shield size={18} className="text-cmr-yellow"/>
            <span className="font-oswald tracking-widest text-sm text-green-muted uppercase">Connexion sécurisée</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-green-muted font-oswald tracking-wider uppercase mb-2">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                     required autoComplete="email" placeholder="admin@example.com"
                     className="w-full bg-deep border border-border rounded px-4 py-3 text-white text-sm focus:border-cmr-yellow outline-none transition-colors placeholder:text-green-dim"/>
            </div>

            <div>
              <label className="block text-xs text-green-muted font-oswald tracking-wider uppercase mb-2">Mot de passe</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} value={password}
                       onChange={e => setPassword(e.target.value)}
                       required autoComplete="current-password" placeholder="••••••••"
                       className="w-full bg-deep border border-border rounded px-4 py-3 text-white text-sm focus:border-cmr-yellow outline-none transition-colors pr-12 placeholder:text-green-dim"/>
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-green-dim hover:text-green-muted transition-colors">
                  {showPwd ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-800 rounded px-4 py-3 text-red-300 text-sm font-oswald tracking-wide">
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {loading ? <><RefreshCw size={16} className="animate-spin"/> Connexion...</> : <><Shield size={16}/> Se connecter</>}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-xs text-green-dim hover:text-green-muted font-oswald tracking-wider transition-colors">
            ← Retour au site public
          </a>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 flag-strip z-50">
        <div className="fg"/><div className="fr"/><div className="fy"/>
      </div>
    </div>
  )
}