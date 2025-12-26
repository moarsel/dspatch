// Sequencer.jsx - Simple 8-step gate sequencer
import { el } from '@elemaudio/core';
import { Handle, Position } from 'reactflow';
import { useNodeData } from '../engine/useGraph';
import { subscribe, unsubscribe } from '../engine/audioContext';
import { useEffect, useState } from 'react';
import { NodeCard, NodeContent, ParamRow } from '../components';

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
    <NodeCard type="sequencer" selected={selected} headerClassName="bg-indigo-400 ">
      <NodeContent>
        <ParamRow>
          <Handle
            type="target"
            position={Position.Left}
            id="trigger"
            className="handle inlet"
          />
          <label className="w-8 text-gray-500 text-xs uppercase font-semibold">trig</label>
        </ParamRow>

        <ParamRow>
          <Handle
            type="target"
            position={Position.Left}
            id="reset"
            className="handle inlet"
          />
          <label className="w-8 text-gray-500 text-xs uppercase font-semibold">reset</label>
        </ParamRow>

        <div className="flex gap-0.5 mt-2 p-1 bg-gray-800 rounded">
          {steps.map((value, i) => {
            const isOn = value > 0.5;
            const isActive = currentStep === i;
            return (
              <button
                key={i}
                onClick={() => toggleStep(i)}
                className={`w-3.5 h-6 border-0 rounded transition-colors ${
                  isOn
                    ? (isActive ? 'bg-pink-500 shadow-lg shadow-pink-500/60' : 'bg-indigo-500')
                    : (isActive ? 'bg-gray-600 shadow-lg shadow-pink-500/60' : 'bg-gray-700')
                }`}
              />
            );
          })}
        </div>

        <div className="flex justify-between text-xs text-gray-600 mt-0.5 px-1">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`w-3.5 text-center transition-colors ${currentStep === i ? 'text-pink-500' : ''}`}
            >
              {i + 1}
            </span>
          ))}
        </div>
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
