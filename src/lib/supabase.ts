import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

// ── Types TS générés depuis le schéma ──────────────────────

export type SportType = 
  | 'football' | 'basketball' | 'volleyball' | 'handball'
  | 'billard'  | 'cyclisme'   | 'boxe'       | 'athletisme'
  | 'judo'     | 'sambo'      | 'natation'   | 'autre'

export type MatchStatus = 
  | 'planifie' | 'en_direct' | 'termine' | 'reporte' | 'annule' | 'suspendu'

export type CompetitionStatus = 
  | 'a_venir' | 'en_cours' | 'suspendue' | 'terminee' | 'annulee'

export interface Federation {
  id:                 string
  slug:               string
  nom:                string
  nom_court:          string
  sport:              SportType
  logo_url?:          string
  couleur_primaire:   string
  couleur_secondaire: string
  president?:         string
  active:             boolean
}

export interface Competition {
  id:               string
  slug:             string
  nom:              string
  nom_court?:       string
  sport:            SportType
  statut:           CompetitionStatus
  genre:            string
  sponsor_principal?: string
  nb_journees?:     number
  federation_id:    string
  federations?:     Federation
}

export interface Club {
  id:                  string
  slug:                string
  nom:                 string
  nom_court?:          string
  sigle?:              string
  sport:               SportType
  ville?:              string
  logo_url?:           string
  couleur_maillot_dom?: string
}

export interface MatchView {
  id:               string
  competition_id:   string
  competition_nom:  string
  sport:            SportType
  federation:       string
  journee?:         number
  date_match?:      string
  statut:           MatchStatus
  resultat?:        string
  minute_actuelle?: number
  est_aller:        boolean
  dom_id:           string
  dom_nom:          string
  dom_sigle?:       string
  dom_logo?:        string
  dom_score?:       number
  ext_id:           string
  ext_nom:          string
  ext_sigle?:       string
  ext_logo?:        string
  ext_score?:       number
  lieu_nom?:        string
  lieu_ville?:      string
  diffusion_tv?:    string
}

export interface ClassementView {
  id:              string
  competition_id:  string
  competition_nom: string
  sport:           SportType
  journee?:        number
  position:        number
  club_id:         string
  club_nom:        string
  club_sigle?:     string
  club_logo?:      string
  club_ville?:     string
  matchs_joues:    number
  victoires:       number
  nuls:            number
  defaites:        number
  score_pour:      number
  score_contre:    number
  difference:      number
  points:          number
  points_nets:     number
  forme:           string
  zone?:           string
}

// ── Helpers requêtes ───────────────────────────────────────

export async function getMatchsLive(): Promise<MatchView[]> {
  try {
    const { data, error } = await supabase
      .from('v_matchs_live')
      .select('*')
      .order('date_match')
    if (error) {
      console.error('getMatchsLive error:', error.message)
      return []
    }
    return data as MatchView[]
  } catch (e) {
    console.error('getMatchsLive exception:', e)
    return []
  }
}

export async function getMatchsDuJour(): Promise<MatchView[]> {
  try {
    const { data, error } = await supabase
      .from('v_matchs_du_jour')
      .select('*')
      .order('date_match')
    if (error) {
      console.error('getMatchsDuJour error:', error.message)
      return []
    }
    return data as MatchView[]
  } catch (e) {
    console.error('getMatchsDuJour exception:', e)
    return []
  }
}

export async function getProchainMatchs(): Promise<MatchView[]> {
  try {
    const { data, error } = await supabase
      .from('v_prochains_matchs')
      .select('*')
      .order('date_match')
      .limit(20)
    if (error) {
      console.error('getProchainMatchs error:', error.message)
      return []
    }
    return data as MatchView[]
  } catch (e) {
    console.error('getProchainMatchs exception:', e)
    return []
  }
}

export async function getClassement(competitionSlug: string, journee?: number): Promise<ClassementView[]> {
  try {
    let query = supabase
      .from('v_classements')
      .select('*, competitions!inner(slug)')
      .eq('competitions.slug', competitionSlug)
      .order('position')

    if (journee) query = query.eq('journee', journee)
    
    const { data, error } = await query
    if (error) {
      console.error('getClassement error:', error.message)
      return []
    }
    return data as ClassementView[]
  } catch (e) {
    console.error('getClassement exception:', e)
    return []
  }
}

export async function getMatchsParCompetition(competitionSlug: string, journee?: number): Promise<MatchView[]> {
  try {
    let query = supabase
      .from('v_matchs')
      .select('*, competitions!inner(slug)')
      .eq('competitions.slug', competitionSlug)
      .order('date_match')

    if (journee) query = query.eq('journee', journee)

    const { data, error } = await query
    if (error) {
      console.error('getMatchsParCompetition error:', error.message)
      return []
    }
    return data as MatchView[]
  } catch (e) {
    console.error('getMatchsParCompetition exception:', e)
    return []
  }
}

export async function getCompetitionsActives(): Promise<Competition[]> {
  try {
    const { data, error } = await supabase
      .from('competitions')
      .select('*, federations(*)')
      .eq('statut', 'en_cours')
      .order('sport')
    if (error) {
      console.error('getCompetitionsActives error:', error.message)
      return []
    }
    return data as Competition[]
  } catch (e) {
    console.error('getCompetitionsActives exception:', e)
    return []
  }
}

export async function getFederations(): Promise<Federation[]> {
  try {
    const { data, error } = await supabase
      .from('federations')
      .select('*')
      .eq('active', true)
      .order('sport')
    if (error) {
      console.error('getFederations error:', error.message)
      return []
    }
    return data as Federation[]
  } catch (e) {
    console.error('getFederations exception:', e)
    return []
  }
}
