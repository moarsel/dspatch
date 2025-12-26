/**
 * Base Audio Node Card component
 * Dieter Rams-inspired: functional, minimal, tactile
 */
export function NodeCard({ type, selected = false, category = 'default', children }) {
  // Category determines the subtle accent dot color
  const accentColors = {
    source: 'bg-orange-500',      // Oscillator, Noise
    process: 'bg-emerald-500',    // Gain, Filter, Mix
    modulation: 'bg-blue-500',    // LFO, Envelope
    utility: 'bg-slate-400',      // Math, Compare, Number
    io: 'bg-rose-500',            // Output, Meter
    trigger: 'bg-pink-500',       // Bang, Metro
    analysis: 'bg-violet-500',    // Scope, FFT, Probe
    default: 'bg-slate-500',
  };

  return (
    <div
      className={`
        bg-[#2c2c2e] rounded-md min-w-40 text-xs
        border border-[#3a3a3c]
        shadow-lg shadow-black/30
        transition-all duration-150
        ${selected ? 'ring-2 ring-orange-500/50 border-orange-500/50' : ''}
      `}
    >
      {/* Header with category indicator dot */}
      <div className="px-3 py-2 border-b border-[#3a3a3c] cursor-grab active:cursor-grabbing select-none flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${accentColors[category]}`} />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#a1a1a6]">
          {type}
        </span>
      </div>

      {/* Content - extra left padding for handles */}
      <div className="p-2 pl-4">
        {children}
      </div>
    </div>
  );
}

/**
 * Node content wrapper for organizing parameters
 */
export function NodeContent({ children }) {
  return <div className="space-y-1">{children}</div>;
}
