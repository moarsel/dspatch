import { useCallback } from 'react'
import { AudioWaveform } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { usePatchExplorer, TAB_TITLES } from '@/hooks/use-patch-explorer'
import { PatchExplorerTabs } from './PatchExplorerTabs'
import { TabContent } from './TabContent'
import { cn } from '@/lib/utils'

import type { TabId } from '@/hooks/use-patch-explorer'

interface PatchExplorerProps {
  onStart: (tabId: TabId) => void
  audioStarted: boolean
}

export function PatchExplorer({ onStart, audioStarted }: PatchExplorerProps) {
  const { isOpen, activeTab, close } = usePatchExplorer()

  const handleStart = useCallback(() => {
    onStart(activeTab)
    close()
  }, [onStart, activeTab, close])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      // Only allow closing via X/escape/outside click if audio has started
      if (!open && audioStarted) {
        close()
      }
    },
    [audioStarted, close]
  )

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        showClose={audioStarted}
        className={cn(
          'flex h-[85vh] max-h-[700px] flex-col overflow-hidden p-0',
          'md:max-w-4xl'
        )}
        onPointerDownOutside={(e) => {
          // Prevent closing on outside click if audio hasn't started
          if (!audioStarted) {
            e.preventDefault()
          }
        }}
        onEscapeKeyDown={(e) => {
          // Prevent closing on escape if audio hasn't started
          if (!audioStarted) {
            e.preventDefault()
          }
        }}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <AudioWaveform className="h-6 w-6 text-muted-foreground" />
            <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              dspatch
            </span>
          </div>

        </div>

        {/* Main content area */}
        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          {/* Vertical tabs (horizontal on mobile) */}
          <PatchExplorerTabs />

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <DialogTitle className="text-lg self-center font-semibold">
            {TAB_TITLES[activeTab]}
          </DialogTitle>
          {/* Hidden description for accessibility */}
          <DialogDescription className="sr-only">
            Explore patches and learn about dspatch audio synthesis
          </DialogDescription>
            <TabContent />
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-border px-6 py-4">
          {audioStarted && (
            <Button variant="ghost" onClick={close}>
              Close
            </Button>
          )}
          <Button onClick={handleStart}>
            Start
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
