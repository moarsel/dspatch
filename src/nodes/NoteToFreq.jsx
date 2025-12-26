// NoteToFreq.jsx - MIDI note to frequency converter
import { el } from '@elemaudio/core';
import { Handle, Position } from 'reactflow';
import { useNodeData } from '../engine/useGraph';
import { formatFixed } from '../engine/format';
import { NodeCard, NodeContent, ParamRow, NumberInput, SelectInput, ValueDisplay } from '../components';

// Note names for the GUI selector
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Convert MIDI note to frequency: freq = 440 * 2^((note - 69) / 12)
function midiToFreq(note) {
  return 440 * Math.pow(2, (note - 69) / 12);
}

// Parse note name to MIDI number (e.g., "C4" -> 60, "A4" -> 69)
function noteNameToMidi(noteName) {
  const match = noteName.match(/^([A-G]#?)(-?\d+)$/);
  if (!match) return 60; // Default to C4
  const [, note, octave] = match;
  const noteIndex = NOTE_NAMES.indexOf(note);
  if (noteIndex === -1) return 60;
  return (parseInt(octave) + 1) * 12 + noteIndex;
}

// Convert MIDI number to note name
function midiToNoteName(midi) {
  const octave = Math.floor(midi / 12) - 1;
  const noteIndex = midi % 12;
  return `${NOTE_NAMES[noteIndex]}${octave}`;
}

export const descriptor = {
  type: 'notetofreq',
  inlets: {
    note: { default: 60 }, // MIDI note number input (can be signal or number)
  },
  outlets: ['frequency'],
  compile: (inputs, nodeId) => {
    const note = inputs.note;

    // If note is a signal, use el.pow for the conversion
    if (typeof note !== 'number') {
      // freq = 440 * 2^((note - 69) / 12)
      const exponent = el.div(el.sub(note, 69), 12);
      const freq = el.mul(440, el.pow(2, exponent));
      return { frequency: freq };
    }

    // For numeric input, calculate directly
    const freq = midiToFreq(note);
    return {
      frequency: el.const({ key: `${nodeId}:freq`, value: freq })
    };
  }
};

export function NoteToFreqNode({ id, selected }) {
  const { data, updateParam } = useNodeData(id);
  const currentNote = data.note ?? 60;
  const currentFreq = midiToFreq(currentNote);
  const octaves = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <NodeCard type="notetofreq" selected={selected} headerClassName="bg-blue-400 ">
      <NodeContent>
        <ParamRow>
          <Handle
            type="target"
            position={Position.Left}
            id="note"
            className="handle inlet"
          />
          <SelectInput
            label="note"
            value={NOTE_NAMES[currentNote % 12]}
            onChange={e => {
              const noteIndex = NOTE_NAMES.indexOf(e.target.value);
              const octave = Math.floor(currentNote / 12);
              updateParam('note', octave * 12 + noteIndex);
            }}
            options={NOTE_NAMES.map(n => ({ value: n, label: n }))}
          />
          <SelectInput
            label=""
            value={Math.floor(currentNote / 12) - 1}
            onChange={e => {
              const octave = parseInt(e.target.value) + 1;
              const noteIndex = currentNote % 12;
              updateParam('note', octave * 12 + noteIndex);
            }}
            options={octaves.map(o => ({ value: o.toString(), label: o.toString() }))}
          />
        </ParamRow>

        <ParamRow>
          <NumberInput
            label="midi"
            value={currentNote}
            onChange={e => updateParam('note', Math.max(0, Math.min(127, parseInt(e.target.value) || 0)))}
            min="0"
            max="127"
          />
          <ValueDisplay value={`${formatFixed(currentFreq, 1)}Hz`} />
        </ParamRow>
      </NodeContent>

      <Handle
        type="source"
        position={Position.Right}
        id="frequency"
        className="handle outlet"
      />
    </NodeCard>
  );
}
