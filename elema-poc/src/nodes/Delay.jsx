// Delay.jsx - Simple delay effect with feedback
import { el } from '@elemaudio/core';
import { Handle, Position } from 'reactflow';
import { useNodeData } from '../engine/useGraph';

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
    <div className={`audio-node delay ${selected ? 'selected' : ''}`}>
      <div className="node-header">Delay</div>
      <div className="node-content">
        <div className="param-row">
          <Handle
            type="target"
            position={Position.Left}
            id="input"
            className="handle inlet audio"
          />
          <label>input</label>
        </div>

        <div className="param-row">
          <Handle
            type="target"
            position={Position.Left}
            id="time"
            className="handle inlet"
          />
          <label>time</label>
          <input
            type="range"
            value={data.time ?? 250}
            onChange={e => updateParam('time', parseFloat(e.target.value))}
            min="1"
            max="2000"
            step="1"
          />
          <span className="value">{Math.round(data.time ?? 250)}ms</span>
        </div>

        <div className="param-row">
          <Handle
            type="target"
            position={Position.Left}
            id="feedback"
            className="handle inlet"
          />
          <label>fb</label>
          <input
            type="range"
            value={data.feedback ?? 0.3}
            onChange={e => updateParam('feedback', parseFloat(e.target.value))}
            min="0"
            max="0.95"
            step="0.01"
          />
          <span className="value">{(data.feedback ?? 0.3).toFixed(2)}</span>
        </div>

        <div className="param-row">
          <Handle
            type="target"
            position={Position.Left}
            id="mix"
            className="handle inlet"
          />
          <label>mix</label>
          <input
            type="range"
            value={data.mix ?? 0.5}
            onChange={e => updateParam('mix', parseFloat(e.target.value))}
            min="0"
            max="1"
            step="0.01"
          />
          <span className="value">{(data.mix ?? 0.5).toFixed(2)}</span>
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
