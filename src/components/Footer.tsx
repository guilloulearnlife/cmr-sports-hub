import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react'

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
  { href: '/api-doc', label: 'API' },
  { href: '/mentions-legales', label: 'Mentions légales' },
  { href: '/confidentialite', label: 'Confidentialité' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border mt-16 bg-deep">
      <div className="max-w-screen-2xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-cmr-yellow flex items-center justify-center text-xl">
                🏆
              </div>
              <div>
                <div className="font-oswald text-cmr-yellow font-bold tracking-widest">CMR SPORTS</div>
                <div className="font-oswald text-white text-sm tracking-widest">HUB</div>
              </div>
            </div>
            <p className="text-green-muted text-sm leading-relaxed">
              La plateforme nationale du sport camerounais. Scores en direct, classements et calendriers de toutes les compétitions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-oswald text-cmr-yellow tracking-widest text-sm mb-4">COMPÉTITIONS</h3>
            <ul className="space-y-2">
              {QUICK_LINKS.map(link => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-green-muted hover:text-cmr-yellow text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-oswald text-cmr-yellow tracking-widest text-sm mb-4">INFORMATIONS</h3>
            <ul className="space-y-2">
              {LEGAL_LINKS.map(link => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-green-muted hover:text-cmr-yellow text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h3 className="font-oswald text-cmr-yellow tracking-widest text-sm mb-4">SUIVEZ-NOUS</h3>
            <div className="flex gap-3 mb-4">
              {SOCIAL_LINKS.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-green-muted hover:text-cmr-yellow hover:border-cmr-yellow transition-all"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
            <a 
              href="mailto:contact@tgm-automation.com"
              className="flex items-center gap-2 text-green-muted hover:text-cmr-yellow text-sm transition-colors"
            >
              <Mail size={14} />
              contact@tgm-automation.com
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-green-dim">
            © {currentYear} CMR Sports Hub — Toutes les compétitions nationales du Cameroun
          </div>
          <div className="flex items-center gap-4 text-xs text-green-dim">
            <span>Fait avec ❤️ au Cameroun</span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-cmr-green" />
              <span className="w-3 h-3 rounded-sm bg-cmr-flag_r" />
              <span className="w-3 h-3 rounded-sm bg-cmr-flag_y" />
            </span>
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
