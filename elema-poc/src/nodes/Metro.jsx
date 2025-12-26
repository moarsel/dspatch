// Metro.jsx - Metronome/pulse train node
import { el } from '@elemaudio/core';
import { Handle, Position } from 'reactflow';
import { useNodeData } from '../engine/useGraph';
import { useSignalHigh } from '../engine/useSignalValue';
import { formatFixed } from '../engine/format';
import { NodeCard, NodeContent, ParamRow, NumberInput } from '../components';

export const descriptor = {
  type: 'metro',
  inlets: {
    bpm: { default: 120 },
  },
  outlets: ['signal'],
  compile: (inputs, nodeId) => {
    const bpm = inputs.bpm ?? 120;

    // Convert BPM to interval in milliseconds
    const bpmValue = typeof bpm === 'number' ? bpm : 120;
    const interval = 60000 / Math.max(1, bpmValue);

    return {
      signal: el.meter({ name: nodeId }, el.metro({ interval }))
    };
  }
};

export function MetroNode({ id, selected }) {
  const { data, updateParam } = useNodeData(id);
  const bpm = data.bpm ?? 120;
  const hz = bpm / 60;
  const isActive = useSignalHigh(id);

  return (
    <NodeCard type="metro" selected={selected} headerClassName="bg-orange-300 text-gray-900">
      <NodeContent>
        <ParamRow>
          <Handle
            type="target"
            position={Position.Left}
            id="bpm"
            className="handle inlet"
          />
          <NumberInput
            label="bpm"
            value={bpm}
            onChange={e => updateParam('bpm', parseFloat(e.target.value) || 120)}
            min="1"
            max="999"
            step="1"
          />
          <div
            className={`w-3 h-3 rounded-full transition-all ${
              isActive ? 'bg-pink-500 shadow-lg shadow-pink-500/50' : 'bg-gray-700'
            }`}
          />
        </ParamRow>

        <div className="text-right text-xs font-mono text-gray-600 mt-0.5">
          {formatFixed(hz, 2)} Hz
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
