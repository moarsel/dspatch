// mockGraph.js - Helpers to build test graphs

let nodeIdCounter = 0;

export function resetNodeIds() {
  nodeIdCounter = 0;
}

export function createNode(type, data = {}, id = null) {
  return {
    id: id ?? `${type}-${nodeIdCounter++}`,
    type,
    position: { x: 0, y: 0 },
    data,
  };
}

export function createEdge(sourceNode, sourceHandle, targetNode, targetHandle) {
  return {
    id: `e-${sourceNode.id}-${targetNode.id}-${sourceHandle}-${targetHandle}`,
    source: sourceNode.id,
    sourceHandle,
    target: targetNode.id,
    targetHandle,
  };
}

/**
 * Build oscillator -> output chain
 */
export function createOscOutputChain(oscParams = {}) {
  resetNodeIds();

  const osc = createNode('oscillator', {
    frequency: 440,
    gain: 0.5,
    waveform: 'sine',
    ...oscParams,
  });

  const output = createNode('output', {});

  const edges = [
    createEdge(osc, 'signal', output, 'left'),
  ];

  return { nodes: [osc, output], edges, osc, output };
}

/**
 * Build oscillator -> filter -> output chain
 */
export function createOscFilterOutputChain(oscParams = {}, filterParams = {}) {
  resetNodeIds();

  const osc = createNode('oscillator', {
    frequency: 440,
    gain: 0.5,
    waveform: 'sine',
    ...oscParams,
  });

  const filter = createNode('filter', {
    cutoff: 1000,
    q: 1,
    filterType: 'lowpass',
    ...filterParams,
  });

  const output = createNode('output', {});

  const edges = [
    createEdge(osc, 'signal', filter, 'input'),
    createEdge(filter, 'signal', output, 'left'),
  ];

  return { nodes: [osc, filter, output], edges, osc, filter, output };
}

/**
 * Build oscillator -> gain -> output chain
 */
export function createOscGainOutputChain(oscParams = {}, gainValue = 0.5) {
  resetNodeIds();

  const osc = createNode('oscillator', {
    frequency: 440,
    gain: 0.5,
    waveform: 'sine',
    ...oscParams,
  });

  const gain = createNode('gain', {
    gain: gainValue,
  });

  const output = createNode('output', {});

  const edges = [
    createEdge(osc, 'signal', gain, 'input'),
    createEdge(gain, 'signal', output, 'left'),
  ];

  return { nodes: [osc, gain, output], edges, osc, gain, output };
}
