// Math.jsx - Mathematical operations node with hot/cold inlet semantics
// Hot inlet (a): Primary input - triggers computation in event-based systems
// Cold inlet (b): Operand - stores value for use when hot inlet triggers
// In continuous signal flow, both are computed every sample
import { el } from '@elemaudio/core';
import { Handle, Position } from 'reactflow';
import { useNodeData } from '../engine/useGraph';

const OPERATIONS = {
  add: { symbol: '+', fn: (a, b) => el.add(a, b), numFn: (a, b) => a + b },
  subtract: { symbol: '-', fn: (a, b) => el.sub(a, b), numFn: (a, b) => a - b },
  multiply: { symbol: '*', fn: (a, b) => el.mul(a, b), numFn: (a, b) => a * b },
  divide: { symbol: '/', fn: (a, b) => el.div(a, b), numFn: (a, b) => b !== 0 ? a / b : 0 },
  modulo: { symbol: '%', fn: (a, b) => el.mod(a, b), numFn: (a, b) => b !== 0 ? a % b : 0 },
  power: { symbol: '^', fn: (a, b) => el.pow(a, b), numFn: (a, b) => Math.pow(a, b) },
  min: { symbol: 'min', fn: (a, b) => el.min(a, b), numFn: (a, b) => Math.min(a, b) },
  max: { symbol: 'max', fn: (a, b) => el.max(a, b), numFn: (a, b) => Math.max(a, b) },
};

export const descriptor = {
  type: 'math',
  inlets: {
    a: { default: 0 },  // Hot inlet
    b: { default: 0 },  // Cold inlet
  },
  outlets: ['signal'],
  compile: (inputs, nodeId) => {
    const a = inputs.a;
    const b = inputs.b;
    const op = inputs.operation ?? 'add';
    const operation = OPERATIONS[op] || OPERATIONS.add;

    const aIsNum = typeof a === 'number';
    const bIsNum = typeof b === 'number';

    // Both are numbers - compute directly and output constant
    if (aIsNum && bIsNum) {
      const result = operation.numFn(a, b);
      return {
        signal: el.const({ key: `${nodeId}:result`, value: result })
      };
    }

    // At least one is a signal - wrap numbers in el.const and use signal operation
    const signalA = aIsNum
      ? el.const({ key: `${nodeId}:a`, value: a })
      : a;
    const signalB = bIsNum
      ? el.const({ key: `${nodeId}:b`, value: b })
      : b;

    return {
      signal: operation.fn(signalA, signalB)
    };
  }
};

export function MathNode({ id, selected }) {
  const { data, updateParam } = useNodeData(id);
  const operation = data.operation ?? 'add';
  const opInfo = OPERATIONS[operation];

  return (
    <div className={`audio-node math ${selected ? 'selected' : ''}`}>
      <div className="node-header">Math</div>
      <div className="node-content nodrag">
        <div className="param-row">
          <Handle
            type="target"
            position={Position.Left}
            id="a"
            className="handle inlet"
            style={{ background: '#ff6b6b' }} // Hot inlet indicator
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
            style={{ background: '#45b7d1' }} // Cold inlet indicator
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
