// edge-scopes.test.js - Tests for edge meter visualization feature
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import OfflineRenderer from '@elemaudio/offline-renderer';
import { compileGraph } from '../engine/compile';
import { registry } from '../nodes';
import {
  createOscOutputChain,
  createOscGainOutputChain,
  resetNodeIds,
} from '../test-utils/mockGraph';
import { calculateRMS } from '../test-utils/signalAnalysis';

describe('Edge Meters - Audio Output', () => {
  let core;
  const SAMPLE_RATE = 44100;
  const BLOCK_SIZE = 512;
  const RENDER_SAMPLES = 4096;

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
    core.reset();
  });

  describe('Basic signal chain with edge meters', () => {
    it('should produce audio from oscillator -> output (single edge)', async () => {
      const { nodes, edges } = createOscOutputChain({ frequency: 440, gain: 0.5 });
      const result = compileGraph(nodes, edges, registry);

      expect(result).not.toBeNull();

      const output = await processAudio(result.left, result.right);
      const rms = calculateRMS(output.left);

      expect(rms).toBeGreaterThan(0.1);
    });

    it('should produce audio from oscillator -> gain -> output (two edges)', async () => {
      const { nodes, edges } = createOscGainOutputChain(
        { frequency: 440, gain: 0.5 },
        0.8
      );
      const result = compileGraph(nodes, edges, registry);

      expect(result).not.toBeNull();

      const output = await processAudio(result.left, result.right);
      const rms = calculateRMS(output.left);

      expect(rms).toBeGreaterThan(0.1);
    });
  });

  describe('Edge meters should not affect signal', () => {
    it('should produce expected amplitude from oscillator', async () => {
      const { nodes, edges } = createOscOutputChain({ frequency: 440, gain: 0.5 });
      const result = compileGraph(nodes, edges, registry);

      const output = await processAudio(result.left, result.right);
      const rms = calculateRMS(output.left);

      // RMS of sine wave at 0.5 gain ≈ 0.354
      expect(rms).toBeGreaterThan(0.25);
      expect(rms).toBeLessThan(0.45);
    });

    it('should preserve gain node effect', async () => {
      const { nodes, edges } = createOscGainOutputChain(
        { frequency: 440, gain: 1.0 },
        0.5 // 50% gain
      );
      const result = compileGraph(nodes, edges, registry);

      const output = await processAudio(result.left, result.right);
      const rms = calculateRMS(output.left);

      // Full amplitude oscillator through 0.5 gain ≈ 0.354
      expect(rms).toBeGreaterThan(0.25);
      expect(rms).toBeLessThan(0.45);
    });
  });
});
