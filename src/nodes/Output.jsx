// Output.jsx - DAC output node (stereo) with integrated level meter
import { el } from '@elemaudio/core';
import { Handle, Position } from '@xyflow/react';
import { useNodeData } from '../engine/useGraph';
import { subscribe, unsubscribe } from '../engine/audioContext';
import { useEffect, useState } from 'react';
import { NodeCard, NodeContent, ParamRow, InletHandle } from '../components';

export const descriptor = {
  type: 'output',
  inlets: {
    left: { default: 0 },
    right: { default: 0 },
    muted: { default: false },
  },
  outlets: [],
  compile: (inputs, nodeId) => {
    const left = inputs.left;
    const right = inputs.right;
    const muted = inputs.muted;

    // Convert numbers to const nodes if needed
    const leftSignal = typeof left === 'number'
      ? el.const({ key: `${nodeId}:left`, value: left })
      : left;

    // Keep right as separate signal for metering (don't copy left yet)
    const rightInput = typeof right === 'number'
      ? el.const({ key: `${nodeId}:right`, value: right })
      : right;

    // Meter each channel independently
    const leftMetered = el.meter({ name: `${nodeId}:L` }, leftSignal);
    const rightMetered = el.meter({ name: `${nodeId}:R` }, rightInput);

    // For audio output: if right is silent (0), use left for both channels (mono)
    const rightOutput = typeof right === 'number' && right === 0
      ? leftMetered
      : rightMetered;

    // Apply mute
    const gain = el.const({ key: `${nodeId}:mute`, value: muted ? 0 : 1 });

    return {
      left: el.mul(gain, leftMetered),
      right: el.mul(gain, rightOutput)
    };
  }
};

function HorizontalMeter({ level }) {
  const pct = Math.min(1, Math.abs(level)) * 100;
  const color = level > 0.9 ? '#ef4444' : level > 0.7 ? '#f59e0b' : '#22c55e';

  return (
    <div className="flex-1 h-1.5 bg-[#1a1a2e] rounded-sm overflow-hidden">
      <div
        className="h-full rounded-sm"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

export function OutputNode({ id, selected }) {
  const { data, updateParam } = useNodeData(id);
  const [levelL, setLevelL] = useState(0);
  const [levelR, setLevelR] = useState(0);
  const muted = data.muted ?? false;

  useEffect(() => {
    subscribe('meter', `${id}:L`, (d) => {
      setLevelL(Math.max(Math.abs(d.min), Math.abs(d.max)));
    });
    subscribe('meter', `${id}:R`, (d) => {
      setLevelR(Math.max(Math.abs(d.min), Math.abs(d.max)));
    });

    return () => {
      unsubscribe('meter', `${id}:L`);
      unsubscribe('meter', `${id}:R`);
    };
  }, [id]);

  return (
    <NodeCard type="output" selected={selected} category="io">
      <NodeContent>
        <div className="flex flex-col gap-1.5">
          <ParamRow>
            <InletHandle id="left" />
            <label className="w-4 text-gray-400 text-xxs uppercase font-medium">L</label>
            <HorizontalMeter level={levelL} />
          </ParamRow>

          <ParamRow>
            <InletHandle id="right" />
            <label className="w-4 text-gray-400 text-xxs uppercase font-medium">R</label>
            <HorizontalMeter level={levelR} />
          </ParamRow>

          <button
            onClick={() => updateParam('muted', !muted)}
            className={`w-full py-1 rounded text-xs font-medium transition-colors ${
              muted
                ? 'bg-red-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {muted ? 'Muted' : 'On'}
          </button>
        </div>
      </NodeContent>
    </NodeCard>
  );
}
