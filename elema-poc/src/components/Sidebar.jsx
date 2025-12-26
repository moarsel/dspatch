/**
 * Sidebar component for node palette
 * Clean, organized by category
 */
export function Sidebar({ children }) {
  return (
    <aside className="w-40 bg-surface border-r border-surface-overlay p-3 overflow-y-auto flex flex-col">
      {children}
    </aside>
  );
}

/**
 * Sidebar header
 */
export function SidebarHeader({ children }) {
  return (
    <h2 className="text-xxs uppercase tracking-widest mb-3 font-semibold">
      {children}
    </h2>
  );
}

/**
 * Node type palette - organized by category
 */
export function NodePalette({ nodes }) {
  // Categorize nodes for organized display
  const categories = {
    'I/O': ['output'],
    'Sources': ['oscillator', 'noise'],
    'Processing': ['gain', 'filter', 'delay', 'mix'],
    'Modulation': ['lfo', 'envelope'],
    'Timing': ['metro', 'sequencer', 'bang'],
    'Utility': ['number', 'math', 'compare', 'notetofreq'],
    'Analysis': ['scope', 'meter', 'fft', 'probe'],
  };

  // Accent colors by category - subtle left border
  const categoryAccents = {
    'Sources': 'border-l-orange-500',
    'Processing': 'border-l-emerald-500',
    'Modulation': 'border-l-blue-500',
    'Timing': 'border-l-pink-500',
    'Utility': 'border-l-slate-400',
    'Analysis': 'border-l-violet-500',
    'I/O': 'border-l-rose-500',
  };

  return (
    <div className="flex flex-col">
      {Object.entries(categories).map(([category, categoryNodes]) => {
        // Filter to only include nodes that exist in the available nodes
        const availableInCategory = categoryNodes.filter(n => nodes.includes(n));
        if (availableInCategory.length === 0) return null;

        return (
          <div key={category} className="pb-5">
            <div className={`text-sm uppercase text-muted font-medium mt-3 mb-2  pl-2 border-l-2 ${categoryAccents[category]}`}>
              {category}
            </div>
            <div className="flex flex-col gap-0.5">
              {availableInCategory.map((nodeType) => (
                <button
                  key={nodeType}
                  draggable
                  className={`
                    px-2 py-1.5 rounded text-left text-xs font-medium
                    bg-neutral-800
                    transition-all duration-200
                    hover:bg-gray-700 
                    active:bg-gray-600
                    cursor-grab active:cursor-grabbing
                  `}
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('application/reactflow', nodeType);
                  }}
                >
                  {nodeType}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
