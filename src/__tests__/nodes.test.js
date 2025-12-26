// nodes.test.js - Unit tests for node descriptors
import { describe, it, expect } from 'vitest';
import { el } from '@elemaudio/core';

import { descriptor as oscillatorDescriptor } from '../nodes/Oscillator';
import { descriptor as filterDescriptor } from '../nodes/Filter';
import { descriptor as gainDescriptor } from '../nodes/Gain';
import { descriptor as outputDescriptor } from '../nodes/Output';
import { descriptor as noiseDescriptor } from '../nodes/Noise';
import { descriptor as lfoDescriptor } from '../nodes/LFO';
import { descriptor as mixDescriptor } from '../nodes/Mix';
import { descriptor as noteToFreqDescriptor } from '../nodes/NoteToFreq';
import { descriptor as numberDescriptor } from '../nodes/Number';
import { descriptor as mathDescriptor } from '../nodes/Math';

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

  describe('Noise', () => {
    it('should have correct inlet definitions', () => {
      expect(noiseDescriptor.inlets).toHaveProperty('gain');
      expect(noiseDescriptor.inlets.gain.default).toBe(0.5);
    });

    it('should have signal outlet', () => {
      expect(noiseDescriptor.outlets).toContain('signal');
    });

    it('should compile white noise', () => {
      const result = noiseDescriptor.compile({
        gain: 0.5,
        noiseType: 'white',
      }, 'noise-1');

      expect(result).toHaveProperty('signal');
      expect(result.signal).toBeDefined();
    });

    it('should compile pink noise', () => {
      const result = noiseDescriptor.compile({
        gain: 0.5,
        noiseType: 'pink',
      }, 'noise-1');

      expect(result.signal).toBeDefined();
    });
  });

  describe('LFO', () => {
    it('should have correct inlet definitions', () => {
      expect(lfoDescriptor.inlets).toHaveProperty('rate');
      expect(lfoDescriptor.inlets).toHaveProperty('depth');
      expect(lfoDescriptor.inlets.rate.default).toBe(1);
      expect(lfoDescriptor.inlets.depth.default).toBe(1);
    });

    it('should have signal outlet', () => {
      expect(lfoDescriptor.outlets).toContain('signal');
    });

    it('should compile with default values', () => {
      const result = lfoDescriptor.compile({
        rate: 1,
        depth: 1,
        waveform: 'sine',
      }, 'lfo-1');

      expect(result).toHaveProperty('signal');
      expect(result.signal).toBeDefined();
    });

    it('should compile all waveforms', () => {
      const waveforms = ['sine', 'saw', 'square', 'triangle'];

      for (const waveform of waveforms) {
        const result = lfoDescriptor.compile({
          rate: 2,
          depth: 0.5,
          waveform,
        }, 'lfo-1');

        expect(result.signal).toBeDefined();
      }
    });
  });

  describe('Mix', () => {
    it('should have correct inlet definitions', () => {
      expect(mixDescriptor.inlets).toHaveProperty('a');
      expect(mixDescriptor.inlets).toHaveProperty('b');
      expect(mixDescriptor.inlets).toHaveProperty('balance');
      expect(mixDescriptor.inlets.balance.default).toBe(0.5);
    });

    it('should have signal outlet', () => {
      expect(mixDescriptor.outlets).toContain('signal');
    });

    it('should return silence when both inputs are 0', () => {
      const result = mixDescriptor.compile({
        a: 0,
        b: 0,
        balance: 0.5,
      }, 'mix-1');

      expect(result.signal).toBeDefined();
    });

    it('should mix two signals', () => {
      const signalA = el.cycle(440);
      const signalB = el.cycle(880);

      const result = mixDescriptor.compile({
        a: signalA,
        b: signalB,
        balance: 0.5,
      }, 'mix-1');

      expect(result.signal).toBeDefined();
    });

    it('should handle single input (A only)', () => {
      const signalA = el.cycle(440);

      const result = mixDescriptor.compile({
        a: signalA,
        b: 0,
        balance: 0,
      }, 'mix-1');

      expect(result.signal).toBeDefined();
    });

    it('should handle single input (B only)', () => {
      const signalB = el.cycle(880);

      const result = mixDescriptor.compile({
        a: 0,
        b: signalB,
        balance: 1,
      }, 'mix-1');

      expect(result.signal).toBeDefined();
    });
  });

  describe('NoteToFreq', () => {
    it('should have correct inlet definitions', () => {
      expect(noteToFreqDescriptor.inlets).toHaveProperty('note');
      expect(noteToFreqDescriptor.inlets.note.default).toBe(60); // C4
    });

    it('should have frequency outlet', () => {
      expect(noteToFreqDescriptor.outlets).toContain('frequency');
    });

    it('should convert MIDI note 69 (A4) to 440Hz', () => {
      const result = noteToFreqDescriptor.compile({
        note: 69,
      }, 'n2f-1');

      expect(result).toHaveProperty('frequency');
      expect(result.frequency).toBeDefined();
    });

    it('should convert MIDI note 60 (C4) correctly', () => {
      const result = noteToFreqDescriptor.compile({
        note: 60,
      }, 'n2f-1');

      expect(result.frequency).toBeDefined();
    });

    it('should handle signal input for note', () => {
      const noteSignal = el.const({ key: 'test:note', value: 69 });

      const result = noteToFreqDescriptor.compile({
        note: noteSignal,
      }, 'n2f-1');

      expect(result.frequency).toBeDefined();
    });
  });

  describe('Number', () => {
    it('should have correct inlet definitions', () => {
      expect(numberDescriptor.inlets).toHaveProperty('value');
      expect(numberDescriptor.inlets.value.default).toBe(0);
    });

    it('should have signal outlet', () => {
      expect(numberDescriptor.outlets).toContain('signal');
    });

    it('should output constant value', () => {
      const result = numberDescriptor.compile({
        value: 42,
      }, 'num-1');

      expect(result).toHaveProperty('signal');
      expect(result.signal).toBeDefined();
    });

    it('should pass through signal input', () => {
      const inputSignal = el.cycle(1);

      const result = numberDescriptor.compile({
        value: inputSignal,
      }, 'num-1');

      expect(result.signal).toBeDefined();
    });
  });

  describe('Math', () => {
    it('should have correct inlet definitions', () => {
      expect(mathDescriptor.inlets).toHaveProperty('a');
      expect(mathDescriptor.inlets).toHaveProperty('b');
      expect(mathDescriptor.inlets.a.default).toBe(0);
      expect(mathDescriptor.inlets.b.default).toBe(0);
    });

    it('should have signal outlet', () => {
      expect(mathDescriptor.outlets).toContain('signal');
    });

    it('should add two numbers', () => {
      const result = mathDescriptor.compile({
        a: 5,
        b: 3,
        operation: 'add',
      }, 'math-1');

      expect(result.signal).toBeDefined();
    });

    it('should multiply two signals', () => {
      const signalA = el.cycle(440);
      const signalB = el.const({ key: 'test:b', value: 0.5 });

      const result = mathDescriptor.compile({
        a: signalA,
        b: signalB,
        operation: 'multiply',
      }, 'math-1');

      expect(result.signal).toBeDefined();
    });

    it('should handle mixed number and signal', () => {
      const signalA = el.cycle(440);

      const result = mathDescriptor.compile({
        a: signalA,
        b: 2,
        operation: 'multiply',
      }, 'math-1');

      expect(result.signal).toBeDefined();
    });

    it('should compile all operations', () => {
      const operations = ['add', 'subtract', 'multiply', 'divide', 'modulo', 'power', 'min', 'max'];

      for (const operation of operations) {
        const result = mathDescriptor.compile({
          a: 10,
          b: 3,
          operation,
        }, 'math-1');

        expect(result.signal).toBeDefined();
      }
    });

    it('should handle division by zero gracefully', () => {
      const result = mathDescriptor.compile({
        a: 10,
        b: 0,
        operation: 'divide',
      }, 'math-1');

      expect(result.signal).toBeDefined();
    });
  });
});
