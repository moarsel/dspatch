/**
 * Number input field
 */
export function NumberInput({ label, value, onChange, ...props }) {
  return (
    <div className="flex items-center gap-1.5">
      {label && <label className="w-10 text-gray-500 text-xs uppercase font-semibold">{label}</label>}
      <input
        type="number"
        value={value}
        onChange={onChange}
        className="w-15 px-1.5 py-1 bg-gray-800 text-white border border-gray-700 rounded text-xs focus:outline-none focus:border-purple-500"
        {...props}
      />
    </div>
  );
}

/**
 * Range/Slider input
 */
export function RangeInput({ label, value, onChange, min = 0, max = 1, step = 0.01, ...props }) {
  return (
    <div className="flex items-center gap-1.5">
      {label && <label className="w-10 text-gray-500 text-xs uppercase font-semibold">{label}</label>}
      <input
        type="range"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        className="flex-1 h-1 bg-gray-700 rounded cursor-pointer appearance-none accent-purple-600"
        {...props}
      />
    </div>
  );
}

/**
 * Select/Dropdown input
 */
export function SelectInput({ label, value, onChange, options, ...props }) {
  return (
    <div className="flex items-center gap-1.5">
      {label && <label className="w-10 text-gray-500 text-xs uppercase font-semibold">{label}</label>}
      <select
        value={value}
        onChange={onChange}
        className="flex-1 px-2 py-1 bg-gray-800 text-white border border-gray-700 rounded text-xs cursor-pointer focus:outline-none focus:border-purple-500"
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
    <div className={`relative flex items-center gap-1.5 py-1 px-0 ${centered ? 'justify-center' : ''}`} {...props}>
      {label && <label className="w-10 text-gray-500 text-xs uppercase font-semibold">{label}</label>}
      {children}
    </div>
  );
}

/**
 * Value display (read-only)
 */
export function ValueDisplay({ value, className = '' }) {
  return (
    <span className={`w-12 text-right text-xs text-gray-600 font-mono ${className}`}>
      {typeof value === 'number' ? value.toFixed(2) : value}
    </span>
  );
}
