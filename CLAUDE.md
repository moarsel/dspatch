# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server
npm run build      # Production build
npm run lint       # Run ESLint
npm test           # Run Vitest in watch mode
npm run test:run   # Run tests once (CI mode)
```

Run a single test file:
```bash
npx vitest run src/__tests__/compile.test.js
```

## Architecture

Dspatch is a visual programming environment for audio synthesis built with React Flow (node editor), Elementary Audio (DSP), and Zustand (state).

### Core Data Flow

```
User drags nodes/connects edges
           ↓
Zustand store (useGraph.js) updates state
           ↓
compile() is called automatically
           ↓
compileGraph() topologically sorts nodes → calls each descriptor.compile()
           ↓
Elementary Audio graph rendered to WebAudio
```

### Node Descriptor Pattern

Every audio node has two parts in the same file:

1. **Descriptor object** - defines DSP interface:
```javascript
export const descriptor = {
  type: 'oscillator',
  inlets: { frequency: { default: 440 }, gain: { default: 0.5 } },
  outlets: ['signal'],
  compile: (inputs, nodeId) => {
    return { signal: el.mul(el.cycle(inputs.frequency), inputs.gain) };
  }
};
```

2. **React component** - renders the UI with handles and parameter controls

All nodes are registered in `src/nodes/index.js` which creates the `registry` and `nodeTypes` exports.

### Key Files

- `src/engine/compile.js` - Topological sort (Kahn's algorithm) and graph compilation
- `src/engine/useGraph.js` - Zustand store, auto-compiles on any change
- `src/engine/audioContext.js` - WebRenderer singleton, event subscription system
- `src/nodes/index.js` - Node registry mapping types to descriptors and components

### Visualization System

Edge and node visualization uses Elementary Audio's event system:
- `el.meter()`, `el.scope()`, `el.fft()` emit events with signal data
- `audioContext.js` manages subscriptions via `subscribe(type, name, callback)`
- `useSignalValue` hook provides reactive access to meter values

Orphan visualizers (scopes/meters without output connections) are included in the render graph at zero gain so they continue firing events.

### Connection Rules

- Each inlet accepts only one connection (enforced in `onConnect`)
- Unconnected inlets fall back to `node.data[inletName]` or `inlet.default`
- Outlets can connect to multiple inlets

### Adding a New Node

1. Create `src/nodes/YourNode.jsx` with `descriptor` and component exports
2. Import and add to registry in `src/nodes/index.js`
3. Node will appear in sidebar automatically via `availableNodes`

### Presets

Presets are serialized `{ nodes, edges }` snapshots in `src/engine/presets.ts`. Load via `useGraph.getState().loadPreset(preset)`.

## Testing

Tests use Vitest with `@elemaudio/offline-renderer` for actual audio signal verification.

### Test Utilities

Located in `src/test-utils/`:

- **mockGraph.js** - Builders for test graphs:
  ```javascript
  import { createNode, createEdge, createOscOutputChain, resetNodeIds } from '../test-utils/mockGraph';

  // Always reset before building new graphs
  resetNodeIds();
  const { nodes, edges } = createOscOutputChain({ frequency: 440, gain: 0.5 });
  ```

- **signalAnalysis.js** - Audio analysis helpers: `calculateRMS()`, `calculatePeak()`, `estimateFrequency()`, `analyzeBuffer()`

### Custom Matchers

Defined in `src/__tests__/setup.js`:

```javascript
expect(buffer).toHaveNonZeroRMS(0.1);  // Verify signal present
expect(buffer).toBeSilent();            // Verify silence
```

### Integration Tests with OfflineRenderer

Signal flow tests render actual audio to verify DSP correctness:

```javascript
import OfflineRenderer from '@elemaudio/offline-renderer';

const core = new OfflineRenderer();
await core.initialize({ sampleRate: 44100, blockSize: 512, numInputChannels: 0, numOutputChannels: 2 });

const result = compileGraph(nodes, edges, registry);
await core.render(result.left, result.right);

const outChannels = [new Float32Array(4096), new Float32Array(4096)];
core.process([], outChannels);
// outChannels now contains rendered audio samples
```

Call `core.reset()` between tests to clear renderer state.
