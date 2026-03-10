'use client'

import Link from 'next/link'
import { Bell, ArrowLeft, Smartphone, Zap, Shield, HelpCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BottomNav from '@/components/BottomNav'
import NotificationSettings from '@/components/NotificationSettings'
import { useNotifications } from '@/hooks/useNotifications'

export default function NotificationsPage() {
  const { isEnabled, isSupported } = useNotifications()

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />

      {/* Hero */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cmr-gold/5 via-transparent to-transparent" />
        <div className="absolute top-10 right-1/4 w-40 h-40 bg-cmr-gold/10 rounded-full blur-3xl animate-float" />
        
        <div className="relative max-w-screen-xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-text-muted hover:text-cmr-gold text-sm mb-6 transition-colors">
            <ArrowLeft size={16} />
            Retour à l'accueil
          </Link>
          
          <div className="flex items-center gap-4 mb-4 animate-fade-up">
            <div className="w-16 h-16 rounded-2xl bg-cmr-gold/20 flex items-center justify-center">
              <Bell className="text-cmr-gold" size={32} />
            </div>
            <div>
              <h1 className="font-oswald font-black text-4xl tracking-widest text-white">
                NOTIFICATIONS
              </h1>
              <p className="text-text-secondary">
                Configurez vos alertes en direct
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-8">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Settings panel */}
            <div className="lg:col-span-2 animate-fade-up">
              <NotificationSettings />
            </div>

            {/* Info sidebar */}
            <div className="space-y-6">
              {/* Status card */}
              <div className="card p-5 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-3 h-3 rounded-full ${isEnabled ? 'bg-cmr-green animate-pulse' : 'bg-text-muted'}`} />
                  <span className="font-oswald text-sm tracking-wider text-text-secondary">
                    STATUT
                  </span>
                </div>
                <div className={`text-2xl font-oswald tracking-wider ${isEnabled ? 'text-cmr-green' : 'text-text-muted'}`}>
                  {!isSupported ? 'Non supporté' : isEnabled ? 'Actif' : 'Inactif'}
                </div>
              </div>

              {/* Features */}
              <div className="card p-5 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="font-oswald text-cmr-gold tracking-wider text-sm mb-4">
                  FONCTIONNALITÉS
                </h3>
                <ul className="space-y-3">
                  {[
                    { icon: Zap, text: 'Alertes instantanées' },
                    { icon: Smartphone, text: 'Fonctionne en arrière-plan' },
                    { icon: Shield, text: 'Respect de la vie privée' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-text-secondary text-sm">
                      <item.icon size={16} className="text-cmr-gold" />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Help */}
              <div className="card p-5 animate-fade-up" style={{ animationDelay: '0.3s' }}>
                <h3 className="font-oswald text-cmr-gold tracking-wider text-sm mb-4 flex items-center gap-2">
                  <HelpCircle size={16} />
                  AIDE
                </h3>
                <div className="space-y-4 text-sm text-text-muted">
                  <div>
                    <strong className="text-white block mb-1">Comment ça marche ?</strong>
                    <p>Les notifications s'affichent même quand l'application est fermée, directement sur votre appareil.</p>
                  </div>
                  <div>
                    <strong className="text-white block mb-1">Pas de notification ?</strong>
                    <p>Vérifiez que les notifications sont autorisées dans les paramètres de votre navigateur.</p>
                  </div>
                  <div>
                    <strong className="text-white block mb-1">Économie de batterie ?</strong>
                    <p>Les notifications push consomment très peu de batterie.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Types of notifications */}
      <section className="py-12 bg-bg-elevated/30">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="font-oswald text-2xl tracking-widest text-white text-center mb-8">
            Types de notifications
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                emoji: '🏟️',
                title: 'Début de match',
                desc: 'Soyez prévenu dès qu\'un match de vos équipes favorites commence',
                example: 'Canon Yaoundé vs Coton Sport • Elite One',
              },
              {
                emoji: '⚽',
                title: 'Buts en direct',
                desc: 'Notification instantanée à chaque but avec le buteur',
                example: 'BUUUT ! Canon 2 - 1 Coton • Nsame 67\'',
              },
              {
                emoji: '🏁',
                title: 'Score final',
                desc: 'Résumé du match dès le coup de sifflet final',
                example: 'Match terminé : Canon 3 - 2 Coton Sport',
              },
            ].map((item, i) => (
              <div key={i} className="card p-6 text-center animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-5xl mb-4">{item.emoji}</div>
                <h3 className="font-oswald text-white tracking-wider mb-2">{item.title}</h3>
                <p className="text-text-muted text-sm mb-4">{item.desc}</p>
                <div className="bg-bg-surface rounded-lg p-3 text-xs text-text-secondary">
                  <span className="text-cmr-gold">Exemple :</span> {item.example}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <BottomNav />
    </div>
  )
}
