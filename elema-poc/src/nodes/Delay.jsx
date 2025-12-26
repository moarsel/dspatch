// Delay.jsx - Simple delay effect with feedback
import { el } from '@elemaudio/core';
import { Handle, Position } from 'reactflow';
import { useNodeData } from '../engine/useGraph';
import { formatFixed } from '../engine/format';
import { NodeCard, NodeContent, ParamRow, RangeInput, ValueDisplay } from '../components';

export const descriptor = {
  type: 'delay',
  inlets: {
    input: { default: 0 },
    time: { default: 250 },
    feedback: { default: 0.3 },
    mix: { default: 0.5 },
  },
  outlets: ['signal'],
  compile: (inputs, nodeId) => {
    const input = inputs.input;
    const timeMs = inputs.time;
    const feedback = inputs.feedback;
    const mix = inputs.mix;

    // If no input signal, return silence
    if (typeof input === 'number' && input === 0) {
      return { signal: el.const({ key: `${nodeId}:silence`, value: 0 }) };
    }

    // Convert ms to samples (assuming 44100 sample rate)
    // el.ms2samps would be ideal but we'll use a simple calculation
    const sampleRate = 44100;
    const delaySamples = (timeMs / 1000) * sampleRate;

    // Max delay of 2 seconds
    const maxDelaySamples = 2 * sampleRate;

    // Simple delay with feedback using sdelay (single sample delay line)
    // For a proper feedback delay, we'd use tapIn/tapOut, but sdelay works for basic cases
    const delayed = el.delay(
      { size: maxDelaySamples },
      el.ms2samps(timeMs),
      feedback,
      input
    );

    // Mix dry and wet
    const dry = el.mul(input, el.sub(1, mix));
    const wet = el.mul(delayed, mix);

    return {
      signal: el.add(dry, wet)
    };
  }
};

export function DelayNode({ id, selected }) {
  const { data, updateParam } = useNodeData(id);

  return (
    <NodeCard type="delay" selected={selected} headerClassName="bg-purple-600 text-white">
      <NodeContent>
        <ParamRow>
          <Handle
            type="target"
            position={Position.Left}
            id="input"
            className="handle inlet"
          />
          <label className="w-16 text-gray-500 text-xs uppercase font-semibold">input</label>
        </ParamRow>

        <ParamRow>
          <Handle
            type="target"
            position={Position.Left}
            id="time"
            className="handle inlet"
          />
          <RangeInput
            label="time"
            value={data.time ?? 250}
            onChange={e => updateParam('time', parseFloat(e.target.value))}
            min="1"
            max="2000"
            step="1"
          />
          <ValueDisplay value={`${Math.round(data.time ?? 250)}ms`} />
        </ParamRow>

        <ParamRow>
          <Handle
            type="target"
            position={Position.Left}
            id="feedback"
            className="handle inlet"
          />
          <RangeInput
            label="fb"
            value={data.feedback ?? 0.3}
            onChange={e => updateParam('feedback', parseFloat(e.target.value))}
            min="0"
            max="0.95"
            step="0.01"
          />
          <ValueDisplay value={data.feedback ?? 0.3} />
        </ParamRow>

        <ParamRow>
          <Handle
            type="target"
            position={Position.Left}
            id="mix"
            className="handle inlet"
          />
          <RangeInput
            label="mix"
            value={data.mix ?? 0.5}
            onChange={e => updateParam('mix', parseFloat(e.target.value))}
            min="0"
            max="1"
            step="0.01"
          />
          <ValueDisplay value={data.mix ?? 0.5} />
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
