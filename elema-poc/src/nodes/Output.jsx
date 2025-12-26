// Output.jsx - DAC output node (stereo)
import { el } from '@elemaudio/core';
import { Handle, Position } from 'reactflow';
import { useNodeData } from '../engine/useGraph';
import { NodeCard, NodeContent, ParamRow } from '../components';

export const descriptor = {
  type: 'output',
  inlets: {
    left: { default: 0 },
    right: { default: 0 },
  },
  outlets: [],
  compile: (inputs, nodeId) => {
    const left = inputs.left;
    const right = inputs.right;

    // Convert numbers to const nodes if needed
    const leftSignal = typeof left === 'number'
      ? el.const({ key: `${nodeId}:left`, value: left })
      : left;

    // If right is not connected, use left for both channels (mono)
    const rightSignal = typeof right === 'number' && right === 0
      ? leftSignal
      : (typeof right === 'number'
        ? el.const({ key: `${nodeId}:right`, value: right })
        : right);

    return {
      left: leftSignal,
      right: rightSignal
    };
  }
};

export function OutputNode({ id, selected }) {
  const { data, updateParam } = useNodeData(id);

  return (
    <NodeCard type="output" selected={selected} headerClassName="bg-green-500 text-gray-900">
      <NodeContent>
        <ParamRow>
          <Handle
            type="target"
            position={Position.Left}
            id="left"
            className="handle inlet audio"
          />
          <label className="w-12 text-gray-500 text-xs uppercase font-semibold">L</label>
        </ParamRow>

        <ParamRow>
          <Handle
            type="target"
            position={Position.Left}
            id="right"
            className="handle inlet audio"
          />
          <label className="w-12 text-gray-500 text-xs uppercase font-semibold">R</label>
        </ParamRow>
      </NodeContent>
    </NodeCard>
  );
}
