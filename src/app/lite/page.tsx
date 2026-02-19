import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function LitePage() {
  const today = new Date().toISOString().split('T')[0]

  const { data: matchs } = await supabase
    .from('v_matchs')
    .select('sport, club_domicile_nom, club_exterieur_nom, score_domicile, score_exterieur, statut, date_match, journee')
    .gte('date_match', `${today}T00:00:00`)
    .lte('date_match', `${today}T23:59:59`)
    .order('statut')
    .order('date_match')

  const all = matchs ?? []
  const live     = all.filter(m => m.statut === 'en_direct')
  const termines = all.filter(m => m.statut === 'termine')
  const planifies = all.filter(m => m.statut === 'planifie')

  const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  const dateStr = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <html>
      <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>CMR Scores · {dateStr}</title>
        <style>{`
          * { margin:0; padding:0; box-sizing:border-box; }
          body { font-family: Arial, sans-serif; font-size: 14px; background: #fff; color: #000; }
          header { background: #007a3d; color: #fff; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; }
          header h1 { font-size: 16px; font-weight: bold; }
          header span { font-size: 12px; }
          .section { border-bottom: 2px solid #eee; padding: 6px 0; }
          .section-title { background: #f0f0f0; padding: 4px 12px; font-size: 12px; font-weight: bold; text-transform: uppercase; color: #555; }
          .live-title { background: #cc0000; color: #fff; }
          .match { display: flex; align-items: center; padding: 6px 12px; border-bottom: 1px solid #f5f5f5; }
          .teams { flex: 1; }
          .home { font-weight: bold; }
          .score { font-weight: bold; font-size: 16px; padding: 0 12px; min-width: 60px; text-align: center; }
          .live-score { color: #cc0000; }
          .sport { font-size: 10px; color: #888; }
          .time { font-size: 11px; color: #888; min-width: 45px; text-align: right; }
          .live-dot { display: inline-block; width: 6px; height: 6px; background: #cc0000; border-radius: 50%; margin-right: 4px; animation: blink 1s infinite; }
          @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
          footer { padding: 10px 12px; font-size: 11px; color: #888; text-align: center; }
          .empty { padding: 8px 12px; color: #888; font-size: 12px; }
          a { color: #007a3d; text-decoration: none; }
        `}</style>
      </head>
      <body>
        <header>
          <h1>🇨🇲 CMR SCORES</h1>
          <span>{dateStr} · {now}</span>
        </header>

        {live.length > 0 && (
          <div className="section">
            <div className="section-title live-title">
              <span className="live-dot"/>EN DIRECT ({live.length})
            </div>
            {live.map((m, i) => (
              <div key={i} className="match">
                <div className="teams">
                  <div className="home">{m.club_domicile_nom}</div>
                  <div>{m.club_exterieur_nom}</div>
                  <div className="sport">{m.sport?.toUpperCase()} · J{m.journee}</div>
                </div>
                <div className="score live-score">{m.score_domicile ?? 0} - {m.score_exterieur ?? 0}</div>
              </div>
            ))}
          </div>
        )}

        {termines.length > 0 && (
          <div className="section">
            <div className="section-title">RÉSULTATS ({termines.length})</div>
            {termines.map((m, i) => (
              <div key={i} className="match">
                <div className="teams">
                  <div className="home">{m.club_domicile_nom}</div>
                  <div>{m.club_exterieur_nom}</div>
                  <div className="sport">{m.sport?.toUpperCase()} · J{m.journee}</div>
                </div>
                <div className="score">{m.score_domicile} - {m.score_exterieur}</div>
              </div>
            ))}
          </div>
        )}

        {planifies.length > 0 && (
          <div className="section">
            <div className="section-title">À VENIR ({planifies.length})</div>
            {planifies.map((m, i) => (
              <div key={i} className="match">
                <div className="teams">
                  <div className="home">{m.club_domicile_nom}</div>
                  <div>{m.club_exterieur_nom}</div>
                  <div className="sport">{m.sport?.toUpperCase()} · J{m.journee}</div>
                </div>
                <div className="time">
                  {m.date_match ? new Date(m.date_match).toLocaleTimeString('fr-FR', {hour:'2-digit',minute:'2-digit'}) : '-'}
                </div>
              </div>
            ))}
          </div>
        )}

        {all.length === 0 && (
          <div className="empty">Aucun match aujourd'hui.</div>
        )}

        <footer>
          <a href="https://cmr-sports-hub.vercel.app">Version complète</a> · CMR Sports Hub
        </footer>
      </body>
    </html>
  )
}
