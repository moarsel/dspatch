// Scope.jsx - Oscilloscope waveform visualization node
import { el } from '@elemaudio/core';
import { Handle, Position } from '@xyflow/react';
import { useNodeData } from '../engine/useGraph';
import { subscribe, unsubscribe } from '../engine/audioContext';
import { formatCompact } from '../engine/format';
import { useEffect, useState, useRef } from 'react';
import { NodeCard, NodeContent, ParamRow, InletHandle } from '../components';

const SCOPE_WIDTH = 140;
const SCOPE_HEIGHT = 60;

export const descriptor = {
  type: 'scope',
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

    // Wrap signal in scope for visualization, pass through unchanged
    return {
      signal: el.scope({ name: nodeId, size: 512 }, signalIn)
    };
  }
};

export function ScopeNode({ id, selected }) {
  const { data } = useNodeData(id);
  const [waveform, setWaveform] = useState([]);
  const [minMax, setMinMax] = useState({ min: 0, max: 0 });
  const rafRef = useRef(null);
  const dataRef = useRef([]);

  useEffect(() => {
    // Subscribe to scope events for this node
    subscribe('scope', id, (scopeData) => {
      // scopeData is array of blocks, one per channel
      // We take the first channel
      if (scopeData && scopeData[0]) {
        dataRef.current = scopeData[0];
      }
    });

    // Update display at ~30fps
    const updateDisplay = () => {
      if (dataRef.current.length > 0) {
        const samples = dataRef.current;
        setWaveform([...samples]);
        // Calculate min/max
        let min = samples[0] ?? 0;
        let max = samples[0] ?? 0;
        for (let i = 1; i < samples.length; i++) {
          if (samples[i] < min) min = samples[i];
          if (samples[i] > max) max = samples[i];
        }
        setMinMax({ min, max });
      }
      rafRef.current = requestAnimationFrame(updateDisplay);
    };
    rafRef.current = requestAnimationFrame(updateDisplay);

    return () => {
      unsubscribe('scope', id);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [id]);


  // Build SVG path from waveform data
  const buildPath = () => {
    if (waveform.length === 0) {
      // Draw flat line in center
      return `M 0 ${SCOPE_HEIGHT / 2} L ${SCOPE_WIDTH} ${SCOPE_HEIGHT / 2}`;
    }

    const step = SCOPE_WIDTH / waveform.length;
    let path = '';

    for (let i = 0; i < waveform.length; i++) {
      const x = i * step;
      // Map sample value (-1 to 1) to y coordinate
      const y = ((1 - waveform[i]) / 2) * SCOPE_HEIGHT;
      const clampedY = Math.max(0, Math.min(SCOPE_HEIGHT, y));

      if (i === 0) {
        path = `M ${x} ${clampedY}`;
      } else {
        path += ` L ${x} ${clampedY}`;
      }
    }

    return path;
  };

  return (
    <NodeCard type="scope" selected={selected} headerClassName="bg-green-600 text-white">
      <NodeContent>
        <ParamRow>
          <InletHandle id="input" />
          <label className="w-6 text-gray-500 text-xs uppercase font-semibold">in</label>
        </ParamRow>

        <div className="relative">
          <svg
            width={SCOPE_WIDTH}
            height={SCOPE_HEIGHT}
            viewBox={`0 0 ${SCOPE_WIDTH} ${SCOPE_HEIGHT}`}
            preserveAspectRatio="none"
          >
            {/* Center line */}
            <line
              x1="0"
              y1={SCOPE_HEIGHT / 2}
              x2={SCOPE_WIDTH}
              y2={SCOPE_HEIGHT / 2}
              stroke="#333"
              strokeWidth="1"
            />
            {/* Waveform */}
            <path
              d={buildPath()}
              fill="none"
              stroke="#00b894"
              strokeWidth="1.5"
            />
          </svg>
          <span className="absolute top-0.5 right-1 text-xs font-mono text-red-400">
            {formatCompact(minMax.max)}
          </span>
          <span className="absolute bottom-0.5 right-1 text-xs font-mono text-blue-400">
            {formatCompact(minMax.min)}
          </span>
        </div>
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
