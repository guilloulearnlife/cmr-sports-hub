import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('v_matchs')
    .select('*')
    .gte('date_match', `${today}T00:00:00`)
    .lte('date_match', `${today}T23:59:59`)
    .order('statut')
    .order('date_match')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    date: today,
    total: data?.length ?? 0,
    live: data?.filter(m => m.statut === 'en_direct').length ?? 0,
    matchs: data
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store'
    }
  })
}
