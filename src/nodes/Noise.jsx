// Noise.jsx - White/Pink noise generator node
import { el } from '@elemaudio/core';
import { Handle, Position } from 'reactflow';
import { useNodeData } from '../engine/useGraph';
import { formatFixed } from '../engine/format';
import { NodeCard, NodeContent, ParamRow, RangeInput, SelectInput, ValueDisplay } from '../components';

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
    <NodeCard type="noise" selected={selected} headerClassName="bg-gray-500 ">
      <NodeContent>
        <ParamRow>
          <Handle
            type="target"
            position={Position.Left}
            id="gain"
            className="handle inlet"
          />
          <RangeInput
            label="gain"
            value={data.gain ?? 0.5}
            onChange={e => updateParam('gain', parseFloat(e.target.value))}
            min="0"
            max="1"
            step="0.01"
          />
          <ValueDisplay value={data.gain ?? 0.5} />
        </ParamRow>

        <ParamRow>
          <SelectInput
            label="type"
            value={data.noiseType ?? 'white'}
            onChange={e => updateParam('noiseType', e.target.value)}
            options={[
              { value: 'white', label: 'White' },
              { value: 'pink', label: 'Pink' },
            ]}
          />
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
