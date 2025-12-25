// compile.test.js - Unit tests for graph compilation
import { describe, it, expect, beforeEach } from 'vitest';
import { compileGraph } from '../engine/compile';
import { registry } from '../nodes';
import {
  createOscOutputChain,
  createOscFilterOutputChain,
  createOscGainOutputChain,
  createNode,
  createEdge,
  resetNodeIds,
} from '../test-utils/mockGraph';

describe('compileGraph', () => {
  beforeEach(() => {
    resetNodeIds();
  });

  describe('Basic compilation', () => {
    it('should return null for empty graph', () => {
      const result = compileGraph([], [], registry);
      expect(result).toBeNull();
    });

    it('should return null when no output node exists', () => {
      const osc = createNode('oscillator', { frequency: 440, gain: 0.5 });
      const result = compileGraph([osc], [], registry);
      expect(result).toBeNull();
    });

    it('should compile oscillator -> output chain', () => {
      const { nodes, edges } = createOscOutputChain();
      const result = compileGraph(nodes, edges, registry);

      expect(result).not.toBeNull();
      expect(result.left).toBeDefined();
      expect(result.right).toBeDefined();
    });
  });

  describe('Topological sort', () => {
    it('should compile nodes regardless of array order', () => {
      // Create nodes in reverse order
      const output = createNode('output', {}, 'output-1');
      const osc = createNode('oscillator', {
        frequency: 440,
        gain: 0.5,
        waveform: 'sine'
      }, 'osc-1');

      const edges = [createEdge(osc, 'signal', output, 'left')];

      // Pass nodes in reverse order
      const result = compileGraph([output, osc], edges, registry);

      expect(result).not.toBeNull();
      expect(result.left).toBeDefined();
    });
  });

  describe('Signal chain: Oscillator -> Filter -> Output', () => {
    it('should compile the full chain', () => {
      const { nodes, edges } = createOscFilterOutputChain();
      const result = compileGraph(nodes, edges, registry);

      expect(result).not.toBeNull();
      expect(result.left).toBeDefined();
    });
  });

  describe('Signal chain: Oscillator -> Gain -> Output', () => {
    it('should compile oscillator -> gain -> output chain', () => {
      const { nodes, edges } = createOscGainOutputChain();
      const result = compileGraph(nodes, edges, registry);

      expect(result).not.toBeNull();
      expect(result.left).toBeDefined();
    });
  });

  describe('Edge resolution', () => {
    it('should correctly match sourceHandle to targetHandle', () => {
      const osc = createNode('oscillator', {
        frequency: 440,
        gain: 0.5,
        waveform: 'sine',
      }, 'osc-1');

      const filter = createNode('filter', {
        cutoff: 1000,
        q: 1,
        filterType: 'lowpass',
      }, 'filter-1');

      const output = createNode('output', {}, 'output-1');

      const edges = [
        {
          id: 'e1',
          source: 'osc-1',
          sourceHandle: 'signal',
          target: 'filter-1',
          targetHandle: 'input',
        },
        {
          id: 'e2',
          source: 'filter-1',
          sourceHandle: 'signal',
          target: 'output-1',
          targetHandle: 'left',
        },
      ];

      const result = compileGraph([osc, filter, output], edges, registry);
      expect(result).not.toBeNull();
    });

    it('should use default when no edge exists for inlet', () => {
      const filter = createNode('filter', {
        cutoff: 1000,
        q: 1,
        filterType: 'lowpass',
      }, 'filter-1');

      const output = createNode('output', {}, 'output-1');

      const edges = [
        createEdge(filter, 'signal', output, 'left'),
      ];

      const result = compileGraph([filter, output], edges, registry);
      expect(result).not.toBeNull();
    });
  });
});
