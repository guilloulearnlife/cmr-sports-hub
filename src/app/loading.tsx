export default function Loading() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="text-center animate-fade-up">
        <div className="relative">
          {/* Cercle animé */}
          <div className="w-16 h-16 border-4 border-border rounded-full animate-spin border-t-cmr-yellow mx-auto" />
          
          {/* Emoji central */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">⚽</span>
          </div>
        </div>
        
        <p className="mt-6 font-oswald tracking-widest text-green-muted text-sm">
          CHARGEMENT...
        </p>
      </div>
    </div>
  )
}
