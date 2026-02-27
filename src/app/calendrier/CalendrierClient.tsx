'use client'
import { useState, useMemo } from 'react'
import MatchCard from '@/components/MatchCard'
import type { MatchView } from '@/lib/supabase'

const SPORTS = [
  { val: '', label: 'Tous les sports' },
  { val: 'football', label: '⚽ Football' },
  { val: 'basketball', label: '🏀 Basketball' },
  { val: 'volleyball', label: '🏐 Volleyball' },
  { val: 'handball', label: '🤾 Handball' },
  { val: 'billard', label: '🎱 Billard' },
  { val: 'boxe', label: '🥊 Boxe' },
  { val: 'athletisme', label: '🏃 Athlétisme' },
]

const STATUTS = [
  { val: '', label: 'Tous' },
  { val: 'planifie', label: '⏳ Planifiés' },
  { val: 'en_direct', label: '🔴 En direct' },
  { val: 'termine', label: '✅ Terminés' },
]

export default function CalendrierClient({ matchs, competitions }: { matchs: MatchView[], competitions: any[] }) {
  const [sport, setSport] = useState('')
  const [compId, setCompId] = useState('')
  const [statut, setStatut] = useState('')

  const compsFiltrees = useMemo(() =>
    sport ? competitions.filter(c => c.sport === sport) : competitions,
    [sport, competitions]
  )

  const matchsFiltres = useMemo(() => {
    return matchs.filter(m => {
      if (sport && m.sport !== sport) return false
      if (compId && m.competition_id !== compId) return false
      if (statut && m.statut !== statut) return false
      return true
    })
  }, [matchs, sport, compId, statut])

  const parDate = useMemo(() => {
    return matchsFiltres.reduce<Record<string, MatchView[]>>((acc, m) => {
      const key = m.date_match ? m.date_match.split('T')[0] : 'Sans date'
      if (!acc[key]) acc[key] = []
      acc[key].push(m)
      return acc
    }, {})
  }, [matchsFiltres])

  return (
    <div>
      {/* Filtres */}
      <div className="card p-4 mb-8 flex flex-wrap gap-3">
        <select value={sport} onChange={e => { setSport(e.target.value); setCompId('') }}
          className="bg-deep border border-border rounded px-3 py-2 text-sm text-white font-oswald outline-none focus:border-cmr-yellow">
          {SPORTS.map(s => <option key={s.val} value={s.val}>{s.label}</option>)}
        </select>

        <select value={compId} onChange={e => setCompId(e.target.value)}
          className="bg-deep border border-border rounded px-3 py-2 text-sm text-white font-oswald outline-none focus:border-cmr-yellow">
          <option value="">Toutes compétitions</option>
          {compsFiltrees.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
        </select>

        <select value={statut} onChange={e => setStatut(e.target.value)}
          className="bg-deep border border-border rounded px-3 py-2 text-sm text-white font-oswald outline-none focus:border-cmr-yellow">
          {STATUTS.map(s => <option key={s.val} value={s.val}>{s.label}</option>)}
        </select>

        <div className="ml-auto text-xs text-green-muted font-oswald tracking-wider flex items-center">
          {matchsFiltres.length} match{matchsFiltres.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Résultats */}
      {Object.keys(parDate).length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-green-muted font-oswald tracking-wider">Aucun match trouvé</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(parDate).sort(([a], [b]) => a.localeCompare(b)).map(([date, matchsList]) => (
            <section key={date}>
              <h2 className="font-oswald text-lg tracking-widest text-white mb-3 pb-2 border-b border-border">
                {date !== 'Sans date'
                  ? new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Douala' })
                  : 'Sans date'}
                <span className="text-xs text-green-muted ml-3">{matchsList.length} match{matchsList.length > 1 ? 's' : ''}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {matchsList.map(m => <MatchCard key={m.id} match={m}/>)}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
