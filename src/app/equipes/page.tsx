import Navbar from '@/components/Navbar'
import ClubLogo from '@/components/ClubLogo'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getSportConfig } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function EquipesPage() {
  const { data: clubs } = await supabase
    .from('clubs')
    .select('id, nom, nom_court, sigle, sport, ville, couleur_maillot_dom, logo_url, actif')
    .eq('actif', true)
    .order('sport')
    .order('nom')

  const parSport = (clubs ?? []).reduce<Record<string, any[]>>((acc, c) => {
    if (!acc[c.sport]) acc[c.sport] = []
    acc[c.sport].push(c)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-dark">
      <Navbar/>
      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        <h1 className="font-oswald font-bold text-4xl tracking-widest text-cmr-yellow mb-8">
          🏟️ ÉQUIPES
        </h1>
        <div className="space-y-10">
          {Object.entries(parSport).map(([sport, clubsList]) => {
            const cfg = getSportConfig(sport as any)
            return (
              <section key={sport}>
                <h2 className="font-oswald text-2xl tracking-widest text-white mb-4 flex items-center gap-3">
                  <span>{cfg.emoji}</span>{cfg.label}
                  <span className="text-sm text-green-muted">({clubsList.length} clubs)</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
                  {clubsList.map((c: any) => (
                    <div key={c.id} className="card p-4 text-center hover:border-green-mid transition-all">
                      <div className="flex justify-center mb-3">
                        <ClubLogo
                          nom={c.nom}
                          sigle={c.sigle}
                          couleur={c.couleur_maillot_dom}
                          logo_url={c.logo_url}
                          size={56}
                        />
                      </div>
                      <div className="font-oswald text-xs tracking-wide text-white leading-tight">{c.nom_court ?? c.nom}</div>
                      <div className="text-xs text-green-dim mt-1">{c.ville}</div>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
