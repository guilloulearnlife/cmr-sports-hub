'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { RefreshCw, BarChart2, ExternalLink } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ClassementsAdminPage() {
  const [competitions, setCompetitions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtreSport, setFiltreSport] = useState('')

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    const { data } = await supabase
      .from('competitions')
      .select('id, nom, sport, slug, statut, nb_journees, saison')
      .order('sport')
    setCompetitions(data ?? [])
    setLoading(false)
  }

  const sports = [...new Set(competitions.map(c => c.sport))]
  const filtrees = filtreSport ? competitions.filter(c => c.sport === filtreSport) : competitions

  const SPORT_EMOJI: Record<string, string> = {
    football: '⚽', basketball: '🏀', volleyball: '🏐', handball: '🤾',
    billard: '🎱', boxe: '🥊', athletisme: '🏃',
  }

  return (
    <div className="min-h-screen bg-dark p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <BarChart2 size={24} className="text-cmr-yellow"/>
            <h1 className="font-oswald font-bold text-3xl tracking-widest text-cmr-yellow">CLASSEMENTS</h1>
          </div>
          <Link href="/admin" className="btn-outline text-sm">Dashboard</Link>
        </div>

        <div className="card p-4 mb-6 flex flex-wrap gap-3 items-center">
          <span className="text-xs text-green-muted font-oswald tracking-wider">Filtrer par sport :</span>
          <button onClick={() => setFiltreSport('')}
            className={`px-3 py-1.5 rounded text-xs font-oswald tracking-wider border transition-colors ${!filtreSport ? 'bg-cmr-yellow text-dark border-cmr-yellow' : 'border-border text-green-muted hover:border-cmr-yellow'}`}>
            Tous
          </button>
          {sports.map(s => (
            <button key={s} onClick={() => setFiltreSport(s)}
              className={`px-3 py-1.5 rounded text-xs font-oswald tracking-wider border transition-colors ${filtreSport === s ? 'bg-cmr-yellow text-dark border-cmr-yellow' : 'border-border text-green-muted hover:border-cmr-yellow'}`}>
              {SPORT_EMOJI[s]} {s}
            </button>
          ))}
          {loading && <RefreshCw size={14} className="animate-spin text-cmr-yellow ml-auto"/>}
        </div>

        <div className="space-y-3">
          {filtrees.map(c => (
            <div key={c.id} className="card p-4 flex items-center gap-4 hover:border-green-mid transition-colors">
              <div className="text-2xl">{SPORT_EMOJI[c.sport] ?? '🏆'}</div>
              <div className="flex-1">
                <div className="font-barlow-condensed font-semibold">{c.nom}</div>
                <div className="text-xs text-green-muted mt-0.5">{c.sport} · {c.saison}</div>
              </div>
              <span className={`text-xs font-oswald px-2 py-1 rounded border ${c.statut === 'en_cours' ? 'text-green-400 border-green-700 bg-green-900/20' : 'text-gray-400 border-gray-700 bg-gray-900/20'}`}>
                {c.statut}
              </span>
              <div className="flex gap-2">
                <Link href={`/${c.sport}/${c.slug}/classement`} target="_blank"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border text-green-muted hover:border-cmr-yellow hover:text-cmr-yellow transition-colors text-xs font-oswald">
                  <BarChart2 size={12}/> Classement
                </Link>
                <Link href={`/${c.sport}/${c.slug}/calendrier`} target="_blank"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border text-green-muted hover:border-cmr-yellow hover:text-cmr-yellow transition-colors text-xs font-oswald">
                  <ExternalLink size={12}/> Calendrier
                </Link>
              </div>
            </div>
          ))}
          {filtrees.length === 0 && !loading && (
            <div className="card p-12 text-center text-green-muted font-oswald tracking-wider">
              Aucune competition trouvee
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
