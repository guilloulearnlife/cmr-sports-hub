
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'
import type { MatchView } from '@/lib/supabase'
import CalendrierClient from './CalendrierClient'

export const dynamic = 'force-dynamic'

export default async function CalendrierPage() {
  const [{ data: matchs }, { data: competitions }] = await Promise.all([
    supabase.from('v_matchs').select('*').order('date_match').limit(300),
    supabase.from('competitions').select('id, nom, sport, slug').eq('statut', 'en_cours').order('sport'),
  ])

  return (
    <div className="min-h-screen bg-dark">
      <Navbar/>
      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        <h1 className="font-oswald font-bold text-4xl tracking-widest text-cmr-yellow mb-8">
          📅 CALENDRIER GÉNÉRAL
        </h1>
        <CalendrierClient matchs={(matchs ?? []) as MatchView[]} competitions={competitions ?? []}/>
      </div>
    </div>
  )
}
