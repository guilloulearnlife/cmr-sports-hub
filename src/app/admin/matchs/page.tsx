
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Competition, Club } from '@/lib/supabase'

export default function MatchsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [clubs, setClubs] = useState<Club[]>([])
  const [correspondants, setCorrespondants] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok'|'err'; text: string }|null>(null)
  const [form, setForm] = useState({
    competition_id: '', club_domicile_id: '', club_exterieur_id: '',
    journee: '', date_match: '', statut: 'planifie', correspondant_id: '',
  })

  const competitionSelectionnee = competitions.find(c => c.id === form.competition_id)
  const sportSelectionne = competitionSelectionnee?.sport
  const clubsFiltres = sportSelectionne ? clubs.filter(c => c.sport === sportSelectionne) : clubs

  useEffect(() => {
    async function load() {
      const [c, cl] = await Promise.all([
        supabase.from('competitions').select('*').eq('statut', 'en_cours').order('sport'),
        supabase.from('clubs').select('*').eq('actif', true).order('nom'),
      ])
      setCompetitions(c.data ?? [])
      setClubs(cl.data ?? [])

      // Charger correspondants selon le role
      const { data: sessionData } = await supabase.auth.getSession()
      const { data: currentProfile } = await supabase.from('profiles')
        .select('role, id').eq('id', sessionData.session?.user.id ?? '').single()
      
      let q = supabase.from('profiles').select('*').eq('role', 'correspondant').order('email')
      const { data: co } = await q
      setCorrespondants(co ?? [])
    }
    load()
  }, [])

  async function creerMatch(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('matchs').insert({
      competition_id: form.competition_id,
      club_domicile_id: form.club_domicile_id,
      club_exterieur_id: form.club_exterieur_id,
      journee: form.journee ? parseInt(form.journee) : null,
      date_match: form.date_match || null,
      statut: form.statut,
      correspondant_id: form.correspondant_id || null,
    })
    if (error) {
      setMessage({ type: 'err', text: 'Erreur : ' + error.message })
    } else {
      setMessage({ type: 'ok', text: 'Match cree !' })
      setForm({ competition_id: '', club_domicile_id: '', club_exterieur_id: '', journee: '', date_match: '', statut: 'planifie', correspondant_id: '' })
    }
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-dark p-6">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-oswald font-bold text-3xl tracking-widest text-cmr-yellow">PLANIFIER MATCH</h1>
          <Link href="/admin" className="btn-outline text-sm">Dashboard</Link>
        </div>
        {message && (
          <div className={`flex items-center gap-3 p-4 rounded-lg mb-6 ${message.type === 'ok' ? 'bg-green-900/30 border border-green-600 text-green-300' : 'bg-red-900/30 border border-red-600 text-red-300'}`}>
            {message.type === 'ok' ? <CheckCircle size={18}/> : <AlertCircle size={18}/>}
            {message.text}
            <button onClick={() => setMessage(null)} className="ml-auto text-xs opacity-60">X</button>
          </div>
        )}
        <form onSubmit={creerMatch} className="card p-6 space-y-4">
          <div>
            <label className="block text-xs text-green-muted font-oswald tracking-wider uppercase mb-2">Competition *</label>
            <select value={form.competition_id}
              onChange={e => setForm(p=>({...p, competition_id: e.target.value, club_domicile_id: '', club_exterieur_id: ''}))}
              required className="form-select">
              <option value="">-- Choisir --</option>
              {competitions.map(c => <option key={c.id} value={c.id}>{c.nom} ({c.sport})</option>)}
            </select>
          </div>
          {sportSelectionne && (
            <div className="text-xs text-cmr-yellow font-oswald tracking-wider bg-green-900/20 border border-green-800 rounded px-3 py-2">
              SPORT : {sportSelectionne.toUpperCase()} — {clubsFiltres.length} clubs disponibles
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-green-muted font-oswald tracking-wider uppercase mb-2">Domicile *</label>
              <select value={form.club_domicile_id}
                onChange={e => setForm(p=>({...p, club_domicile_id: e.target.value}))}
                required className="form-select" disabled={!sportSelectionne}>
                <option value="">-- Choisir --</option>
                {clubsFiltres.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-green-muted font-oswald tracking-wider uppercase mb-2">Exterieur *</label>
              <select value={form.club_exterieur_id}
                onChange={e => setForm(p=>({...p, club_exterieur_id: e.target.value}))}
                required className="form-select" disabled={!sportSelectionne}>
                <option value="">-- Choisir --</option>
                {clubsFiltres.filter(c => c.id !== form.club_domicile_id).map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-green-muted font-oswald tracking-wider uppercase mb-2">Journee</label>
              <input type="number" min="1" max="50" value={form.journee}
                onChange={e => setForm(p=>({...p, journee: e.target.value}))}
                className="form-input" placeholder="5"/>
            </div>
            <div>
              <label className="block text-xs text-green-muted font-oswald tracking-wider uppercase mb-2">Date et Heure</label>
              <input type="datetime-local" value={form.date_match}
                onChange={e => setForm(p=>({...p, date_match: e.target.value}))}
                className="form-input"/>
            </div>
          </div>
          <div>
            <label className="block text-xs text-green-muted font-oswald tracking-wider uppercase mb-2">Correspondant</label>
            <select value={form.correspondant_id}
              onChange={e => setForm(p=>({...p, correspondant_id: e.target.value}))}
              className="form-select">
              <option value="">-- Aucun --</option>
              {correspondants.map(c => <option key={c.id} value={c.id}>{c.email}</option>)}
            </select>
          </div>
          <button type="submit" disabled={saving || !form.competition_id} className="btn-primary w-full flex items-center justify-center gap-2">
            {saving ? <RefreshCw size={16} className="animate-spin"/> : <Plus size={16}/>}
            {saving ? 'Creation...' : 'Creer le Match'}
          </button>
        </form>
      </div>
      <style jsx global>{`
        .form-input { width:100%; background:#0e1a12; border:1px solid #1e3224; border-radius:6px; padding:8px 12px; color:white; font-size:14px; outline:none; }
        .form-select { width:100%; background:#0e1a12; border:1px solid #1e3224; border-radius:6px; padding:8px 12px; color:white; font-size:14px; outline:none; }
        .form-select:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>
    </div>
  )
}

