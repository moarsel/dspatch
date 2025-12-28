// useGraph.js - Zustand store for nodes, edges, and graph compilation
import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges, reconnectEdge } from '@xyflow/react';
import { compileGraph } from './compile';
import { render, isInitialized } from './audioContext';
import { registry } from '../nodes';

// Default Output node so users can hear audio immediately
const defaultNodes = [
  {
    id: 'output-default',
    type: 'output',
    position: { x: 400, y: 200 },
    data: {},
  },
];

export const useGraph = create((set, get) => ({
  nodes: defaultNodes,
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
    // Prevent multiple connections to the same inlet
    const existingConnection = get().edges.find(
      e => e.target === params.target && e.targetHandle === params.targetHandle
    );
    if (existingConnection) {
      return; // Reject - inlet already has a connection
    }

    set(state => ({
      edges: addEdge(params, state.edges)
    }));
    get().compile();
  },

  // Handle edge reconnection (drag edge to new handle)
  onReconnect: (oldEdge, newConnection) => {
    // Prevent reconnecting to an inlet that already has a connection
    const existingConnection = get().edges.find(
      e => e.id !== oldEdge.id &&
           e.target === newConnection.target &&
           e.targetHandle === newConnection.targetHandle
    );
    if (existingConnection) {
      return; // Reject - inlet already has a connection
    }

    set(state => ({
      edges: reconnectEdge(oldEdge, newConnection, state.edges)
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

  // Update an edge's data (e.g., visualization mode)
  updateEdgeData: (edgeId, key, value) => {
    set(state => ({
      edges: state.edges.map(e =>
        e.id === edgeId
          ? { ...e, data: { ...e.data, [key]: value } }
          : e
      )
    }));
  },

  // Delete an edge
  deleteEdge: (edgeId) => {
    set(state => ({
      edges: state.edges.filter(e => e.id !== edgeId)
    }));
    get().compile();
  },

  // Delete a node and its connected edges
  deleteNode: (nodeId) => {
    set(state => ({
      nodes: state.nodes.filter(n => n.id !== nodeId),
      edges: state.edges.filter(e => e.source !== nodeId && e.target !== nodeId)
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
  },

  // Load a preset (replace all nodes and edges)
  loadPreset: (preset) => {
    set({
      nodes: preset.nodes,
      edges: preset.edges,
    });
    get().compile();
  },
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
