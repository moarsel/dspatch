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

