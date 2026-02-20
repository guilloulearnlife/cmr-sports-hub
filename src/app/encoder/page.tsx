
'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

export default function EncoderPage() {
  const [user, setUser] = useState<any>(null)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [logging, setLogging] = useState(false)
  const [matchs, setMatchs] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [scores, setScores] = useState({ dom: '', ext: '', statut: 'en_direct' })
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser(data.session.user)
        loadMatchs(data.session.user.id)
      }
    })
  }, [])

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setLogging(true)
    setLoginError('')
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password,
    })
    if (error) {
      setLoginError('Email ou mot de passe incorrect')
    } else if (data.user) {
      setUser(data.user)
      loadMatchs(data.user.id)
    }
    setLogging(false)
  }

  async function loadMatchs(userId: string) {
    setLoading(true)
    const { data } = await supabase
      .from('v_matchs')
      .select('*')
      .in('statut', ['planifie', 'en_direct'])
      .eq('correspondant_id', userId)
      .order('date_match')
    setMatchs(data ?? [])
    setLoading(false)
  }

  async function submit() {
    if (!selected) return
    setSending(true)
    setMsg(null)
    const { error } = await supabase
      .from('matchs')
      .update({
        score_domicile: parseInt(scores.dom),
        score_exterieur: parseInt(scores.ext),
        statut: 'en_attente',
      })
      .eq('id', selected.id)

    if (error) {
      setMsg({ type: 'error', text: 'Erreur : ' + error.message })
    } else {
      setMsg({ type: 'success', text: 'Score soumis ! En attente de validation.' })
      setSelected(null)
      setScores({ dom: '', ext: '', statut: 'en_direct' })
      loadMatchs(user.id)
    }
    setSending(false)
  }

  async function deconnexion() {
    await supabase.auth.signOut()
    setUser(null)
    setMatchs([])
  }

  const s = { minHeight: '100vh', background: '#0a100d', color: '#fff', fontFamily: 'Arial, sans-serif', padding: '16px', maxWidth: '480px', margin: '0 auto' }

  // Page de connexion
  if (!user) return (
    <div style={s}>
      <div style={{ background: '#007a3d', borderRadius: 8, padding: '12px 16px', marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 'bold' }}>🇨🇲 CMR Sports</div>
        <div style={{ fontSize: 12, opacity: 0.8 }}>Espace correspondant</div>
      </div>
      <div style={{ background: '#1a4a2e', borderRadius: 8, padding: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 16 }}>Connexion</div>
        {loginError && (
          <div style={{ background: '#7f1d1d', borderRadius: 6, padding: '10px 12px', marginBottom: 12, fontSize: 13 }}>
            {loginError}
          </div>
        )}
        <input
          type="email" placeholder="Email" value={loginForm.email}
          onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
          style={{ width: '100%', background: '#0a100d', border: '1px solid #2d6a4f', borderRadius: 6, padding: '10px 12px', color: '#fff', fontSize: 14, marginBottom: 10, boxSizing: 'border-box' }}
        />
        <input
          type="password" placeholder="Mot de passe" value={loginForm.password}
          onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
          style={{ width: '100%', background: '#0a100d', border: '1px solid #2d6a4f', borderRadius: 6, padding: '10px 12px', color: '#fff', fontSize: 14, marginBottom: 16, boxSizing: 'border-box' }}
        />
        <button onClick={login} disabled={logging}
          style={{ width: '100%', padding: '12px', borderRadius: 8, background: '#f5c518', color: '#000', fontWeight: 'bold', fontSize: 15, border: 'none', cursor: 'pointer' }}>
          {logging ? 'Connexion...' : 'Se connecter'}
        </button>
      </div>
    </div>
  )

  return (
    <div style={s}>
      <div style={{ background: '#007a3d', borderRadius: 8, padding: '12px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 'bold' }}>🇨🇲 CMR Sports</div>
          <div style={{ fontSize: 11, opacity: 0.8 }}>{user.email}</div>
        </div>
        <button onClick={deconnexion} style={{ background: 'rgba(0,0,0,0.3)', border: 'none', color: '#fff', borderRadius: 6, padding: '6px 10px', fontSize: 12, cursor: 'pointer' }}>
          Déconnexion
        </button>
      </div>

      {msg && (
        <div style={{ background: msg.type === 'success' ? '#14532d' : '#7f1d1d', borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontSize: 14 }}>
          {msg.text}
        </div>
      )}

      {!selected ? (
        <div>
          <div style={{ fontSize: 14, color: '#9ca3af', marginBottom: 12 }}>
            {loading ? 'Chargement...' : `${matchs.length} match(s) assigné(s)`}
          </div>
          {matchs.length === 0 && !loading && (
            <div style={{ background: '#1a4a2e', borderRadius: 8, padding: 24, textAlign: 'center', color: '#9ca3af' }}>
              Aucun match assigné pour le moment
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {matchs.map(m => (
              <button key={m.id} onClick={() => { setSelected(m); setMsg(null) }}
                style={{ background: '#1a4a2e', border: '1px solid #2d6a4f', borderRadius: 8, padding: '12px 16px', textAlign: 'left', cursor: 'pointer', color: '#fff' }}>
                <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>
                  {m.sport?.toUpperCase()} · J{m.journee} · {m.statut === 'en_direct' ? '🔴 LIVE' : '⏳ Planifié'}
                </div>
                <div style={{ fontSize: 15, fontWeight: 'bold' }}>{m.dom_nom}</div>
                <div style={{ fontSize: 13, color: '#9ca3af' }}>vs {m.ext_nom}</div>
                <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>
                  {m.date_match ? new Date(m.date_match).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div style={{ background: '#1a4a2e', borderRadius: 8, padding: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 8 }}>
              {selected.sport?.toUpperCase()} · Journée {selected.journee}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 'bold' }}>{selected.dom_nom}</div>
                <input type="number" min="0" max="20" value={scores.dom}
                  onChange={e => setScores({ ...scores, dom: e.target.value })}
                  placeholder="0"
                  style={{ width: '100%', marginTop: 8, background: '#0a100d', border: '2px solid #f5c518', borderRadius: 8, color: '#f5c518', fontSize: 32, fontWeight: 'bold', textAlign: 'center', padding: '8px 0' }} />
              </div>
              <div style={{ fontSize: 20, color: '#9ca3af', fontWeight: 'bold' }}>-</div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 'bold' }}>{selected.ext_nom}</div>
                <input type="number" min="0" max="20" value={scores.ext}
                  onChange={e => setScores({ ...scores, ext: e.target.value })}
                  placeholder="0"
                  style={{ width: '100%', marginTop: 8, background: '#0a100d', border: '2px solid #f5c518', borderRadius: 8, color: '#f5c518', fontSize: 32, fontWeight: 'bold', textAlign: 'center', padding: '8px 0' }} />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 8 }}>Statut du match</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ val: 'en_direct', label: '🔴 En direct' }, { val: 'termine', label: '✅ Terminé' }].map(s => (
                <button key={s.val} onClick={() => setScores({ ...scores, statut: s.val })}
                  style={{ flex: 1, padding: '10px 8px', borderRadius: 8, border: '2px solid', borderColor: scores.statut === s.val ? '#f5c518' : '#2d6a4f', background: scores.statut === s.val ? '#3a2a00' : '#1a4a2e', color: scores.statut === s.val ? '#f5c518' : '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 'bold' }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={submit} disabled={sending || scores.dom === '' || scores.ext === ''}
            style={{ width: '100%', padding: '14px', borderRadius: 8, background: scores.dom === '' || scores.ext === '' ? '#2d6a4f' : '#f5c518', color: '#000', fontWeight: 'bold', fontSize: 16, border: 'none', cursor: 'pointer', marginBottom: 8 }}>
            {sending ? 'Envoi...' : '📤 Soumettre le score'}
          </button>
          <button onClick={() => { setSelected(null); setMsg(null) }}
            style={{ width: '100%', padding: '12px', borderRadius: 8, background: 'transparent', color: '#9ca3af', border: '1px solid #2d6a4f', cursor: 'pointer', fontSize: 14 }}>
            Retour
          </button>
        </div>
      )}
    </div>
  )
}
