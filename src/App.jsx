// App.jsx - Main application with React Flow canvas and sidebar
import { useCallback, useState, useRef } from 'react';
import {ReactFlow, Background, Controls, ReactFlowProvider, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './App.css';

import { useGraph } from './engine/useGraph';
import { initAudio } from './engine/audioContext';
import { nodeTypes, availableNodes } from './nodes';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar, SidebarToggle } from '@/components/AppSidebar';

function AppContent() {
  const [audioStarted, setAudioStarted] = useState(false);
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onReconnect,
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

  // Handle drop onto canvas (desktop drag-and-drop)
  const onDrop = useCallback((event) => {
    event.preventDefault();

    const type = event.dataTransfer.getData('application/reactflow');
    if (!type) return;

    // Convert screen coordinates to flow coordinates (accounts for zoom/pan)
    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    addNode(type, position);
  }, [addNode, screenToFlowPosition]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle tap-to-add for mobile - adds node to center of visible canvas
  const handleAddNode = useCallback((nodeType) => {
    if (!reactFlowWrapper.current) return;

    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    // Convert center of screen to flow coordinates
    const position = screenToFlowPosition({
      x: bounds.width / 2,
      y: bounds.height / 2,
    });

    // Add slight random offset so nodes don't stack exactly
    position.x += (Math.random() - 0.5) * 60;
    position.y += (Math.random() - 0.5) * 60;

    addNode(nodeType, position);
  }, [addNode, screenToFlowPosition]);

  return (
    <SidebarProvider style={{ '--sidebar-width': '14rem' }}>
      <div className="app dark">
        {/* Start Audio Overlay */}
        {!audioStarted && (
          <div className="audio-overlay" onClick={handleStartAudio}>
            <div className="audio-overlay-content">
              <h2>Welcome</h2>
              <p>Tap a node to add it to the canvas. Connect to an Output to hear audio.</p>
            </div>
          </div>
        )}

        {/* Floating Sidebar */}
        <AppSidebar availableNodes={availableNodes} onAddNode={handleAddNode} />
        <SidebarToggle />

        {/* React Flow Canvas */}
        <SidebarInset className="canvas" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onReconnect={onReconnect}
            edgesReconnectable
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
            <Controls position='bottom-right' />
          </ReactFlow>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <ReactFlowProvider>
      <AppContent />
    </ReactFlowProvider>
  );
}

export default App;
