Normal — l'ancien admin n'utilise plus les tabs, on l'a remplacé par le dashboard. Le contenu encodage/matchs/clubs est dans l'ancien fichier sauvegardé. Recrée les 3 pages directement :
bashcd ~/Downloads/cmr-sports-hub

# Page encoder scores
cat > src/app/admin/encoder/page.tsx << 'EOF'
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Save, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { MatchView } from '@/lib/supabase'

export default function EncoderScorePage() {
  const [matchs, setMatchs] = useState<MatchView[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok'|'err'; text: string }|null>(null)
  const [scoreForm, setScoreForm] = useState({
    match_id: '', score_domicile: '', score_exterieur: '', statut: 'termine', minute: '',
  })

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    const { data } = await supabase.from('v_matchs').select('*').in('statut', ['planifie','en_direct']).order('date_match').limit(50)
    setMatchs((data ?? []) as MatchView[])
    setLoading(false)
  }

  async function encoderScore(e: React.FormEvent) {
    e.preventDefault()
    if (!scoreForm.match_id) return
    setSaving(true)
    setMessage(null)
    const update: any = {
      score_domicile: parseInt(scoreForm.score_domicile),
      score_exterieur: parseInt(scoreForm.score_exterieur),
      statut: scoreForm.statut,
    }
    if (scoreForm.minute) update.minute_actuelle = parseInt(scoreForm.minute)
    const { error } = await supabase.from('matchs').update(update).eq('id', scoreForm.match_id)
    if (error) {
      setMessage({ type: 'err', text: `Erreur : ${error.message}` })
    } else {
      setMessage({ type: 'ok', text: '✅ Score encodé !' })
      const match = matchs.find(m => m.id === scoreForm.match_id)
      if (match && scoreForm.statut === 'termine') {
        await supabase.rpc('recalcule_classement', { p_competition_id: match.competition_id })
      }
      setScoreForm({ match_id: '', score_domicile: '', score_exterieur: '', statut: 'termine', minute: '' })
      loadData()
    }
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-dark p-6">
      <div className="max-w-screen-lg mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-oswald font-bold text-3xl tracking-widest text-cmr-yellow">🏆 ENCODER SCORES</h1>
          <Link href="/admin" className="btn-outline text-sm">← Dashboard</Link>
        </div>

        {message && (
          <div className={`flex items-center gap-3 p-4 rounded-lg mb-6 font-oswald tracking-wide ${message.type === 'ok' ? 'bg-green-900/30 border border-green-600 text-green-300' : 'bg-red-900/30 border border-red-600 text-red-300'}`}>
            {message.type === 'ok' ? <CheckCircle size={18}/> : <AlertCircle size={18}/>}
            {message.text}
            <button onClick={() => setMessage(null)} className="ml-auto text-xs opacity-60 hover:opacity-100">✕</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <form onSubmit={encoderScore} className="card p-6 space-y-4">
              <div>
                <label className="block text-xs text-green-muted font-oswald tracking-wider uppercase mb-2">Match *</label>
                <select value={scoreForm.match_id} onChange={e => setScoreForm(p => ({ ...p, match_id: e.target.value }))} required className="form-select">
                  <option value="">-- Choisir un match --</option>
                  {matchs.map(m => (
                    <option key={m.id} value={m.id}>{m.competition_nom} J{m.journee} · {m.dom_nom} vs {m.ext_nom}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-green-muted font-oswald tracking-wider uppercase mb-2">Domicile</label>
                  <input type="number" min="0" max="99" value={scoreForm.score_domicile} onChange={e => setScoreForm(p => ({ ...p, score_domicile: e.target.value }))} required className="w-full bg-deep border border-border rounded px-3 py-3 text-3xl font-oswald text-center text-white focus:border-cmr-yellow outline-none" placeholder="0"/>
                </div>
                <div>
                  <label className="block text-xs text-green-muted font-oswald tracking-wider uppercase mb-2">Extérieur</label>
                  <input type="number" min="0" max="99" value={scoreForm.score_exterieur} onChange={e => setScoreForm(p => ({ ...p, score_exterieur: e.target.value }))} required className="w-full bg-deep border border-border rounded px-3 py-3 text-3xl font-oswald text-center text-white focus:border-cmr-yellow outline-none" placeholder="0"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-green-muted font-oswald tracking-wider uppercase mb-2">Statut</label>
                  <select value={scoreForm.statut} onChange={e => setScoreForm(p => ({ ...p, statut: e.target.value }))} className="form-select">
                    <option value="en_direct">🔴 En Direct</option>
                    <option value="termine">✅ Terminé</option>
                  </select>
                </div>
                {scoreForm.statut === 'en_direct' && (
                  <div>
                    <label className="block text-xs text-green-muted font-oswald tracking-wider uppercase mb-2">Minute</label>
                    <input type="number" min="1" max="120" value={scoreForm.minute} onChange={e => setScoreForm(p => ({ ...p, minute: e.target.value }))} className="form-input" placeholder="67"/>
                  </div>
                )}
              </div>
              <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
                {saving ? <><RefreshCw size={16} className="animate-spin"/> Enregistrement...</> : <><Save size={16}/> Encoder le Score</>}
              </button>
            </form>
          </div>

          <div>
            <h2 className="font-oswald text-xl tracking-widest text-white mb-4">Matchs à jouer ({matchs.length})</h2>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {loading && <div className="card p-8 text-center text-green-muted">Chargement...</div>}
              {matchs.map(m => (
                <div key={m.id} onClick={() => setScoreForm(p => ({ ...p, match_id: m.id }))}
                     className={`card p-3 cursor-pointer transition-all hover:border-green-mid ${scoreForm.match_id === m.id ? 'border-cmr-yellow bg-cmr-yellow/5' : ''}`}>
                  <div className="text-xs text-green-muted font-oswald tracking-wider mb-1">{m.competition_nom} · J{m.journee}</div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{m.dom_nom}</span>
                    <span className="text-xs text-green-muted px-2">vs</span>
                    <span className="font-semibold text-sm">{m.ext_nom}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .form-input { width:100%; background:#0e1a12; border:1px solid #1e3224; border-radius:6px; padding:8px 12px; color:white; font-size:14px; outline:none; }
        .form-select { width:100%; background:#0e1a12; border:1px solid #1e3224; border-radius:6px; padding:8px 12px; color:white; font-size:14px; outline:none; }
      `}</style>
    </div>
  )
}
