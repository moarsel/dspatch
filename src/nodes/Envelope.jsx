// Envelope.jsx - ADSR envelope generator
import { el } from '@elemaudio/core';
import { Handle, Position } from '@xyflow/react';
import { useNodeData } from '../engine/useGraph';
import { useSignalValue } from '../engine/useSignalValue';
import { formatFixed } from '../engine/format';
import { NodeCard, NodeContent, ParamRow, RangeInput, GateButton, ValueDisplay, InletHandle } from '../components';

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
    let gate;

    if (typeof inputs.gate === 'object') {
      // Signal from connected node  - use directly
      gate = inputs.gate;
    } else {
      gate = inputs.gate > 0 
          ? el.const({key: 'silence', value: 1}) 
          :  el.const({ key: "silence", value: 0 });
    }

    const env = el.adsr(
      inputs.attack ?? 0.01,
      inputs.decay ?? 0.1,
      inputs.sustain ?? 0.7,
      inputs.release ?? 0.3,
      gate
    );

    return {
      signal: el.meter({ name: nodeId }, env)
    };
  }
};

export function EnvelopeNode({ id, selected }) {
  const { data, updateParam } = useNodeData(id);
  const { value: envValue, display } = useSignalValue(id);
  const gateActive = data.gate || envValue >= 1;

  return (
    <NodeCard type="envelope" selected={selected} headerClassName="bg-yellow-400 ">
      <NodeContent>
        <ParamRow>
          <InletHandle id="gate" />
          <GateButton
            active={gateActive}
            onMouseDown={(e) => { e.stopPropagation(); updateParam('gate', 1); }}
            onMouseUp={(e) => { e.stopPropagation(); updateParam('gate', 0); }}
            onMouseLeave={() => updateParam('gate', 0)}
          />
          <span className="text-xs font-mono text-cyan-400 ml-1">
            {display}
          </span>
        </ParamRow>

        <ParamRow>
          <InletHandle id="attack" />
          <RangeInput
            label="A"
            value={data.attack ?? 0.01}
            onChange={e => updateParam('attack', parseFloat(e.target.value))}
            min="0.001"
            max="2"
            step="0.001"
          />
          <ValueDisplay value={`${formatFixed(data.attack ?? 0.01, 3)}s`} />
        </ParamRow>

        <ParamRow>
          <InletHandle id="decay" />
          <RangeInput
            label="D"
            value={data.decay ?? 0.1}
            onChange={e => updateParam('decay', parseFloat(e.target.value))}
            min="0.001"
            max="2"
            step="0.001"
          />
          <ValueDisplay value={`${formatFixed(data.decay ?? 0.1, 3)}s`} />
        </ParamRow>

        <ParamRow>
          <InletHandle id="sustain" />
          <RangeInput
            label="S"
            value={data.sustain ?? 0.7}
            onChange={e => updateParam('sustain', parseFloat(e.target.value))}
            min="0"
            max="1"
            step="0.01"
          />
          <ValueDisplay value={data.sustain ?? 0.7} />
        </ParamRow>

        <ParamRow>
          <InletHandle id="release" />
          <RangeInput
            label="R"
            value={data.release ?? 0.3}
            onChange={e => updateParam('release', parseFloat(e.target.value))}
            min="0.001"
            max="5"
            step="0.001"
          />
          <ValueDisplay value={`${formatFixed(data.release ?? 0.3, 3)}s`} />
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
