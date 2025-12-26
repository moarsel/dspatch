/**
 * Number input field - compact, precise
 */
export function NumberInput({ label, value, onChange, ...props }) {
  return (
    <div className="flex items-center gap-1.5">
      {label && (
        <label className="w-10 text-text-muted text-xxs uppercase font-medium tracking-wide">
          {label}
        </label>
      )}
      <input
        type="number"
        value={value}
        onChange={onChange}
        className="min-w-10 px-1 py-1 bg-neutral-800 text-text-primary border border-neutral-500 rounded text-xs font-mono
                   focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-accent/20
                   transition-colors duration-150"
        {...props}
      />
    </div>
  );
}

/**
 * Range/Slider input - tactile, hardware-inspired
 */
export function RangeInput({ label, value, onChange, min = 0, max = 1, step = 0.01, ...props }) {
  return (
    <div className="flex items-center gap-1.5 flex-1">
      {label && (
        <label className="w-10 text-text-muted text-xxs uppercase font-medium tracking-wide">
          {label}
        </label>
      )}
      <input
        type="range"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        className="flex-1 nodrag h-1 bg-neutral-700 rounded-full cursor-pointer appearance-none
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:w-4
                   [&::-webkit-slider-thumb]:h-4
                   [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:bg-neutral-300
                   [&::-webkit-slider-thumb]:border-0
                   [&::-webkit-slider-thumb]:shadow-sm
                   [&::-webkit-slider-thumb]:transition-all
                   [&::-webkit-slider-thumb]:duration-150
                   [&::-webkit-slider-thumb]:hover:bg-neutral-300
                   [&::-webkit-slider-thumb]:hover:scale-110
                   [&::-moz-range-thumb]:w-4
                   [&::-moz-range-thumb]:h-4
                   [&::-moz-range-thumb]:rounded-full
                   [&::-moz-range-thumb]:bg-neutral-300
                   [&::-moz-range-thumb]:border-0"
        {...props}
      />
    </div>
  );
}

/**
 * Select/Dropdown input - clean, minimal
 */
export function SelectInput({ label, value, onChange, options, ...props }) {
  return (
    <div className="flex items-center gap-1.5">
      {label && (
        <label className="w-10 text-text-muted text-xxs uppercase font-medium tracking-wide">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className="flex-1 px-2 py-1 bg-neutral-800 text-text-primary border border-neutral-500 rounded text-xs
                   cursor-pointer focus:outline-none focus:border-neutral-300
                   transition-colors duration-150"
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Param row wrapper for organizing inputs
 * Note: position relative is required for React Flow handles to position correctly
 */
export function ParamRow({ label, children, centered = false, ...props }) {
  return (
    <div className={`relative flex items-center gap-1.5 py-0.5 px-0 min-h-5 ${centered ? 'justify-center' : ''}`} {...props}>
      {label && (
        <label className="w-8 text-text-muted text-xxs uppercase font-medium tracking-wide">
          {label}
        </label>
      )}
      {children}
    </div>
  );
}

/**
 * Value display (read-only) - monospace, subtle
 */
export function ValueDisplay({ value, className = '' }) {
  return (
    <span className={`w-10 text-right text-xxs text-muted font-mono tabular-nums ${className}`}>
      {typeof value === 'number' ? value.toFixed(2) : value}
    </span>
  );
}
