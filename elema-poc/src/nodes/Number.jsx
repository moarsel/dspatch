// Number.jsx - Constant value source node
import { el } from '@elemaudio/core';
import { Handle, Position } from 'reactflow';
import { useNodeData } from '../engine/useGraph';

export const descriptor = {
  type: 'number',
  inlets: {
    value: { default: 0 },
  },
  outlets: ['signal'],
  compile: (inputs, nodeId) => {
    const value = inputs.value ?? 0;

    // If value is already a signal, pass it through
    if (typeof value !== 'number') {
      return { signal: value };
    }

    return {
      signal: el.const({ key: `${nodeId}:value`, value })
    };
  }
};

export function NumberNode({ id, selected }) {
  const { data, updateParam } = useNodeData(id);
  const value = data.value ?? 0;

  return (
    <div className={`audio-node number ${selected ? 'selected' : ''}`}>
      <div className="node-header">Number</div>
      <div className="node-content nodrag">
        <div className="param-row">
          <Handle
            type="target"
            position={Position.Left}
            id="value"
            className="handle inlet"
          />
          <input
            type="number"
            value={value}
            onChange={e => updateParam('value', parseFloat(e.target.value) || 0)}
            step="any"
            style={{ width: '80px', textAlign: 'center' }}
          />
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
