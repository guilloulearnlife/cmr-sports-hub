import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Politique de Confidentialité',
  description: 'Politique de confidentialité et protection des données de CMR Sports Hub'
}

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="font-oswald font-bold text-4xl tracking-widest text-cmr-yellow mb-8">
          POLITIQUE DE CONFIDENTIALITÉ
        </h1>

        <div className="space-y-8 text-green-muted">
          <section className="card p-6">
            <h2 className="font-oswald text-xl tracking-widest text-white mb-4">COLLECTE DES DONNÉES</h2>
            <p className="leading-relaxed">
              CMR Sports Hub collecte uniquement les données nécessaires au fonctionnement de la plateforme :
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li>Données de navigation (cookies techniques)</li>
              <li>Informations de compte pour les administrateurs et correspondants</li>
              <li>Données sportives publiques (scores, classements)</li>
            </ul>
          </section>

          <section className="card p-6">
            <h2 className="font-oswald text-xl tracking-widest text-white mb-4">UTILISATION DES DONNÉES</h2>
            <p className="leading-relaxed">
              Les données collectées sont utilisées exclusivement pour :
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li>Afficher les scores et résultats sportifs</li>
              <li>Gérer les comptes administrateurs</li>
              <li>Améliorer l'expérience utilisateur</li>
              <li>Assurer la sécurité de la plateforme</li>
            </ul>
          </section>

          <section className="card p-6">
            <h2 className="font-oswald text-xl tracking-widest text-white mb-4">COOKIES</h2>
            <p className="leading-relaxed">
              Ce site utilise des cookies techniques essentiels au fonctionnement de la plateforme. 
              Ces cookies ne collectent aucune donnée personnelle à des fins publicitaires.
            </p>
            <p className="leading-relaxed mt-4">
              Types de cookies utilisés :
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li><strong className="text-white">Cookies de session</strong> : authentification des utilisateurs</li>
              <li><strong className="text-white">Cookies de préférences</strong> : mémorisation des paramètres</li>
              <li><strong className="text-white">Cookies PWA</strong> : fonctionnement hors-ligne</li>
            </ul>
          </section>

          <section className="card p-6">
            <h2 className="font-oswald text-xl tracking-widest text-white mb-4">PARTAGE DES DONNÉES</h2>
            <p className="leading-relaxed">
              CMR Sports Hub ne vend ni ne partage vos données personnelles avec des tiers, 
              sauf obligation légale ou nécessité technique (hébergement, base de données).
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-oswald text-xl tracking-widest text-white mb-4">SÉCURITÉ</h2>
            <p className="leading-relaxed">
              Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données :
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li>Chiffrement SSL/TLS des communications</li>
              <li>Authentification sécurisée (Supabase Auth)</li>
              <li>Contrôle d'accès basé sur les rôles</li>
            </ul>
          </section>

          <section className="card p-6">
            <h2 className="font-oswald text-xl tracking-widest text-white mb-4">VOS DROITS</h2>
            <p className="leading-relaxed">
              Conformément à la réglementation en vigueur, vous disposez des droits suivants :
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement</li>
              <li>Droit à la portabilité</li>
            </ul>
            <p className="leading-relaxed mt-4">
              Pour exercer ces droits, contactez-nous à :{' '}
              <a href="mailto:contact@tgm-automation.com" className="text-cmr-yellow hover:underline">
                contact@tgm-automation.com
              </a>
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-oswald text-xl tracking-widest text-white mb-4">MISE À JOUR</h2>
            <p className="leading-relaxed">
              Cette politique de confidentialité peut être mise à jour. 
              Dernière modification : Janvier 2026
            </p>
          </section>
        </div>

        <div className="text-center mt-12">
          <Link href="/" className="btn-outline">← Retour à l'accueil</Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
