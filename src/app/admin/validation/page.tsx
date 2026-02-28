
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

 {
  const [matchs, setMatchs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => { loadMatchs() }, [])

  async function loadMatchs() {
    const { data } = await supabase
      .from('v_matchs')
      .select('*')
      .eq('statut', 'en_attente')
      .order('date_match')
    setMatchs(data ?? [])
    setLoading(false)
  }

  async function approuver(match: any) {
    setProcessing(match.id)
    const { error } = await supabase
      .from('matchs')
      .update({ statut: 'termine' })
      .eq('id', match.id)

    if (!error) {
      await supabase.rpc('recalcule_classement', { p_competition_id: match.competition_id })
      setMsg({ type: 'success', text: `Score approuve : ${match.dom_nom} ${match.dom_score} - ${match.ext_score} ${match.ext_nom}` })
      loadMatchs()
    } else {
      setMsg({ type: 'error', text: 'Erreur : ' + error.message })
    }
    setProcessing(null)
  }

  async function rejeter(match: any) {
    setProcessing(match.id)
    const { error } = await supabase
      .from('matchs')
      .update({ statut: 'planifie', score_domicile: null, score_exterieur: null })
      .eq('id', match.id)

    if (!error) {
      setMsg({ type: 'error', text: `Score rejete : ${match.dom_nom} vs ${match.ext_nom}` })
      loadMatchs()
    }
    setProcessing(null)
  }

  return (
    <div className="min-h-screen bg-dark p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-oswald font-bold text-3xl tracking-widest text-cmr-yellow">
              VALIDATION SCORES
            </h1>
            <p className="text-green-muted text-sm mt-1">
              {loading ? '...' : `${matchs.length} score(s) en attente`}
            </p>
          </div>
          <Link href="/admin" className="btn-outline text-sm">Dashboard</Link>
        </div>

        {msg && (
          <div className={`mb-6 p-4 rounded ${msg.type === 'success' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
            {msg.text}
            <button onClick={() => setMsg(null)} className="ml-4 text-xs opacity-60">X</button>
          </div>
        )}

        {loading ? (
          <div className="card p-8 text-center text-green-muted">Chargement...</div>
        ) : matchs.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-4xl mb-4">✅</div>
            <p className="text-green-muted font-oswald tracking-wider">Aucun score en attente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {matchs.map(m => (
              <div key={m.id} className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs text-green-muted font-oswald tracking-wider">
                    {m.sport?.toUpperCase()} · J{m.journee} · {m.date_match ? new Date(m.date_match).toLocaleDateString('fr-FR') : ''}
                  </div>
                  <span className="text-xs bg-yellow-900 text-yellow-300 px-2 py-1 rounded font-oswald">
                    EN ATTENTE
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="flex-1 text-center">
                    <div className="font-oswald font-bold text-white">{m.dom_nom}</div>
                  </div>
                  <div className="text-4xl font-oswald font-bold text-cmr-yellow px-4">
                    {m.dom_score ?? '?'} - {m.ext_score ?? '?'}
                  </div>
                  <div className="flex-1 text-center">
                    <div className="font-oswald font-bold text-white">{m.ext_nom}</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => approuver(m)} disabled={processing === m.id}
                    className="flex-1 py-3 rounded bg-green-700 hover:bg-green-600 text-white font-oswald tracking-wider text-sm transition-colors">
                    {processing === m.id ? '...' : 'APPROUVER'}
                  </button>
                  <button onClick={() => rejeter(m)} disabled={processing === m.id}
                    className="flex-1 py-3 rounded bg-red-900 hover:bg-red-800 text-white font-oswald tracking-wider text-sm transition-colors">
                    {processing === m.id ? '...' : 'REJETER'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
