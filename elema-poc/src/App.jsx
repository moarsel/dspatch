// App.jsx - Main application with React Flow canvas and sidebar
import { useCallback, useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';

import { useGraph } from './engine/useGraph';
import { initAudio } from './engine/audioContext';
import { nodeTypes, availableNodes } from './nodes';

function App() {
  const [audioStarted, setAudioStarted] = useState(false);

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    compile
  } = useGraph();

  // Start audio on first user interaction
  const handleStartAudio = useCallback(async () => {
    if (audioStarted) return;
    await initAudio();
    setAudioStarted(true);
    compile(); // Compile current graph
  }, [audioStarted, compile]);

  // Handle drag from sidebar
  const onDragStart = useCallback((event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  // Handle drop onto canvas
  const onDrop = useCallback((event) => {
    event.preventDefault();

    const type = event.dataTransfer.getData('application/reactflow');
    if (!type) return;

    // Get drop position relative to the flow pane
    const reactFlowBounds = event.currentTarget.getBoundingClientRect();
    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    };

    addNode(type, position);
  }, [addNode]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div className="app">
      {/* Start Audio Overlay */}
      {!audioStarted && (
        <div className="audio-overlay" onClick={handleStartAudio}>
          <div className="audio-overlay-content">
            <h2>Click to Start Audio</h2>
            <p>Browser requires user interaction to enable audio</p>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="sidebar">
        <h2>Nodes</h2>
        <div className="node-list">
          {availableNodes.map(type => (
            <div
              key={type}
              className={`sidebar-node ${type}`}
              draggable
              onDragStart={(e) => onDragStart(e, type)}
            >
              {type}
            </div>
          ))}
        </div>
      </div>

      {/* React Flow Canvas */}
      <div className="canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          snapToGrid
          snapGrid={[15, 15]}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
          }}
        >
          <Background variant="dots" gap={15} size={1} />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              switch (node.type) {
                case 'oscillator': return '#ff6b6b';
                case 'gain': return '#4ecdc4';
                case 'filter': return '#45b7d1';
                case 'envelope': return '#f7b731';
                case 'delay': return '#a55eea';
                case 'output': return '#26de81';
                case 'bang': return '#e84393';
                default: return '#666';
              }
            }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}

export default App;
