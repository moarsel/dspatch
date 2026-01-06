import { usePatchExplorer, type TabId } from '@/hooks/use-patch-explorer'
import { WelcomeTab } from './tabs/WelcomeTab'
import { GettingStartedTab } from './tabs/GettingStartedTab'
import { BasicSynthesisTab } from './tabs/BasicSynthesisTab'
import { SequencerTab } from './tabs/SequencerTab'
import { FMSynthTab } from './tabs/FMSynthTab'
import { KarplusStrongTab } from './tabs/KarplusStrongTab'

const TAB_COMPONENTS: Record<TabId, React.ComponentType> = {
  'welcome': WelcomeTab,
  'getting-started': GettingStartedTab,
  'basic-synthesis': BasicSynthesisTab,
  'sequencer': SequencerTab,
  'fm-synth': FMSynthTab,
  'karplus-strong': KarplusStrongTab,
}

export function TabContent() {
  const { activeTab } = usePatchExplorer()
  const Component = TAB_COMPONENTS[activeTab]
  return <Component />
}
