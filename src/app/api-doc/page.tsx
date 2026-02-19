import Navbar from '@/components/Navbar'

export default function ApiDocPage() {
  const base = 'https://cmr-sports-hub.vercel.app'

  return (
    <div className="min-h-screen bg-dark">
      <Navbar/>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="font-oswald font-bold text-4xl tracking-widest text-cmr-yellow mb-2">
          📡 API PUBLIQUE
        </h1>
        <p className="text-green-muted mb-10">
          API gratuite et ouverte. Aucune clé requise. Utilisable par les médias, pages Facebook, applications.
        </p>

        {/* Endpoint 1 */}
        <div className="card p-6 mb-6">
          <h2 className="font-oswald text-xl text-white tracking-wider mb-1">Scores du jour</h2>
          <div className="bg-black rounded px-4 py-2 font-mono text-cmr-yellow text-sm mb-3">
            GET {base}/api/scores
          </div>
          <p className="text-green-muted text-sm mb-3">Retourne tous les matchs du jour avec leurs scores.</p>
          <pre className="bg-black rounded p-4 text-xs text-green-400 overflow-x-auto">{`{
  "date": "2025-03-01",
  "total": 8,
  "live": 2,
  "matchs": [
    {
      "club_domicile_nom": "Canon Yaoundé",
      "club_exterieur_nom": "Tonnerre",
      "score_domicile": 1,
      "score_exterieur": 0,
      "statut": "en_direct",
      "sport": "football"
    }
  ]
}`}</pre>
        </div>

        {/* Endpoint 2 */}
        <div className="card p-6 mb-6">
          <h2 className="font-oswald text-xl text-white tracking-wider mb-1">Classement</h2>
          <div className="bg-black rounded px-4 py-2 font-mono text-cmr-yellow text-sm mb-3">
            GET {base}/api/classement/[sport]
          </div>
          <p className="text-green-muted text-sm mb-2">Sports disponibles : <span className="text-white">football, basketball, volleyball, handball</span></p>
          <div className="bg-black rounded px-4 py-2 font-mono text-green-400 text-xs mb-3">
            {base}/api/classement/football
          </div>
          <pre className="bg-black rounded p-4 text-xs text-green-400 overflow-x-auto">{`{
  "competition": "MTN Elite One 2024-2025",
  "classement": [
    {
      "position": 1,
      "club_nom": "Cotonsport",
      "points": 45,
      "victoires": 14,
      "nuls": 3,
      "defaites": 1
    }
  ]
}`}</pre>
        </div>

        {/* Endpoint 3 */}
        <div className="card p-6 mb-6">
          <h2 className="font-oswald text-xl text-white tracking-wider mb-1">Matchs par sport</h2>
          <div className="bg-black rounded px-4 py-2 font-mono text-cmr-yellow text-sm mb-3">
            GET {base}/api/matchs/[sport]
          </div>
          <p className="text-green-muted text-sm mb-2">Paramètres optionnels :</p>
          <div className="space-y-2 mb-3">
            {[
              { p: '?statut=en_direct', d: 'Matchs en cours uniquement' },
              { p: '?statut=termine', d: 'Résultats uniquement' },
              { p: '?statut=planifie', d: 'Prochains matchs' },
              { p: '?limite=10', d: 'Nombre de résultats (défaut: 20)' },
            ].map((r, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="font-mono text-cmr-yellow w-40">{r.p}</span>
                <span className="text-green-muted">{r.d}</span>
              </div>
            ))}
          </div>
          <div className="bg-black rounded px-4 py-2 font-mono text-green-400 text-xs">
            {base}/api/matchs/football?statut=en_direct&limite=5
          </div>
        </div>

        {/* Contact */}
        <div className="card p-6 border-cmr-yellow">
          <h2 className="font-oswald text-xl text-cmr-yellow tracking-wider mb-2">Intégration & Contact</h2>
          <p className="text-green-muted text-sm">
            Pour intégrer ces données dans votre site, application ou page Facebook, 
            copiez simplement l'URL et faites un appel HTTP standard. 
            L'API retourne du JSON compatible avec tous les langages.
          </p>
          <div className="mt-4 bg-black rounded p-4 font-mono text-xs text-green-400">
            {`// Exemple JavaScript\nfetch('${base}/api/scores')\n  .then(r => r.json())\n  .then(data => console.log(data.matchs))`}
          </div>
        </div>
      </div>
    </div>
  )
}
