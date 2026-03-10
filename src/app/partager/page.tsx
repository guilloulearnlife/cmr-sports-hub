'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Share2, Trophy, Calendar, ArrowLeft, Zap, Copy, Check, Twitter, Facebook, ExternalLink } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BottomNav from '@/components/BottomNav'
import ShareButton from '@/components/ShareButton'

// WhatsApp icon
const WhatsAppIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

// Example match data for demo
const DEMO_MATCHES = [
  {
    id: '1',
    home: 'Canon Yaoundé',
    away: 'Coton Sport',
    homeScore: 2,
    awayScore: 1,
    competition: 'Elite One',
    status: 'termine',
    date: '10 Mars 2026',
  },
  {
    id: '2',
    home: 'FAP',
    away: 'Union Douala',
    homeScore: 0,
    awayScore: 0,
    competition: 'Elite One',
    status: 'en_direct',
    minute: 45,
    date: "Aujourd'hui",
  },
  {
    id: '3',
    home: 'Tonnerre',
    away: 'Bamboutos',
    homeScore: null,
    awayScore: null,
    competition: 'Elite Two',
    status: 'planifie',
    date: '12 Mars 2026',
  },
]

export default function PartagerPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />

      {/* Hero */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cmr-gold/5 via-transparent to-transparent" />
        <div className="absolute top-10 left-1/4 w-40 h-40 bg-cmr-gold/10 rounded-full blur-3xl animate-float" />
        
        <div className="relative max-w-screen-xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-text-muted hover:text-cmr-gold text-sm mb-6 transition-colors">
            <ArrowLeft size={16} />
            Retour à l'accueil
          </Link>
          
          <div className="flex items-center gap-4 mb-4 animate-fade-up">
            <div className="w-16 h-16 rounded-2xl bg-cmr-gold/20 flex items-center justify-center">
              <Share2 className="text-cmr-gold" size={32} />
            </div>
            <div>
              <h1 className="font-oswald font-black text-4xl tracking-widest text-white">
                PARTAGER
              </h1>
              <p className="text-text-secondary">
                Partagez les scores avec vos amis
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Share tools */}
      <section className="py-8">
        <div className="max-w-screen-xl mx-auto px-4">
          
          {/* Quick share */}
          <div className="card p-6 mb-8 animate-fade-up">
            <h2 className="font-oswald text-xl tracking-widest text-cmr-gold mb-6">
              Partage rapide
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { 
                  icon: <WhatsAppIcon size={32} />, 
                  label: 'WhatsApp', 
                  color: '#25D366',
                  href: 'https://wa.me/?text=Suivez%20le%20sport%20camerounais%20en%20direct%20sur%20CMR%20Sports%20Hub%20!%20https://cmr-sports-hub.vercel.app'
                },
                { 
                  icon: <Twitter size={32} />, 
                  label: 'Twitter', 
                  color: '#1DA1F2',
                  href: 'https://twitter.com/intent/tweet?text=Suivez%20le%20sport%20camerounais%20en%20direct%20!&url=https://cmr-sports-hub.vercel.app&hashtags=CMRSports,Cameroun'
                },
                { 
                  icon: <Facebook size={32} />, 
                  label: 'Facebook', 
                  color: '#1877F2',
                  href: 'https://www.facebook.com/sharer/sharer.php?u=https://cmr-sports-hub.vercel.app'
                },
                { 
                  icon: copied === 'site' ? <Check size={32} /> : <Copy size={32} />, 
                  label: copied === 'site' ? 'Copié !' : 'Copier le lien', 
                  color: copied === 'site' ? '#22c55e' : '#f5c518',
                  onClick: () => handleCopy('https://cmr-sports-hub.vercel.app', 'site')
                },
              ].map((item, i) => (
                item.href ? (
                  <a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-3 p-6 rounded-xl bg-bg-surface/50 border border-border-subtle hover:border-border-default transition-all hover:scale-105"
                  >
                    <div style={{ color: item.color }}>{item.icon}</div>
                    <span className="text-sm text-text-secondary">{item.label}</span>
                  </a>
                ) : (
                  <button
                    key={i}
                    onClick={item.onClick}
                    className="flex flex-col items-center gap-3 p-6 rounded-xl bg-bg-surface/50 border border-border-subtle hover:border-border-default transition-all hover:scale-105"
                  >
                    <div style={{ color: item.color }}>{item.icon}</div>
                    <span className="text-sm text-text-secondary">{item.label}</span>
                  </button>
                )
              ))}
            </div>
          </div>

          {/* Share matches */}
          <div className="card p-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="font-oswald text-xl tracking-widest text-cmr-gold mb-6">
              Partager un match
            </h2>
            
            <div className="space-y-4">
              {DEMO_MATCHES.map((match, i) => (
                <MatchShareCard key={match.id} match={match} index={i} />
              ))}
            </div>
          </div>

          {/* Share templates */}
          <div className="card p-6 mt-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="font-oswald text-xl tracking-widest text-cmr-gold mb-6">
              Messages prêts à partager
            </h2>
            
            <div className="space-y-4">
              {[
                {
                  id: 'template1',
                  title: '🏆 Inviter à suivre le sport camerounais',
                  text: 'Hey ! Suis les scores en direct du foot camerounais sur CMR Sports Hub ! Elite One, Elite Two, et plus encore 🇨🇲⚽\n\nhttps://cmr-sports-hub.vercel.app',
                },
                {
                  id: 'template2',
                  title: '⚽ Partager un résultat',
                  text: '🏁 RÉSULTAT Elite One\nCanon Yaoundé 2 - 1 Coton Sport\n\nClassement et prochains matchs sur CMR Sports Hub 🏆\nhttps://cmr-sports-hub.vercel.app/football',
                },
                {
                  id: 'template3',
                  title: '📺 Annoncer un match en direct',
                  text: '🔴 EN DIRECT maintenant !\nCanon vs Coton Sport - Elite One\n\nSuivez le score en temps réel ➡️\nhttps://cmr-sports-hub.vercel.app/live',
                },
              ].map(template => (
                <div key={template.id} className="bg-bg-surface/50 rounded-xl p-4 border border-border-subtle">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-semibold text-white text-sm">{template.title}</h3>
                    <button
                      onClick={() => handleCopy(template.text, template.id)}
                      className={`
                        flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-all
                        ${copied === template.id 
                          ? 'bg-cmr-green/20 text-cmr-green' 
                          : 'bg-bg-card text-text-muted hover:text-cmr-gold'
                        }
                      `}
                    >
                      {copied === template.id ? <Check size={14} /> : <Copy size={14} />}
                      {copied === template.id ? 'Copié' : 'Copier'}
                    </button>
                  </div>
                  <pre className="text-xs text-text-muted whitespace-pre-wrap font-sans">
                    {template.text}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="py-12 bg-bg-elevated/30">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="font-oswald text-2xl tracking-widest text-white text-center mb-8">
            Conseils pour partager
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                emoji: '📱',
                title: 'WhatsApp',
                tips: ['Partagez dans vos groupes de supporters', 'Utilisez les statuts pour les matchs live', 'Ajoutez des emojis pour plus d\'engagement'],
              },
              {
                emoji: '🐦',
                title: 'Twitter',
                tips: ['Utilisez #CMRSports et #Cameroun', 'Mentionnez @cmrsportshub', 'Partagez les buts en temps réel'],
              },
              {
                emoji: '📘',
                title: 'Facebook',
                tips: ['Partagez dans les pages de fans', 'Créez un post avec le score', 'Invitez vos amis à suivre'],
              },
            ].map((social, i) => (
              <div key={i} className="card p-6 animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-4xl mb-4">{social.emoji}</div>
                <h3 className="font-oswald text-white tracking-wider mb-4">{social.title}</h3>
                <ul className="space-y-2">
                  {social.tips.map((tip, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-text-muted">
                      <span className="text-cmr-gold">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
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

function MatchShareCard({ match, index }: { match: typeof DEMO_MATCHES[0], index: number }) {
  const isLive = match.status === 'en_direct'
  const isTermine = match.status === 'termine'
  const hasScore = match.homeScore !== null

  let shareText = ''
  if (isLive) {
    shareText = `🔴 EN DIRECT : ${match.home} ${match.homeScore} - ${match.awayScore} ${match.away} (${match.minute}')\n${match.competition}\n\nhttps://cmr-sports-hub.vercel.app/live`
  } else if (isTermine) {
    shareText = `🏁 RÉSULTAT : ${match.home} ${match.homeScore} - ${match.awayScore} ${match.away}\n${match.competition}\n\nhttps://cmr-sports-hub.vercel.app`
  } else {
    shareText = `📅 Prochain match : ${match.home} vs ${match.away}\n${match.competition} - ${match.date}\n\nhttps://cmr-sports-hub.vercel.app/calendrier`
  }

  return (
    <div 
      className={`
        flex items-center gap-4 p-4 rounded-xl border transition-all
        ${isLive ? 'bg-accent-live/5 border-accent-live/30' : 'bg-bg-surface/50 border-border-subtle'}
      `}
    >
      {/* Status */}
      <div className="flex-shrink-0">
        {isLive ? (
          <div className="badge-live">{match.minute}'</div>
        ) : isTermine ? (
          <span className="text-xs text-text-muted bg-bg-card px-2 py-1 rounded">Terminé</span>
        ) : (
          <span className="text-xs text-text-muted bg-bg-card px-2 py-1 rounded">{match.date}</span>
        )}
      </div>
      
      {/* Match info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-white truncate">{match.home}</span>
          {hasScore ? (
            <span className={`font-bold ${isLive ? 'text-accent-live' : 'text-cmr-gold'}`}>
              {match.homeScore} - {match.awayScore}
            </span>
          ) : (
            <span className="text-cmr-gold">vs</span>
          )}
          <span className="font-semibold text-white truncate">{match.away}</span>
        </div>
        <div className="text-xs text-text-muted">{match.competition}</div>
      </div>
      
      {/* Share button */}
      <ShareButton
        data={{
          title: hasScore 
            ? `${match.home} ${match.homeScore} - ${match.awayScore} ${match.away}`
            : `${match.home} vs ${match.away}`,
          text: shareText,
          hashtags: ['CMRSports', 'Cameroun', 'Football'],
        }}
        size="sm"
      />
    </div>
  )
}
