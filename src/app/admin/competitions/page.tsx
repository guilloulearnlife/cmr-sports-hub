'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, RefreshCw, CheckCircle, AlertCircle, Pencil, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const SPORTS = ['football', 'basketball', 'volleyball', 'handball', 'billard', 'boxe', 'athletisme']
const TYPES = ['championnat', 'coupe', 'tournoi', 'amical']
const GENRES = ['masculin', 'feminin', 'mixte']

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<any[]>([])
  const [federations, setFederations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({
    nom: '', nom_court: '', slug: '', sport: 'football', type: 'championnat',
    genre: 'masculin', saison: '2024-2025', statut: 'en_cours',
    nb_journees: '30', federation_id: '', sponsor_principal: '',
  })

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    const [{ data: comps }, { data: feds }] = await Promise.all([
      supabase.from('competitions').select('*, federations(nom_court)').order('sport'),
      supabase.from('federations').select('id, nom_court, sport').order('nom_court'),
    ])
    setCompetitions(comps ?? [])
    setFederations(feds ?? [])
    setLoading(false)
  }

  function resetForm() {
    setForm({ nom: '', nom_court: '', slug: '', sport: 'football', type: 'championnat', genre: 'masculin', saison: '2024-2025', statut: 'en_cours', nb_journees: '30', federation_id: '', sponsor_principal: '' })
    setEditId(null)
  }

  function startEdit(c: any) {
    setEditId(c.id)
    setForm({
      nom: c.nom ?? '', nom_court: c.nom_court ?? '', slug: c.slug ?? '',
      sport: c.sport ?? 'football', type: c.type ?? 'championnat',
      genre: c.genre ?? 'masculin', saison: c.saison ?? '2024-2025',
      statut: c.statut ?? 'en_cours', nb_journees: String(c.nb_journees ?? 30),
      federation_id: c.federation_id ?? '', sponsor_principal: c.sponsor_principal ?? '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function sauvegarder(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    const payload = {
      ...form,
      slug: form.slug || form.nom.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      nb_journees: parseInt(form.nb_journees) || null,
      federation_id: form.federation_id || null,
    }
    const { error } = editId
      ? await supabase.from('competitions').update(payload).eq('id', editId)
      : await supabase.from('competitions').insert(payload)
    if (error) {
      setMessage({ type: 'err', text: 'Erreur : ' + error.message })
    } else {
      setMessage({ type: 'ok', text: editId ? 'Competition mise a jour !' : 'Competition creee !' })
      resetForm()
      loadData()
    }
    setSaving(false)
  }

  async function toggleStatut(c: any) {
    const newStatut = c.statut === 'en_cours' ? 'termine' : 'en_cours'
    await supabase.from('competitions').update({ statut: newStatut }).eq('id', c.id)
    loadData()
  }

  const STATUT_COLOR: Record<string, string> = {
    en_cours: 'text-green-400 bg-green-900/30 border-green-700',
    termine: 'text-gray-400 bg-gray-900/30 border-gray-700',
    planifie: 'text-yellow-400 bg-yellow-900/30 border-yellow-700',
  }

  return (
    <div className="min-h-screen bg-dark p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-oswald font-bold text-3xl tracking-widest text-cmr-yellow">COMPETITIONS</h1>
          <div className="flex gap-3">
            {editId && <button onClick={resetForm} className="btn-outline text-sm flex items-center gap-2"><X size={14}/> Annuler</button>}
            <Link href="/admin" className="btn-outline text-sm">Dashboard</Link>
          </div>
        </div>

        {message && (
          <div className={`flex items-center gap-3 p-4 rounded-lg mb-6 ${message.type === 'ok' ? 'bg-green-900/30 border border-green-600 text-green-300' : 'bg-red-900/30 border border-red-600 text-red-300'}`}>
            {message.type === 'ok' ? <CheckCircle size={18}/> : <AlertCircle size={18}/>}
            {message.text}
            <button onClick={() => setMessage(null)} className="ml-auto text-xs opacity-60">X</button>
          </div>
        )}

        <form onSubmit={sauvegarder} className="card p-6 mb-8">
          <h2 className="font-oswald text-lg tracking-wider text-cmr-yellow mb-4">
            {editId ? 'Modifier la competition' : '+ Nouvelle competition'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Nom complet *</label>
              <input value={form.nom} onChange={e => setForm(p => ({ ...p, nom: e.target.value }))} required className="form-input" placeholder="MTN Elite One 2024-2025"/>
            </div>
            <div>
              <label className="label-field">Nom court</label>
              <input value={form.nom_court} onChange={e => setForm(p => ({ ...p, nom_court: e.target.value }))} className="form-input" placeholder="Elite One"/>
            </div>
            <div>
              <label className="label-field">Slug URL</label>
              <input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} className="form-input" placeholder="elite-one-2024-2025"/>
            </div>
            <div>
              <label className="label-field">Saison</label>
              <input value={form.saison} onChange={e => setForm(p => ({ ...p, saison: e.target.value }))} className="form-input" placeholder="2024-2025"/>
            </div>
            <div>
              <label className="label-field">Sport *</label>
              <select value={form.sport} onChange={e => setForm(p => ({ ...p, sport: e.target.value }))} required className="form-select">
                {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">Type</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="form-select">
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">Genre</label>
              <select value={form.genre} onChange={e => setForm(p => ({ ...p, genre: e.target.value }))} className="form-select">
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">Statut</label>
              <select value={form.statut} onChange={e => setForm(p => ({ ...p, statut: e.target.value }))} className="form-select">
                <option value="en_cours">En cours</option>
                <option value="planifie">Planifiee</option>
                <option value="termine">Terminee</option>
              </select>
            </div>
            <div>
              <label className="label-field">Nb journees</label>
              <input type="number" value={form.nb_journees} onChange={e => setForm(p => ({ ...p, nb_journees: e.target.value }))} className="form-input" placeholder="30"/>
            </div>
            <div>
              <label className="label-field">Federation</label>
              <select value={form.federation_id} onChange={e => setForm(p => ({ ...p, federation_id: e.target.value }))} className="form-select">
                <option value="">-- Aucune --</option>
                {federations.map(f => <option key={f.id} value={f.id}>{f.nom_court} ({f.sport})</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">Sponsor principal</label>
              <input value={form.sponsor_principal} onChange={e => setForm(p => ({ ...p, sponsor_principal: e.target.value }))} className="form-input" placeholder="MTN Cameroun"/>
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary mt-6 flex items-center gap-2">
            {saving ? <RefreshCw size={16} className="animate-spin"/> : <Plus size={16}/>}
            {saving ? 'Sauvegarde...' : editId ? 'Mettre a jour' : 'Creer la competition'}
          </button>
        </form>

        <div className="card overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-oswald tracking-wider text-white">Toutes les competitions ({competitions.length})</h2>
            {loading && <RefreshCw size={16} className="animate-spin text-cmr-yellow"/>}
          </div>
          <div className="divide-y divide-border">
            {competitions.map(c => (
              <div key={c.id} className="p-4 flex items-center gap-4 hover:bg-card/50 transition-colors">
                <div className="text-2xl">{c.sport === 'football' ? '\u26bd' : c.sport === 'basketball' ? '\ud83c\udfc0' : c.sport === 'volleyball' ? '\ud83c\udfd0' : '\ud83c\udfc6'}</div>
                <div className="flex-1">
                  <div className="font-barlow-condensed font-semibold">{c.nom}</div>
                  <div className="text-xs text-green-muted mt-0.5">
                    {c.sport} · {c.type} · {c.genre} · {c.saison}
                    {c.federations?.nom_court && ` · ${c.federations.nom_court}`}
                  </div>
                </div>
                <span className={`text-xs font-oswald px-2 py-1 rounded border ${STATUT_COLOR[c.statut] ?? ''}`}>{c.statut}</span>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(c)} className="p-2 rounded border border-border text-green-muted hover:border-cmr-yellow hover:text-cmr-yellow transition-colors">
                    <Pencil size={14}/>
                  </button>
                  <button onClick={() => toggleStatut(c)} className="p-2 rounded border border-border text-green-muted hover:border-cmr-yellow hover:text-cmr-yellow transition-colors text-xs font-oswald">
                    {c.statut === 'en_cours' ? '\u23f9' : '\u25b6'}
                  </button>
                  <Link href={`/${c.sport}/${c.slug}/classement`} className="p-2 rounded border border-border text-green-muted hover:border-cmr-yellow hover:text-cmr-yellow transition-colors text-xs">
                    \ud83d\udc41
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx global>{`
        .label-field { display:block; font-size:11px; color:#6b9e7e; font-family:'Oswald',sans-serif; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:6px; }
        .form-input { width:100%; background:#0e1a12; border:1px solid #1e3224; border-radius:6px; padding:8px 12px; color:white; font-size:14px; outline:none; }
        .form-select { width:100%; background:#0e1a12; border:1px solid #1e3224; border-radius:6px; padding:8px 12px; color:white; font-size:14px; outline:none; }
      `}</style>
    </div>
  )
}
