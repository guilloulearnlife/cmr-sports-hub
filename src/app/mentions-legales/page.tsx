import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Mentions Légales',
  description: 'Mentions légales et informations juridiques de CMR Sports Hub'
}

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="font-oswald font-bold text-4xl tracking-widest text-cmr-yellow mb-8">
          MENTIONS LÉGALES
        </h1>

        <div className="space-y-8 text-green-muted">
          <section className="card p-6">
            <h2 className="font-oswald text-xl tracking-widest text-white mb-4">ÉDITEUR DU SITE</h2>
            <p className="leading-relaxed">
              <strong className="text-white">CMR Sports Hub</strong><br />
              Plateforme d'information sportive<br />
              Cameroun<br />
              Email : contact@tgm-automation.com
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-oswald text-xl tracking-widest text-white mb-4">HÉBERGEMENT</h2>
            <p className="leading-relaxed">
              <strong className="text-white">Vercel Inc.</strong><br />
              340 S Lemon Ave #4133<br />
              Walnut, CA 91789<br />
              États-Unis
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-oswald text-xl tracking-widest text-white mb-4">PROPRIÉTÉ INTELLECTUELLE</h2>
            <p className="leading-relaxed">
              L'ensemble du contenu de ce site (textes, images, vidéos, logos) est protégé par le droit d'auteur. 
              Toute reproduction, même partielle, est soumise à autorisation préalable de l'éditeur.
            </p>
            <p className="leading-relaxed mt-4">
              Les logos et noms des fédérations sportives, clubs et compétitions sont la propriété de leurs détenteurs respectifs.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-oswald text-xl tracking-widest text-white mb-4">DONNÉES SPORTIVES</h2>
            <p className="leading-relaxed">
              Les données sportives (scores, classements, calendriers) sont fournies à titre informatif et peuvent 
              être sujettes à des erreurs ou retards. CMR Sports Hub s'efforce de maintenir ces informations à jour 
              mais ne peut garantir leur exactitude absolue.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-oswald text-xl tracking-widest text-white mb-4">RESPONSABILITÉ</h2>
            <p className="leading-relaxed">
              CMR Sports Hub ne saurait être tenu responsable des dommages directs ou indirects résultant de 
              l'utilisation des informations diffusées sur ce site.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-oswald text-xl tracking-widest text-white mb-4">CONTACT</h2>
            <p className="leading-relaxed">
              Pour toute question relative aux mentions légales, vous pouvez nous contacter à :{' '}
              <a href="mailto:contact@tgm-automation.com" className="text-cmr-yellow hover:underline">
                contact@tgm-automation.com
              </a>
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
