// Filter.jsx - State Variable Filter (lowpass, highpass, bandpass)
import { el } from '@elemaudio/core';
import { Handle, Position } from 'reactflow';
import { useNodeData } from '../engine/useGraph';

export const descriptor = {
  type: 'filter',
  inlets: {
    input: { default: 0 },
    cutoff: { default: 1000 },
    q: { default: 1 },
  },
  outlets: ['signal'],
  compile: (inputs, nodeId) => {
    const input = inputs.input;
    const filterType = inputs.filterType ?? 'lowpass';

    // If no input signal, return silence
    if (typeof input === 'number' && input === 0) {
      return { signal: el.const({ key: `${nodeId}:silence`, value: 0 }) };
    }

    // Ensure cutoff and q are signals (wrap numbers in const)
    const cutoff = typeof inputs.cutoff === 'number'
      ? el.const({ key: `${nodeId}:cutoff`, value: inputs.cutoff })
      : inputs.cutoff;
    const q = typeof inputs.q === 'number'
      ? el.const({ key: `${nodeId}:q`, value: inputs.q })
      : inputs.q;

    // el.svf takes props with mode property
    const signal = el.svf({ mode: filterType }, cutoff, q, input);

    return { signal };
  }
};

export function FilterNode({ id, selected }) {
  const { data, updateParam } = useNodeData(id);

  return (
    <div className={`audio-node filter ${selected ? 'selected' : ''}`}>
      <div className="node-header">Filter</div>
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
            id="cutoff"
            className="handle inlet"
          />
          <label>cutoff</label>
          <input
            type="range"
            value={data.cutoff ?? 1000}
            onChange={e => updateParam('cutoff', parseFloat(e.target.value))}
            min="20"
            max="20000"
            step="1"
          />
          <span className="value">{Math.round(data.cutoff ?? 1000)}Hz</span>
        </div>

        <div className="param-row">
          <Handle
            type="target"
            position={Position.Left}
            id="q"
            className="handle inlet"
          />
          <label>Q</label>
          <input
            type="range"
            value={data.q ?? 1}
            onChange={e => updateParam('q', parseFloat(e.target.value))}
            min="0.1"
            max="20"
            step="0.1"
          />
          <span className="value">{(data.q ?? 1).toFixed(1)}</span>
        </div>

        <div className="param-row">
          <label>type</label>
          <select
            value={data.filterType ?? 'lowpass'}
            onChange={e => updateParam('filterType', e.target.value)}
          >
            <option value="lowpass">Lowpass</option>
            <option value="highpass">Highpass</option>
            <option value="bandpass">Bandpass</option>
          </select>
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
