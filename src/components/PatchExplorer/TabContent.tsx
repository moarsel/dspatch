import { usePatchExplorer, type TabId } from '@/hooks/use-patch-explorer'
import { WelcomeTab } from './tabs/WelcomeTab'
import { GettingStartedTab } from './tabs/GettingStartedTab'
import { BasicSynthesisTab } from './tabs/BasicSynthesisTab'
import { SequencerTab } from './tabs/SequencerTab'
import { PresetsTab } from './tabs/PresetsTab'

const TAB_COMPONENTS: Record<TabId, React.ComponentType> = {
  'welcome': WelcomeTab,
  'getting-started': GettingStartedTab,
  'basic-synthesis': BasicSynthesisTab,
  'sequencer': SequencerTab,
  'presets': PresetsTab,
}

export function TabContent() {
  const { activeTab } = usePatchExplorer()
  const Component = TAB_COMPONENTS[activeTab]
  return <Component />
}
