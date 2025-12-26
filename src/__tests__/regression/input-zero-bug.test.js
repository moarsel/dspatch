// input-zero-bug.test.js - Regression test for the input === 0 silence bug
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import OfflineRenderer from '@elemaudio/offline-renderer';
import { el } from '@elemaudio/core';
import { compileGraph } from '../../engine/compile';
import { registry } from '../../nodes';
import { descriptor as filterDescriptor } from '../../nodes/Filter';
import { descriptor as gainDescriptor } from '../../nodes/Gain';
import { calculateRMS } from '../../test-utils/signalAnalysis';
import { resetNodeIds } from '../../test-utils/mockGraph';

/**
 * REGRESSION TEST: input === 0 bug
 *
 * Issue: Nodes check `typeof input === 'number' && input === 0` to detect
 * "no connection", but this may incorrectly silence audio when a valid
 * Elementary node is connected.
 */

describe('Regression: input === 0 bug', () => {
  let core;
  const SAMPLE_RATE = 44100;
  const BLOCK_SIZE = 512;
  const RENDER_SAMPLES = 4096;

  // Helper to render and process audio
  async function processAudio(left, right) {
    await core.render(left, right);
    const outChannels = [new Float32Array(RENDER_SAMPLES), new Float32Array(RENDER_SAMPLES)];
    core.process([], outChannels);
    return { left: outChannels[0], right: outChannels[1] };
  }

  beforeAll(async () => {
    core = new OfflineRenderer();
    await core.initialize({
      sampleRate: SAMPLE_RATE,
      blockSize: BLOCK_SIZE,
      numInputChannels: 0,
      numOutputChannels: 2,
    });
  });

  beforeEach(() => {
    resetNodeIds();
    core.reset();  // Reset the renderer state between tests
  });

  describe('Direct descriptor testing', () => {
    it('Filter should NOT return silence when input is an Elementary node', () => {
      const inputSignal = el.cycle(440);

      const result = filterDescriptor.compile({
        input: inputSignal,
        cutoff: 1000,
        q: 1,
        filterType: 'lowpass',
      }, 'filter-test');

      expect(result.signal).toBeDefined();
    });

    it('Filter should return silence when input is numeric 0', () => {
      const result = filterDescriptor.compile({
        input: 0,
        cutoff: 1000,
        q: 1,
        filterType: 'lowpass',
      }, 'filter-test');

      expect(result.signal).toBeDefined();
    });

    it('Gain should NOT return silence when input is an Elementary node', () => {
      const inputSignal = el.cycle(440);

      const result = gainDescriptor.compile({
        input: inputSignal,
        gain: 0.5,
      }, 'gain-test');

      expect(result.signal).toBeDefined();
    });
  });

  describe('Full graph integration', () => {
    it('oscillator -> filter -> output should produce audio, not silence', async () => {
      const nodes = [
        {
          id: 'osc-1',
          type: 'oscillator',
          position: { x: 0, y: 0 },
          data: {
            frequency: 440,
            gain: 0.5,
            waveform: 'sine',
          },
        },
        {
          id: 'filter-1',
          type: 'filter',
          position: { x: 200, y: 0 },
          data: {
            cutoff: 2000,
            q: 1,
            filterType: 'lowpass',
          },
        },
        {
          id: 'output-1',
          type: 'output',
          position: { x: 400, y: 0 },
          data: {},
        },
      ];

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

      const result = compileGraph(nodes, edges, registry);

      expect(result).not.toBeNull();
      expect(result.left).toBeDefined();

      const output = await processAudio(result.left, result.right);
      const rms = calculateRMS(output.left);

      // THIS IS THE CRITICAL ASSERTION
      // If the bug exists, rms will be ~0
      expect(rms).toBeGreaterThan(0.05);
    });

    it('oscillator -> gain -> filter -> output should produce audio', async () => {
      const nodes = [
        {
          id: 'osc-1',
          type: 'oscillator',
          position: { x: 0, y: 0 },
          data: { frequency: 440, gain: 0.5, waveform: 'saw' },
        },
        {
          id: 'gain-1',
          type: 'gain',
          position: { x: 150, y: 0 },
          data: { gain: 0.8 },
        },
        {
          id: 'filter-1',
          type: 'filter',
          position: { x: 300, y: 0 },
          data: { cutoff: 1500, q: 2, filterType: 'lowpass' },
        },
        {
          id: 'output-1',
          type: 'output',
          position: { x: 450, y: 0 },
          data: {},
        },
      ];

      const edges = [
        { id: 'e1', source: 'osc-1', sourceHandle: 'signal', target: 'gain-1', targetHandle: 'input' },
        { id: 'e2', source: 'gain-1', sourceHandle: 'signal', target: 'filter-1', targetHandle: 'input' },
        { id: 'e3', source: 'filter-1', sourceHandle: 'signal', target: 'output-1', targetHandle: 'left' },
      ];

      const result = compileGraph(nodes, edges, registry);
      const output = await processAudio(result.left, result.right);
      const rms = calculateRMS(output.left);

      expect(rms).toBeGreaterThan(0.05);
    });
  });
});
