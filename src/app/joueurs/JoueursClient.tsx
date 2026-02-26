
'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'

const SPORTS = [
  { val: '', label: 'Tous les sports' },
  { val: 'football', label: '⚽ Football' },
  { val: 'basketball', label: '🏀 Basketball' },
  { val: 'volleyball', label: '🏐 Volleyball' },
  { val: 'handball', label: '🤾 Handball' },
]

const TRIS = [
  { val: 'buts', label: 'Buts' },
  { val: 'passes_decisives', label: 'Passes' },
  { val: 'matchs_joues', label: 'Matchs' },
  { val: 'cartons_jaunes', label: 'Cartons J' },
  { val: 'cartons_rouges', label: 'Cartons R' },
]

export default function JoueursClient({ joueurs, competitions }: { joueurs: any[], competitions: any[] }) {
  const [sport, setSport] = useState('')
  const [compId, setCompId] = useState('')
  const [tri, setTri] = useState('buts')
  const [recherche, setRecherche] = useState('')

  const compsFiltrees = useMemo(() =>
    sport ? competitions.filter(c => c.sport === sport) : competitions,
    [sport, competitions]
  )

  const joueursFiltres = useMemo(() => {
    let list = [...joueurs]
    if (sport) list = list.filter(j => j.sport === sport)
    if (compId) list = list.filter(j => j.competition_id === compId)
    if (recherche) list = list.filter(j => j.nom_complet?.toLowerCase().includes(recherche.toLowerCase()) || j.club_nom?.toLowerCase().includes(recherche.toLowerCase()))
    list.sort((a, b) => (b[tri] ?? 0) - (a[tri] ?? 0))
    // Dédupliquer par joueur si pas de filtre compétition
    if (!compId) {
      const seen = new Set()
      list = list.filter(j => {
        if (seen.has(j.id)) return false
        seen.add(j.id)
        return true
      })
    }
    return list
  }, [joueurs, sport, compId, tri, recherche])

  return (
    <div>
      {/* Filtres */}
      <div className="card p-4 mb-6 flex flex-wrap gap-3">
        <input type="text" value={recherche} onChange={e => setRecherche(e.target.value)}
          placeholder="🔍 Rechercher un joueur..."
          className="bg-deep border border-border rounded px-3 py-2 text-sm text-white outline-none focus:border-cmr-yellow flex-1 min-w-40"/>
        <select value={sport} onChange={e => { setSport(e.target.value); setCompId('') }}
          className="bg-deep border border-border rounded px-3 py-2 text-sm text-white font-oswald outline-none focus:border-cmr-yellow">
          {SPORTS.map(s => <option key={s.val} value={s.val}>{s.label}</option>)}
        </select>
        <select value={compId} onChange={e => setCompId(e.target.value)}
          className="bg-deep border border-border rounded px-3 py-2 text-sm text-white font-oswald outline-none focus:border-cmr-yellow">
          <option value="">Toutes compétitions</option>
          {compsFiltrees.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
        </select>
        <select value={tri} onChange={e => setTri(e.target.value)}
          className="bg-deep border border-border rounded px-3 py-2 text-sm text-white font-oswald outline-none focus:border-cmr-yellow">
          {TRIS.map(t => <option key={t.val} value={t.val}>Trier par {t.label}</option>)}
        </select>
      </div>

      {/* Table */}
      {joueursFiltres.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-4">👤</div>
          <p className="text-green-muted font-oswald tracking-wider">Aucun joueur trouvé</p>
          <p className="text-xs text-green-dim mt-2">Ajoutez des joueurs depuis le panel admin</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-deep">
                  <th className="text-left px-4 py-3 font-oswald text-xs tracking-wider text-green-muted uppercase">#</th>
                  <th className="text-left px-4 py-3 font-oswald text-xs tracking-wider text-green-muted uppercase">Joueur</th>
                  <th className="text-left px-4 py-3 font-oswald text-xs tracking-wider text-green-muted uppercase">Club</th>
                  <th className="text-center px-3 py-3 font-oswald text-xs tracking-wider text-green-muted uppercase">MJ</th>
                  <th className="text-center px-3 py-3 font-oswald text-xs tracking-wider text-cmr-yellow uppercase">⚽ Buts</th>
                  <th className="text-center px-3 py-3 font-oswald text-xs tracking-wider text-green-muted uppercase">🎯 Passes</th>
                  <th className="text-center px-3 py-3 font-oswald text-xs tracking-wider text-yellow-400 uppercase">🟨</th>
                  <th className="text-center px-3 py-3 font-oswald text-xs tracking-wider text-red-400 uppercase">🟥</th>
                  <th className="text-center px-3 py-3 font-oswald text-xs tracking-wider text-green-muted uppercase">Min</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {joueursFiltres.map((j, idx) => (
                  <tr key={`${j.id}-${j.competition_id}`} className="hover:bg-card/50 transition-colors">
                    <td className="px-4 py-3 font-oswald font-bold text-green-muted">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <Link href={`/joueur/${j.id}`} className="flex items-center gap-3 hover:text-cmr-yellow transition-colors">
                        {j.photo_url ? (
                          <img src={j.photo_url} alt={j.nom_complet} className="w-9 h-9 rounded-full object-cover border border-border flex-shrink-0"/>
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-green-mid flex items-center justify-center text-xs font-oswald font-bold text-white flex-shrink-0">
                            {j.nom?.slice(0,2)?.toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-barlow-condensed font-semibold text-sm">{j.nom_complet}</div>
                          <div className="text-xs text-green-muted">{j.poste}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {j.club_logo && <img src={j.club_logo} alt={j.club_sigle} className="w-6 h-6 rounded-full object-cover"/>}
                        <span className="text-sm text-green-muted">{j.club_sigle ?? j.club_nom}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center text-sm text-green-muted">{j.matchs_joues}</td>
                    <td className="px-3 py-3 text-center font-oswald font-bold text-cmr-yellow text-lg">{j.buts}</td>
                    <td className="px-3 py-3 text-center text-sm text-green-muted">{j.passes_decisives}</td>
                    <td className="px-3 py-3 text-center text-sm text-yellow-400">{j.cartons_jaunes}</td>
                    <td className="px-3 py-3 text-center text-sm text-red-400">{j.cartons_rouges}</td>
                    <td className="px-3 py-3 text-center text-sm text-green-muted">{j.minutes_jouees}'</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
