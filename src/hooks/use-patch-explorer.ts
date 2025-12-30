import { create } from 'zustand'

export type TabId =
  | 'welcome'
  | 'getting-started'
  | 'basic-synthesis'
  | 'sequencer'
  | 'presets'

export const TAB_TITLES: Record<TabId, string> = {
  'welcome': 'Welcome to dspatch',
  'getting-started': 'Getting Started',
  'basic-synthesis': 'Basic Synthesizer',
  'sequencer': 'Sequencer & Sampling',
  'presets': 'Preset Instruments',
}

export const TABS: { id: TabId; label: string }[] = [
  { id: 'welcome', label: 'Welcome' },
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'basic-synthesis', label: 'Basic Synth' },
  { id: 'sequencer', label: 'Sequencer' },
  { id: 'presets', label: 'Presets' },
]

interface PatchExplorerState {
  isOpen: boolean
  activeTab: TabId
  open: () => void
  close: () => void
  setActiveTab: (tab: TabId) => void
}

export const usePatchExplorer = create<PatchExplorerState>((set) => ({
  isOpen: true,
  activeTab: 'welcome',
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}))
