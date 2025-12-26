// Metro.jsx - Metronome/pulse train node
import { el } from '@elemaudio/core';
import { Handle, Position } from 'reactflow';
import { useNodeData } from '../engine/useGraph';
import { useSignalHigh } from '../engine/useSignalValue';
import { formatFixed } from '../engine/format';

export const descriptor = {
  type: 'metro',
  inlets: {
    bpm: { default: 120 },
  },
  outlets: ['signal'],
  compile: (inputs, nodeId) => {
    const bpm = inputs.bpm ?? 120;

    // Convert BPM to interval in milliseconds
    const bpmValue = typeof bpm === 'number' ? bpm : 120;
    const interval = 60000 / Math.max(1, bpmValue);

    return {
      signal: el.meter({ name: nodeId }, el.metro({ interval }))
    };
  }
};

export function MetroNode({ id, selected }) {
  const { data, updateParam } = useNodeData(id);
  const bpm = data.bpm ?? 120;
  const hz = bpm / 60;
  const isActive = useSignalHigh(id);

  return (
    <div className={`audio-node metro ${selected ? 'selected' : ''}`}>
      <div className="node-header">Metro</div>
      <div className="node-content nodrag">
        <div className="param-row">
          <Handle
            type="target"
            position={Position.Left}
            id="bpm"
            className="handle inlet"
          />
          <label>bpm</label>
          <input
            type="number"
            value={bpm}
            onChange={e => updateParam('bpm', parseFloat(e.target.value) || 120)}
            min="1"
            max="999"
            step="1"
            style={{ width: '50px' }}
          />
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: isActive ? '#e84393' : '#333',
              marginLeft: '8px',
              boxShadow: isActive ? '0 0 8px #e84393' : 'none',
              transition: 'background 0.05s, box-shadow 0.05s'
            }}
          />
        </div>

        <div style={{
          textAlign: 'right',
          fontSize: '9px',
          fontFamily: 'monospace',
          color: '#666',
          marginTop: '2px'
        }}>
          {formatFixed(hz, 2)} Hz
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
