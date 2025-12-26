// Probe.jsx - Numeric signal inspector for debugging signal math
import { el } from '@elemaudio/core';
import { Handle, Position } from 'reactflow';
import { useSignalValue } from '../engine/useSignalValue';
import { NodeCard, NodeContent, ParamRow } from '../components';

export const descriptor = {
  type: 'probe',
  inlets: {
    input: { default: 0 },
  },
  outlets: ['signal'],
  compile: (inputs, nodeId) => {
    // Wrap in meter for visualization - Elementary handles numbers automatically
    return {
      signal: el.meter({ name: nodeId }, inputs.input ?? 0)
    };
  }
};

export function ProbeNode({ id, selected }) {
  const { display } = useSignalValue(id);

  return (
    <NodeCard type="probe" selected={selected} headerClassName="bg-cyan-300 ">
      <NodeContent>
        <ParamRow>
          <Handle
            type="target"
            position={Position.Left}
            id="input"
            className="handle inlet"
          />
          <div className="flex-1 text-center font-mono text-lg font-bold text-cyan-400 py-2">
            {display}
          </div>
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
