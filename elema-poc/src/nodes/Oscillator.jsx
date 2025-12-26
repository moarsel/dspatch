// Oscillator.jsx - Sine/Saw/Square/Triangle oscillator node
import { el } from '@elemaudio/core';
import { Handle, Position } from 'reactflow';
import { useNodeData } from '../engine/useGraph';
import { formatFixed } from '../engine/format';

export const descriptor = {
  type: 'oscillator',
  inlets: {
    frequency: { default: 440 },
    gain: { default: 0.5 },
  },
  outlets: ['signal'],
  compile: (inputs, nodeId) => {
    const freq = inputs.frequency;
    const gain = inputs.gain;
    const waveform = inputs.waveform ?? 'sine';

    // Select oscillator type
    let osc;
    switch (waveform) {
      case 'saw':
        osc = el.saw(freq);
        break;
      case 'square':
        osc = el.square(freq);
        break;
      case 'triangle':
        osc = el.triangle(freq);
        break;
      case 'sine':
      default:
        osc = el.cycle(freq);
    }

    return {
      signal: el.mul(osc, gain)
    };
  }
};

export function OscillatorNode({ id, selected }) {
  const { data, updateParam } = useNodeData(id);

  return (
    <div className={`audio-node oscillator ${selected ? 'selected' : ''}`}>
      <div className="node-header">Oscillator</div>
      <div className="node-content nodrag">
        <div className="param-row">
          <Handle
            type="target"
            position={Position.Left}
            id="frequency"
            className="handle inlet"
          />
          <label>freq</label>
          <input
            type="number"
            value={data.frequency ?? 440}
            onChange={e => updateParam('frequency', parseFloat(e.target.value) || 440)}
            min="20"
            max="20000"
            step="1"
          />
        </div>

        <div className="param-row">
          <Handle
            type="target"
            position={Position.Left}
            id="gain"
            className="handle inlet"
          />
          <label>gain</label>
          <input
            type="range"
            value={data.gain ?? 0.5}
            onChange={e => updateParam('gain', parseFloat(e.target.value))}
            min="0"
            max="1"
            step="0.01"
          />
          <span className="value">{formatFixed(data.gain ?? 0.5, 2)}</span>
        </div>

        <div className="param-row">
          <label>wave</label>
          <select
            value={data.waveform ?? 'sine'}
            onChange={e => updateParam('waveform', e.target.value)}
          >
            <option value="sine">Sine</option>
            <option value="saw">Saw</option>
            <option value="square">Square</option>
            <option value="triangle">Triangle</option>
          </select>
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
