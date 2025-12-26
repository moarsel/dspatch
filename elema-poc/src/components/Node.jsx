/**
 * Base Audio Node Card component
 * Provides header, content area, and styling for audio nodes
 * Pass headerClassName to customize header color/styling
 */
export function NodeCard({ type, selected = false, headerClassName = 'bg-gray-700 text-white', children }) {
  return (
    <div
      className={`
        bg-gray-900 border-2 rounded-lg min-w-40 text-xs
        ${selected ? 'border-purple-500 shadow-lg shadow-purple-500/30' : 'border-gray-700'}
      `}
    >
      <div className={`${headerClassName} px-3 py-2 font-bold text-xs uppercase tracking-wide rounded-t-md cursor-grab active:cursor-grabbing select-none`}>
        {type}
      </div>
      <div className="p-2">
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
