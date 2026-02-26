
'use client'
import { useState, useEffect } from 'react'
import { Search, Trophy, Users, Calendar } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function RecherchePage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ clubs: any[], competitions: any[], matchs: any[] }>({ clubs: [], competitions: [], matchs: [] })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.length < 2) {
      setResults({ clubs: [], competitions: [], matchs: [] })
      return
    }
    const timeout = setTimeout(() => rechercher(query), 300)
    return () => clearTimeout(timeout)
  }, [query])

  async function rechercher(q: string) {
    setLoading(true)
    const [{ data: clubs }, { data: competitions }, { data: matchs }] = await Promise.all([
      supabase.from('clubs').select('id, nom, sigle, sport, ville, logo_url, slug').ilike('nom', `%${q}%`).eq('actif', true).limit(5),
      supabase.from('competitions').select('id, nom, sport, slug').ilike('nom', `%${q}%`).limit(5),
      supabase.from('v_matchs').select('id, dom_nom, ext_nom, dom_score, ext_score, statut, date_match, sport, competition_nom').or(`dom_nom.ilike.%${q}%,ext_nom.ilike.%${q}%`).limit(5),
    ])
    setResults({ clubs: clubs ?? [], competitions: competitions ?? [], matchs: matchs ?? [] })
    setLoading(false)
  }

  const total = results.clubs.length + results.competitions.length + results.matchs.length

  return (
    <div className="min-h-screen bg-dark">
      <Navbar/>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="font-oswald font-bold text-4xl tracking-widest text-cmr-yellow mb-8">
          🔍 RECHERCHE
        </h1>

        {/* Champ recherche */}
        <div className="relative mb-8">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-green-muted"/>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Club, compétition, match..."
            autoFocus
            className="w-full bg-card border border-border rounded-lg pl-12 pr-4 py-4 text-white text-lg outline-none focus:border-cmr-yellow transition-colors"
          />
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-cmr-yellow border-t-transparent rounded-full animate-spin"/>
          )}
        </div>

        {query.length >= 2 && !loading && total === 0 && (
          <div className="card p-8 text-center text-green-muted font-oswald tracking-wider">
            Aucun résultat pour "{query}"
          </div>
        )}

        {/* Clubs */}
        {results.clubs.length > 0 && (
          <section className="mb-6">
            <h2 className="flex items-center gap-2 font-oswald text-sm tracking-widest text-green-muted uppercase mb-3">
              <Users size={14}/> Clubs ({results.clubs.length})
            </h2>
            <div className="space-y-2">
              {results.clubs.map(c => (
                <Link key={c.id} href={`/club/${c.slug}`}
                  className="card p-4 flex items-center gap-4 hover:border-cmr-yellow transition-colors block">
                  {c.logo_url ? (
                    <img src={c.logo_url} alt={c.sigle} className="w-10 h-10 rounded-full object-cover border border-border"/>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-green-mid flex items-center justify-center text-xs font-oswald font-bold text-white border border-white/10">
                      {c.sigle?.slice(0,3)}
                    </div>
                  )}
                  <div>
                    <div className="font-barlow-condensed font-semibold">{c.nom}</div>
                    <div className="text-xs text-green-muted">{c.sport} · {c.ville}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Compétitions */}
        {results.competitions.length > 0 && (
          <section className="mb-6">
            <h2 className="flex items-center gap-2 font-oswald text-sm tracking-widest text-green-muted uppercase mb-3">
              <Trophy size={14}/> Compétitions ({results.competitions.length})
            </h2>
            <div className="space-y-2">
              {results.competitions.map(c => (
                <Link key={c.id} href={`/${c.sport}/${c.slug}`}
                  className="card p-4 flex items-center gap-4 hover:border-cmr-yellow transition-colors block">
                  <div className="text-2xl">{c.sport === 'football' ? '⚽' : c.sport === 'basketball' ? '🏀' : c.sport === 'volleyball' ? '🏐' : '🤾'}</div>
                  <div>
                    <div className="font-barlow-condensed font-semibold">{c.nom}</div>
                    <div className="text-xs text-green-muted capitalize">{c.sport}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Matchs */}
        {results.matchs.length > 0 && (
          <section className="mb-6">
            <h2 className="flex items-center gap-2 font-oswald text-sm tracking-widest text-green-muted uppercase mb-3">
              <Calendar size={14}/> Matchs ({results.matchs.length})
            </h2>
            <div className="space-y-2">
              {results.matchs.map(m => (
                <Link key={m.id} href={`/match/${m.id}`}
                  className="card p-4 hover:border-cmr-yellow transition-colors block">
                  <div className="text-xs text-green-muted font-oswald mb-1">{m.competition_nom}</div>
                  <div className="flex items-center justify-between">
                    <span className="font-barlow-condensed font-semibold">{m.dom_nom}</span>
                    <span className={`font-oswald font-bold text-lg mx-3 ${m.statut === 'en_direct' ? 'text-cmr-live' : 'text-white'}`}>
                      {m.statut !== 'planifie' ? `${m.dom_score} — ${m.ext_score}` : 'VS'}
                    </span>
                    <span className="font-barlow-condensed font-semibold">{m.ext_nom}</span>
                  </div>
                  <div className="text-xs text-green-muted mt-1">
                    {m.statut === 'en_direct' ? '🔴 En direct' : m.statut === 'termine' ? '✅ Terminé' : '⏳ Planifié'}
                    {m.date_match && ` · ${new Date(m.date_match).toLocaleDateString('fr-FR', { timeZone: 'Africa/Douala' })}`}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
