// LFO.jsx - Low Frequency Oscillator for modulation
import { el } from '@elemaudio/core';
import { Handle, Position } from 'reactflow';
import { useNodeData } from '../engine/useGraph';

export const descriptor = {
  type: 'lfo',
  inlets: {
    rate: { default: 1 },
    depth: { default: 1 },
  },
  outlets: ['signal'],
  compile: (inputs, nodeId) => {
    const rate = inputs.rate;
    const depth = inputs.depth;
    const waveform = inputs.waveform ?? 'sine';

    // Select oscillator type for LFO
    let osc;
    switch (waveform) {
      case 'saw':
        osc = el.saw(rate);
        break;
      case 'square':
        osc = el.square(rate);
        break;
      case 'triangle':
        osc = el.triangle(rate);
        break;
      case 'sine':
      default:
        osc = el.cycle(rate);
    }

    // LFO output is bipolar (-1 to 1), scaled by depth
    return {
      signal: el.mul(osc, depth)
    };
  }
};

export function LFONode({ id, selected }) {
  const { data, updateParam } = useNodeData(id);

  return (
    <div className={`audio-node lfo ${selected ? 'selected' : ''}`}>
      <div className="node-header">LFO</div>
      <div className="node-content nodrag">
        <div className="param-row">
          <Handle
            type="target"
            position={Position.Left}
            id="rate"
            className="handle inlet"
          />
          <label>rate</label>
          <input
            type="range"
            value={data.rate ?? 1}
            onChange={e => updateParam('rate', parseFloat(e.target.value))}
            min="0.1"
            max="20"
            step="0.1"
          />
          <span className="value">{(data.rate ?? 1).toFixed(1)}Hz</span>
        </div>

        <div className="param-row">
          <Handle
            type="target"
            position={Position.Left}
            id="depth"
            className="handle inlet"
          />
          <label>depth</label>
          <input
            type="range"
            value={data.depth ?? 1}
            onChange={e => updateParam('depth', parseFloat(e.target.value))}
            min="0"
            max="1"
            step="0.01"
          />
          <span className="value">{(data.depth ?? 1).toFixed(2)}</span>
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
