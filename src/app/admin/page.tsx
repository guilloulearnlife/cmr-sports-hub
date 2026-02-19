'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Settings, Plus, Save, CheckCircle, AlertCircle, RefreshCw, Trophy, Calendar, Users } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Competition, Club, MatchView } from '@/lib/supabase'

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

  return <AdminContent/>
}
