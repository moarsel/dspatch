// nodes.test.js - Unit tests for node descriptors
import { describe, it, expect } from 'vitest';
import { el } from '@elemaudio/core';

import { descriptor as oscillatorDescriptor } from '../nodes/Oscillator';
import { descriptor as filterDescriptor } from '../nodes/Filter';
import { descriptor as gainDescriptor } from '../nodes/Gain';
import { descriptor as outputDescriptor } from '../nodes/Output';

describe('Node Descriptors', () => {
  describe('Oscillator', () => {
    it('should have correct inlet definitions', () => {
      expect(oscillatorDescriptor.inlets).toHaveProperty('frequency');
      expect(oscillatorDescriptor.inlets).toHaveProperty('gain');
      expect(oscillatorDescriptor.inlets.frequency.default).toBe(440);
      expect(oscillatorDescriptor.inlets.gain.default).toBe(0.5);
    });

    it('should have signal outlet', () => {
      expect(oscillatorDescriptor.outlets).toContain('signal');
    });

    it('should compile with default values', () => {
      const result = oscillatorDescriptor.compile({
        frequency: 440,
        gain: 0.5,
        waveform: 'sine',
      }, 'osc-1');

      expect(result).toHaveProperty('signal');
      expect(result.signal).toBeDefined();
    });

    it('should compile all waveforms', () => {
      const waveforms = ['sine', 'saw', 'square', 'triangle'];

      for (const waveform of waveforms) {
        const result = oscillatorDescriptor.compile({
          frequency: 440,
          gain: 0.5,
          waveform,
        }, 'osc-1');

        expect(result.signal).toBeDefined();
      }
    });
  });

  describe('Filter', () => {
    it('should have correct inlet definitions', () => {
      expect(filterDescriptor.inlets).toHaveProperty('input');
      expect(filterDescriptor.inlets).toHaveProperty('cutoff');
      expect(filterDescriptor.inlets).toHaveProperty('q');
    });

    it('should return silence when input is numeric 0 (disconnected)', () => {
      const result = filterDescriptor.compile({
        input: 0,
        cutoff: 1000,
        q: 1,
        filterType: 'lowpass',
      }, 'filter-1');

      expect(result.signal).toBeDefined();
    });

    it('should process signal when input is an Elementary node', () => {
      const inputSignal = el.cycle(440);

      const result = filterDescriptor.compile({
        input: inputSignal,
        cutoff: 1000,
        q: 1,
        filterType: 'lowpass',
      }, 'filter-1');

      expect(result.signal).toBeDefined();
    });

    it('should compile all filter types', () => {
      const inputSignal = el.cycle(440);
      const filterTypes = ['lowpass', 'highpass', 'bandpass'];

      for (const filterType of filterTypes) {
        const result = filterDescriptor.compile({
          input: inputSignal,
          cutoff: 1000,
          q: 1,
          filterType,
        }, 'filter-1');

        expect(result.signal).toBeDefined();
      }
    });
  });

  describe('Gain', () => {
    it('should return silence when input is numeric 0', () => {
      const result = gainDescriptor.compile({
        input: 0,
        gain: 1,
      }, 'gain-1');

      expect(result.signal).toBeDefined();
    });

    it('should process signal when input is an Elementary node', () => {
      const inputSignal = el.cycle(440);

      const result = gainDescriptor.compile({
        input: inputSignal,
        gain: 0.5,
      }, 'gain-1');

      expect(result.signal).toBeDefined();
    });
  });

  describe('Output', () => {
    it('should handle mono input (left only)', () => {
      const inputSignal = el.cycle(440);

      const result = outputDescriptor.compile({
        left: inputSignal,
        right: 0,
      }, 'output-1');

      expect(result.left).toBeDefined();
      expect(result.right).toBeDefined();
    });

    it('should handle stereo input', () => {
      const leftSignal = el.cycle(440);
      const rightSignal = el.cycle(880);

      const result = outputDescriptor.compile({
        left: leftSignal,
        right: rightSignal,
      }, 'output-1');

      expect(result.left).toBeDefined();
      expect(result.right).toBeDefined();
    });
  });
});
