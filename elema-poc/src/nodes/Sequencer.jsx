// Sequencer.jsx - Simple 8-step gate sequencer
import { el } from '@elemaudio/core';
import { Handle, Position } from 'reactflow';
import { useNodeData } from '../engine/useGraph';
import { subscribe, unsubscribe } from '../engine/audioContext';
import { useEffect, useState, useRef } from 'react';

const NUM_STEPS = 8;
const DEFAULT_STEPS = [1, 0, 1, 0, 1, 0, 1, 0];

export const descriptor = {
  type: 'sequencer',
  inlets: {
    trigger: { default: 0 },
    reset: { default: 0 },
  },
  outlets: ['signal'],
  compile: (inputs, nodeId) => {
    const trigger = inputs.trigger;
    const reset = inputs.reset;

    // Get step values from node data (0 or 1)
    const steps = [];
    for (let i = 0; i < NUM_STEPS; i++) {
      steps.push(inputs[`step${i}`] ?? DEFAULT_STEPS[i]);
    }

    // Convert trigger to signal if needed
    const trigSignal = typeof trigger === 'number'
      ? el.const({ key: `${nodeId}:trigger`, value: trigger })
      : trigger;

    const resetSignal = typeof reset === 'number'
      ? el.const({ key: `${nodeId}:reset`, value: reset })
      : reset;

    // Create step index sequence (0, 1, 2, ..., 7) for tracking position
    const stepIndices = Array.from({ length: NUM_STEPS }, (_, i) => i / (NUM_STEPS - 1));

    // Use el.seq2 for step values
    const seq = el.seq2(
      { seq: steps, hold: true, loop: true },
      trigSignal,
      resetSignal
    );

    // Use a second seq2 for step position tracking
    const posSeq = el.seq2(
      { seq: stepIndices, hold: true, loop: true },
      trigSignal,
      resetSignal
    );

    // Combine: output = step value, but we also need position
    // We'll use meter on position and scope on output
    return {
      signal: el.add(
        seq,
        el.mul(el.const({ key: `${nodeId}:pos-scale`, value: 0 }),
          el.meter({ name: `${nodeId}:pos` }, posSeq))
      )
    };
  }
};

export function SequencerNode({ id, selected }) {
  const { data, updateParam } = useNodeData(id);
  const [currentStep, setCurrentStep] = useState(0);

  // Get step values
  const steps = [];
  for (let i = 0; i < NUM_STEPS; i++) {
    steps.push(data[`step${i}`] ?? DEFAULT_STEPS[i]);
  }

  useEffect(() => {
    // Subscribe to position meter
    subscribe('meter', `${id}:pos`, (meterData) => {
      // Convert normalized position back to step index
      const stepIndex = Math.round(meterData.max * (NUM_STEPS - 1));
      setCurrentStep(stepIndex);
    });

    return () => unsubscribe('meter', `${id}:pos`);
  }, [id]);

  const toggleStep = (i) => {
    const current = data[`step${i}`] ?? DEFAULT_STEPS[i];
    updateParam(`step${i}`, current > 0.5 ? 0 : 1);
  };

  return (
    <div className={`audio-node sequencer ${selected ? 'selected' : ''}`}>
      <div className="node-header">Seq</div>
      <div className="node-content nodrag">
        <div className="param-row">
          <Handle
            type="target"
            position={Position.Left}
            id="trigger"
            className="handle inlet"
            style={{ top: '40px' }}
          />
          <label>trig</label>
        </div>

        <div className="param-row">
          <Handle
            type="target"
            position={Position.Left}
            id="reset"
            className="handle inlet"
            style={{ top: '62px' }}
          />
          <label>reset</label>
        </div>

        <div style={{
          display: 'flex',
          gap: '3px',
          marginTop: '8px',
          padding: '4px',
          background: '#1a1a2e',
          borderRadius: '4px'
        }}>
          {steps.map((value, i) => {
            const isOn = value > 0.5;
            const isActive = currentStep === i;
            return (
              <button
                key={i}
                onClick={() => toggleStep(i)}
                style={{
                  width: '14px',
                  height: '24px',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  padding: 0,
                  background: isOn
                    ? (isActive ? '#e84393' : '#667eea')
                    : (isActive ? '#555' : '#2a2a3e'),
                  boxShadow: isActive ? '0 0 6px rgba(232, 67, 147, 0.6)' : 'none',
                  transition: 'background 0.05s'
                }}
              />
            );
          })}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '7px',
          color: '#666',
          marginTop: '2px',
          padding: '0 4px'
        }}>
          {steps.map((_, i) => (
            <span
              key={i}
              style={{
                color: currentStep === i ? '#e84393' : '#666',
                width: '14px',
                textAlign: 'center'
              }}
            >
              {i + 1}
            </span>
          ))}
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
