// App.jsx - Main application with React Flow canvas and sidebar
import { useCallback, useState, useRef } from 'react';
import {ReactFlow, Background, Controls, ReactFlowProvider, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './App.css';

import { useGraph } from './engine/useGraph';
import { initAudio } from './engine/audioContext';
import { getPreset } from './engine/presets';
import { nodeTypes, availableNodes } from './nodes';
import { edgeTypes } from './edges';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar, SidebarToggle } from '@/components/AppSidebar';
import { TrashZone } from './components/TrashZone';
import { PatchExplorer } from '@/components/PatchExplorer';
import { usePatchExplorer } from '@/hooks/use-patch-explorer';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

function AppContent() {
  const [audioStarted, setAudioStarted] = useState(false);
  const [draggingNodeId, setDraggingNodeId] = useState(null);
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
    loadPreset,
    compile
  } = useGraph();

  // Track node dragging for trash zone
  const handleNodesChange = useCallback((changes) => {
    for (const change of changes) {
      if (change.type === 'position' && change.dragging !== undefined) {
        setDraggingNodeId(change.dragging ? change.id : null);
      }
    }
    onNodesChange(changes);
  }, [onNodesChange]);

  // Start audio and load preset for selected tab
  const handleStartAudio = useCallback(async (tabId) => {
    // Load the preset for this tab
    const preset = getPreset(tabId);
    loadPreset(preset);

    // Initialize audio if not already started
    if (!audioStarted) {
      await initAudio();
      setAudioStarted(true);
    }

    compile();
  }, [audioStarted, loadPreset, compile]);

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
        {/* Patch Explorer Modal */}
        <PatchExplorer onStart={handleStartAudio} audioStarted={audioStarted} />

        {/* Info button to reopen Patch Explorer */}
        {audioStarted && (
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 right-4 z-40 bg-card/80 backdrop-blur-sm"
            onClick={() => usePatchExplorer.getState().open()}
          >
            <Info className="h-5 w-5" />
          </Button>
        )}

        {/* Floating Sidebar */}
        <AppSidebar availableNodes={availableNodes} onAddNode={handleAddNode} />
        <SidebarToggle />

        {/* React Flow Canvas */}
        <SidebarInset className="canvas" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onReconnect={onReconnect}
            edgesReconnectable
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            snapToGrid
            snapGrid={[15, 15]}
            defaultViewport={{x: 100, y: 100, zoom: 0.7 }}
            defaultEdgeOptions={{
              type: 'signal',
            }}
          >
            <Background variant="dots" gap={15} size={1} />
            <Controls position='bottom-right' />
          </ReactFlow>
        </SidebarInset>

        {/* Trash zone for deleting nodes by dragging */}
        <TrashZone isDragging={!!draggingNodeId} draggedNodeId={draggingNodeId} />
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
