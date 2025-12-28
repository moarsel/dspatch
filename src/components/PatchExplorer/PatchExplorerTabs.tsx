import { usePatchExplorer, TABS, type TabId } from '@/hooks/use-patch-explorer'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function PatchExplorerTabs() {
  const { activeTab, setActiveTab } = usePatchExplorer()

  return (
    <nav
      className={cn(
        'flex shrink-0 gap-1 overflow-x-auto border-b border-border p-2',
        'md:w-44 md:flex-col md:overflow-visible md:border-b-0 md:border-r md:py-4'
      )}
    >
      {TABS.map((tab) => (
        <TabButton
          key={tab.id}
          id={tab.id}
          label={tab.label}
          isActive={activeTab === tab.id}
          onClick={() => setActiveTab(tab.id)}
        />
      ))}
    </nav>
  )
}

interface TabButtonProps {
  id: TabId
  label: string
  isActive: boolean
  onClick: () => void
}

function TabButton({ label, isActive, onClick }: TabButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        'justify-start whitespace-nowrap text-sm font-medium',
        'md:w-full',
        isActive
          ? 'bg-accent text-accent-foreground'
          : 'text-muted-foreground hover:text-foreground'
      )}
    >
      {label}
    </Button>
  )
}
