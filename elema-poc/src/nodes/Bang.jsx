// Bang.jsx - Trigger node that outputs a gate signal
import { el } from '@elemaudio/core';
import { Handle, Position } from 'reactflow';
import { useNodeData } from '../engine/useGraph';
import { useSignalHigh } from '../engine/useSignalValue';

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
    <div className={`audio-node bang ${selected ? 'selected' : ''}`}>
      <div className="node-header">Bang</div>
      <div className="node-content nodrag">
        <div className="param-row center">
          <Handle
            type="target"
            position={Position.Left}
            id="gate"
            className="handle inlet"
          />
          <button
            className={`bang-button ${showActive ? 'active' : ''}`}
            onMouseDown={(e) => {
              e.stopPropagation();
              updateParam('gate', 1);
            }}
            onMouseUp={(e) => {
              e.stopPropagation();
              updateParam('gate', 0);
            }}
            onMouseLeave={() => updateParam('gate', 0)}
          >
            ●
          </button>
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
