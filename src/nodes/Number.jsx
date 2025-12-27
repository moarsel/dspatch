// Number.jsx - Constant value source node
import { el } from '@elemaudio/core';
import { Handle, Position } from '@xyflow/react';
import { useNodeData } from '../engine/useGraph';
import { useSignalValue } from '../engine/useSignalValue';
import { NodeCard, NodeContent, ParamRow, ValueDisplay, InletHandle } from '../components';

export const descriptor = {
  type: 'number',
  inlets: {
    value: { default: 0 },
  },
  outlets: ['signal'],
  compile: (inputs, nodeId) => {
    // Wrap in meter for visualization - Elementary handles numbers automatically
    return {
      signal: el.meter({ name: nodeId }, inputs.value ?? 0)
    };
  }
};

export function NumberNode({ id, selected }) {
  const { data, updateParam } = useNodeData(id);
  const { display } = useSignalValue(id);
  const inputValue = data.value ?? 0;

  return (
    <NodeCard type="number" selected={selected} headerClassName="bg-gray-600 text-white">
      <NodeContent>
        <ParamRow>
          <InletHandle id="value" />
          <input
            type="number"
            value={inputValue}
            onChange={e => updateParam('value', parseFloat(e.target.value) || 0)}
            step="any"
            className="w-16 px-1 py-1 bg-surface text-text-primary border border-gray-300 rounded text-xs font-mono
                   focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20
                   transition-colors duration-150"
          />
          <span className="text-xs font-mono text-cyan-500 ml-1">
            {display}
          </span>
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
