// Filter.jsx - State Variable Filter (lowpass, highpass, bandpass)
import { el } from '@elemaudio/core';
import { Handle, Position } from '@xyflow/react';
import { useNodeData } from '../engine/useGraph';
import { formatFixed } from '../engine/format';
import { NodeCard, NodeContent, ParamRow, RangeInput, SelectInput, ValueDisplay, InletHandle } from '../components';

export const descriptor = {
  type: 'filter',
  inlets: {
    input: { default: 0 },
    cutoff: { default: 1000 },
    q: { default: 1 },
  },
  outlets: ['signal'],
  compile: (inputs, nodeId) => {
    const input = inputs.input;
    const filterType = inputs.filterType ?? 'lowpass';

    // If no input signal, return silence
    if (typeof input === 'number' && input === 0) {
      return { signal: el.const({ key: `${nodeId}:silence`, value: 0 }) };
    }

    // Ensure cutoff and q are signals (wrap numbers in const)
    const cutoff = typeof inputs.cutoff === 'number'
      ? el.const({ key: `${nodeId}:cutoff`, value: inputs.cutoff })
      : inputs.cutoff;
    const q = typeof inputs.q === 'number'
      ? el.const({ key: `${nodeId}:q`, value: inputs.q })
      : inputs.q;

    // el.svf takes props with mode property
    const signal = el.svf({ mode: filterType }, cutoff, q, input);

    return { signal };
  }
};

export function FilterNode({ id, selected }) {
  const { data, updateParam } = useNodeData(id);

  return (
    <NodeCard type="filter" selected={selected} headerClassName="bg-blue-500 text-white">
      <NodeContent>
        <ParamRow>
          <InletHandle id="input" />
          <label className="w-16 text-gray-500 text-xs uppercase font-semibold">input</label>
        </ParamRow>

        <ParamRow>
          <InletHandle id="cutoff" />
          <RangeInput
            label="cut"
            value={data.cutoff ?? 1000}
            onChange={e => updateParam('cutoff', parseFloat(e.target.value))}
            min="20"
            max="20000"
            step="1"
          />
          <ValueDisplay value={`${Math.round(data.cutoff ?? 1000)}Hz`} />
        </ParamRow>

        <ParamRow>
          <InletHandle id="q" />
          <RangeInput
            label="Q"
            value={data.q ?? 1}
            onChange={e => updateParam('q', parseFloat(e.target.value))}
            min="0.1"
            max="70"
            step="0.1"
          />
          <ValueDisplay value={data.q ?? 1} />
        </ParamRow>

        <ParamRow>
          <SelectInput
            label="type"
            value={data.filterType ?? 'lowpass'}
            onChange={e => updateParam('filterType', e.target.value)}
            options={[
              { value: 'lowpass', label: 'Low' },
              { value: 'highpass', label: 'High' },
              { value: 'bandpass', label: 'Band' },
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
