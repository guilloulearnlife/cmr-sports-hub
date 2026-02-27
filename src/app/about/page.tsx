
import Link from 'next/link'

export const metadata = { title: 'À propos — CMR Sports Hub' }

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-3xl mx-auto px-4 py-16">
        
        <div className="text-center mb-16">
          <div className="text-6xl mb-6">🇨🇲</div>
          <h1 className="font-oswald font-bold text-4xl tracking-widest text-cmr-yellow mb-4">
            CMR SPORTS HUB
          </h1>
          <p className="text-green-muted text-lg">
            La plateforme nationale du sport camerounais
          </p>
        </div>

        <div className="space-y-8">
          <div className="card p-8">
            <h2 className="font-oswald text-xl tracking-widest text-cmr-yellow mb-4">NOTRE MISSION</h2>
            <p className="text-green-muted leading-relaxed">
              CMR Sports Hub est la plateforme de référence pour le suivi des compétitions sportives au Cameroun. 
              Notre mission est de centraliser et diffuser en temps réel les scores, classements et calendriers 
              de toutes les disciplines sportives nationales — du football au billard, en passant par le handball, 
              le basketball et bien d'autres.
            </p>
          </div>

          <div className="card p-8">
            <h2 className="font-oswald text-xl tracking-widest text-cmr-yellow mb-4">NOS SPORTS</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { emoji: '⚽', label: 'Football' },
                { emoji: '🏀', label: 'Basketball' },
                { emoji: '🏐', label: 'Volleyball' },
                { emoji: '🤾', label: 'Handball' },
                { emoji: '🎱', label: 'Billard' },
                { emoji: '🥊', label: 'Boxe' },
              ].map(s => (
                <div key={s.label} className="bg-deep rounded-lg p-4 text-center border border-border">
                  <div className="text-3xl mb-2">{s.emoji}</div>
                  <div className="font-oswald tracking-wider text-white text-sm">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-8">
            <h2 className="font-oswald text-xl tracking-widest text-cmr-yellow mb-4">COMMENT ÇA MARCHE</h2>
            <div className="space-y-4">
              {[
                { num: '01', title: 'Correspondants sur le terrain', desc: 'Des correspondants assignés à chaque match encodent les scores en temps réel depuis leur mobile.' },
                { num: '02', title: 'Validation par les fédérations', desc: 'Les administrateurs régionaux valident les scores avant publication officielle.' },
                { num: '03', title: 'Diffusion instantanée', desc: 'Les résultats validés sont immédiatement disponibles sur la plateforme pour tous les fans.' },
              ].map(s => (
                <div key={s.num} className="flex gap-4 items-start">
                  <div className="font-oswald text-3xl font-bold text-cmr-yellow opacity-40 w-12 flex-shrink-0">{s.num}</div>
                  <div>
                    <div className="font-oswald tracking-wider text-white mb-1">{s.title}</div>
                    <div className="text-green-muted text-sm">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-8">
            <h2 className="font-oswald text-xl tracking-widest text-cmr-yellow mb-4">CONTACT</h2>
            <p className="text-green-muted">
              Pour toute demande de partenariat ou d'intégration de votre fédération sportive sur la plateforme, 
              contactez-nous à <span className="text-cmr-yellow">contact@cmrsportshub.cm</span>
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/" className="btn-outline">← Retour à l'accueil</Link>
        </div>
      </div>
    </div>
  )
}
