// Gain.jsx - Simple gain/amplifier node
import { el } from '@elemaudio/core';
import { Handle, Position } from 'reactflow';
import { useNodeData } from '../engine/useGraph';
import { NodeCard, NodeContent, ParamRow, RangeInput, ValueDisplay } from '../components';

export const descriptor = {
  type: 'gain',
  inlets: {
    input: { default: 0 },
    gain: { default: 1 },
  },
  outlets: ['signal'],
  compile: (inputs, nodeId) => {
    const input = inputs.input;

    // If no input signal, return silence
    if (typeof input === 'number' && input === 0) {
      return { signal: el.const({ key: `${nodeId}:silence`, value: 0 }) };
    }

    // Wrap numeric gain in const
    const gain = typeof inputs.gain === 'number'
      ? el.const({ key: `${nodeId}:gain`, value: inputs.gain })
      : inputs.gain;

    return {
      signal: el.mul(input, gain)
    };
  }
};

export function GainNode({ id, selected }) {
  const { data, updateParam } = useNodeData(id);

  return (
    <NodeCard type="gain" selected={selected} category="process">
      <NodeContent>
        <ParamRow>
          <Handle
            type="target"
            position={Position.Left}
            id="input"
            className="handle inlet"
          />
          <label className="w-8 text-text-muted text-xxs uppercase font-medium tracking-wide">in</label>
        </ParamRow>

        <ParamRow>
          <Handle
            type="target"
            position={Position.Left}
            id="gain"
            className="handle inlet"
          />
          <RangeInput
            label="gain"
            value={data.gain ?? 1}
            onChange={e => updateParam('gain', parseFloat(e.target.value))}
            min="0"
            max="2"
            step="0.01"
          />
          <ValueDisplay value={data.gain ?? 1} />
        </ParamRow>
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
