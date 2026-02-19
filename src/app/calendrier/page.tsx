import Navbar from '@/components/Navbar'
import MatchCard from '@/components/MatchCard'
import { supabase } from '@/lib/supabase'
import type { MatchView } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function CalendrierPage() {
  const { data: matchs } = await supabase
    .from('v_matchs')
    .select('*')
    .order('date_match')
    .limit(100)

  const all = (matchs ?? []) as MatchView[]

  // Grouper par date
  const parDate = all.reduce<Record<string, MatchView[]>>((acc, m) => {
    const key = m.date_match ? m.date_match.split('T')[0] : 'Sans date'
    if (!acc[key]) acc[key] = []
    acc[key].push(m)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-dark">
      <Navbar/>
      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        <h1 className="font-oswald font-bold text-4xl tracking-widest text-cmr-yellow mb-8">
          📅 CALENDRIER GÉNÉRAL
        </h1>

        {Object.keys(parDate).length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-green-muted font-oswald tracking-wider">Aucun match planifié</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(parDate).map(([date, matchsList]) => (
              <section key={date}>
                <h2 className="font-oswald text-lg tracking-widest text-white mb-3 pb-2 border-b border-border">
                  {date !== 'Sans date' 
                    ? new Date(date).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
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
    </div>
  )
}
