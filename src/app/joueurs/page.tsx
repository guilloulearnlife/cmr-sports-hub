
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import JoueursClient from './JoueursClient'

export const dynamic = 'force-dynamic'

export default async function JoueursPage() {
  const [{ data: joueurs }, { data: competitions }] = await Promise.all([
    supabase.from('v_stats_joueurs').select('*').order('buts', { ascending: false }),
    supabase.from('competitions').select('id, nom, sport').eq('statut', 'en_cours').order('sport'),
  ])

  return (
    <div className="min-h-screen bg-dark">
      <Navbar/>
      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        <h1 className="font-oswald font-bold text-4xl tracking-widest text-cmr-yellow mb-8">
          👤 JOUEURS & STATISTIQUES
        </h1>
        <JoueursClient joueurs={joueurs ?? []} competitions={competitions ?? []}/>
      </div>
    </div>
  )
}
