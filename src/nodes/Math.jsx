// Math.jsx - Mathematical operations node
import { el } from '@elemaudio/core';
import { Handle, Position } from '@xyflow/react';
import { useNodeData } from '../engine/useGraph';
import { useSignalValue } from '../engine/useSignalValue';
import { NodeCard, NodeContent, ParamRow, NumberInput, SelectInput, InletHandle } from '../components';

const OPERATIONS = {
  add: { symbol: '+', fn: (a, b) => el.add(a, b) },
  subtract: { symbol: '-', fn: (a, b) => el.sub(a, b) },
  multiply: { symbol: '*', fn: (a, b) => el.mul(a, b) },
  divide: { symbol: '/', fn: (a, b) => el.div(a, b) },
  modulo: { symbol: '%', fn: (a, b) => el.mod(a, b) },
  power: { symbol: '^', fn: (a, b) => el.pow(a, b) },
  min: { symbol: 'min', fn: (a, b) => el.min(a, b) },
  max: { symbol: 'max', fn: (a, b) => el.max(a, b) },
};

export const descriptor = {
  type: 'math',
  inlets: {
    a: { default: 0 },
    b: { default: 0 },
  },
  outlets: ['signal'],
  compile: (inputs, nodeId) => {
    const op = inputs.operation ?? 'add';
    const operation = OPERATIONS[op] || OPERATIONS.add;

    // Elementary handles numbers automatically
    const result = operation.fn(inputs.a ?? 0, inputs.b ?? 0);

    return {
      signal: el.meter({ name: nodeId }, result)
    };
  }
};

export function MathNode({ id, selected }) {
  const { data, updateParam } = useNodeData(id);
  const { display } = useSignalValue(id);
  const operation = data.operation ?? 'add';

  return (
    <NodeCard type="math" selected={selected} headerClassName="bg-gray-400 ">
      <NodeContent>
        <ParamRow>
          <InletHandle id="a" />
          <NumberInput
            label="A"
            value={data.a ?? 0}
            onChange={e => updateParam('a', parseFloat(e.target.value) || 0)}
            step="any"
          />
        </ParamRow>

        <ParamRow>
          <InletHandle id="b" />
          <NumberInput
            label="B"
            value={data.b ?? 0}
            onChange={e => updateParam('b', parseFloat(e.target.value) || 0)}
            step="any"
          />
        </ParamRow>

        <ParamRow>
          <SelectInput
            label="op"
            value={operation}
            onChange={e => updateParam('operation', e.target.value)}
            options={Object.entries(OPERATIONS).map(([key, { symbol }]) => ({
              value: key,
              label: `${symbol} (${key})`
            }))}
          />
        </ParamRow>

        <div className="text-center text-xs font-mono font-bold text-cyan-400 mt-1 p-1 bg-gray-950 rounded">
          = {display}
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
