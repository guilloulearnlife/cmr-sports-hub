import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

const BASE_URL = 'https://cmr-sports-hub.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/live`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/calendrier`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/joueurs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/recherche`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  // Sports
  const sports = ['football', 'basketball', 'volleyball', 'handball', 'billard', 'boxe', 'athletisme']
  const sportPages: MetadataRoute.Sitemap = sports.map(sport => ({
    url: `${BASE_URL}/${sport}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Compétitions dynamiques
  let competitionPages: MetadataRoute.Sitemap = []
  try {
    const { data: competitions } = await supabase
      .from('competitions')
      .select('slug, sport, updated_at')
      .eq('statut', 'en_cours')

    if (competitions) {
      competitionPages = competitions.flatMap(comp => [
        {
          url: `${BASE_URL}/${comp.sport}/${comp.slug}`,
          lastModified: new Date(comp.updated_at || Date.now()),
          changeFrequency: 'daily' as const,
          priority: 0.7,
        },
        {
          url: `${BASE_URL}/${comp.sport}/${comp.slug}/classement`,
          lastModified: new Date(comp.updated_at || Date.now()),
          changeFrequency: 'daily' as const,
          priority: 0.7,
        },
        {
          url: `${BASE_URL}/${comp.sport}/${comp.slug}/calendrier`,
          lastModified: new Date(comp.updated_at || Date.now()),
          changeFrequency: 'daily' as const,
          priority: 0.6,
        },
      ])
    }
  } catch (error) {
    console.error('Erreur sitemap compétitions:', error)
  }

  // Clubs dynamiques
  let clubPages: MetadataRoute.Sitemap = []
  try {
    const { data: clubs } = await supabase
      .from('clubs')
      .select('slug, updated_at')
      .eq('actif', true)
      .limit(100)

    if (clubs) {
      clubPages = clubs.map(club => ({
        url: `${BASE_URL}/club/${club.slug}`,
        lastModified: new Date(club.updated_at || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.5,
      }))
    }
  } catch (error) {
    console.error('Erreur sitemap clubs:', error)
  }

  return [...staticPages, ...sportPages, ...competitionPages, ...clubPages]
}
