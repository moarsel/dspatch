import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

// Node categories with their types
const categories = {
  'I/O': ['output'],
  'Sources': ['oscillator', 'noise'],
  'Processing': ['gain', 'filter', 'delay', 'mix'],
  'Modulation': ['lfo', 'envelope'],
  'Timing': ['metro', 'sequencer', 'bang'],
  'Utility': ['number', 'math', 'compare', 'notetofreq'],
  'Analysis': ['scope', 'meter', 'fft', 'probe'],
} as const

// Category accent colors
const categoryAccents: Record<string, string> = {
  'I/O': 'border-l-rose-500',
  'Sources': 'border-l-orange-500',
  'Processing': 'border-l-emerald-500',
  'Modulation': 'border-l-blue-500',
  'Timing': 'border-l-pink-500',
  'Utility': 'border-l-slate-400',
  'Analysis': 'border-l-violet-500',
}

interface AppSidebarProps {
  availableNodes: string[]
}

export function AppSidebar({ availableNodes }: AppSidebarProps) {
  const handleDragStart = (e: React.DragEvent, nodeType: string) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('application/reactflow', nodeType)
  }

  return (
    <Sidebar
      variant="floating"
      collapsible="offcanvas"
    >
      <SidebarHeader className="px-4 py-3 flex flex-row items-center justify-between">
        <h2 className="text-[10px] uppercase tracking-[0.15em] font-semibold text-sidebar-foreground/50">
          Nodes
        </h2>
        <SidebarTrigger className="h-6 w-6" />
      </SidebarHeader>
      <SidebarContent className="px-2">
        {Object.entries(categories).map(([category, categoryNodes]) => {
          const available = categoryNodes.filter(n => availableNodes.includes(n))
          if (available.length === 0) return null

          return (
            <SidebarGroup key={category} className="py-2">
              <div className={`text-[11px] uppercase tracking-wide text-sidebar-foreground/60 font-medium border-l-2 ${categoryAccents[category]} pl-2 mb-1`}>
                {category}
              </div>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  {available.map((nodeType) => (
                    <SidebarMenuItem key={nodeType}>
                      <SidebarMenuButton
                        size="sm"
                        draggable
                        className="cursor-grab active:cursor-grabbing h-7 rounded-md"
                        onDragStart={(e) => handleDragStart(e, nodeType)}
                      >
                        <span className="capitalize text-[13px]">{nodeType}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })}
      </SidebarContent>
    </Sidebar>
  )
}

export function SidebarToggle() {
  const { state } = useSidebar()

  // Only show floating toggle when sidebar is collapsed
  if (state === 'expanded') return null

  return (
    <SidebarTrigger
      className="fixed top-3 left-3 z-50 h-8 w-8 bg-sidebar border border-sidebar-border rounded-md shadow-md hover:bg-sidebar-accent transition-all duration-200"
    />
  )
}
