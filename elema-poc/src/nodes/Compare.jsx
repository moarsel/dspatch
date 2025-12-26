// Compare.jsx - Comparison and logical operations node
import { el } from '@elemaudio/core';
import { Handle, Position } from 'reactflow';
import { useNodeData } from '../engine/useGraph';

const OPERATIONS = {
  eq: { symbol: '==', fn: (a, b) => el.eq(a, b) },
  le: { symbol: '<', fn: (a, b) => el.le(a, b) },
  leq: { symbol: '<=', fn: (a, b) => el.leq(a, b) },
  ge: { symbol: '>', fn: (a, b) => el.ge(a, b) },
  geq: { symbol: '>=', fn: (a, b) => el.geq(a, b) },
  and: { symbol: '&&', fn: (a, b) => el.and(a, b) },
  or: { symbol: '||', fn: (a, b) => el.or(a, b) },
};

export const descriptor = {
  type: 'compare',
  inlets: {
    a: { default: 0 },
    b: { default: 0 },
  },
  outlets: ['signal'],
  compile: (inputs, nodeId) => {
    const a = inputs.a;
    const b = inputs.b;
    const op = inputs.operation ?? 'eq';
    const operation = OPERATIONS[op] || OPERATIONS.eq;

    // Wrap numbers in el.const
    const signalA = typeof a === 'number'
      ? el.const({ key: `${nodeId}:a`, value: a })
      : a;
    const signalB = typeof b === 'number'
      ? el.const({ key: `${nodeId}:b`, value: b })
      : b;

    return {
      signal: operation.fn(signalA, signalB)
    };
  }
};

export function CompareNode({ id, selected }) {
  const { data, updateParam } = useNodeData(id);
  const operation = data.operation ?? 'eq';
  const opInfo = OPERATIONS[operation];

  return (
    <div className={`audio-node compare ${selected ? 'selected' : ''}`}>
      <div className="node-header">Compare</div>
      <div className="node-content nodrag">
        <div className="param-row">
          <Handle
            type="target"
            position={Position.Left}
            id="a"
            className="handle inlet"
          />
          <label>A</label>
          <input
            type="number"
            value={data.a ?? 0}
            onChange={e => updateParam('a', parseFloat(e.target.value) || 0)}
            step="any"
            style={{ width: '60px' }}
          />
        </div>

        <div className="param-row">
          <Handle
            type="target"
            position={Position.Left}
            id="b"
            className="handle inlet"
          />
          <label>B</label>
          <input
            type="number"
            value={data.b ?? 0}
            onChange={e => updateParam('b', parseFloat(e.target.value) || 0)}
            step="any"
            style={{ width: '60px' }}
          />
        </div>

        <div className="param-row">
          <label>op</label>
          <select
            value={operation}
            onChange={e => updateParam('operation', e.target.value)}
          >
            {Object.entries(OPERATIONS).map(([key, { symbol }]) => (
              <option key={key} value={key}>
                {symbol} ({key})
              </option>
            ))}
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
