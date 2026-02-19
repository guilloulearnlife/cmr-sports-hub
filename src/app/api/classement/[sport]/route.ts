import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sport: string }> }
) {
  const { sport } = await params

  const { data: comp } = await supabase
    .from('competitions')
    .select('id, nom, slug')
    .eq('sport', sport)
    .eq('type', 'championnat')
    .eq('statut', 'en_cours')
    .single()

  if (!comp) return NextResponse.json({ error: 'Compétition introuvable' }, { status: 404 })

  const { data, error } = await supabase
    .from('v_classements')
    .select('*')
    .eq('competition_id', comp.id)
    .order('position')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    competition: comp.nom,
    slug: comp.slug,
    classement: data
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, s-maxage=60'
    }
  })
}
