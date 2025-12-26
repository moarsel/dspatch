// LFO.jsx - Low Frequency Oscillator for modulation
import { el } from '@elemaudio/core';
import { Handle, Position } from 'reactflow';
import { useNodeData } from '../engine/useGraph';
import { formatFixed } from '../engine/format';
import { NodeCard, NodeContent, ParamRow, RangeInput, SelectInput, ValueDisplay } from '../components';

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
    <NodeCard type="lfo" selected={selected} headerClassName="bg-pink-400 ">
      <NodeContent>
        <ParamRow>
          <Handle
            type="target"
            position={Position.Left}
            id="rate"
            className="handle inlet"
          />
          <RangeInput
            label="rate"
            value={data.rate ?? 1}
            onChange={e => updateParam('rate', parseFloat(e.target.value))}
            min="0.1"
            max="20"
            step="0.1"
          />
          <ValueDisplay value={`${formatFixed(data.rate ?? 1, 1)}Hz`} />
        </ParamRow>

        <ParamRow>
          <Handle
            type="target"
            position={Position.Left}
            id="depth"
            className="handle inlet"
          />
          <RangeInput
            label="depth"
            value={data.depth ?? 1}
            onChange={e => updateParam('depth', parseFloat(e.target.value))}
            min="0"
            max="1"
            step="0.01"
          />
          <ValueDisplay value={data.depth ?? 1} />
        </ParamRow>

        <ParamRow>
          <SelectInput
            label="wave"
            value={data.waveform ?? 'sine'}
            onChange={e => updateParam('waveform', e.target.value)}
            options={[
              { value: 'sine', label: 'Sine' },
              { value: 'saw', label: 'Saw' },
              { value: 'square', label: 'Square' },
              { value: 'triangle', label: 'Triangle' },
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
