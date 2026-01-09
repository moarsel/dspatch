// Oscillator.jsx - Sine/Saw/Square/Triangle oscillator node
import { el } from '@elemaudio/core';
import { Handle, Position } from '@xyflow/react';
import { useNodeData } from '../engine/useGraph';
import { NodeCard, NodeContent, ParamRow, NumberInput, RangeInput, SelectInput, ValueDisplay, InletHandle } from '../components';

export const descriptor = {
  type: 'oscillator',
  inlets: {
    frequency: { default: 440 },
    gain: { default: 0.5 },
  },
  outlets: ['signal'],
  compile: (inputs, _nodeId) => {
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
    <NodeCard type="oscillator" selected={selected} category="source">
      <NodeContent>
        <ParamRow>
          <InletHandle id="frequency" />
          <NumberInput
            label="freq"
            value={data.frequency ?? 440}
            onChange={e => updateParam('frequency', parseFloat(e.target.value) || 440)}
            min="20"
            max="20000"
            step="1"
          />
        </ParamRow>

        <ParamRow>
          <InletHandle id="gain" />
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
            label="wave"
            value={data.waveform ?? 'sine'}
            onChange={e => updateParam('waveform', e.target.value)}
            options={[
              { value: 'sine', label: 'sine' },
              { value: 'saw', label: 'saw' },
              { value: 'square', label: 'square' },
              { value: 'triangle', label: 'tri' },
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
