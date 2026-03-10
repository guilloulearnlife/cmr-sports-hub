export default function Loading() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="text-center animate-fade-up">
        {/* Main loader */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-border-subtle" />
          
          {/* Animated ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cmr-gold animate-spin" />
          
          {/* Inner content */}
          <div className="absolute inset-4 rounded-full bg-bg-card flex items-center justify-center">
            <span className="text-3xl animate-bounce" style={{ animationDuration: '1s' }}>⚽</span>
          </div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-cmr-gold/10 blur-xl animate-pulse" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <p className="font-oswald tracking-[0.4em] text-cmr-gold text-sm animate-pulse">
            CHARGEMENT
          </p>
          <div className="flex justify-center gap-1">
            {[0, 1, 2].map(i => (
              <span 
                key={i}
                className="w-2 h-2 rounded-full bg-cmr-gold animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
