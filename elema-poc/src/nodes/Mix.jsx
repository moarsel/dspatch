// Mix.jsx - 2-input signal mixer
import { el } from '@elemaudio/core';
import { Handle, Position } from 'reactflow';
import { useNodeData } from '../engine/useGraph';

export const descriptor = {
  type: 'mix',
  inlets: {
    a: { default: 0 },
    b: { default: 0 },
    balance: { default: 0.5 },
  },
  outlets: ['signal'],
  compile: (inputs, nodeId) => {
    const a = inputs.a;
    const b = inputs.b;
    const balance = inputs.balance;

    // If both inputs are 0, return silence
    const aIsZero = typeof a === 'number' && a === 0;
    const bIsZero = typeof b === 'number' && b === 0;

    if (aIsZero && bIsZero) {
      return { signal: el.const({ key: `${nodeId}:silence`, value: 0 }) };
    }

    // Wrap numbers in const for consistent signal handling
    const signalA = aIsZero
      ? el.const({ key: `${nodeId}:a`, value: 0 })
      : a;
    const signalB = bIsZero
      ? el.const({ key: `${nodeId}:b`, value: 0 })
      : b;

    // Balance: 0 = all A, 0.5 = equal mix, 1 = all B
    const balanceSignal = typeof balance === 'number'
      ? el.const({ key: `${nodeId}:balance`, value: balance })
      : balance;

    // Crossfade between A and B based on balance
    const scaledA = el.mul(signalA, el.sub(1, balanceSignal));
    const scaledB = el.mul(signalB, balanceSignal);

    return {
      signal: el.add(scaledA, scaledB)
    };
  }
};

export function MixNode({ id, selected }) {
  const { data, updateParam } = useNodeData(id);

  return (
    <div className={`audio-node mix ${selected ? 'selected' : ''}`}>
      <div className="node-header">Mix</div>
      <div className="node-content nodrag">
        <div className="param-row">
          <Handle
            type="target"
            position={Position.Left}
            id="a"
            className="handle inlet audio"
          />
          <label>A</label>
        </div>

        <div className="param-row">
          <Handle
            type="target"
            position={Position.Left}
            id="b"
            className="handle inlet audio"
          />
          <label>B</label>
        </div>

        <div className="param-row">
          <Handle
            type="target"
            position={Position.Left}
            id="balance"
            className="handle inlet"
          />
          <label>bal</label>
          <input
            type="range"
            value={data.balance ?? 0.5}
            onChange={e => updateParam('balance', parseFloat(e.target.value))}
            min="0"
            max="1"
            step="0.01"
          />
          <span className="value">
            {data.balance === undefined || data.balance === 0.5
              ? '50/50'
              : data.balance < 0.5
                ? `A ${Math.round((1 - data.balance) * 100)}%`
                : `B ${Math.round(data.balance * 100)}%`}
          </span>
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
