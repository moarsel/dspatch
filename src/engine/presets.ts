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
      id: 'osc-1',
      type: 'oscillator',
      position: { x: 50, y: 200 },
      data: { muted: false },
    },
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
      position: { x: -150, y: 50 },
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
      position: { x: 400, y: 350 },
      data: { frequency: 440, gain: 1, waveform: 'sawtooth' },
    },
    {
      id: 'env-1',
      type: 'envelope',
      position: { x: 400, y: 50 },
      data: { gate: 0, attack: 0.01, decay: 0.15, sustain: 0.2, release: 0.3 },
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
      target: 'output-1',
      targetHandle: 'left',
    },
    {
      id: 'e6',
      source: 'env-1',
      sourceHandle: 'signal',
      target: 'osc-1',
      targetHandle: 'gain',
    }
  ],
}

// FM Synth Preset
const fmSynthPreset: Preset = {
  nodes: [
    {
      id: 'num-base',
      type: 'number',
      position: { x: 50, y: 50 },
      data: { value: 220 },
    },
    {
      id: 'osc-mod',
      type: 'oscillator',
      position: { x: 50, y: 200 },
      data: { frequency: 110, gain: 100, waveform: 'sine' },
    },
    {
      id: 'math-add',
      type: 'math',
      position: { x: 350, y: 100 },
      data: { operation: 'add', a: 0, b: 0 },
    },
    {
      id: 'osc-carrier',
      type: 'oscillator',
      position: { x: 650, y: 200 },
      data: { frequency: 440, gain: 0, waveform: 'sine' },
    },
    {
      id: 'bang-1',
      type: 'bang',
      position: { x: 350, y: 400 },
      data: { gate: 0 },
    },
    {
      id: 'env-1',
      type: 'envelope',
      position: { x: 650, y: 50 },
      data: { gate: 0, attack: 0.01, decay: 0.2, sustain: 0.8, release: 0.5 },
    },
    {
      id: 'output-1',
      type: 'output',
      position: { x: 950, y: 250 },
      data: { muted: false },
    },
  ],
  edges: [
    // Base Freq -> Math (Add) input A
    {
      id: 'e-base',
      source: 'num-base',
      sourceHandle: 'signal',
      target: 'math-add',
      targetHandle: 'a',
    },
    // Modulator -> Math (Add) input B
    {
      id: 'e-mod',
      source: 'osc-mod',
      sourceHandle: 'signal',
      target: 'math-add',
      targetHandle: 'b',
    },
    // Math (Add) -> Carrier Frequency
    {
      id: 'e-freq',
      source: 'math-add',
      sourceHandle: 'signal',
      target: 'osc-carrier',
      targetHandle: 'frequency',
    },
    // Bang -> Envelope Gate
    {
      id: 'e-gate',
      source: 'bang-1',
      sourceHandle: 'signal',
      target: 'env-1',
      targetHandle: 'gate',
    },
    // Envelope -> Carrier Gain
    {
      id: 'e-amp',
      source: 'env-1',
      sourceHandle: 'signal',
      target: 'osc-carrier',
      targetHandle: 'gain',
    },
    // Carrier -> Output
    {
      id: 'e-out',
      source: 'osc-carrier',
      sourceHandle: 'signal',
      target: 'output-1',
      targetHandle: 'left',
    },
  ],
}

// Karplus-Strong Preset
const karplusStrongPreset: Preset = {
  nodes: [
    {
      id: 'key-1',
      type: 'keyboard',
      position: { x: 50, y: 50 },
      data: { currentNote: 48, currentGate: 0, octaveOffset: -1 },
    },
    {
      id: 'ntf-1',
      type: 'notetofreq',
      position: { x: 300, y: 50 },
      data: { note: 48 },
    },
    {
      id: 'math-1',
      type: 'math',
      position: { x: 600, y: 50 },
      data: { operation: 'divide', a: 1000, b: 0 },
    },
    {
      id: 'env-1',
      type: 'envelope',
      position: { x: 900, y: 50 },
      data: { gate: 0, attack: 0.002, decay: 3, sustain: 0.0, release: 0.9 },
    },
    {
      id: 'noise-1',
      type: 'noise',
      position: { x: 50, y: 350 },
      data: { gain: 0.9, noiseType: 'white' },
    },
    {
      id: 'delay-1',
      type: 'delay',
      position: { x: 400, y: 350 },
      data: { feedback: 0.98, mix: 1, time: 20 },
    },
    {
      id: 'filt-1',
      type: 'filter',
      position: { x: 800, y: 350 },
      data: { q: 1, filterType: 'lowpass', cutoff: 1600 },
    },
    {
      id: 'vca-1',
      type: 'gain',
      position: { x: 1200, y: 350 },
      data: { gain: 1 },
    },
    {
      id: 'output-1',
      type: 'output',
      position: { x: 1550, y: 350 },
      data: { muted: false },
    },
  ],
  edges: [
    // Keyboard -> NoteToFreq
    {
      id: 'e-note',
      source: 'key-1',
      sourceHandle: 'note',
      target: 'ntf-1',
      targetHandle: 'note',
    },
    // Keyboard -> Envelope Gate
    {
      id: 'e-gate',
      source: 'key-1',
      sourceHandle: 'gate',
      target: 'env-1',
      targetHandle: 'gate',
    },
    // NoteToFreq -> Math (Input B)
    {
      id: 'e-freq-math',
      source: 'ntf-1',
      sourceHandle: 'frequency',
      target: 'math-1',
      targetHandle: 'b',
    },
    // Math -> Delay Time
    {
      id: 'e-time',
      source: 'math-1',
      sourceHandle: 'signal',
      target: 'delay-1',
      targetHandle: 'time',
    },
    // Noise -> Delay Input
    {
      id: 'e-noise-del',
      source: 'noise-1',
      sourceHandle: 'signal',
      target: 'delay-1',
      targetHandle: 'input',
    },
    // Delay -> Filter Input
    {
      id: 'e-del-filt',
      source: 'delay-1',
      sourceHandle: 'signal',
      target: 'filt-1',
      targetHandle: 'input',
    },
    // Filter -> VCA Input
    {
      id: 'e-filt-vca',
      source: 'filt-1',
      sourceHandle: 'signal',
      target: 'vca-1',
      targetHandle: 'input',
    },
    // Envelope -> VCA Gain
    {
      id: 'e-env-vca',
      source: 'env-1',
      sourceHandle: 'signal',
      target: 'vca-1',
      targetHandle: 'gain',
    },
    // VCA -> Output
    {
      id: 'e-vca-out',
      source: 'vca-1',
      sourceHandle: 'signal',
      target: 'output-1',
      targetHandle: 'left',
    },
  ],
}


export const PRESETS: Record<TabId, Preset> = {
  'welcome': welcomePreset,
  'getting-started': gettingStartedPreset,
  'basic-synthesis': basicSynthesisPreset,
  'sequencer': sequencerPreset,
  'fm-synth': fmSynthPreset,
  'karplus-strong': karplusStrongPreset,
}

export function getPreset(tabId: TabId): Preset {
  return PRESETS[tabId] ?? welcomePreset
}
