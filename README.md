# ∿ dspatch

Visual programming environment for audio synthesis.

Build audio patches by connecting nodes on a canvas. Drag oscillators, filters, envelopes, and effects together to create sounds in real-time. Inspired by the work of Miller Puckette, creator of Max/MSP and Pure Data.

React + Elementary Audio = Easy UI development + Powerful audio processing.


## Features

- **Node-based patching** - Connect audio sources, processors, and outputs visually
- **Real-time audio** - Hear changes instantly as you modify your patch
- **Built-in visualizations** - Oscilloscope, spectrum analyzer, and level meters
- **Sequencer** - Step sequencer with drag-to-edit interface
- **Keyboard input** - Play notes with your computer keyboard
- **Preset library** - Example patches to learn from and build on

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## How It Works

Drag nodes from the sidebar onto the canvas, then connect outlets to inlets. Each inlet accepts one connection; outlets can connect to multiple destinations.

### Architecture

Each node type is a single file with two exports:

```jsx
// 1. Descriptor - defines the parameters and audio signal behavior
export const descriptor = {
  type: 'oscillator',
  inlets: { frequency: { default: 440 }, gain: { default: 0.5 } },
  outlets: ['signal'],
  compile: (inputs, nodeId) => {
    // Elementary Audio functions build the audio graph
    return { signal: el.mul(el.cycle(inputs.frequency), inputs.gain) };
  }
};

// 2. React component - renders the UI
export function OscillatorNode({ id, selected }) {
  const { data, updateParam } = useNodeData(id);
  return (
    <NodeCard type="oscillator" selected={selected}>
      {/* Parameter controls, handles, etc. */}
    </NodeCard>
  );
}
```

**The compilation flow:**

1. User edits the graph (adds node, connects edge, changes parameter)
2. Zustand store updates trigger `compileGraph()`
3. Nodes are topologically sorted so dependencies compile first
4. Each node's `descriptor.compile()` is called with its resolved inputs
5. The resulting Elementary Audio graph is rendered to WebAudio

**Elementary Audio basics:**

Elementary uses a functional approach where you compose audio operations:

```js
el.cycle(440)                    // Sine oscillator at 440Hz
el.mul(signal, 0.5)              // Multiply signal by 0.5
el.add(el.cycle(440), el.noise()) // Mix sine and noise
```

Functions return node objects that describe the audio graph. The graph is rendered to actual audio samples by the WebRenderer.

## Development

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # Run ESLint
npm test           # Run tests in watch mode
npm run test:run   # Run tests once
```

See [CLAUDE.md](./CLAUDE.md) for architecture details and contribution guidelines.

## Tech Stack

- [React Flow](https://reactflow.dev/) - Node editor
- [Elementary Audio](https://www.elementary.audio/) - DSP engine
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [Vite](https://vite.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## License

[MIT](./LICENSE)
