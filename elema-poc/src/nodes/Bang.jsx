// Bang.jsx - Trigger node that outputs a gate signal
import { el } from '@elemaudio/core';
import { Handle, Position } from 'reactflow';
import { useNodeData } from '../engine/useGraph';

export const descriptor = {
  type: 'bang',
  inlets: {
    gate: { default: 0 },
  },
  outlets: ['signal'],
  compile: (inputs, nodeId) => {
    const gate = inputs.gate ?? 0;
    return {
      signal: el.const({ key: `${nodeId}:gate`, value: gate })
    };
  }
};

export function BangNode({ id, selected }) {
  const { data, updateParam } = useNodeData(id);

  return (
    <div className={`audio-node bang ${selected ? 'selected' : ''}`}>
      <div className="node-header">Bang</div>
      <div className="node-content nodrag">
        <div className="param-row center">
          <button
            className={`bang-button ${data.gate ? 'active' : ''}`}
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
