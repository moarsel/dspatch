// nodes/index.js - Node registry
import { OscillatorNode, descriptor as oscillatorDescriptor } from './Oscillator';
import { GainNode, descriptor as gainDescriptor } from './Gain';
import { FilterNode, descriptor as filterDescriptor } from './Filter';
import { EnvelopeNode, descriptor as envelopeDescriptor } from './Envelope';
import { DelayNode, descriptor as delayDescriptor } from './Delay';
import { OutputNode, descriptor as outputDescriptor } from './Output';
import { BangNode, descriptor as bangDescriptor } from './Bang';

// Registry: type -> { descriptor, Component }
export const registry = {
  oscillator: {
    descriptor: oscillatorDescriptor,
    Component: OscillatorNode,
  },
  gain: {
    descriptor: gainDescriptor,
    Component: GainNode,
  },
  filter: {
    descriptor: filterDescriptor,
    Component: FilterNode,
  },
  envelope: {
    descriptor: envelopeDescriptor,
    Component: EnvelopeNode,
  },
  delay: {
    descriptor: delayDescriptor,
    Component: DelayNode,
  },
  output: {
    descriptor: outputDescriptor,
    Component: OutputNode,
  },
  bang: {
    descriptor: bangDescriptor,
    Component: BangNode,
  },
};

// ReactFlow nodeTypes mapping
export const nodeTypes = Object.fromEntries(
  Object.entries(registry).map(([type, { Component }]) => [type, Component])
);

// List of available node types for the sidebar
export const availableNodes = Object.keys(registry);
