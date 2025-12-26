// signal-flow.test.js - Integration tests with offline renderer
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import OfflineRenderer from '@elemaudio/offline-renderer';
import { compileGraph } from '../engine/compile';
import { registry } from '../nodes';
import {
  createOscOutputChain,
  createOscFilterOutputChain,
  createOscGainOutputChain,
  resetNodeIds,
} from '../test-utils/mockGraph';
import { calculateRMS, analyzeBuffer } from '../test-utils/signalAnalysis';

describe('Signal Flow Integration Tests', () => {
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

  describe('Basic oscillator output', () => {
    it('should produce non-silent audio from oscillator -> output', async () => {
      const { nodes, edges } = createOscOutputChain({ frequency: 440, gain: 0.5 });
      const result = compileGraph(nodes, edges, registry);

      expect(result).not.toBeNull();

      const output = await processAudio(result.left, result.right);

      expect(output.left).toHaveNonZeroRMS(0.1);
      expect(output.right).toHaveNonZeroRMS(0.1);
    });

    it('should produce correct approximate frequency', async () => {
      const targetFreq = 440;
      const { nodes, edges } = createOscOutputChain({ frequency: targetFreq, gain: 0.5 });
      const result = compileGraph(nodes, edges, registry);

      const output = await processAudio(result.left, result.right);
      const analysis = analyzeBuffer(output.left, SAMPLE_RATE);

      // Allow 15% tolerance for frequency estimation
      expect(analysis.estimatedFrequency).toBeGreaterThan(targetFreq * 0.85);
      expect(analysis.estimatedFrequency).toBeLessThan(targetFreq * 1.15);
    });

    it('should respect gain parameter', async () => {
      // Full gain
      const fullGain = createOscOutputChain({ frequency: 440, gain: 1.0 });
      const fullResult = compileGraph(fullGain.nodes, fullGain.edges, registry);
      const fullOutput = await processAudio(fullResult.left, fullResult.right);
      const fullRMS = calculateRMS(fullOutput.left);

      // Half gain
      resetNodeIds();
      const halfGain = createOscOutputChain({ frequency: 440, gain: 0.5 });
      const halfResult = compileGraph(halfGain.nodes, halfGain.edges, registry);
      const halfOutput = await processAudio(halfResult.left, halfResult.right);
      const halfRMS = calculateRMS(halfOutput.left);

      // Half gain should produce roughly half the RMS
      expect(halfRMS).toBeLessThan(fullRMS);
      expect(halfRMS).toBeGreaterThan(fullRMS * 0.4);
      expect(halfRMS).toBeLessThan(fullRMS * 0.6);
    });
  });

  describe('Oscillator -> Filter -> Output chain', () => {
    it('should produce non-silent audio through filter', async () => {
      const { nodes, edges } = createOscFilterOutputChain(
        { frequency: 440, gain: 0.5, waveform: 'saw' },
        { cutoff: 2000, q: 1, filterType: 'lowpass' }
      );
      const result = compileGraph(nodes, edges, registry);

      expect(result).not.toBeNull();

      const output = await processAudio(result.left, result.right);

      // THIS IS THE KEY TEST FOR THE BUG
      // If the bug exists, RMS will be near zero
      expect(output.left).toHaveNonZeroRMS(0.05);
    });

    it('should attenuate high frequencies with lowpass filter', async () => {
      // High frequency oscillator with low cutoff filter
      const { nodes, edges } = createOscFilterOutputChain(
        { frequency: 5000, gain: 0.5, waveform: 'sine' },
        { cutoff: 500, q: 1, filterType: 'lowpass' }
      );
      const result = compileGraph(nodes, edges, registry);
      const filteredOutput = await processAudio(result.left, result.right);
      const filteredRMS = calculateRMS(filteredOutput.left);

      // Same oscillator without filter
      resetNodeIds();
      const { nodes: unfilteredNodes, edges: unfilteredEdges } = createOscOutputChain(
        { frequency: 5000, gain: 0.5, waveform: 'sine' }
      );
      const unfilteredResult = compileGraph(unfilteredNodes, unfilteredEdges, registry);
      const unfilteredOutput = await processAudio(unfilteredResult.left, unfilteredResult.right);
      const unfilteredRMS = calculateRMS(unfilteredOutput.left);

      // Filtered signal should be significantly quieter
      expect(filteredRMS).toBeLessThan(unfilteredRMS * 0.5);
    });
  });

  describe('Oscillator -> Gain -> Output chain', () => {
    it('should produce non-silent audio through gain node', async () => {
      const { nodes, edges } = createOscGainOutputChain(
        { frequency: 440, gain: 0.5 },
        0.8
      );
      const result = compileGraph(nodes, edges, registry);

      const output = await processAudio(result.left, result.right);

      expect(output.left).toHaveNonZeroRMS(0.1);
    });

    it('should produce silence when gain is zero', async () => {
      const { nodes, edges } = createOscGainOutputChain(
        { frequency: 440, gain: 0.5 },
        0
      );
      const result = compileGraph(nodes, edges, registry);

      const output = await processAudio(result.left, result.right);

      expect(output.left).toBeSilent();
    });
  });

  describe('All waveforms', () => {
    const waveforms = ['sine', 'saw', 'square', 'triangle'];

    for (const waveform of waveforms) {
      it(`should produce audio for ${waveform} waveform`, async () => {
        resetNodeIds();
        const { nodes, edges } = createOscOutputChain({
          frequency: 440,
          gain: 0.5,
          waveform,
        });
        const result = compileGraph(nodes, edges, registry);

        const output = await processAudio(result.left, result.right);

        expect(output.left).toHaveNonZeroRMS(0.1);
      });
    }
  });

  describe('All filter types', () => {
    const filterTypes = ['lowpass', 'highpass', 'bandpass'];

    for (const filterType of filterTypes) {
      it(`should pass audio through ${filterType} filter`, async () => {
        resetNodeIds();
        const { nodes, edges } = createOscFilterOutputChain(
          { frequency: 440, gain: 0.5, waveform: 'saw' },
          { cutoff: 1000, q: 1, filterType }
        );
        const result = compileGraph(nodes, edges, registry);

        const output = await processAudio(result.left, result.right);

        expect(output.left).toHaveNonZeroRMS(0.01);
      });
    }
  });
});
