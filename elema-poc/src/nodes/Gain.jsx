// Gain.jsx - Simple gain/amplifier node
import { el } from '@elemaudio/core';
import { Handle, Position } from 'reactflow';
import { useNodeData } from '../engine/useGraph';
import { formatFixed } from '../engine/format';

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
    <div className={`audio-node gain ${selected ? 'selected' : ''}`}>
      <div className="node-header">Gain</div>
      <div className="node-content nodrag">
        <div className="param-row">
          <Handle
            type="target"
            position={Position.Left}
            id="input"
            className="handle inlet audio"
          />
          <label>input</label>
        </div>

        <div className="param-row">
          <Handle
            type="target"
            position={Position.Left}
            id="gain"
            className="handle inlet"
          />
          <label>gain</label>
          <input
            type="range"
            value={data.gain ?? 1}
            onChange={e => updateParam('gain', parseFloat(e.target.value))}
            min="0"
            max="2"
            step="0.01"
          />
          <span className="value">{formatFixed(data.gain ?? 1, 2)}</span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="signal"
        className="handle outlet"
      />
    </div>
  );
}
