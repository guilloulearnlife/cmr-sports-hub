import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sport: string }> }
) {
  const { sport } = await params
  const { searchParams } = new URL(request.url)
  const limite = parseInt(searchParams.get('limite') ?? '20')
  const statut = searchParams.get('statut') // planifie, en_direct, termine

  let query = supabase
    .from('v_matchs')
    .select('*')
    .eq('sport', sport)
    .order('date_match', { ascending: false })
    .limit(limite)

  if (statut) query = query.eq('statut', statut)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    sport,
    total: data?.length ?? 0,
    matchs: data
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, s-maxage=30'
    }
  })
}
