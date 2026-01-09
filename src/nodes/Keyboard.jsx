// Keyboard.jsx - Computer keyboard input for MIDI notes
import { useState, useEffect, useCallback } from 'react';
import { el } from '@elemaudio/core';
import { Handle, Position } from '@xyflow/react';
import { useNodeData } from '../engine/useGraph';
import { NodeCard, NodeContent, ParamRow } from '../components';

// QWERTY to MIDI note mapping (base octave C4 = 60)
const KEY_MAP = {
  // White keys (bottom row)
  'a': 60,  // C4
  's': 62,  // D4
  'd': 64,  // E4
  'f': 65,  // F4
  'g': 67,  // G4
  'h': 69,  // A4
  'j': 71,  // B4
  'k': 72,  // C5
  'l': 74,  // D5
  // Black keys (top row)
  'w': 61,  // C#4
  'e': 63,  // D#4
  't': 66,  // F#4
  'y': 68,  // G#4
  'u': 70,  // A#4
  'o': 73,  // C#5
  'p': 75,  // D#5
};

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function midiToNoteName(midi) {
  const octave = Math.floor(midi / 12) - 1;
  const noteIndex = midi % 12;
  return `${NOTE_NAMES[noteIndex]}${octave}`;
}

// Mini keyboard component
function MiniKeyboard({ pressedKeys }) {
  const whiteKeys = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k'];
  const blackKeys = [
    { key: 'w', left: 10 },   // C#
    { key: 'e', left: 26 },   // D#
    { key: null, left: 42 },  // gap (no E#)
    { key: 't', left: 58 },   // F#
    { key: 'y', left: 74 },   // G#
    { key: 'u', left: 90 },   // A#
  ];

  return (
    <div className="relative h-10 flex mt-2 nodrag">
      {/* White keys */}
      {whiteKeys.map((key) => (
        <div
          key={key}
          className={`w-4 h-10 border border-gray-600 rounded-b transition-colors ${
            pressedKeys.has(key) ? 'bg-pink-500' : 'bg-gray-200'
          }`}
        />
      ))}
      {/* Black keys */}
      {blackKeys.map(({ key, left }) =>
        key && (
          <div
            key={key}
            className={`absolute w-3 h-6 rounded-b transition-colors ${
              pressedKeys.has(key) ? 'bg-pink-500' : 'bg-gray-800'
            }`}
            style={{ left: `${left}px`, top: 0 }}
          />
        )
      )}
    </div>
  );
}

export const descriptor = {
  type: 'keyboard',
  inlets: {},
  outlets: ['note', 'gate'],
  compile: (inputs, nodeId) => {
    const currentNote = inputs.currentNote ?? 60;
    const currentGate = inputs.currentGate ?? 0;

    return {
      note: el.const({ key: `${nodeId}:note`, value: currentNote }),
      gate: el.const({ key: `${nodeId}:gate`, value: currentGate })
    };
  }
};

export function KeyboardNode({ id, selected }) {
  const { data, updateParam } = useNodeData(id);
  const [pressedKeys, setPressedKeys] = useState(new Set());

  const octaveOffset = data.octaveOffset ?? 0;
  const currentNote = data.currentNote ?? 60;
  const currentGate = data.currentGate ?? 0;

  const handleKeyDown = useCallback((e) => {
    // Ignore if typing in input field
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const key = e.key.toLowerCase();

    // Octave controls
    if (key === 'z') {
      updateParam('octaveOffset', Math.max(-4, octaveOffset - 1));
      return;
    }
    if (key === 'x') {
      updateParam('octaveOffset', Math.min(4, octaveOffset + 1));
      return;
    }

    // Note keys
    if (KEY_MAP[key] !== undefined) {
      e.preventDefault();
      if (pressedKeys.has(key)) return; // Ignore key repeat

      setPressedKeys(prev => new Set(prev).add(key));
      const midiNote = KEY_MAP[key] + (octaveOffset * 12);
      updateParam('currentNote', Math.max(0, Math.min(127, midiNote)));
      updateParam('currentGate', 1);
    }
  }, [octaveOffset, pressedKeys, updateParam]);

  const handleKeyUp = useCallback((e) => {
    const key = e.key.toLowerCase();

    if (KEY_MAP[key] !== undefined) {
      if (!pressedKeys.has(key)) return;

      const next = new Set(pressedKeys);
      next.delete(key);
      setPressedKeys(next);

      // Release gate if no keys pressed
      if (next.size === 0) {
        updateParam('currentGate', 0);
      }
    }
  }, [pressedKeys, updateParam]);

  // Add/remove keyboard listeners when enabled changes
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp, updateParam]);

  return (
    <NodeCard type="keyboard" selected={selected} headerClassName="bg-purple-500">
      <NodeContent>
         {/* Enable toggle
        <ParamRow centered>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`nodrag px-3 py-1.5 rounded text-xs font-bold transition-all ${
              enabled
                ? 'bg-green-500 text-gray-900 shadow-lg shadow-green-500/30'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            {enabled ? 'KEYS ON' : 'KEYS OFF'}
          </button>
        </ParamRow> */}
        {/* Current note display */}
        <ParamRow>
          <span className="text-xs text-gray-400 uppercase">note</span>
          <span className={`flex-1 text-center font-mono text-lg transition-colors ${
            currentGate ? 'text-pink-500' : 'text-gray-500'
          }`}>
            {midiToNoteName(currentNote)}
          </span>
          <span className="text-xs font-mono text-gray-500">
            {currentNote}
          </span>
        </ParamRow>

        {/* Octave control */}
        <ParamRow>
          <button
            onClick={() => updateParam('octaveOffset', Math.max(-4, octaveOffset - 1))}
            className="nodrag w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded text-xs"
          >
            -
          </button>
          <span className="flex-1 text-center text-xs text-gray-400">
            Oct: {octaveOffset >= 0 ? '+' : ''}{octaveOffset}
          </span>
          <button
            onClick={() => updateParam('octaveOffset', Math.min(4, octaveOffset + 1))}
            className="nodrag w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded text-xs"
          >
            +
          </button>
        </ParamRow>

        {/* Mini keyboard */}
        <MiniKeyboard pressedKeys={pressedKeys} />
      </NodeContent>

      {/* Outlets */}
      <ParamRow>
      <Handle
        type="source"
        position={Position.Right}
        id="note"
        className="handle outlet"
      />
      </ParamRow>
      <ParamRow>
      <Handle
        type="source"
        position={Position.Right}
        id="gate"
        className="handle outlet"
      />
      </ParamRow>
    </NodeCard>
  );
}
