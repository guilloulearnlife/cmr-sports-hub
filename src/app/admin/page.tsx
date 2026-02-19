'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Settings, Plus, Save, CheckCircle, AlertCircle, RefreshCw, Trophy, Calendar, Users } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Competition, Club, MatchView } from '@/lib/supabase'

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        window.location.href = '/admin/login'
      } else {
        setAuthed(true)
      }
    })
  }, [])

  if (authed === null) return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <RefreshCw size={24} className="animate-spin text-cmr-yellow"/>
    </div>
  )

  return <AdminContent/>
}

function AdminContent() {
  const [tab, setTab] = useState<'scores'|'matchs'|'clubs'>('scores')
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [clubs, setClubs] = useState<Club[]>([])
  const [matchs, setMatchs] = useState<MatchView[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok'|'err'; text: string }|null>(null)

  const [scoreForm, setScoreForm] = useState({
    match_id: '', score_domicile: '', score_exterieur: '', statut: 'termine', minute: '',
  })

  const [matchForm, setMatchForm] = useState({
    competition_id: '', club_domicile_id: '', club_exterieur_id: '', journee: '', date_match: '', statut: 'planifie',
  })

  const [clubForm, setClubForm] = useState({
    slug: '', nom: '', sigle: '', sport: 'football', ville: '', federation_id: '',
  })

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    const [compsRes, clubsRes, matchsRes] = await Promise.all([
      supabase.from('competitions').select('*, federations(*)').eq('statut', 'en_cours').order('sport'),
      supabase.from('clubs').select('*').eq('actif', true).order('nom'),
      supabase.from('v_matchs').select('*').in('statut', ['planifie','en_direct']).order('date_match').limit(50),
    ])
    setCompetitions((compsRes.data ?? []) as Competition[])
    setClubs((clubsRes.data ?? []) as Club[])
    setMatchs((matchsRes.data ?? []) as MatchView[])
    setLoading(false)
  }

  async function encoderScore(e: React.FormEvent) {
    e.preventDefault()
    if (!scoreForm.match_id) return
    setSaving(true)
    setMessage(null)

    const update: any = {
      score_domicile:  parseInt(scoreForm.score_domicile),
      score_exterieur: parseInt(scoreForm.score_exterieur),
      statut:          scoreForm.statut,
    }
    if (scoreForm.minute) update.minute_actuelle = parseInt(scoreForm.minute)

    const { error } = await supabase.from('matchs').update(update).eq('id', scoreForm.match_id)

    if (error) {
      setMessage({ type: 'err', text: `Erreur : ${error.message}` })
    } else {
      setMessage({ type: 'ok', text: '✅ Score encodé ! Classement recalculé automatiquement.' })
      const match = matchs.find(m => m.id === scoreForm.match_id)
      if (match && scoreForm.statut === 'termine') {
        await supabase.rpc('recalcule_classement', { p_competition_id: match.competition_id })
      }
      setScoreForm({ match_id: '', score_domicile: '', score_exterieur: '', statut: 'termine', minute: '' })
      loadData()
    }
    setSaving(false)
  }

  async function creerMatch(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('matchs').insert({
      competition_id:    matchForm.competition_id,
      club_domicile_id:  matchForm.club_domicile_id,
      club_exterieur_id: matchForm.club_exterieur_id,
      journee:           matchForm.journee ? parseInt(matchForm.journee) : null,
      date_match:        matchForm.date_match || null,
      statut:            matchForm.statut,
    })
    if (error) {
      setMessage({ type: 'err', text: `Erreur : ${error.message}` })
    } else {
      setMessage({ type: 'ok', text: '✅ Match créé !' })
      setMatchForm({ competition_id:'', club_domicile_id:'', club_exterieur_id:'', journee:'', date_match:'', statut:'planifie' })
      loadData()
    }
    setSaving(false)
  }

  async function creerClub(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('clubs').insert({
      ...clubForm,
      slug: clubForm.slug || clubForm.nom.toLowerCase().replace(/\s+/g, '-'),
    })
    if (error) {
      setMessage({ type: 'err', text: `Erreur : ${error.message}` })
    } else {
      setMessage({ type: 'ok', text: '✅ Club créé !' })
      setClubForm({ slug:'', nom:'', sigle:'', sport:'football', ville:'', federation_id:'' })
      loadData()
    }
    setSaving(false)
  }

  async function deconnexion() {
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  const TABS = [
    { id: 'scores', label: 'Encoder Scores', icon: <Trophy size={15}/> },
    { id: 'matchs', label: 'Créer Match',    icon: <Calendar size={15}/> },
    { id: 'clubs',  label: 'Créer Club',     icon: <Users size={15}/> },
  ] as const

  return (
    <div className="min-h-screen bg-dark">
      <header className="border-b-2 border-cmr-yellow sticky top-0 z-50"
              style={{ background: 'linear-gradient(135deg, #0c2218, #091510)' }}>
        <div className="flag-strip"><div className="fg"/><div className="fr"/><div className="fy"/></div>
        <div className="max-w-screen-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings size={18} className="text-cmr-yellow"/>
            <span className="font-oswald font-bold text-cmr-yellow tracking-widest">ADMIN PANEL</span>
            <span className="text-xs text-green-muted">CMR Sports Hub</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadData} className="text-green-muted hover:text-cmr-yellow transition-colors">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''}/>
            </button>
            <Link href="/" className="text-xs text-green-muted hover:text-cmr-yellow font-oswald tracking-wider transition-colors">
              ← Site public
            </Link>
            <button onClick={deconnexion}
                    className="text-xs text-red-400 hover:text-red-300 font-oswald tracking-wider transition-colors border border-red-900 px-3 py-1 rounded hover:border-red-700">
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-lg mx-auto px-4 py-8">
        {message && (
          <div className={`flex items-center gap-3 p-4 rounded-lg mb-6 font-oswald tracking-wide
            ${message.type === 'ok' ? 'bg-green-900/30 border border-green-600 text-green-300' : 'bg-red-900/30 border border-red-600 text-red-300'}`}>
            {message.type === 'ok' ? <CheckCircle size={18}/> : <AlertCircle size={18}/>}
            {message.text}
            <button onClick={() => setMessage(null)} className="ml-auto text-xs opacity-60 hover:opacity-100">✕</button>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Compétitions actives', val: competitions.length, color: 'text-cmr-yellow' },
            { label: 'Clubs enregistrés',    val: clubs.length,        color: 'text-green-400' },
            { label: 'Matchs à jouer',        val: matchs.length,       color: 'text-green-muted' },
          ].map(s => (
            <div key={s.label} className="card p-4 text-center">
              <div className={`font-oswald font-bold text-3xl ${s.color}`}>{s.val}</div>
              <div className="text-xs text-green-dim font-oswald tracking-wider mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-1 border-b border-border mb-6">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
                    className={`flex items-center gap-2 px-4 py-3 font-oswald text-sm tracking-wider transition-all
                      ${tab === t.id ? 'text-cmr-yellow border-b-2 border-cmr-yellow -mb-px' : 'text-green-muted hover:text-white'}`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* ─── Encoder Score ─── */}
        {tab === 'scores' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="font-oswald text-xl tracking-widest text-white mb-4">Encoder un score</h2>
              <form onSubmit={encoderScore} className="card p-6 space-y-4">
                <div>
                  <label className="block text-xs text-green-muted font-oswald tracking-wider uppercase mb-2">Sélectionner le match *</label>
                  <select value={scoreForm.match_id}
                          onChange={e => setScoreForm(p => ({ ...p, match_id: e.target.value }))}
                          required className="form-select">
                    <option value="">-- Choisir un match --</option>
                    {matchs.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.competition_nom} J{m.journee} · {m.dom_nom} vs {m.ext_nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-green-muted font-oswald tracking-wider uppercase mb-2">
                      {scoreForm.match_id ? matchs.find(m=>m.id===scoreForm.match_id)?.dom_nom || 'Domicile' : 'Domicile'}
                    </label>
                    <input type="number" min="0" max="99" value={scoreForm.score_domicile}
                           onChange={e => setScoreForm(p => ({ ...p, score_domicile: e.target.value }))}
                           required className="w-full bg-deep border border-border rounded px-3 py-3 text-3xl font-oswald text-center text-white focus:border-cmr-yellow outline-none"
                           placeholder="0"/>
                  </div>
                  <div>
                    <label className="block text-xs text-green-muted font-oswald tracking-wider uppercase mb-2">
                      {scoreForm.match_id ? matchs.find(m=>m.id===scoreForm.match_id)?.ext_nom || 'Extérieur' : 'Extérieur'}
                    </label>
                    <input type="number" min="0" max="99" value={scoreForm.score_exterieur}
                           onChange={e => setScoreForm(p => ({ ...p, score_exterieur: e.target.value }))}
                           required className="w-full bg-deep border border-border rounded px-3 py-3 text-3xl font-oswald text-center text-white focus:border-cmr-yellow outline-none"
                           placeholder="0"/>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-green-muted font-oswald tracking-wider uppercase mb-2">Statut</label>
                    <select value={scoreForm.statut}
                            onChange={e => setScoreForm(p => ({ ...p, statut: e.target.value }))}
                            className="form-select">
                      <option value="en_direct">🔴 En Direct</option>
                      <option value="termine">✅ Terminé</option>
                    </select>
                  </div>
                  {scoreForm.statut === 'en_direct' && (
                    <div>
                      <label className="block text-xs text-green-muted font-oswald tracking-wider uppercase mb-2">Minute</label>
                      <input type="number" min="1" max="120" value={scoreForm.minute}
                             onChange={e => setScoreForm(p => ({ ...p, minute: e.target.value }))}
                             className="form-input" placeholder="ex: 67"/>
                    </div>
                  )}
                </div>

                <button type="submit" disabled={saving}
                        className="btn-primary w-full flex items-center justify-center gap-2">
                  {saving ? <><RefreshCw size={16} className="animate-spin"/> Enregistrement...</> : <><Save size={16}/> Encoder le Score</>}
                </button>
              </form>
              <p className="text-xs text-green-dim mt-3 text-center">✨ Le classement est recalculé automatiquement après chaque score</p>
            </div>

            <div>
              <h2 className="font-oswald text-xl tracking-widest text-white mb-4">Matchs à jouer ({matchs.length})</h2>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {matchs.length === 0 && <div className="card p-8 text-center text-green-muted text-sm">Aucun match planifié</div>}
                {matchs.map(m => (
                  <div key={m.id}
                       onClick={() => setScoreForm(p => ({ ...p, match_id: m.id }))}
                       className={`card p-3 cursor-pointer transition-all hover:border-green-mid ${scoreForm.match_id === m.id ? 'border-cmr-yellow bg-cmr-yellow/5' : ''}`}>
                    <div className="text-xs text-green-muted font-oswald tracking-wider mb-1">{m.competition_nom} · J{m.journee}</div>
                    <div className="flex items-center justify-between">
                      <span className="font-barlow-condensed font-semibold text-sm">{m.dom_nom}</span>
                      <span className="font-oswald text-xs text-green-muted px-2">vs</span>
                      <span className="font-barlow-condensed font-semibold text-sm">{m.ext_nom}</span>
                    </div>
                    {m.date_match && (
                      <div className="text-xs text-green-dim mt-1">
                        {new Date(m.date_match).toLocaleDateString('fr-FR', { weekday:'short', day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── Créer Match ─── */}
        {tab === 'matchs' && (
          <div className="max-w-lg">
            <h2 className="font-oswald text-xl tracking-widest text-white mb-4">Planifier un match</h2>
            <form onSubmit={creerMatch} className="card p-6 space-y-4">
              <div>
                <label className="block text-xs text-green-muted font-oswald tracking-wider uppercase mb-2">Compétition *</label>
                <select value={matchForm.competition_id}
                        onChange={e => setMatchForm(p=>({...p, competition_id: e.target.value}))}
                        required className="form-select">
                  <option value="">-- Choisir --</option>
                  {competitions.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-green-muted font-oswald tracking-wider uppercase mb-2">Équipe Domicile *</label>
                  <select value={matchForm.club_domicile_id}
                          onChange={e => setMatchForm(p=>({...p, club_domicile_id: e.target.value}))}
                          required className="form-select">
                    <option value="">-- Choisir --</option>
                    {clubs.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-green-muted font-oswald tracking-wider uppercase mb-2">Équipe Extérieur *</label>
                  <select value={matchForm.club_exterieur_id}
                          onChange={e => setMatchForm(p=>({...p, club_exterieur_id: e.target.value}))}
                          required className="form-select">
                    <option value="">-- Choisir --</option>
                    {clubs.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-green-muted font-oswald tracking-wider uppercase mb-2">Journée</label>
                  <input type="number" min="1" max="50" value={matchForm.journee}
                         onChange={e => setMatchForm(p=>({...p, journee: e.target.value}))}
                         className="form-input" placeholder="ex: 5"/>
                </div>
                <div>
                  <label className="block text-xs text-green-muted font-oswald tracking-wider uppercase mb-2">Date & Heure</label>
                  <input type="datetime-local" value={matchForm.date_match}
                         onChange={e => setMatchForm(p=>({...p, date_match: e.target.value}))}
                         className="form-input"/>
                </div>
              </div>
              <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
                {saving ? <><RefreshCw size={16} className="animate-spin"/> Création...</> : <><Plus size={16}/> Créer le Match</>}
              </button>
            </form>
          </div>
        )}

        {/* ─── Créer Club ─── */}
        {tab === 'clubs' && (
          <div className="max-w-lg">
            <h2 className="font-oswald text-xl tracking-widest text-white mb-4">Ajouter un club</h2>
            <form onSubmit={creerClub} className="card p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-green-muted font-oswald tracking-wider uppercase mb-2">Nom complet *</label>
                  <input type="text" value={clubForm.nom}
                         onChange={e => setClubForm(p=>({...p, nom: e.target.value}))}
                         required className="form-input" placeholder="Canon Yaoundé"/>
                </div>
                <div>
                  <label className="block text-xs text-green-muted font-oswald tracking-wider uppercase mb-2">Sigle (3 lettres)</label>
                  <input type="text" maxLength={3} value={clubForm.sigle}
                         onChange={e => setClubForm(p=>({...p, sigle: e.target.value.toUpperCase()}))}
                         className="form-input" placeholder="CYD"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-green-muted font-oswald tracking-wider uppercase mb-2">Sport *</label>
                  <select value={clubForm.sport}
                          onChange={e => setClubForm(p=>({...p, sport: e.target.value}))}
                          className="form-select">
                    {['football','basketball','volleyball','handball','billard','boxe','athletisme'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-green-muted font-oswald tracking-wider uppercase mb-2">Ville</label>
                  <input type="text" value={clubForm.ville}
                         onChange={e => setClubForm(p=>({...p, ville: e.target.value}))}
                         className="form-input" placeholder="Yaoundé"/>
                </div>
              </div>
              <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
                {saving ? <><RefreshCw size={16} className="animate-spin"/> Création...</> : <><Plus size={16}/> Créer le Club</>}
              </button>
            </form>
          </div>
        )}
      </div>

      <style jsx global>{`
        .form-input  { width:100%; background:#0e1a12; border:1px solid #1e3224; border-radius:6px; padding:8px 12px; color:white; font-size:14px; outline:none; transition:border-color .2s; }
        .form-input:focus  { border-color:#f5c518; }
        .form-select { width:100%; background:#0e1a12; border:1px solid #1e3224; border-radius:6px; padding:8px 12px; color:white; font-size:14px; outline:none; transition:border-color .2s; }
        .form-select:focus { border-color:#f5c518; }
      `}</style>
    </div>
  )
}
