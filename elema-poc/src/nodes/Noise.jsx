// Noise.jsx - White/Pink noise generator node
import { el } from '@elemaudio/core';
import { Handle, Position } from 'reactflow';
import { useNodeData } from '../engine/useGraph';

export const descriptor = {
  type: 'noise',
  inlets: {
    gain: { default: 0.5 },
  },
  outlets: ['signal'],
  compile: (inputs, nodeId) => {
    const gain = inputs.gain;
    const noiseType = inputs.noiseType ?? 'white';

    // Generate noise based on type
    const whiteNoise = el.noise();
    let noise;
    switch (noiseType) {
      case 'pink':
        // Approximate pink noise by filtering white noise through a lowpass
        // This rolls off the high frequencies like real pink noise
        noise = el.lowpass(800, 0.5, whiteNoise);
        break;
      case 'white':
      default:
        noise = whiteNoise;
    }

    return {
      signal: el.mul(noise, gain)
    };
  }
};

export function NoiseNode({ id, selected }) {
  const { data, updateParam } = useNodeData(id);

  return (
    <div className={`audio-node noise ${selected ? 'selected' : ''}`}>
      <div className="node-header">Noise</div>
      <div className="node-content nodrag">
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
          <span className="value">{(data.gain ?? 0.5).toFixed(2)}</span>
        </div>

        <div className="param-row">
          <label>type</label>
          <select
            value={data.noiseType ?? 'white'}
            onChange={e => updateParam('noiseType', e.target.value)}
          >
            <option value="white">White</option>
            <option value="pink">Pink</option>
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
