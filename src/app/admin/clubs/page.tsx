
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Plus, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ClubsPage() {
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok'|'err'; text: string }|null>(null)
  const [form, setForm] = useState({
    slug: '', nom: '', sigle: '', sport: 'football', ville: '', federation_id: '',
  })

  async function creerClub(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('clubs').insert({
      ...form,
      slug: form.slug || form.nom.toLowerCase().replace(/\s+/g, '-'),
    })
    if (error) {
      setMessage({ type: 'err', text: 'Erreur : ' + error.message })
    } else {
      setMessage({ type: 'ok', text: 'Club cree !' })
      setForm({ slug: '', nom: '', sigle: '', sport: 'football', ville: '', federation_id: '' })
    }
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-dark p-6">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-oswald font-bold text-3xl tracking-widest text-cmr-yellow">CREER CLUB</h1>
          <Link href={dashboardHref} className="btn-outline text-sm">Dashboard</Link>
        </div>

        {message && (
          <div className={`flex items-center gap-3 p-4 rounded-lg mb-6 ${message.type === 'ok' ? 'bg-green-900/30 border border-green-600 text-green-300' : 'bg-red-900/30 border border-red-600 text-red-300'}`}>
            {message.type === 'ok' ? <CheckCircle size={18}/> : <AlertCircle size={18}/>}
            {message.text}
            <button onClick={() => setMessage(null)} className="ml-auto text-xs opacity-60">X</button>
          </div>
        )}

        <form onSubmit={creerClub} className="card p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-green-muted font-oswald tracking-wider uppercase mb-2">Nom complet *</label>
              <input type="text" value={form.nom} onChange={e => setForm(p=>({...p, nom: e.target.value}))} required className="form-input" placeholder="Canon Yaounde"/>
            </div>
            <div>
              <label className="block text-xs text-green-muted font-oswald tracking-wider uppercase mb-2">Sigle</label>
              <input type="text" maxLength={3} value={form.sigle} onChange={e => setForm(p=>({...p, sigle: e.target.value.toUpperCase()}))} className="form-input" placeholder="CYD"/>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-green-muted font-oswald tracking-wider uppercase mb-2">Sport *</label>
              <select value={form.sport} onChange={e => setForm(p=>({...p, sport: e.target.value}))} className="form-select">
                {['football','basketball','volleyball','handball','billard','boxe','athletisme'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-green-muted font-oswald tracking-wider uppercase mb-2">Ville</label>
              <input type="text" value={form.ville} onChange={e => setForm(p=>({...p, ville: e.target.value}))} className="form-input" placeholder="Yaounde"/>
            </div>
          </div>
          <div>
            <label className="block text-xs text-green-muted font-oswald tracking-wider uppercase mb-2">Slug (optionnel)</label>
            <input type="text" value={form.slug} onChange={e => setForm(p=>({...p, slug: e.target.value}))} className="form-input" placeholder="canon-yaounde"/>
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
            {saving ? <RefreshCw size={16} className="animate-spin"/> : <Plus size={16}/>}
            {saving ? 'Creation...' : 'Creer le Club'}
          </button>
        </form>
      </div>
      <style jsx global>{`
        .form-input { width:100%; background:#0e1a12; border:1px solid #1e3224; border-radius:6px; padding:8px 12px; color:white; font-size:14px; outline:none; }
        .form-select { width:100%; background:#0e1a12; border:1px solid #1e3224; border-radius:6px; padding:8px 12px; color:white; font-size:14px; outline:none; }
      `}</style>
    </div>
  )
}
