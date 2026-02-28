'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, RefreshCw, CheckCircle, AlertCircle, Pencil, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const SPORTS = ['football', 'basketball', 'volleyball', 'handball', 'billard', 'boxe', 'athletisme']
const POSTES = ['Gardien', 'Defenseur', 'Milieu', 'Attaquant', 'Pivot', 'Ailier', 'Meneur', 'Libero', 'Passeur']

export default function AdminJoueursPage() {
  const [joueurs, setJoueurs] = useState<any[]>([])
  const [clubs, setClubs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [recherche, setRecherche] = useState('')
  const [form, setForm] = useState({
    prenom: '', nom: '', surnom: '', sport: 'football', poste: '',
    numero_maillot: '', nationalite: 'Camerounaise', ville_origine: '',
    date_naissance: '', taille_cm: '', poids_kg: '', pied_fort: 'droit',
    club_actuel_id: '', photo_url: '', bio: '',
  })

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    const [{ data: j }, { data: c }] = await Promise.all([
      supabase.from('joueurs').select('*, clubs(nom, sigle, sport)').eq('actif', true).order('nom'),
      supabase.from('clubs').select('id, nom, sigle, sport').eq('actif', true).order('sport'),
    ])
    setJoueurs(j ?? [])
    setClubs(c ?? [])
    setLoading(false)
  }

  function resetForm() {
    setForm({ prenom: '', nom: '', surnom: '', sport: 'football', poste: '', numero_maillot: '', nationalite: 'Camerounaise', ville_origine: '', date_naissance: '', taille_cm: '', poids_kg: '', pied_fort: 'droit', club_actuel_id: '', photo_url: '', bio: '' })
    setEditId(null)
  }

  function startEdit(j: any) {
    setEditId(j.id)
    setForm({
      prenom: j.prenom ?? '', nom: j.nom ?? '', surnom: j.surnom ?? '',
      sport: j.sport ?? 'football', poste: j.poste ?? '',
      numero_maillot: String(j.numero_maillot ?? ''), nationalite: j.nationalite ?? 'Camerounaise',
      ville_origine: j.ville_origine ?? '', date_naissance: j.date_naissance ?? '',
      taille_cm: String(j.taille_cm ?? ''), poids_kg: String(j.poids_kg ?? ''),
      pied_fort: j.pied_fort ?? 'droit', club_actuel_id: j.club_actuel_id ?? '',
      photo_url: j.photo_url ?? '', bio: j.bio ?? '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function sauvegarder(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    const payload = {
      prenom: form.prenom,
      nom: form.nom,
      nom_complet: `${form.prenom} ${form.nom}`.trim(),
      surnom: form.surnom || null,
      sport: form.sport,
      poste: form.poste || null,
      numero_maillot: form.numero_maillot ? parseInt(form.numero_maillot) : null,
      nationalite: form.nationalite || null,
      ville_origine: form.ville_origine || null,
      date_naissance: form.date_naissance || null,
      taille_cm: form.taille_cm ? parseInt(form.taille_cm) : null,
      poids_kg: form.poids_kg ? parseFloat(form.poids_kg) : null,
      pied_fort: form.pied_fort || null,
      club_actuel_id: form.club_actuel_id || null,
      photo_url: form.photo_url || null,
      bio: form.bio || null,
      actif: true,
    }
    const { error } = editId
      ? await supabase.from('joueurs').update(payload).eq('id', editId)
      : await supabase.from('joueurs').insert(payload)
    if (error) {
      setMessage({ type: 'err', text: 'Erreur : ' + error.message })
    } else {
      setMessage({ type: 'ok', text: editId ? 'Joueur mis a jour !' : 'Joueur cree !' })
      resetForm()
      loadData()
    }
    setSaving(false)
  }

  async function desactiver(id: string) {
    if (!confirm('Desactiver ce joueur ?')) return
    await supabase.from('joueurs').update({ actif: false }).eq('id', id)
    loadData()
  }

  const clubsFiltres = clubs.filter(c => c.sport === form.sport)
  const joueursFiltres = joueurs.filter(j =>
    !recherche || j.nom_complet?.toLowerCase().includes(recherche.toLowerCase()) || j.clubs?.nom?.toLowerCase().includes(recherche.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-dark p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-oswald font-bold text-3xl tracking-widest text-cmr-yellow">JOUEURS</h1>
          <div className="flex gap-3">
            {editId && <button onClick={resetForm} className="btn-outline text-sm flex items-center gap-2"><X size={14}/> Annuler</button>}
            <Link href={dashboardHref} className="btn-outline text-sm">Dashboard</Link>
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
            {editId ? 'Modifier le joueur' : '+ Nouveau joueur'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label-field">Prenom *</label>
              <input value={form.prenom} onChange={e => setForm(p => ({ ...p, prenom: e.target.value }))} required className="form-input" placeholder="Samuel"/>
            </div>
            <div>
              <label className="label-field">Nom *</label>
              <input value={form.nom} onChange={e => setForm(p => ({ ...p, nom: e.target.value }))} required className="form-input" placeholder="Eto o"/>
            </div>
            <div>
              <label className="label-field">Surnom</label>
              <input value={form.surnom} onChange={e => setForm(p => ({ ...p, surnom: e.target.value }))} className="form-input" placeholder="The African Lion"/>
            </div>
            <div>
              <label className="label-field">Sport *</label>
              <select value={form.sport} onChange={e => setForm(p => ({ ...p, sport: e.target.value, club_actuel_id: '' }))} required className="form-select">
                {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">Club actuel</label>
              <select value={form.club_actuel_id} onChange={e => setForm(p => ({ ...p, club_actuel_id: e.target.value }))} className="form-select">
                <option value="">-- Sans club --</option>
                {clubsFiltres.map(c => <option key={c.id} value={c.id}>{c.nom} ({c.sigle})</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">Poste</label>
              <select value={form.poste} onChange={e => setForm(p => ({ ...p, poste: e.target.value }))} className="form-select">
                <option value="">-- Poste --</option>
                {POSTES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">Numero maillot</label>
              <input type="number" value={form.numero_maillot} onChange={e => setForm(p => ({ ...p, numero_maillot: e.target.value }))} className="form-input" placeholder="9"/>
            </div>
            <div>
              <label className="label-field">Date naissance</label>
              <input type="date" value={form.date_naissance} onChange={e => setForm(p => ({ ...p, date_naissance: e.target.value }))} className="form-input"/>
            </div>
            <div>
              <label className="label-field">Nationalite</label>
              <input value={form.nationalite} onChange={e => setForm(p => ({ ...p, nationalite: e.target.value }))} className="form-input" placeholder="Camerounaise"/>
            </div>
            <div>
              <label className="label-field">Ville origine</label>
              <input value={form.ville_origine} onChange={e => setForm(p => ({ ...p, ville_origine: e.target.value }))} className="form-input" placeholder="Douala"/>
            </div>
            <div>
              <label className="label-field">Taille (cm)</label>
              <input type="number" value={form.taille_cm} onChange={e => setForm(p => ({ ...p, taille_cm: e.target.value }))} className="form-input" placeholder="178"/>
            </div>
            <div>
              <label className="label-field">Pied fort</label>
              <select value={form.pied_fort} onChange={e => setForm(p => ({ ...p, pied_fort: e.target.value }))} className="form-select">
                <option value="droit">Droit</option>
                <option value="gauche">Gauche</option>
                <option value="les deux">Les deux</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="label-field">URL Photo</label>
              <input value={form.photo_url} onChange={e => setForm(p => ({ ...p, photo_url: e.target.value }))} className="form-input" placeholder="https://..."/>
            </div>
            <div className="md:col-span-3">
              <label className="label-field">Bio</label>
              <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} className="form-input" rows={3} placeholder="Biographie du joueur..."/>
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary mt-6 flex items-center gap-2">
            {saving ? <RefreshCw size={16} className="animate-spin"/> : <Plus size={16}/>}
            {saving ? 'Sauvegarde...' : editId ? 'Mettre a jour' : 'Creer le joueur'}
          </button>
        </form>

        <div className="card overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between gap-4">
            <h2 className="font-oswald tracking-wider text-white">Joueurs ({joueursFiltres.length})</h2>
            <input type="text" value={recherche} onChange={e => setRecherche(e.target.value)}
              placeholder="Rechercher..." className="form-input max-w-xs text-sm py-1.5"/>
            {loading && <RefreshCw size={16} className="animate-spin text-cmr-yellow flex-shrink-0"/>}
          </div>
          <div className="divide-y divide-border">
            {joueursFiltres.map(j => (
              <div key={j.id} className="p-4 flex items-center gap-4 hover:bg-card/50 transition-colors">
                {j.photo_url ? (
                  <img src={j.photo_url} alt={j.nom_complet} className="w-10 h-10 rounded-full object-cover border border-border flex-shrink-0"/>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-green-mid flex items-center justify-center text-xs font-oswald font-bold text-white flex-shrink-0">
                    {j.nom?.slice(0,2)?.toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-barlow-condensed font-semibold">{j.nom_complet}</div>
                  <div className="text-xs text-green-muted mt-0.5">
                    {j.poste} · {j.sport} · {j.clubs?.nom ?? 'Sans club'}
                    {j.numero_maillot && ` · #${j.numero_maillot}`}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(j)} className="p-2 rounded border border-border text-green-muted hover:border-cmr-yellow hover:text-cmr-yellow transition-colors">
                    <Pencil size={14}/>
                  </button>
                  <Link href={`/joueur/${j.id}`} target="_blank" className="p-2 rounded border border-border text-green-muted hover:border-cmr-yellow hover:text-cmr-yellow transition-colors text-xs">
                    👁
                  </Link>
                  <button onClick={() => desactiver(j.id)} className="p-2 rounded border border-border text-red-400 hover:border-red-500 transition-colors">
                    <X size={14}/>
                  </button>
                </div>
              </div>
            ))}
            {joueursFiltres.length === 0 && !loading && (
              <div className="p-8 text-center text-green-muted font-oswald tracking-wider">Aucun joueur</div>
            )}
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
