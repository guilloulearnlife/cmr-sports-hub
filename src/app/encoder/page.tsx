
'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

function CartonCounter({ label, jaunes, rouges, onJaune, onRouge, onRetireJaune, onRetireRouge, actif }: any) {
  return (
    <div style={{ background: '#0a100d', borderRadius: 8, padding: 10, flex: 1, opacity: actif ? 1 : 0.4 }}>
      <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 8, textAlign: 'center' }}>{label}</div>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
        {/* Carton jaune */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 14 }}>🟨</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button onClick={onRetireJaune} disabled={!actif || jaunes === 0}
              style={{ background: jaunes > 0 && actif ? '#854d0e' : '#1a2e1e', border: 'none', borderRadius: 4, width: 22, height: 22, color: '#fbbf24', fontWeight: 'bold', cursor: jaunes > 0 && actif ? 'pointer' : 'not-allowed', fontSize: 16, lineHeight: 1 }}>-</button>
            <span style={{ fontSize: 15, fontWeight: 'bold', color: '#fbbf24', minWidth: 16, textAlign: 'center' }}>{jaunes}</span>
            <button onClick={onJaune} disabled={!actif}
              style={{ background: actif ? '#854d0e' : '#1a2e1e', border: 'none', borderRadius: 4, width: 22, height: 22, color: '#fbbf24', fontWeight: 'bold', cursor: actif ? 'pointer' : 'not-allowed', fontSize: 16, lineHeight: 1 }}>+</button>
          </div>
        </div>
        {/* Carton rouge */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 14 }}>🟥</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button onClick={onRetireRouge} disabled={!actif || rouges === 0}
              style={{ background: rouges > 0 && actif ? '#7f1d1d' : '#1a2e1e', border: 'none', borderRadius: 4, width: 22, height: 22, color: '#f87171', fontWeight: 'bold', cursor: rouges > 0 && actif ? 'pointer' : 'not-allowed', fontSize: 16, lineHeight: 1 }}>-</button>
            <span style={{ fontSize: 15, fontWeight: 'bold', color: '#f87171', minWidth: 16, textAlign: 'center' }}>{rouges}</span>
            <button onClick={onRouge} disabled={!actif}
              style={{ background: actif ? '#7f1d1d' : '#1a2e1e', border: 'none', borderRadius: 4, width: 22, height: 22, color: '#f87171', fontWeight: 'bold', cursor: actif ? 'pointer' : 'not-allowed', fontSize: 16, lineHeight: 1 }}>+</button>
          </div>
        </div>
      </div>
    </div>
  )
}


function BillardEncoder({ domNom, extNom, detail, onChange, actif }: any) {
  const matchTypes = [
    { key: 'M1', label: 'Messieurs 1', format: '1er a 7', icon: '🎱' },
    { key: 'M2', label: 'Messieurs 2', format: '1er a 7', icon: '🎱' },
    { key: 'M3', label: 'Messieurs 3', format: '1er a 7', icon: '🎱' },
    { key: 'DA', label: 'Dames', format: '1ere a 5', icon: '🎱' },
    { key: 'MX', label: 'Double Mixte', format: '1er a 5', icon: '🎱' },
  ]

  function toggle(idx: number, winner: 'dom' | 'ext') {
    const newDetail = [...detail]
    if (!newDetail[idx]) newDetail[idx] = {}
    if (newDetail[idx][winner]) {
      // Deselectionner
      newDetail[idx] = {}
    } else {
      // Selectionner ce gagnant
      newDetail[idx] = { dom: winner === 'dom', ext: winner === 'ext' }
    }
    onChange(newDetail)
  }

  const domTotal = detail.filter((d: any) => d?.dom).length
  const extTotal = detail.filter((d: any) => d?.ext).length

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 10 }}>
        Resultats des 5 matchs — cliquer sur le gagnant
      </div>
      {matchTypes.map((mt, idx) => (
        <div key={mt.key} style={{
          background: detail[idx]?.dom || detail[idx]?.ext ? '#0f2a1a' : '#1a4a2e',
          border: '1px solid #2d6a4f', borderRadius: 8, padding: '10px 12px', marginBottom: 8,
          display: 'flex', alignItems: 'center', gap: 8
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 'bold', color: '#f5c518' }}>{mt.key} — {mt.label}</div>
            <div style={{ fontSize: 10, color: '#6b7280' }}>{mt.format}</div>
          </div>
          <button
            onClick={() => actif && toggle(idx, 'dom')}
            style={{
              padding: '8px 14px', borderRadius: 8, border: '2px solid',
              borderColor: detail[idx]?.dom ? '#007a3d' : '#2d6a4f',
              background: detail[idx]?.dom ? '#007a3d' : '#0a100d',
              color: detail[idx]?.dom ? '#fff' : '#9ca3af',
              fontWeight: 'bold', fontSize: 12, cursor: actif ? 'pointer' : 'not-allowed',
              opacity: actif ? 1 : 0.5, minWidth: 70, textAlign: 'center'
            }}>
            {detail[idx]?.dom ? '✓ ' : ''}{domNom}
          </button>
          <div style={{ color: '#6b7280', fontSize: 12 }}>vs</div>
          <button
            onClick={() => actif && toggle(idx, 'ext')}
            style={{
              padding: '8px 14px', borderRadius: 8, border: '2px solid',
              borderColor: detail[idx]?.ext ? '#ce1126' : '#2d6a4f',
              background: detail[idx]?.ext ? '#ce1126' : '#0a100d',
              color: detail[idx]?.ext ? '#fff' : '#9ca3af',
              fontWeight: 'bold', fontSize: 12, cursor: actif ? 'pointer' : 'not-allowed',
              opacity: actif ? 1 : 0.5, minWidth: 70, textAlign: 'center'
            }}>
            {detail[idx]?.ext ? '✓ ' : ''}{extNom}
          </button>
        </div>
      ))}
      <div style={{ background: '#0a100d', borderRadius: 8, padding: '12px 16px', marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: 11, color: '#9ca3af' }}>{domNom}</div>
          <div style={{ fontSize: 32, fontWeight: 'bold', color: domTotal > extTotal ? '#f5c518' : '#fff' }}>{domTotal}</div>
        </div>
        <div style={{ fontSize: 14, color: '#6b7280' }}>POINTS</div>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: 11, color: '#9ca3af' }}>{extNom}</div>
          <div style={{ fontSize: 32, fontWeight: 'bold', color: extTotal > domTotal ? '#f5c518' : '#fff' }}>{extTotal}</div>
        </div>
      </div>
      {!actif && (
        <div style={{ background: '#1a3a5c', border: '1px solid #2563eb', borderRadius: 8, padding: '10px 12px', marginTop: 8, fontSize: 12, color: '#93c5fd' }}>
          ⏰ Match pas encore disponible pour encodage
        </div>
      )}
    </div>
  )
}

export default function EncoderPage() {
  const [user, setUser] = useState<any>(null)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [logging, setLogging] = useState(false)
  const [matchs, setMatchs] = useState<any[]>([])
  const [historique, setHistorique] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [tab, setTab] = useState<'matchs' | 'historique'>('matchs')
  const [scores, setScores] = useState<any>({
    dom: '', ext: '', statut: 'en_direct', minute: '', periode: '1',
    cj_dom: 0, cr_dom: 0, cj_ext: 0, cr_ext: 0,
    billard_detail: [{},{},{},{},{}]
  })
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [running, setRunning] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser(data.session.user)
        loadMatchs(data.session.user.id)
        loadHistorique(data.session.user.id)
      }
    })
  }, [])

  // Timer chronometre
  useEffect(() => {
    if (!running) return
    const interval = setInterval(() => {
      setScores(p => ({ ...p, minute: String(Math.min(parseInt(p.minute || '0') + 1, 120)) }))
    }, 60000)
    return () => clearInterval(interval)
  }, [running])

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setLogging(true)
    setLoginError('')
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginForm.email, password: loginForm.password,
    })
    if (error) {
      setLoginError('Email ou mot de passe incorrect')
    } else if (data.user) {
      setUser(data.user)
      loadMatchs(data.user.id)
      loadHistorique(data.user.id)
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

    // Recharger automatiquement le match en_direct si existant
    const matchEnCours = (data ?? []).find((m: any) => m.statut === 'en_direct')
    if (matchEnCours) {
      setSelected(matchEnCours)
      setScores({
        dom: matchEnCours.dom_score ?? '',
        ext: matchEnCours.ext_score ?? '',
        statut: 'en_direct',
        minute: matchEnCours.minute_actuelle ?? '',
        periode: '1',
        cj_dom: matchEnCours.cartons_jaunes_dom ?? 0,
        cr_dom: matchEnCours.cartons_rouges_dom ?? 0,
        cj_ext: matchEnCours.cartons_jaunes_ext ?? 0,
        cr_ext: matchEnCours.cartons_rouges_ext ?? 0,
      })
    }
  }

  async function loadHistorique(userId: string) {
    const { data } = await supabase
      .from('v_matchs')
      .select('*')
      .in('statut', ['en_attente', 'termine'])
      .eq('correspondant_id', userId)
      .order('date_match', { ascending: false })
      .limit(20)
    setHistorique(data ?? [])
  }

  async function submit() {
    if (!selected) return
    setSending(true)
    setMsg(null)
    const estFinal = scores.statut === 'termine'
    const { error } = await supabase.from('matchs').update({
      score_domicile: parseInt(scores.dom),
      score_exterieur: parseInt(scores.ext),
      statut: estFinal ? 'en_attente' : 'en_direct',
      minute_actuelle: parseInt(scores.minute) || null,
      cartons_jaunes_dom: scores.cj_dom,
      cartons_rouges_dom: scores.cr_dom,
      cartons_jaunes_ext: scores.cj_ext,
      cartons_rouges_ext: scores.cr_ext,
    }).eq('id', selected.id)

    if (error) {
      setMsg({ type: 'error', text: 'Erreur : ' + error.message })
    } else {
      setMsg({ type: 'success', text: estFinal ? 'Score final soumis ! En attente de validation.' : 'Score en direct mis a jour !' })
      setRunning(false); setSelected(null)
      setScores({ dom: '', ext: '', statut: 'en_direct', minute: '', periode: '1', cj_dom: 0, cr_dom: 0, cj_ext: 0, cr_ext: 0, billard_detail: [{},{},{},{},{}] })
      loadMatchs(user.id)
      loadHistorique(user.id)
    }
    setSending(false)
  }

  async function deconnexion() {
    await supabase.auth.signOut()
    setUser(null)
    setMatchs([])
    setHistorique([])
  }

  const isBillard = selected?.sport === 'billard'
  const maxMinute = scores.periode === 'prolongation' ? 120 : scores.periode === '2' ? 90 : 45
  const progressPct = Math.min(((parseInt(scores.minute) || 0) / maxMinute) * 100, 100)
  // Verifier si le match peut etre lance
  const maintenant = new Date()
  // Cameroun = WAT (UTC+1), Supabase stocke en UTC, on corrige +1h
  const dateMatch = selected ? new Date(new Date(selected.date_match).getTime() - 60 * 60 * 1000) : null
  const diffMinutes = dateMatch ? (maintenant.getTime() - dateMatch.getTime()) / 60000 : -999
  const matchDispo = diffMinutes >= -30 && diffMinutes <= 180

  const s = { minHeight: '100vh', background: '#0a100d', color: '#fff', fontFamily: 'Arial, sans-serif', padding: '16px', maxWidth: '480px', margin: '0 auto' }

  if (!user) return (
    <div style={s}>
      <div style={{ background: '#007a3d', borderRadius: 8, padding: '12px 16px', marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 'bold' }}>🇨🇲 CMR Sports</div>
        <div style={{ fontSize: 12, opacity: 0.8 }}>Espace correspondant / arbitre</div>
      </div>
      <div style={{ background: '#1a4a2e', borderRadius: 8, padding: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 16 }}>Connexion</div>
        {loginError && <div style={{ background: '#7f1d1d', borderRadius: 6, padding: '10px 12px', marginBottom: 12, fontSize: 13 }}>{loginError}</div>}
        <input type="email" placeholder="Email" value={loginForm.email}
          onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
          style={{ width: '100%', background: '#0a100d', border: '1px solid #2d6a4f', borderRadius: 6, padding: '10px 12px', color: '#fff', fontSize: 14, marginBottom: 10, boxSizing: 'border-box' }} />
        <input type="password" placeholder="Mot de passe" value={loginForm.password}
          onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
          style={{ width: '100%', background: '#0a100d', border: '1px solid #2d6a4f', borderRadius: 6, padding: '10px 12px', color: '#fff', fontSize: 14, marginBottom: 16, boxSizing: 'border-box' }} />
        <button onClick={login} disabled={logging}
          style={{ width: '100%', padding: '12px', borderRadius: 8, background: '#f5c518', color: '#000', fontWeight: 'bold', fontSize: 15, border: 'none', cursor: 'pointer' }}>
          {logging ? 'Connexion...' : 'Se connecter'}
        </button>
      </div>
    </div>
  )

  return (
    <div style={s}>
      <div style={{ background: '#007a3d', borderRadius: 8, padding: '12px 16px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 'bold' }}>🇨🇲 CMR Sports</div>
          <div style={{ fontSize: 11, opacity: 0.8 }}>{user.email}</div>
        </div>
        <button onClick={deconnexion} style={{ background: 'rgba(0,0,0,0.3)', border: 'none', color: '#fff', borderRadius: 6, padding: '6px 10px', fontSize: 12, cursor: 'pointer' }}>
          Deconnexion
        </button>
      </div>

      {msg && (
        <div style={{ background: msg.type === 'success' ? '#14532d' : '#7f1d1d', borderRadius: 8, padding: '12px 16px', marginBottom: 12, fontSize: 14 }}>
          {msg.text}
        </div>
      )}

      {!selected ? (
        <>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {[{ val: 'matchs', label: `Mes matchs (${matchs.length})` }, { val: 'historique', label: `Historique (${historique.length})` }].map(t => (
              <button key={t.val} onClick={() => setTab(t.val as any)}
                style={{ flex: 1, padding: '10px', borderRadius: 8, border: '2px solid', borderColor: tab === t.val ? '#f5c518' : '#2d6a4f', background: tab === t.val ? '#3a2a00' : '#1a4a2e', color: tab === t.val ? '#f5c518' : '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 'bold' }}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'matchs' ? (
            <div>
              {loading ? <div style={{ textAlign: 'center', color: '#9ca3af', padding: 24 }}>Chargement...</div> :
                matchs.length === 0 ? (
                  <div style={{ background: '#1a4a2e', borderRadius: 8, padding: 24, textAlign: 'center', color: '#9ca3af' }}>
                    Aucun match assigne
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {matchs.map(m => (
                      <button key={m.id} onClick={() => {
                        setSelected(m)
                        setScores({ dom: m.dom_score ?? '', ext: m.ext_score ?? '', statut: 'en_direct', minute: m.minute_actuelle ?? '', periode: '1', cj_dom: m.cartons_jaunes_dom ?? 0, cr_dom: m.cartons_rouges_dom ?? 0, cj_ext: m.cartons_jaunes_ext ?? 0, cr_ext: m.cartons_rouges_ext ?? 0 })
                        setMsg(null)
                      }}
                        style={{ background: '#1a4a2e', border: m.statut === 'en_direct' ? '2px solid #ce1126' : '1px solid #2d6a4f', borderRadius: 8, padding: '12px 16px', textAlign: 'left', cursor: 'pointer', color: '#fff' }}>
                        <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>
                          {m.sport?.toUpperCase()} · J{m.journee} · {m.statut === 'en_direct' ? '🔴 LIVE' : '⏳ Planifie'}
                        </div>
                        <div style={{ fontWeight: 'bold' }}>{m.dom_nom} vs {m.ext_nom}</div>
                        <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                          {m.date_match ? new Date(m.date_match).toLocaleString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Douala' }) : ''}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {historique.length === 0 ? (
                <div style={{ background: '#1a4a2e', borderRadius: 8, padding: 24, textAlign: 'center', color: '#9ca3af' }}>Aucun historique</div>
              ) : historique.map(m => (
                <div key={m.id} style={{ background: '#1a4a2e', border: '1px solid #2d6a4f', borderRadius: 8, padding: '12px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{m.sport?.toUpperCase()} · J{m.journee}</div>
                    <span style={{
                      fontSize: 11, fontWeight: 'bold', padding: '2px 8px', borderRadius: 4,
                      background: m.statut === 'termine' ? '#14532d' : '#3a2a00',
                      color: m.statut === 'termine' ? '#86efac' : '#fbbf24'
                    }}>
                      {m.statut === 'termine' ? '✅ Approuve' : '⏳ En attente'}
                    </span>
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: 15 }}>
                    {m.dom_nom} <span style={{ color: '#f5c518' }}>{m.dom_score ?? '-'} - {m.ext_score ?? '-'}</span> {m.ext_nom}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div>
          {/* Header match */}
          <div style={{ background: '#1a4a2e', borderRadius: 8, padding: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 8 }}>
              {selected.sport?.toUpperCase()} · Journee {selected.journee}
              {isBillard && <span style={{ marginLeft: 8, background: '#3a2a00', color: '#f5c518', padding: '2px 6px', borderRadius: 4 }}>🎱 BILLARD 9-BALL</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 6 }}>{selected.dom_nom}</div>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: '#f5c518', fontFamily: 'monospace' }}>
                  {isBillard ? (scores.billard_detail ? [0,1,2,3,4].filter(i => scores.billard_detail[i]?.dom).length : parseInt(scores.dom)||0) : (scores.dom||'-')}
                </div>
              </div>
              <div style={{ fontSize: 20, color: '#9ca3af', fontWeight: 'bold' }}>-</div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 6 }}>{selected.ext_nom}</div>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: '#f5c518', fontFamily: 'monospace' }}>
                  {isBillard ? (scores.billard_detail ? [0,1,2,3,4].filter(i => scores.billard_detail[i]?.ext).length : parseInt(scores.ext)||0) : (scores.ext||'-')}
                </div>
              </div>
            </div>
          </div>

          {isBillard ? (
            /* === INTERFACE BILLARD === */
            <BillardEncoder
              domNom={selected.dom_sigle || selected.dom_nom}
              extNom={selected.ext_sigle || selected.ext_nom}
              detail={scores.billard_detail || [{},{},{},{},{}]}
              onChange={(detail: any[]) => {
                const domPts = detail.filter(d => d.dom).length
                const extPts = detail.filter(d => d.ext).length
                setScores(p => ({ ...p, billard_detail: detail, dom: String(domPts), ext: String(extPts) }))
              }}
              actif={matchDispo}
            />
          ) : (
            /* === INTERFACE FOOTBALL/AUTRES === */
            <>
              {/* Score manuel */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <input type="number" min="0" max="20" value={scores.dom}
                  onChange={e => setScores({ ...scores, dom: e.target.value })} placeholder="0"
                  style={{ flex: 1, background: '#0a100d', border: '2px solid #f5c518', borderRadius: 8, color: '#f5c518', fontSize: 32, fontWeight: 'bold', textAlign: 'center', padding: '8px 0' }} />
                <input type="number" min="0" max="20" value={scores.ext}
                  onChange={e => setScores({ ...scores, ext: e.target.value })} placeholder="0"
                  style={{ flex: 1, background: '#0a100d', border: '2px solid #f5c518', borderRadius: 8, color: '#f5c518', fontSize: 32, fontWeight: 'bold', textAlign: 'center', padding: '8px 0' }} />
              </div>

              {/* Cartons */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 8 }}>Cartons</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <CartonCounter label={selected.dom_sigle}
                    jaunes={scores.cj_dom} rouges={scores.cr_dom}
                    actif={running || parseInt(scores.minute || '0') > 0}
                    onJaune={() => setScores(p => ({ ...p, cj_dom: p.cj_dom + 1 }))}
                    onRouge={() => setScores(p => ({ ...p, cr_dom: p.cr_dom + 1 }))}
                    onRetireJaune={() => setScores(p => ({ ...p, cj_dom: Math.max(0, p.cj_dom - 1) }))}
                    onRetireRouge={() => setScores(p => ({ ...p, cr_dom: Math.max(0, p.cr_dom - 1) }))} />
                  <CartonCounter label={selected.ext_sigle}
                    jaunes={scores.cj_ext} rouges={scores.cr_ext}
                    actif={running || parseInt(scores.minute || '0') > 0}
                    onJaune={() => setScores(p => ({ ...p, cj_ext: p.cj_ext + 1 }))}
                    onRouge={() => setScores(p => ({ ...p, cr_ext: p.cr_ext + 1 }))}
                    onRetireJaune={() => setScores(p => ({ ...p, cj_ext: Math.max(0, p.cj_ext - 1) }))}
                    onRetireRouge={() => setScores(p => ({ ...p, cr_ext: Math.max(0, p.cr_ext - 1) }))} />
                </div>
              </div>

              {/* Periode */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 8 }}>Periode</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[{ val: '1', label: '1ere MT' }, { val: '2', label: '2eme MT' }, { val: 'prolongation', label: 'Prol.' }].map(p => (
                    <button key={p.val} onClick={() => setScores({ ...scores, periode: p.val })}
                      style={{ flex: 1, padding: '8px 4px', borderRadius: 8, border: '2px solid', borderColor: scores.periode === p.val ? '#f5c518' : '#2d6a4f', background: scores.periode === p.val ? '#3a2a00' : '#1a4a2e', color: scores.periode === p.val ? '#f5c518' : '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 'bold' }}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chronometre */}
              {!matchDispo && dateMatch && (
                <div style={{ background: '#1a3a5c', border: '1px solid #2563eb', borderRadius: 8, padding: '10px 12px', marginBottom: 12, fontSize: 12, color: '#93c5fd' }}>
                  ⏰ Match disponible le {dateMatch.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
              {scores.statut !== 'termine' && (
                <div style={{ marginBottom: 12, background: '#1a4a2e', borderRadius: 8, padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ fontSize: 13, color: '#9ca3af' }}>Chronometre</div>
                    <div style={{ fontSize: 28, fontWeight: 'bold', color: '#f5c518', fontFamily: 'monospace' }}>{String(scores.minute || 0).padStart(2,'0')}'</div>
                  </div>
                  <div style={{ background: '#0a100d', borderRadius: 4, height: 8, overflow: 'hidden', marginBottom: 10 }}>
                    <div style={{ background: scores.periode === '1' ? '#007a3d' : scores.periode === '2' ? '#f5c518' : '#ce1126', height: '100%', width: `${progressPct}%`, transition: 'width 1s', borderRadius: 4 }} />
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setRunning(true)} disabled={running || !matchDispo}
                      style={{ flex: 1, padding: '10px', borderRadius: 8, background: running ? '#1a4a2e' : '#007a3d', border: running ? '1px solid #2d6a4f' : 'none', color: '#fff', fontWeight: 'bold', fontSize: 14, cursor: running ? 'not-allowed' : 'pointer', opacity: running ? 0.5 : 1 }}>
                      ▶ Start
                    </button>
                    <button onClick={() => setRunning(false)} disabled={!running}
                      style={{ flex: 1, padding: '10px', borderRadius: 8, background: !running ? '#1a4a2e' : '#854d0e', border: !running ? '1px solid #2d6a4f' : 'none', color: '#fff', fontWeight: 'bold', fontSize: 14, cursor: !running ? 'not-allowed' : 'pointer', opacity: !running ? 0.5 : 1 }}>
                      ⏸ Pause
                    </button>
                    <button onClick={() => { setRunning(false); setScores(p => ({...p, minute: '0'})) }}
                      style={{ padding: '10px 14px', borderRadius: 8, background: '#1a4a2e', border: '1px solid #2d6a4f', color: '#9ca3af', fontWeight: 'bold', fontSize: 14, cursor: 'pointer' }}>
                      ↺
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Statut */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 8 }}>Statut</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ val: 'en_direct', label: '🔴 En cours' }, { val: 'termine', label: '✅ Termine' }].map(st => (
                <button key={st.val} onClick={() => setScores({ ...scores, statut: st.val })}
                  style={{ flex: 1, padding: '10px', borderRadius: 8, border: '2px solid', borderColor: scores.statut === st.val ? '#f5c518' : '#2d6a4f', background: scores.statut === st.val ? '#3a2a00' : '#1a4a2e', color: scores.statut === st.val ? '#f5c518' : '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 'bold' }}>
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {scores.statut === 'termine' && (
            <div style={{ background: '#1a3a5c', border: '1px solid #2563eb', borderRadius: 8, padding: '10px 12px', marginBottom: 12, fontSize: 12, color: '#93c5fd' }}>
              Le score sera soumis a la validation de l'admin regional avant publication.
            </div>
          )}

          <button onClick={submit} disabled={sending}
            style={{ width: '100%', padding: '14px', borderRadius: 8, background: '#f5c518', color: '#000', fontWeight: 'bold', fontSize: 16, border: 'none', cursor: 'pointer', marginBottom: 8 }}>
            {sending ? 'Envoi...' : scores.statut === 'termine' ? 'Soumettre score final' : 'Mettre a jour en cours'}
          </button>
          <button onClick={() => { setRunning(false); setSelected(null); setMsg(null) }}
            style={{ width: '100%', padding: '12px', borderRadius: 8, background: 'transparent', color: '#9ca3af', border: '1px solid #2d6a4f', cursor: 'pointer', fontSize: 14 }}>
            Retour
          </button>
        </div>
      )}
    </div>
  )
}
