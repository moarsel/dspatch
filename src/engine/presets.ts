import type { TabId } from '@/hooks/use-patch-explorer'

interface Preset {
  nodes: Array<{
    id: string
    type: string
    position: { x: number; y: number }
    data: Record<string, unknown>
  }>
  edges: Array<{
    id: string
    source: string
    sourceHandle: string
    target: string
    targetHandle: string
  }>
}

// Welcome - just output (clean slate)
const welcomePreset: Preset = {
  nodes: [
    {
      id: 'output-1',
      type: 'output',
      position: { x: 400, y: 200 },
      data: { muted: false },
    },
  ],
  edges: [],
}

// Getting Started - bang + oscillator + output (simplest patch)
const gettingStartedPreset: Preset = {
  nodes: [
    {
      id: 'bang-1',
      type: 'bang',
      position: { x: 100, y: 200 },
      data: { gate: 0 },
    },
    {
      id: 'osc-1',
      type: 'oscillator',
      position: { x: 430, y: 240 },
      data: { frequency: 440, gain: 0.3, waveform: 'sine' },
    },
    {
      id: 'output-1',
      type: 'output',
      position: { x: 840, y: 200 },
      data: { muted: false },
    },
  ],
  edges: [
    {
      id: 'e1',
      source: 'bang-1',
      sourceHandle: 'signal',
      target: 'osc-1',
      targetHandle: 'gain',
    },
    {
      id: 'e2',
      source: 'osc-1',
      sourceHandle: 'signal',
      target: 'output-1',
      targetHandle: 'left',
    },
  ],
}

// Basic Synthesizer - oscillator + envelope + gain + output
const basicSynthesisPreset: Preset = {
  nodes: [
    {
      id: 'osc-1',
      type: 'oscillator',
      position: { x: 100, y: 400 },
      data: { frequency: 440, gain: 1, waveform: 'sawtooth' },
    },
    {
      id: 'bang-1',
      type: 'bang',
      position: { x: 100, y: 100 },
      data: { gate: 0 },
    },
    {
      id: 'env-1',
      type: 'envelope',
      position: { x: 500, y: 100 },
      data: { gate: 0, attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.5 },
    },
    {
      id: 'output-1',
      type: 'output',
      position: { x: 550, y: 450 },
      data: { muted: false },
    },
  ],
  edges: [
    {
      id: 'e1',
      source: 'bang-1',
      sourceHandle: 'signal',
      target: 'env-1',
      targetHandle: 'gate',
    },
    {
      id: 'e2',
      source: 'osc-1',
      sourceHandle: 'signal',
      target: 'output-1',
      targetHandle: 'left',
    },
    {
      id: 'e3',
      source: 'env-1',
      sourceHandle: 'signal',
      target: 'osc-1',
      targetHandle: 'gain',
    },
  ],
}

// Sequencer - metro + sequencer + notetofreq + osc + env + gain + output
const sequencerPreset: Preset = {
  nodes: [
    {
      id: 'metro-1',
      type: 'metro',
      position: { x: 100, y: 50 },
      data: { bpm: 120 },
    },
    {
      id: 'seq-1',
      type: 'sequencer',
      position: { x: 100, y: 200 },
      data: {
        trigger: 0,
        reset: 0,
        step0: 60, step1: 62, step2: 64, step3: 65,
        step4: 67, step5: 69, step6: 71, step7: 72,
      },
    },
    {
      id: 'ntf-1',
      type: 'notetofreq',
      position: { x: 100, y: 450 },
      data: { note: 60 },
    },
    {
      id: 'osc-1',
      type: 'oscillator',
      position: { x: 400, y: 250 },
      data: { frequency: 440, gain: 1, waveform: 'sawtooth' },
    },
    {
      id: 'env-1',
      type: 'envelope',
      position: { x: 400, y: 50 },
      data: { gate: 0, attack: 0.01, decay: 0.15, sustain: 0.2, release: 0.3 },
    },
    {
      id: 'gain-1',
      type: 'gain',
      position: { x: 400, y: 500 },
      data: { input: 0, gain: 0.4 },
    },
    {
      id: 'output-1',
      type: 'output',
      position: { x: 700, y: 400 },
      data: { muted: false },
    },
  ],
  edges: [
    {
      id: 'e1',
      source: 'metro-1',
      sourceHandle: 'signal',
      target: 'seq-1',
      targetHandle: 'trigger',
    },
    {
      id: 'e2',
      source: 'metro-1',
      sourceHandle: 'signal',
      target: 'env-1',
      targetHandle: 'gate',
    },
    {
      id: 'e3',
      source: 'seq-1',
      sourceHandle: 'signal',
      target: 'ntf-1',
      targetHandle: 'note',
    },
    {
      id: 'e4',
      source: 'ntf-1',
      sourceHandle: 'frequency',
      target: 'osc-1',
      targetHandle: 'frequency',
    },
    {
      id: 'e5',
      source: 'osc-1',
      sourceHandle: 'signal',
      target: 'gain-1',
      targetHandle: 'input',
    },
    {
      id: 'e6',
      source: 'env-1',
      sourceHandle: 'signal',
      target: 'gain-1',
      targetHandle: 'gain',
    },
    {
      id: 'e7',
      source: 'gain-1',
      sourceHandle: 'signal',
      target: 'output-1',
      targetHandle: 'left',
    },
  ],
}

// Advanced - Simple LFO modulation test
const advancedPreset: Preset = {
  nodes: [
    {
      id: 'lfo-1',
      type: 'lfo',
      position: { x: 100, y: 50 },
      data: { frequency: 5, gain: 50, waveform: 'sine' },
    },
    {
      id: 'osc-1',
      type: 'oscillator',
      position: { x: 100, y: 250 },
      data: { frequency: 440, gain: 0.3, waveform: 'sine' },
    },
    {
      id: 'output-1',
      type: 'output',
      position: { x: 450, y: 250 },
      data: { muted: false },
    },
  ],
  edges: [
    {
      id: 'e1',
      source: 'lfo-1',
      sourceHandle: 'signal',
      target: 'osc-1',
      targetHandle: 'frequency',
    },
    {
      id: 'e2',
      source: 'osc-1',
      sourceHandle: 'signal',
      target: 'output-1',
      targetHandle: 'left',
    },
  ],
}

// Presets tab - same as welcome for now
const presetsPreset: Preset = welcomePreset

export const PRESETS: Record<TabId, Preset> = {
  'welcome': welcomePreset,
  'getting-started': gettingStartedPreset,
  'basic-synthesis': basicSynthesisPreset,
  'sequencer': sequencerPreset,
  'advanced': advancedPreset,
  'presets': presetsPreset,
}

export function getPreset(tabId: TabId): Preset {
  return PRESETS[tabId] ?? welcomePreset
}
