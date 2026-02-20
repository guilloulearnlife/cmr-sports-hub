'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const REGIONS = [
  { id: '0a13c16a-ee0a-482f-9f29-68e7f6912ef9', nom: 'Centre' },
  { id: '173296dc-eb1a-47cd-a7a8-5be5ef8b4529', nom: 'Littoral' },
  { id: '4f95cb24-e2d9-4792-9d39-dfef6517a6b9', nom: 'Est' },
  { id: '5261e46a-59ca-4dd0-9d45-7a282cedba3b', nom: 'Sud-Ouest' },
  { id: '760fcf3d-9a82-4b1e-bc67-8724a5789966', nom: 'Nord' },
  { id: 'a70a3a5c-f54d-4725-b5f6-df0ec1b90a50', nom: 'Extrême-Nord' },
  { id: 'ad2dc3ca-8627-4e86-8a43-aa3a27b70e19', nom: 'Ouest' },
  { id: 'e09330a2-d2f2-4aff-9e12-2b324cb5af87', nom: 'Nord-Ouest' },
  { id: 'f00a4f01-e9b3-4f10-9521-8658c3a23080', nom: 'Adamaoua' },
  { id: 'f65b96ac-aaf8-412c-8181-7f94a6404a3a', nom: 'Sud' },
]

export default function UtilisateursPage() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ email: '', password: '', role: 'correspondant', region_id: '' })
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    const { data } = await supabase.from('profiles').select('*').order('role')
    setUsers(data ?? [])
    setLoading(false)
  }

  async function createUser() {
    setCreating(true)
    setMsg(null)
    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMsg({ type: 'success', text: `Utilisateur ${form.email} créé avec succès !` })
      setForm({ email: '', password: '', role: 'correspondant', region_id: '' })
      loadUsers()
    } catch (e: any) {
      setMsg({ type: 'error', text: e.message })
    }
    setCreating(false)
  }

  async function updateRole(userId: string, role: string, region_id: string) {
    await supabase.from('profiles').update({ role, region_id: region_id || null }).eq('id', userId)
    loadUsers()
  }

  const roleColor: Record<string, string> = {
    super_admin: 'text-cmr-yellow',
    admin_regional: 'text-blue-400',
    correspondant: 'text-green-400',
  }

  return (
    <div className="min-h-screen bg-dark p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-oswald font-bold text-3xl tracking-widest text-cmr-yellow">
            👥 UTILISATEURS
          </h1>
          <Link href="/admin" className="btn-outline text-sm">← Admin</Link>
        </div>

        {/* Créer un utilisateur */}
        <div className="card p-6 mb-8">
          <h2 className="font-oswald text-xl text-white tracking-wider mb-4">Créer un compte</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              className="bg-deep border border-border rounded px-3 py-2 text-white text-sm"
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              className="bg-deep border border-border rounded px-3 py-2 text-white text-sm"
            />
            <select
              value={form.role}
              onChange={e => setForm({...form, role: e.target.value})}
              className="bg-deep border border-border rounded px-3 py-2 text-white text-sm"
            >
              <option value="correspondant">Correspondant</option>
              <option value="admin_regional">Admin Régional</option>
            </select>
            <select
              value={form.region_id}
              onChange={e => setForm({...form, region_id: e.target.value})}
              className="bg-deep border border-border rounded px-3 py-2 text-white text-sm"
            >
              <option value="">-- Région (optionnel) --</option>
              {REGIONS.map(r => (
                <option key={r.id} value={r.id}>{r.nom}</option>
              ))}
            </select>
          </div>
          {msg && (
            <div className={`mb-4 p-3 rounded text-sm ${msg.type === 'success' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
              {msg.text}
            </div>
          )}
          <button onClick={createUser} disabled={creating || !form.email || !form.password}
                  className="btn-primary text-sm">
            {creating ? 'Création...' : '+ Créer le compte'}
          </button>
        </div>

        {/* Liste utilisateurs */}
        <div className="card">
          <div className="p-4 border-b border-border">
            <h2 className="font-oswald text-xl text-white tracking-wider">Comptes existants</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-green-muted">Chargement...</div>
          ) : (
            <div className="divide-y divide-border">
              {users.map(u => (
                <div key={u.id} className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-oswald text-white text-sm">{u.email}</div>
                    <div className={`text-xs font-oswald ${roleColor[u.role] ?? 'text-green-muted'}`}>
                      {u.role}
                      {u.region_id && ` · ${REGIONS.find(r => r.id === u.region_id)?.nom ?? ''}`}
                    </div>
                  </div>
                  {u.role !== 'super_admin' && (
                    <div className="flex gap-2">
                      <select
                        defaultValue={u.role}
                        onChange={e => updateRole(u.id, e.target.value, u.region_id ?? '')}
                        className="bg-deep border border-border rounded px-2 py-1 text-white text-xs"
                      >
                        <option value="correspondant">Correspondant</option>
                        <option value="admin_regional">Admin Régional</option>
                      </select>
                      <select
                        defaultValue={u.region_id ?? ''}
                        onChange={e => updateRole(u.id, u.role, e.target.value)}
                        className="bg-deep border border-border rounded px-2 py-1 text-white text-xs"
                      >
                        <option value="">Région</option>
                        {REGIONS.map(r => (
                          <option key={r.id} value={r.id}>{r.nom}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
