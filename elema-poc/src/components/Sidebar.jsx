/**
 * Sidebar component for node palette
 */
export function Sidebar({ children }) {
  return (
    <aside className="w-44 bg-gray-950 border-r border-blue-900 p-5 overflow-y-auto flex flex-col">
      {children}
    </aside>
  );
}

/**
 * Sidebar header
 */
export function SidebarHeader({ children }) {
  return (
    <h2 className="text-xs uppercase tracking-widest text-gray-600 mb-5 font-semibold">
      {children}
    </h2>
  );
}

/**
 * Node type palette - list of draggable node buttons
 */
export function NodePalette({ nodes }) {
  const colorMap = {
    oscillator: 'bg-red-500 text-white hover:bg-red-600',
    gain: 'bg-cyan-400 text-gray-900 hover:bg-cyan-300',
    filter: 'bg-blue-500 text-white hover:bg-blue-600',
    envelope: 'bg-yellow-400 text-gray-900 hover:bg-yellow-300',
    delay: 'bg-purple-600 text-white hover:bg-purple-700',
    output: 'bg-green-500 text-gray-900 hover:bg-green-600',
    bang: 'bg-pink-500 text-white hover:bg-pink-600',
    noise: 'bg-gray-500 text-gray-900 hover:bg-gray-600',
    lfo: 'bg-pink-400 text-gray-900 hover:bg-pink-300',
    mix: 'bg-teal-500 text-gray-900 hover:bg-teal-600',
    notetofreq: 'bg-blue-400 text-gray-900 hover:bg-blue-300',
    number: 'bg-gray-600 text-white hover:bg-gray-700',
    math: 'bg-gray-400 text-gray-900 hover:bg-gray-300',
    compare: 'bg-yellow-500 text-gray-900 hover:bg-yellow-600',
    scope: 'bg-green-600 text-white hover:bg-green-700',
    meter: 'bg-orange-600 text-white hover:bg-orange-700',
    fft: 'bg-indigo-600 text-white hover:bg-indigo-700',
    probe: 'bg-cyan-300 text-gray-900 hover:bg-cyan-200',
    metro: 'bg-orange-300 text-gray-900 hover:bg-orange-200',
    sequencer: 'bg-indigo-400 text-gray-900 hover:bg-indigo-300',
  };

  return (
    <div className="flex flex-col gap-2">
      {nodes.map((nodeType) => (
        <button
          key={nodeType}
          draggable
          className={`
            px-4 py-3 rounded font-semibold text-center capitalize
            transition-all duration-100 text-sm
            ${colorMap[nodeType] || 'bg-gray-700 text-white hover:bg-gray-600'}
            hover:-translate-y-0.5 hover:shadow-lg cursor-grab active:cursor-grabbing
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
  );
}
