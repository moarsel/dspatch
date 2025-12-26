/**
 * Reusable Button component
 * Supports multiple variants: default, primary, secondary
 * Sizes: sm, md, lg
 */
export function Button({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) {
  const baseClasses = 'font-semibold transition-all duration-100 rounded cursor-pointer border-none';

  const variantClasses = {
    default: 'bg-gray-700 text-white hover:bg-gray-600 active:bg-gray-800',
    primary: 'bg-purple-600 text-white hover:bg-purple-500 active:bg-purple-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-500 active:bg-gray-700',
    success: 'bg-green-500 text-gray-900 hover:bg-green-400 active:bg-green-600',
    danger: 'bg-pink-500 text-white hover:bg-pink-400 active:bg-pink-600',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Circular Bang Button for triggers
 */
export function BangButton({ active = false, ...props }) {
  return (
    <button
      className={`w-10 h-10 rounded-full border-none font-bold text-xl flex items-center justify-center transition-all duration-100 ${
        active
          ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/50'
          : 'bg-gray-700 text-gray-600 hover:bg-gray-600'
      }`}
      {...props}
    >
      ◉
    </button>
  );
}

/**
 * Gate/Toggle Button
 */
export function GateButton({ active = false, ...props }) {
  return (
    <button
      className={`px-2 py-0.5 rounded text-xs font-bold transition-all duration-100 ${
        active
          ? 'bg-green-500 text-gray-900'
          : 'bg-gray-700 text-gray-600 hover:bg-gray-600'
      }`}
      {...props}
    >
      {active ? 'ON' : 'OFF'}
    </button>
  );
}
