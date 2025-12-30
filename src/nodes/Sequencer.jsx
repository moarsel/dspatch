// Sequencer.jsx - Simple 8-step MIDI note sequencer
import { el } from '@elemaudio/core';
import { Handle, Position } from '@xyflow/react';
import { useNodeData } from '../engine/useGraph';
import { subscribe, unsubscribe } from '../engine/audioContext';
import { useEffect, useState, useRef, useCallback } from 'react';
import { NodeCard, NodeContent, ParamRow, InletHandle } from '../components';

const NUM_STEPS = 8;
const DEFAULT_STEPS = [60, 64, 67, 72, 67, 64, 60, 55]; // C major arpeggio
const MIN_NOTE = 36; // C2
const MAX_NOTE = 96; // C7

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

    // Get step values from node data (MIDI notes)
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
  const [dragging, setDragging] = useState(null); // { index, startY, startValue }
  const containerRef = useRef(null);

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

  const handleMouseDown = useCallback((e, index) => {
    e.stopPropagation();
    const startValue = steps[index];
    setDragging({ index, startY: e.clientY, startValue });
  }, [steps]);

  useEffect(() => {
    if (dragging === null) return;

    const handleMouseMove = (e) => {
      const deltaY = dragging.startY - e.clientY; // Invert: drag up = increase
      const sensitivity = 1; // 1 MIDI note per pixel
      const newValue = Math.round(
        Math.min(MAX_NOTE, Math.max(MIN_NOTE, dragging.startValue + deltaY * sensitivity))
      );
      updateParam(`step${dragging.index}`, newValue);
    };

    const handleMouseUp = () => {
      setDragging(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, updateParam]);

  // Convert MIDI note to height percentage
  const noteToHeight = (note) => {
    return ((note - MIN_NOTE) / (MAX_NOTE - MIN_NOTE)) * 100;
  };

  const CONTAINER_HEIGHT = 48; // pixels

  return (
    <NodeCard type="sequencer" selected={selected} headerClassName="bg-indigo-400 ">
      <NodeContent>
        <ParamRow>
          <InletHandle id="trigger" />
          <label className="w-8 text-gray-500 text-xs uppercase font-semibold">trig</label>
        </ParamRow>

        <ParamRow>
          <InletHandle id="reset" />
          <label className="w-8 text-gray-500 text-xs uppercase font-semibold">reset</label>
        </ParamRow>

        <div
          ref={containerRef}
          className="flex gap-0.5 mt-2 p-1 bg-gray-800 rounded items-end"
          style={{ height: CONTAINER_HEIGHT + 8 }} // +8 for padding
        >
          {steps.map((value, i) => {
            const isActive = currentStep === i;
            const heightPercent = noteToHeight(value);
            return (
              <button
                key={i}
                onMouseDown={(e) => handleMouseDown(e, i)}
                className={`nodrag w-4 rounded cursor-ns-resize transition-colors select-none border-0 ${
                  isActive
                    ? 'bg-pink-500 shadow-lg shadow-pink-500/60'
                    : 'bg-indigo-500 hover:bg-indigo-400'
                }`}
                style={{
                  height: `${Math.max(4, heightPercent)}%`,
                  minHeight: 4
                }}
                title={`Note: ${value}`}
              />
            );
          })}
        </div>

        <div className="flex justify-between text-xs text-gray-600 mt-0.5 px-1">
          {steps.map((value, i) => (
            <span
              key={i}
              className={`w-4 text-center transition-colors ${currentStep === i ? 'text-pink-500' : ''}`}
            >
              {value}
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
