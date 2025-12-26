// FFT.jsx - Frequency spectrum analyzer visualization node
import { el } from '@elemaudio/core';
import { Handle, Position } from 'reactflow';
import { useNodeData } from '../engine/useGraph';
import { subscribe, unsubscribe } from '../engine/audioContext';
import { useEffect, useState, useRef } from 'react';
import { NodeCard, NodeContent, ParamRow } from '../components';

const FFT_WIDTH = 140;
const FFT_HEIGHT = 60;
const FFT_SIZE = 1024;
const NUM_BINS = 64; // Number of bars to display

export const descriptor = {
  type: 'fft',
  inlets: {
    input: { default: 0 },
  },
  outlets: ['signal'],
  compile: (inputs, nodeId) => {
    const input = inputs.input;

    // If no input connected, pass through silence
    if (typeof input === 'number' && input === 0) {
      return { signal: el.const({ key: `${nodeId}:silence`, value: 0 }) };
    }

    const signalIn = typeof input === 'number'
      ? el.const({ key: `${nodeId}:input`, value: input })
      : input;

    // Wrap signal in fft for visualization, pass through unchanged
    return {
      signal: el.fft({ name: nodeId, size: FFT_SIZE }, signalIn)
    };
  }
};

export function FFTNode({ id, selected }) {
  const { data } = useNodeData(id);
  const [magnitudes, setMagnitudes] = useState([]);
  const rafRef = useRef(null);
  const dataRef = useRef([]);

  useEffect(() => {
    // Subscribe to fft events for this node
    subscribe('fft', id, (fftData) => {
      // fftData has { real: [...], imag: [...] }
      if (fftData && fftData.real && fftData.imag) {
        const real = fftData.real;
        const imag = fftData.imag;
        const halfLength = Math.floor(real.length / 2); // Only use positive frequencies

        // Calculate magnitudes and downsample to NUM_BINS
        const mags = new Array(NUM_BINS).fill(0);
        const binSize = Math.floor(halfLength / NUM_BINS);

        for (let i = 0; i < NUM_BINS; i++) {
          let sum = 0;
          for (let j = 0; j < binSize; j++) {
            const idx = i * binSize + j;
            if (idx < halfLength) {
              // Magnitude = sqrt(real^2 + imag^2)
              const mag = Math.sqrt(real[idx] * real[idx] + imag[idx] * imag[idx]);
              sum += mag;
            }
          }
          mags[i] = sum / binSize;
        }

        dataRef.current = mags;
      }
    });

    // Update display at ~30fps
    const updateDisplay = () => {
      if (dataRef.current.length > 0) {
        setMagnitudes([...dataRef.current]);
      }
      rafRef.current = requestAnimationFrame(updateDisplay);
    };
    rafRef.current = requestAnimationFrame(updateDisplay);

    return () => {
      unsubscribe('fft', id);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [id]);

  // Build bars from magnitude data
  const barWidth = FFT_WIDTH / NUM_BINS;

  return (
    <NodeCard type="fft" selected={selected} headerClassName="bg-indigo-600 text-white">
      <NodeContent>
        <ParamRow>
          <Handle
            type="target"
            position={Position.Left}
            id="input"
            className="handle inlet"
          />
          <label className="w-6 text-gray-500 text-xs uppercase font-semibold">in</label>
        </ParamRow>

        <svg
          width={FFT_WIDTH}
          height={FFT_HEIGHT}
          viewBox={`0 0 ${FFT_WIDTH} ${FFT_HEIGHT}`}
        >
          {/* Background */}
          <rect x="0" y="0" width={FFT_WIDTH} height={FFT_HEIGHT} fill="#1a1a2e" />

          {/* Frequency bars */}
          {magnitudes.map((mag, i) => {
            // Scale magnitude to height (log scale for better visualization)
            const logMag = mag > 0 ? Math.log10(mag * 100 + 1) / 2 : 0;
            const barHeight = Math.min(1, logMag) * FFT_HEIGHT;

            return (
              <rect
                key={i}
                x={i * barWidth}
                y={FFT_HEIGHT - barHeight}
                width={barWidth - 1}
                height={barHeight}
                fill="#6c5ce7"
              />
            );
          })}
        </svg>
      </NodeContent>

      <Handle
        type="source"
        position={Position.Right}
        id="signal"
        className="handle outlet"
      />
    </NodeCard>
  );
}
