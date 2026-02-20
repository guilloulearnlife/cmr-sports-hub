'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Settings, RefreshCw, Trophy, Calendar, Users, CheckCircle, UserPlus, BarChart2, Globe, Smartphone } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        window.location.href = '/admin/login'
      } else {
        setAuthed(true)
      }
    })
  }, [])

  if (authed === null) return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <RefreshCw size={24} className="animate-spin text-cmr-yellow"/>
    </div>
  )

  return <Dashboard/>
}

function Dashboard() {
  const [stats, setStats] = useState({ competitions: 0, clubs: 0, matchs: 0, enAttente: 0, correspondants: 0 })

  useEffect(() => {
    async function loadStats() {
      const [comps, clubs, matchs, attente, corrs] = await Promise.all([
        supabase.from('competitions').select('id', { count: 'exact' }).eq('statut', 'en_cours'),
        supabase.from('clubs').select('id', { count: 'exact' }).eq('actif', true),
        supabase.from('matchs').select('id', { count: 'exact' }).in('statut', ['planifie','en_direct']),
        supabase.from('matchs').select('id', { count: 'exact' }).eq('statut', 'en_attente'),
        supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'correspondant'),
      ])
      setStats({
        competitions: comps.count ?? 0,
        clubs: clubs.count ?? 0,
        matchs: matchs.count ?? 0,
        enAttente: attente.count ?? 0,
        correspondants: corrs.count ?? 0,
      })
    }
    loadStats()
  }, [])

  async function deconnexion() {
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  const sections = [
    {
      title: 'Encoder Scores',
      description: 'Encoder manuellement les scores des matchs',
      href: '/admin/encoder',
      icon: <Trophy size={28}/>,
      color: 'border-cmr-yellow text-cmr-yellow',
      bg: 'hover:bg-cmr-yellow/5',
    },
    {
      title: 'Validation Scores',
      description: 'Approuver ou rejeter les scores soumis',
      href: '/admin/validation',
      icon: <CheckCircle size={28}/>,
      color: 'border-green-500 text-green-400',
      bg: 'hover:bg-green-900/20',
      badge: stats.enAttente > 0 ? stats.enAttente : null,
    },
    {
      title: 'Planifier un Match',
      description: 'Créer un match et assigner un correspondant',
      href: '/admin/matchs',
      icon: <Calendar size={28}/>,
      color: 'border-blue-500 text-blue-400',
      bg: 'hover:bg-blue-900/20',
    },
    {
      title: 'Gérer les Clubs',
      description: 'Ajouter ou modifier des clubs',
      href: '/admin/clubs',
      icon: <Users size={28}/>,
      color: 'border-purple-500 text-purple-400',
      bg: 'hover:bg-purple-900/20',
    },
    {
      title: 'Utilisateurs',
      description: 'Gérer correspondants et admins régionaux',
      href: '/admin/utilisateurs',
      icon: <UserPlus size={28}/>,
      color: 'border-orange-500 text-orange-400',
      bg: 'hover:bg-orange-900/20',
    },
    {
      title: 'Classements',
      description: 'Voir et recalculer les classements',
      href: '/football/elite-one/classement',
      icon: <BarChart2 size={28}/>,
      color: 'border-pink-500 text-pink-400',
      bg: 'hover:bg-pink-900/20',
    },
    {
      title: 'Site Public',
      description: 'Voir le site comme les visiteurs',
      href: '/',
      icon: <Globe size={28}/>,
      color: 'border-gray-500 text-gray-400',
      bg: 'hover:bg-gray-900/20',
    },
    {
      title: 'Page Encodage Mobile',
      description: 'Interface mobile pour correspondants',
      href: '/encoder',
      icon: <Smartphone size={28}/>,
      color: 'border-teal-500 text-teal-400',
      bg: 'hover:bg-teal-900/20',
    },
  ]

  return (
    <div className="min-h-screen bg-dark">
      <header className="border-b-2 border-cmr-yellow sticky top-0 z-50"
              style={{ background: 'linear-gradient(135deg, #0c2218, #091510)' }}>
        <div className="flag-strip"><div className="fg"/><div className="fr"/><div className="fy"/></div>
        <div className="max-w-screen-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings size={18} className="text-cmr-yellow"/>
            <span className="font-oswald font-bold text-cmr-yellow tracking-widest">ADMIN PANEL</span>
            <span className="text-xs text-green-muted">CMR Sports Hub</span>
          </div>
          <button onClick={deconnexion}
                  className="text-xs text-red-400 hover:text-red-300 font-oswald tracking-wider transition-colors border border-red-900 px-3 py-1 rounded hover:border-red-700">
            Déconnexion
          </button>
        </div>
      </header>

      <div className="max-w-screen-lg mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
          {[
            { label: 'Compétitions', val: stats.competitions, color: 'text-cmr-yellow' },
            { label: 'Clubs', val: stats.clubs, color: 'text-green-400' },
            { label: 'Matchs à jouer', val: stats.matchs, color: 'text-blue-400' },
            { label: 'En attente', val: stats.enAttente, color: stats.enAttente > 0 ? 'text-red-400' : 'text-green-muted' },
            { label: 'Correspondants', val: stats.correspondants, color: 'text-orange-400' },
          ].map(s => (
            <div key={s.label} className="card p-4 text-center">
              <div className={`font-oswald font-bold text-3xl ${s.color}`}>{s.val}</div>
              <div className="text-xs text-green-dim font-oswald tracking-wider mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Cards navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sections.map(s => (
            <Link key={s.href} href={s.href}
                  className={`card p-6 border-l-4 ${s.color} ${s.bg} transition-all hover:scale-105 relative`}>
              {s.badge && (
                <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {s.badge}
                </span>
              )}
              <div className={`mb-3 ${s.color.split(' ')[1]}`}>{s.icon}</div>
              <div className="font-oswald font-bold text-white tracking-wider mb-1">{s.title}</div>
              <div className="text-xs text-green-muted">{s.description}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
