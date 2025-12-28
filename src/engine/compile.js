// compile.js - Graph compilation: nodes + edges -> Elementary Audio graph
import { el } from '@elemaudio/core';

// Visualizer node types that should work even without output connections
const VISUALIZER_TYPES = new Set(['scope', 'meter', 'fft', 'probe']);

/**
 * Topological sort using Kahn's algorithm
 * Returns nodes in order where dependencies come before dependents
 */
function topoSort(nodes, edges) {
  const inDegree = new Map();
  const adjacency = new Map();

  // Initialize
  for (const node of nodes) {
    inDegree.set(node.id, 0);
    adjacency.set(node.id, []);
  }

  // Build graph
  for (const edge of edges) {
    adjacency.get(edge.source).push(edge.target);
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
  }

  // Find nodes with no incoming edges
  const queue = [];
  for (const [nodeId, degree] of inDegree) {
    if (degree === 0) {
      queue.push(nodeId);
    }
  }

  const sorted = [];
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  while (queue.length > 0) {
    const nodeId = queue.shift();
    sorted.push(nodeMap.get(nodeId));

    for (const dependent of adjacency.get(nodeId) || []) {
      inDegree.set(dependent, inDegree.get(dependent) - 1);
      if (inDegree.get(dependent) === 0) {
        queue.push(dependent);
      }
    }
  }

  return sorted;
}

/**
 * Compile the node graph into Elementary Audio signals
 * @param {Array} nodes - ReactFlow nodes
 * @param {Array} edges - ReactFlow edges
 * @param {Object} registry - Node type registry { type: { descriptor, Component } }
 * @returns {{ left: ElemNode, right: ElemNode } | null}
 */
export function compileGraph(nodes, edges, registry) {
  if (!nodes || nodes.length === 0) return null;

  const sorted = topoSort(nodes, edges);
  const compiled = new Map(); // nodeId -> { outletName: elementaryNode }

  for (const node of sorted) {
    const nodeType = registry[node.type];
    if (!nodeType) {
      console.warn(`Unknown node type: ${node.type}`);
      continue;
    }

    const { descriptor } = nodeType;
    const inputs = {};

    // Start with all node data (includes non-inlet params like waveform, filterType)
    Object.assign(inputs, node.data ?? {});

    // Resolve each inlet (connections override node data)
    for (const [inletName, inlet] of Object.entries(descriptor.inlets)) {
      // Check for incoming connection to this inlet
      const edge = edges.find(
        e => e.target === node.id && e.targetHandle === inletName
      );

      if (edge) {
        // Connected: get the output from the source node
        const sourceOutputs = compiled.get(edge.source);
        if (sourceOutputs && sourceOutputs[edge.sourceHandle] !== undefined) {
          inputs[inletName] = sourceOutputs[edge.sourceHandle];
        } else {
          // Fallback if source not compiled yet (shouldn't happen with topo sort)
          inputs[inletName] = node.data?.[inletName] ?? inlet.default;
        }
      } else if (inputs[inletName] === undefined) {
        // Not connected and no data: use default
        inputs[inletName] = inlet.default;
      }
    }

    // Compile this node
    try {
      const outputs = descriptor.compile(inputs, node.id);
      compiled.set(node.id, outputs);
    } catch (err) {
      console.error(`Error compiling node ${node.id} (${node.type}):`, err);
      compiled.set(node.id, {});
    }
  }

  // Find output node and return its signals
  const outputNode = nodes.find(n => n.type === 'output');
  if (!outputNode) {
    return null;
  }

  const outputs = compiled.get(outputNode.id);
  let left = outputs?.left ?? el.const({ value: 0 });
  let right = outputs?.right ?? el.const({ value: 0 });

  // Find orphan visualizers: visualizer nodes with inputs but outputs not connected
  const orphanVisualizers = nodes.filter(n => {
    if (!VISUALIZER_TYPES.has(n.type)) return false;

    // Check if this node has an input connected
    const hasInput = edges.some(e => e.target === n.id);
    if (!hasInput) return false;

    // Check if this node's output is NOT connected to anything
    const hasOutput = edges.some(e => e.source === n.id);
    return !hasOutput;
  });

  // Include orphan visualizers in the render graph at zero gain
  // This ensures they fire events without affecting audio
  for (const vizNode of orphanVisualizers) {
    const vizOutputs = compiled.get(vizNode.id);
    if (vizOutputs?.signal) {
      // Mix at zero gain: signal is in graph but contributes nothing to audio
      const silent = el.mul(el.const({ key: `${vizNode.id}:zero`, value: 0 }), vizOutputs.signal);
      left = el.add(left, silent);
    }
  }

  // Add edge meter and scope at zero gain for visualization
  for (const edge of edges) {
    const sourceOutputs = compiled.get(edge.source);
    if (sourceOutputs && sourceOutputs[edge.sourceHandle] !== undefined) {
      const signal = sourceOutputs[edge.sourceHandle];
      if (typeof signal === 'object' && signal !== null) {
        // Add meter for probe/meter modes
        const edgeMeter = el.meter({ name: `${edge.id}:meter` }, signal);
        // Add scope for scope mode (scope is passthrough, so chain through meter)
        const edgeScope = el.scope({ name: `${edge.id}:scope` }, edgeMeter);
        const silent = el.mul(el.const({ key: `${edge.id}:z`, value: 0 }), edgeScope);
        left = el.add(left, silent);
      }
    }
  }

  return { left, right };
}
