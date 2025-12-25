// useGraph.js - Zustand store for nodes, edges, and graph compilation
import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { compileGraph } from './compile';
import { render, isInitialized } from './audioContext';
import { registry } from '../nodes';

export const useGraph = create((set, get) => ({
  nodes: [],
  edges: [],

  // ReactFlow node change handler
  onNodesChange: (changes) => {
    set(state => ({
      nodes: applyNodeChanges(changes, state.nodes)
    }));
  },

  // ReactFlow edge change handler
  onEdgesChange: (changes) => {
    set(state => ({
      edges: applyEdgeChanges(changes, state.edges)
    }));
    // Recompile when edges change (connections added/removed)
    get().compile();
  },

  // Add a new node
  addNode: (type, position) => {
    const id = `${type}-${Date.now()}`;
    const nodeType = registry[type];

    if (!nodeType) {
      console.error(`Unknown node type: ${type}`);
      return;
    }

    // Initialize data with default values from descriptor
    const data = {};
    for (const [inletName, inlet] of Object.entries(nodeType.descriptor.inlets)) {
      data[inletName] = inlet.default;
    }

    const newNode = {
      id,
      type,
      position,
      data,
    };

    set(state => ({
      nodes: [...state.nodes, newNode]
    }));

    get().compile();
  },

  // Handle new connection
  onConnect: (params) => {
    set(state => ({
      edges: addEdge(params, state.edges)
    }));
    get().compile();
  },

  // Update a node's parameter
  updateNodeData: (nodeId, key, value) => {
    set(state => ({
      nodes: state.nodes.map(n =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, [key]: value } }
          : n
      )
    }));
    get().compile();
  },

  // Compile and render the audio graph
  compile: () => {
    if (!isInitialized()) return;

    const { nodes, edges } = get();
    const result = compileGraph(nodes, edges, registry);

    if (result) {
      render(result.left, result.right);
    }
  }
}));

/**
 * Hook for nodes to update their parameters
 */
export function useNodeData(nodeId) {
  const updateNodeData = useGraph(state => state.updateNodeData);
  const nodeData = useGraph(state => state.nodes.find(n => n.id === nodeId)?.data);

  return {
    data: nodeData ?? {},
    updateParam: (key, value) => updateNodeData(nodeId, key, value)
  };
}
