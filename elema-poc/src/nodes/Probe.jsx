// Probe.jsx - Numeric signal inspector for debugging signal math
import { el } from '@elemaudio/core';
import { Handle, Position } from 'reactflow';
import { useSignalValue } from '../engine/useSignalValue';

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
    <div className={`audio-node probe ${selected ? 'selected' : ''}`}>
      <div className="node-header">Probe</div>
      <div className="node-content nodrag">
        <div className="param-row">
          <Handle
            type="target"
            position={Position.Left}
            id="input"
            className="handle inlet"
          />
          <div style={{
            flex: 1,
            textAlign: 'center',
            fontFamily: 'monospace',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#81ecec',
            padding: '8px 4px'
          }}>
            {display}
          </div>
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
