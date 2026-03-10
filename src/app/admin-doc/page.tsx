import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Shield, Users, CheckCircle, Calendar, Trophy, BarChart2, Smartphone, Globe } from 'lucide-react'

export const metadata = {
  title: 'Documentation Admin',
  description: 'Documentation des rôles et permissions administrateurs de CMR Sports Hub'
}

const ROLES = [
  {
    id: 'super_admin',
    nom: 'Super Admin',
    couleur: 'bg-cmr-yellow text-dark',
    description: 'Accès complet à toutes les fonctionnalités de la plateforme',
    permissions: [
      { action: 'Encoder les scores', icon: Trophy, allowed: true },
      { action: 'Valider les scores', icon: CheckCircle, allowed: true },
      { action: 'Planifier les matchs', icon: Calendar, allowed: true },
      { action: 'Gérer les compétitions', icon: Trophy, allowed: true },
      { action: 'Gérer les clubs', icon: Shield, allowed: true },
      { action: 'Gérer les joueurs', icon: Users, allowed: true },
      { action: 'Créer des utilisateurs', icon: Users, allowed: true },
      { action: 'Créer des Admin Régionaux', icon: Shield, allowed: true },
      { action: 'Voir les classements', icon: BarChart2, allowed: true },
      { action: 'Accès site public', icon: Globe, allowed: true },
    ],
    federations: 'Toutes les fédérations',
    redirect: '/admin'
  },
  {
    id: 'admin_regional',
    nom: 'Admin Régional',
    couleur: 'bg-blue-500 text-white',
    description: 'Gestion des compétitions et validation des scores pour sa région',
    permissions: [
      { action: 'Encoder les scores', icon: Trophy, allowed: true },
      { action: 'Valider les scores', icon: CheckCircle, allowed: true },
      { action: 'Planifier les matchs', icon: Calendar, allowed: true },
      { action: 'Gérer les compétitions', icon: Trophy, allowed: false },
      { action: 'Gérer les clubs', icon: Shield, allowed: true, note: 'Sa discipline uniquement' },
      { action: 'Gérer les joueurs', icon: Users, allowed: false },
      { action: 'Créer des utilisateurs', icon: Users, allowed: true, note: 'Correspondants uniquement' },
      { action: 'Créer des Admin Régionaux', icon: Shield, allowed: false },
      { action: 'Voir les classements', icon: BarChart2, allowed: true },
      { action: 'Accès site public', icon: Globe, allowed: true },
    ],
    federations: 'Fédération de sa région assignée',
    redirect: '/admin/regional'
  },
  {
    id: 'admin_federation',
    nom: 'Admin Fédération',
    couleur: 'bg-cyan-500 text-white',
    description: 'Gestion d\'une fédération sportive spécifique (FECAFOOT, FECABASKET, etc.)',
    permissions: [
      { action: 'Encoder les scores', icon: Trophy, allowed: true },
      { action: 'Valider les scores', icon: CheckCircle, allowed: true },
      { action: 'Planifier les matchs', icon: Calendar, allowed: true },
      { action: 'Gérer les compétitions', icon: Trophy, allowed: true, note: 'Sa fédération uniquement' },
      { action: 'Gérer les clubs', icon: Shield, allowed: true, note: 'Sa fédération uniquement' },
      { action: 'Gérer les joueurs', icon: Users, allowed: true, note: 'Sa fédération uniquement' },
      { action: 'Créer des utilisateurs', icon: Users, allowed: true, note: 'Correspondants uniquement' },
      { action: 'Créer des Admin Régionaux', icon: Shield, allowed: false },
      { action: 'Voir les classements', icon: BarChart2, allowed: true },
      { action: 'Accès site public', icon: Globe, allowed: true },
    ],
    federations: 'Une fédération spécifique (ex: FECAFOOT)',
    redirect: '/admin'
  },
  {
    id: 'admin_competition',
    nom: 'Admin Compétition',
    couleur: 'bg-purple-500 text-white',
    description: 'Gestion d\'une compétition spécifique (Elite One, Coupe du Cameroun, etc.)',
    permissions: [
      { action: 'Encoder les scores', icon: Trophy, allowed: true },
      { action: 'Valider les scores', icon: CheckCircle, allowed: true },
      { action: 'Planifier les matchs', icon: Calendar, allowed: true, note: 'Sa compétition uniquement' },
      { action: 'Gérer les compétitions', icon: Trophy, allowed: false },
      { action: 'Gérer les clubs', icon: Shield, allowed: false },
      { action: 'Gérer les joueurs', icon: Users, allowed: false },
      { action: 'Créer des utilisateurs', icon: Users, allowed: false },
      { action: 'Créer des Admin Régionaux', icon: Shield, allowed: false },
      { action: 'Voir les classements', icon: BarChart2, allowed: true },
      { action: 'Accès site public', icon: Globe, allowed: true },
    ],
    federations: 'Une compétition spécifique (ex: Elite One 2025)',
    redirect: '/admin'
  },
  {
    id: 'operateur_match',
    nom: 'Opérateur Match',
    couleur: 'bg-orange-500 text-white',
    description: 'Encodage des scores en temps réel depuis le terrain',
    permissions: [
      { action: 'Encoder les scores', icon: Trophy, allowed: true, note: 'Matchs assignés uniquement' },
      { action: 'Valider les scores', icon: CheckCircle, allowed: false },
      { action: 'Planifier les matchs', icon: Calendar, allowed: false },
      { action: 'Gérer les compétitions', icon: Trophy, allowed: false },
      { action: 'Gérer les clubs', icon: Shield, allowed: false },
      { action: 'Gérer les joueurs', icon: Users, allowed: false },
      { action: 'Créer des utilisateurs', icon: Users, allowed: false },
      { action: 'Créer des Admin Régionaux', icon: Shield, allowed: false },
      { action: 'Voir les classements', icon: BarChart2, allowed: true },
      { action: 'Accès site public', icon: Globe, allowed: true },
    ],
    federations: 'Matchs assignés par l\'admin',
    redirect: '/encoder'
  },
  {
    id: 'correspondant',
    nom: 'Correspondant',
    couleur: 'bg-green-500 text-white',
    description: 'Encodage des scores depuis le terrain avec validation requise',
    permissions: [
      { action: 'Encoder les scores', icon: Trophy, allowed: true, note: 'Matchs assignés, validation requise' },
      { action: 'Valider les scores', icon: CheckCircle, allowed: false },
      { action: 'Planifier les matchs', icon: Calendar, allowed: false },
      { action: 'Gérer les compétitions', icon: Trophy, allowed: false },
      { action: 'Gérer les clubs', icon: Shield, allowed: false },
      { action: 'Gérer les joueurs', icon: Users, allowed: false },
      { action: 'Créer des utilisateurs', icon: Users, allowed: false },
      { action: 'Créer des Admin Régionaux', icon: Shield, allowed: false },
      { action: 'Voir les classements', icon: BarChart2, allowed: true },
      { action: 'Accès site public', icon: Globe, allowed: true },
    ],
    federations: 'Matchs assignés par l\'admin régional',
    redirect: '/encoder'
  },
]

const REGIONS = [
  'Centre', 'Littoral', 'Ouest', 'Nord-Ouest', 'Sud-Ouest',
  'Nord', 'Extrême-Nord', 'Adamaoua', 'Est', 'Sud'
]

const FEDERATIONS = [
  { sigle: 'FECAFOOT', nom: 'Fédération Camerounaise de Football', sport: 'football' },
  { sigle: 'FECABASKET', nom: 'Fédération Camerounaise de Basketball', sport: 'basketball' },
  { sigle: 'FECAVOLLEY', nom: 'Fédération Camerounaise de Volleyball', sport: 'volleyball' },
  { sigle: 'FECAHAND', nom: 'Fédération Camerounaise de Handball', sport: 'handball' },
  { sigle: 'FECABILLARD', nom: 'Fédération Camerounaise de Billard', sport: 'billard' },
  { sigle: 'FECABOXE', nom: 'Fédération Camerounaise de Boxe', sport: 'boxe' },
  { sigle: 'FECATHLE', nom: 'Fédération Camerounaise d\'Athlétisme', sport: 'athletisme' },
]

export default function AdminDocPage() {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="font-oswald font-bold text-4xl tracking-widest text-cmr-yellow mb-4">
            DOCUMENTATION ADMIN
          </h1>
          <p className="text-green-muted text-lg">
            Rôles, permissions et workflow de la plateforme CMR Sports Hub
          </p>
        </div>

        {/* Workflow */}
        <section className="card p-6 mb-8">
          <h2 className="font-oswald text-xl tracking-widest text-cmr-yellow mb-4">
            📋 WORKFLOW D'ENCODAGE DES SCORES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { num: '1', title: 'Assignation', desc: 'L\'admin assigne un correspondant à un match', color: 'border-blue-500' },
              { num: '2', title: 'Encodage', desc: 'Le correspondant encode le score en direct depuis le stade', color: 'border-orange-500' },
              { num: '3', title: 'Soumission', desc: 'À la fin du match, le score est soumis pour validation', color: 'border-yellow-500' },
              { num: '4', title: 'Validation', desc: 'L\'admin régional valide et le classement est mis à jour', color: 'border-green-500' },
            ].map(step => (
              <div key={step.num} className={`bg-deep border-l-4 ${step.color} rounded-r-lg p-4`}>
                <div className="font-oswald text-2xl text-cmr-yellow mb-2">{step.num}</div>
                <div className="font-oswald tracking-wider text-white text-sm mb-1">{step.title}</div>
                <div className="text-xs text-green-muted">{step.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Rôles */}
        <section className="mb-8">
          <h2 className="font-oswald text-xl tracking-widest text-cmr-yellow mb-4">
            👥 RÔLES ET PERMISSIONS
          </h2>
          <div className="space-y-4">
            {ROLES.map(role => (
              <div key={role.id} className="card overflow-hidden">
                <div className={`${role.couleur} px-4 py-3 flex items-center justify-between`}>
                  <div>
                    <div className="font-oswald font-bold tracking-wider">{role.nom}</div>
                    <div className="text-xs opacity-80">{role.description}</div>
                  </div>
                  <div className="text-xs bg-black/20 px-2 py-1 rounded">{role.redirect}</div>
                </div>
                <div className="p-4">
                  <div className="text-xs text-green-muted mb-3">
                    <strong>Périmètre:</strong> {role.federations}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {role.permissions.map(perm => (
                      <div key={perm.action} className={`flex items-center gap-2 text-xs p-2 rounded ${perm.allowed ? 'bg-green-900/30 text-green-400' : 'bg-red-900/20 text-red-400/60'}`}>
                        <perm.icon size={12} />
                        <span className="truncate" title={perm.note}>{perm.action}</span>
                        {perm.note && <span className="text-yellow-500">*</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Fédérations */}
        <section className="card p-6 mb-8">
          <h2 className="font-oswald text-xl tracking-widest text-cmr-yellow mb-4">
            🏛️ FÉDÉRATIONS SUPPORTÉES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {FEDERATIONS.map(fed => (
              <div key={fed.sigle} className="bg-deep rounded-lg p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-mid flex items-center justify-center text-sm">
                  {fed.sport === 'football' ? '⚽' : fed.sport === 'basketball' ? '🏀' : fed.sport === 'volleyball' ? '🏐' : fed.sport === 'handball' ? '🤾' : fed.sport === 'billard' ? '🎱' : fed.sport === 'boxe' ? '🥊' : '🏃'}
                </div>
                <div>
                  <div className="font-oswald text-cmr-yellow text-sm tracking-wider">{fed.sigle}</div>
                  <div className="text-xs text-green-muted">{fed.nom}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Régions */}
        <section className="card p-6 mb-8">
          <h2 className="font-oswald text-xl tracking-widest text-cmr-yellow mb-4">
            📍 RÉGIONS DU CAMEROUN
          </h2>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map(region => (
              <span key={region} className="bg-deep border border-border px-3 py-1 rounded-full text-sm text-green-muted">
                {region}
              </span>
            ))}
          </div>
          <p className="text-xs text-green-dim mt-4">
            Chaque admin régional est assigné à une région spécifique et ne peut valider que les matchs de sa zone.
          </p>
        </section>

        {/* Notes */}
        <section className="card p-6">
          <h2 className="font-oswald text-xl tracking-widest text-cmr-yellow mb-4">
            📝 NOTES IMPORTANTES
          </h2>
          <ul className="space-y-3 text-green-muted text-sm">
            <li className="flex gap-2">
              <span className="text-cmr-yellow">•</span>
              <span>Les scores encodés par les correspondants nécessitent une validation avant publication</span>
            </li>
            <li className="flex gap-2">
              <span className="text-cmr-yellow">•</span>
              <span>Le classement est automatiquement recalculé après validation d'un score</span>
            </li>
            <li className="flex gap-2">
              <span className="text-cmr-yellow">•</span>
              <span>Les correspondants ne peuvent encoder que les matchs qui leur sont assignés</span>
            </li>
            <li className="flex gap-2">
              <span className="text-cmr-yellow">•</span>
              <span>Un match ne peut être encodé que 30 minutes avant l'heure prévue et jusqu'à 3h après</span>
            </li>
            <li className="flex gap-2">
              <span className="text-cmr-yellow">•</span>
              <span>Le sport Billard dispose d'une interface d'encodage spécifique (5 matchs individuels)</span>
            </li>
          </ul>
        </section>

        <div className="text-center mt-12">
          <Link href="/admin/login" className="btn-primary mr-4">Accès Admin</Link>
          <Link href="/" className="btn-outline">← Retour à l'accueil</Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
