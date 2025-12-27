// Bang.jsx - Trigger node that outputs a gate signal
import { el } from '@elemaudio/core';
import { Handle, Position } from '@xyflow/react';
import { useNodeData } from '../engine/useGraph';
import { useSignalHigh } from '../engine/useSignalValue';
import { NodeCard, NodeContent, ParamRow, BangButton, InletHandle } from '../components';

export const descriptor = {
  type: 'bang',
  inlets: {
    gate: { default: 0 },
  },
  outlets: ['signal'],
  compile: (inputs, nodeId) => {
    // Elementary handles numbers automatically - no need to wrap in el.const
    return {
      signal: el.meter({ name: nodeId }, inputs.gate ?? 0)
    };
  }
};

export function BangNode({ id, selected }) {
  const { data, updateParam } = useNodeData(id);
  const isActive = useSignalHigh(id);

  // Button is active if manually pressed OR receiving high signal
  const showActive = data.gate || isActive;

  return (
    <NodeCard type="bang" selected={selected} headerClassName="bg-pink-500 text-white">
      <NodeContent>
        <ParamRow centered>
          <InletHandle id="gate" />
          <BangButton
            active={showActive}
            onMouseDown={(e) => {
              e.stopPropagation();
              updateParam('gate', 1);
            }}
            onMouseUp={(e) => {
              e.stopPropagation();
              updateParam('gate', 0);
            }}
            onMouseLeave={() => updateParam('gate', 0)}
          />
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
