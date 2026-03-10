import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Mail, Heart, ExternalLink } from 'lucide-react'

const SOCIAL_LINKS = [
  { icon: Facebook, href: 'https://facebook.com/cmrsportshub', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com/cmrsportshub', label: 'Twitter' },
  { icon: Instagram, href: 'https://instagram.com/cmrsportshub', label: 'Instagram' },
  { icon: Youtube, href: 'https://youtube.com/@cmrsportshub', label: 'YouTube' },
]

const QUICK_LINKS = [
  { href: '/live', label: 'Scores en Direct' },
  { href: '/football', label: 'Football' },
  { href: '/basketball', label: 'Basketball' },
  { href: '/calendrier', label: 'Calendrier' },
]

const LEGAL_LINKS = [
  { href: '/about', label: 'À propos' },
  { href: '/admin-doc', label: 'Documentation' },
  { href: '/mentions-legales', label: 'Mentions légales' },
  { href: '/confidentialite', label: 'Confidentialité' },
]

const FEDERATIONS = [
  { name: 'FECAFOOT', sport: 'Football' },
  { name: 'FECABASKET', sport: 'Basketball' },
  { name: 'FECAVOLLEY', sport: 'Volleyball' },
  { name: 'FECAHAND', sport: 'Handball' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative border-t border-border-subtle bg-bg-elevated/50 pb-20 md:pb-0">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/4 w-80 h-80 bg-cmr-gold/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 w-60 h-60 bg-cmr-green/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-screen-2xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cmr-gold to-cmr-gold-dim flex items-center justify-center text-2xl shadow-glow">
                🏆
              </div>
              <div>
                <div className="font-oswald font-bold text-cmr-gold tracking-widest text-xl">CMR SPORTS</div>
                <div className="font-oswald text-white text-sm tracking-widest">HUB</div>
              </div>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-sm mb-6">
              La plateforme nationale du sport camerounais. Scores en direct, classements et calendriers de toutes les compétitions nationales.
            </p>
            
            {/* Social links */}
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl glass flex items-center justify-center text-text-muted hover:text-cmr-gold hover:border-cmr-gold/30 transition-all hover:scale-110"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-oswald text-cmr-gold tracking-widest text-sm mb-6">COMPÉTITIONS</h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-cmr-gold text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-text-muted group-hover:bg-cmr-gold transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-oswald text-cmr-gold tracking-widest text-sm mb-6">INFORMATIONS</h3>
            <ul className="space-y-3">
              {LEGAL_LINKS.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-cmr-gold text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-text-muted group-hover:bg-cmr-gold transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Federations */}
          <div>
            <h3 className="font-oswald text-cmr-gold tracking-widest text-sm mb-6">FÉDÉRATIONS</h3>
            <ul className="space-y-3">
              {FEDERATIONS.map(fed => (
                <li key={fed.name}>
                  <span className="text-text-secondary text-sm flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-cmr-green" />
                    <span className="text-white font-medium">{fed.name}</span>
                    <span className="text-text-muted text-xs">• {fed.sport}</span>
                  </span>
                </li>
              ))}
            </ul>
            
            {/* Contact */}
            <div className="mt-6 pt-6 border-t border-border-subtle">
              <a
                href="mailto:contact@tgm-automation.com"
                className="flex items-center gap-2 text-text-secondary hover:text-cmr-gold text-sm transition-colors"
              >
                <Mail size={14} />
                contact@tgm-automation.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border-subtle pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-text-muted flex items-center gap-2">
            <span>© {currentYear} CMR Sports Hub</span>
            <span className="hidden md:inline">—</span>
            <span className="hidden md:inline">Toutes les compétitions nationales du Cameroun</span>
          </div>
          
          <div className="flex items-center gap-6">
            <span className="text-xs text-text-muted flex items-center gap-2">
              Fait avec <Heart size={12} className="text-cmr-red fill-cmr-red" /> au Cameroun
            </span>
            <div className="flex items-center gap-1">
              <span className="w-4 h-3 rounded-sm bg-cmr-green" />
              <span className="w-4 h-3 rounded-sm bg-cmr-red" />
              <span className="w-4 h-3 rounded-sm bg-cmr-gold" />
            </div>
          </div>
        </div>
      </div>

      {/* Flag strip */}
      <div className="flag-strip">
        <div className="fg" />
        <div className="fr" />
        <div className="fy" />
      </div>
    </footer>
  )
}
