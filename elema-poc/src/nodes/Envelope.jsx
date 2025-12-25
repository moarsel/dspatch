// Envelope.jsx - ADSR envelope generator
import { el } from '@elemaudio/core';
import { Handle, Position } from 'reactflow';
import { useNodeData } from '../engine/useGraph';

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
    const gate = inputs.gate;
    const attack = inputs.attack;
    const decay = inputs.decay;
    const sustain = inputs.sustain;
    const release = inputs.release;

    // Gate needs to be a signal - if it's a number, make it a const
    const gateSignal = typeof gate === 'number'
      ? el.const({ key: `${nodeId}:gate`, value: gate })
      : gate;

    return {
      signal: el.adsr(attack, decay, sustain, release, gateSignal)
    };
  }
};

export function EnvelopeNode({ id, selected }) {
  const { data, updateParam } = useNodeData(id);

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
            className={`gate-button ${data.gate ? 'active' : ''}`}
            onMouseDown={(e) => { e.stopPropagation(); updateParam('gate', 1); }}
            onMouseUp={(e) => { e.stopPropagation(); updateParam('gate', 0); }}
            onMouseLeave={() => updateParam('gate', 0)}
          >
            {data.gate ? 'ON' : 'OFF'}
          </button>
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
          <span className="value">{(data.attack ?? 0.01).toFixed(3)}s</span>
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
          <span className="value">{(data.decay ?? 0.1).toFixed(3)}s</span>
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
          <span className="value">{(data.sustain ?? 0.7).toFixed(2)}</span>
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
          <span className="value">{(data.release ?? 0.3).toFixed(3)}s</span>
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
