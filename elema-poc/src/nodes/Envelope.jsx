// Envelope.jsx - ADSR envelope generator
import { el } from '@elemaudio/core';
import { Handle, Position } from 'reactflow';
import { useNodeData } from '../engine/useGraph';
import { useSignalValue } from '../engine/useSignalValue';
import { formatFixed } from '../engine/format';

export const descriptor = {
  type: 'envelope',
  inlets: {
    gate: { default: 0 },
    attack: { default: 0.01 },
    decay: { default: 0.1 },
    sustain: { default: 0.7 },
    release: { default: 0.3 },
  },
  outlets: ['signal'],
  compile: (inputs, nodeId) => {
    // Elementary handles numbers automatically
    const env = el.adsr(
      inputs.attack ?? 0.01,
      inputs.decay ?? 0.1,
      inputs.sustain ?? 0.7,
      inputs.release ?? 0.3,
      inputs.gate ?? 0
    );

    return {
      signal: el.meter({ name: nodeId }, env)
    };
  }
};

export function EnvelopeNode({ id, selected }) {
  const { data, updateParam } = useNodeData(id);
  const { value: envValue, display } = useSignalValue(id);
  const gateActive = data.gate || envValue > 0.01;

  return (
    <div className={`audio-node envelope ${selected ? 'selected' : ''}`}>
      <div className="node-header">Envelope</div>
      <div className="node-content nodrag">
        <div className="param-row">
          <Handle
            type="target"
            position={Position.Left}
            id="gate"
            className="handle inlet"
          />
          <label>gate</label>
          <button
            className={`gate-button ${gateActive ? 'active' : ''}`}
            onMouseDown={(e) => { e.stopPropagation(); updateParam('gate', 1); }}
            onMouseUp={(e) => { e.stopPropagation(); updateParam('gate', 0); }}
            onMouseLeave={() => updateParam('gate', 0)}
          >
            {gateActive ? 'ON' : 'OFF'}
          </button>
          <span style={{
            fontSize: '10px',
            fontFamily: 'monospace',
            color: '#81ecec',
            marginLeft: '4px'
          }}>
            {display}
          </span>
        </div>

        <div className="param-row">
          <Handle
            type="target"
            position={Position.Left}
            id="attack"
            className="handle inlet"
          />
          <label>A</label>
          <input
            type="range"
            value={data.attack ?? 0.01}
            onChange={e => updateParam('attack', parseFloat(e.target.value))}
            min="0.001"
            max="2"
            step="0.001"
          />
          <span className="value">{formatFixed(data.attack ?? 0.01, 3)}s</span>
        </div>

        <div className="param-row">
          <Handle
            type="target"
            position={Position.Left}
            id="decay"
            className="handle inlet"
          />
          <label>D</label>
          <input
            type="range"
            value={data.decay ?? 0.1}
            onChange={e => updateParam('decay', parseFloat(e.target.value))}
            min="0.001"
            max="2"
            step="0.001"
          />
          <span className="value">{formatFixed(data.decay ?? 0.1, 3)}s</span>
        </div>

        <div className="param-row">
          <Handle
            type="target"
            position={Position.Left}
            id="sustain"
            className="handle inlet"
          />
          <label>S</label>
          <input
            type="range"
            value={data.sustain ?? 0.7}
            onChange={e => updateParam('sustain', parseFloat(e.target.value))}
            min="0"
            max="1"
            step="0.01"
          />
          <span className="value">{formatFixed(data.sustain ?? 0.7, 2)}</span>
        </div>

        <div className="param-row">
          <Handle
            type="target"
            position={Position.Left}
            id="release"
            className="handle inlet"
          />
          <label>R</label>
          <input
            type="range"
            value={data.release ?? 0.3}
            onChange={e => updateParam('release', parseFloat(e.target.value))}
            min="0.001"
            max="5"
            step="0.001"
          />
          <span className="value">{formatFixed(data.release ?? 0.3, 3)}s</span>
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
