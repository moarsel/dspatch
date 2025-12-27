// SignalEdge.jsx - Custom edge with animated amplitude visualization
import { useRef, useEffect, useState, useMemo } from 'react';
import { BaseEdge, getSmoothStepPath } from '@xyflow/react';
import { useEdgeSignal } from './useEdgeSignal';
import { getChunkPositions } from './edgeAnimation';

const NUM_CHUNKS = 10;
const ANIMATION_SPEED = 0.5; // cycles per second
const BASE_SIZE = 2;
const MAX_SIZE = 6;

export function SignalEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
}) {
  const pathRef = useRef(null);
  const [animationOffset, setAnimationOffset] = useState(0);
  const [pathReady, setPathReady] = useState(false);
  const amplitude = useEdgeSignal(id);

  // Store historical sizes for each chunk slot
  const chunkSizesRef = useRef(new Array(NUM_CHUNKS).fill(BASE_SIZE));
  const lastSlotRef = useRef(-1);

  // Calculate the edge path
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Mark path as ready after initial render
  useEffect(() => {
    if (pathRef.current) {
      setPathReady(true);
    }
  }, [edgePath]);

  // Animation loop
  useEffect(() => {
    let animationId;
    let lastTime = performance.now();

    const animate = (currentTime) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      setAnimationOffset((prev) => (prev + delta * ANIMATION_SPEED) % 1);
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Calculate current signal level
  const signalLevel = Math.max(Math.abs(amplitude.min), Math.abs(amplitude.max));
  const currentSize = BASE_SIZE + signalLevel * (MAX_SIZE - BASE_SIZE);

  // Determine which slot is currently at the source (t ≈ 0)
  // When a new chunk enters, capture the current amplitude
  const currentSlot = Math.floor(animationOffset * NUM_CHUNKS) % NUM_CHUNKS;
  if (currentSlot !== lastSlotRef.current) {
    // New chunk entering - capture current amplitude
    chunkSizesRef.current[currentSlot] = currentSize;
    lastSlotRef.current = currentSlot;
  }

  // Calculate chunk positions along the path
  const chunkPositions = useMemo(() => {
    if (!pathReady || !pathRef.current) return [];
    return getChunkPositions(pathRef.current, NUM_CHUNKS, animationOffset);
  }, [pathReady, animationOffset]);

  return (
    <>
      {/* Invisible path for measurement */}
      <path
        ref={pathRef}
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth="1"
      />

      {/* Base edge with styling */}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeDasharray: 'none',
        }}
      />

      {/* Animated amplitude indicators - each keeps its emitted size */}
      {chunkPositions.map((pos, i) => (
        <circle
          key={i}
          cx={pos.x}
          cy={pos.y}
          r={chunkSizesRef.current[i]}
          fill="#898686ff"
          className="signal-edge-chunk"
        />
      ))}
    </>
  );
}
