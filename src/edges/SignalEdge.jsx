// SignalEdge.jsx - Custom edge with toggleable visualization modes
import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from '@xyflow/react';
import { useEdgeSignal } from './useEdgeSignal';
import { useGraph } from '../engine/useGraph';
import { getChunkPositions } from './edgeAnimation';
import { formatCompact } from '../engine/format';

// Scope mode constants
const MAX_AMPLITUDE = 12;
const RENDER_SAMPLES = 64;
const TAPER_FRACTION = 0.2;

// Meter mode constants
const NUM_CHUNKS = 10;
const ANIMATION_SPEED = 0.5;
const BASE_SIZE = 2;
const MAX_SIZE = 6;

const MODES = ['probe', 'scope', 'meter'];

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
  data,
}) {
  const pathRef = useRef(null);
  const [pathReady, setPathReady] = useState(false);
  const { meter, waveform } = useEdgeSignal(id);
  const updateEdgeData = useGraph(state => state.updateEdgeData);

  // Get current mode from edge data, default to 'probe'
  const mode = data?.mode ?? 'probe';

  // Meter mode animation state
  const [animationOffset, setAnimationOffset] = useState(0);
  const chunkSizesRef = useRef(new Array(NUM_CHUNKS).fill(BASE_SIZE));
  const lastSlotRef = useRef(-1);

  // Calculate the edge path and label position
  const [edgePath, labelX, labelY] = getSmoothStepPath({
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

  // Meter mode animation loop
  useEffect(() => {
    if (mode !== 'meter') return;

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
  }, [mode]);

  // Meter mode: update chunk sizes when new chunks enter
  const signalLevel = Math.max(Math.abs(meter.min), Math.abs(meter.max));
  const currentSize = BASE_SIZE + signalLevel * (MAX_SIZE - BASE_SIZE);
  const currentSlot = Math.floor(animationOffset * NUM_CHUNKS) % NUM_CHUNKS;
  if (mode === 'meter' && currentSlot !== lastSlotRef.current) {
    chunkSizesRef.current[currentSlot] = currentSize;
    lastSlotRef.current = currentSlot;
  }

  // Meter mode: chunk positions
  const chunkPositions = useMemo(() => {
    if (mode !== 'meter' || !pathReady || !pathRef.current) return [];
    return getChunkPositions(pathRef.current, NUM_CHUNKS, animationOffset);
  }, [mode, pathReady, animationOffset]);

  // Scope mode: build waveform path
  const waveformPath = useMemo(() => {
    if (mode !== 'scope' || !pathReady || !pathRef.current || waveform.length === 0) {
      return '';
    }

    const path = pathRef.current;
    const totalLength = path.getTotalLength();
    if (totalLength === 0) return '';

    const points = [];
    const epsilon = 0.5;
    const sampleStep = Math.floor(waveform.length / RENDER_SAMPLES);

    for (let i = 0; i < RENDER_SAMPLES; i++) {
      const sampleIndex = Math.min(i * sampleStep, waveform.length - 1);
      const sample = Math.max(-1, Math.min(1, waveform[sampleIndex] ?? 0));
      const t = i / (RENDER_SAMPLES - 1);
      const len = t * totalLength;
      const point = path.getPointAtLength(len);

      const lenBefore = Math.max(0, len - epsilon);
      const lenAfter = Math.min(totalLength, len + epsilon);
      const pointBefore = path.getPointAtLength(lenBefore);
      const pointAfter = path.getPointAtLength(lenAfter);

      const dx = pointAfter.x - pointBefore.x;
      const dy = pointAfter.y - pointBefore.y;
      const mag = Math.sqrt(dx * dx + dy * dy);

      const perpX = mag > 0 ? -dy / mag : 0;
      const perpY = mag > 0 ? dx / mag : 0;

      const normalizedPos = i / (RENDER_SAMPLES - 1);
      let taper = 1;
      if (normalizedPos < TAPER_FRACTION) {
        taper = normalizedPos / TAPER_FRACTION;
      } else if (normalizedPos > 1 - TAPER_FRACTION) {
        taper = (1 - normalizedPos) / TAPER_FRACTION;
      }

      const offset = sample * MAX_AMPLITUDE * taper;
      points.push({
        x: point.x + perpX * offset,
        y: point.y + perpY * offset,
      });
    }

    if (points.length === 0) return '';

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x} ${points[i].y}`;
    }

    return d;
  }, [mode, pathReady, waveform]);

  // Toggle to next mode
  const cycleMode = useCallback(() => {
    const currentIndex = MODES.indexOf(mode);
    const nextIndex = (currentIndex + 1) % MODES.length;
    updateEdgeData(id, 'mode', MODES[nextIndex]);
  }, [id, mode, updateEdgeData]);

  // Delete this edge
  const deleteEdge = useGraph(state => state.deleteEdge);
  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    deleteEdge(id);
  }, [id, deleteEdge]);

  // Format probe value
  const probeValue = formatCompact(Math.max(Math.abs(meter.min), Math.abs(meter.max)));

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

      {/* Base edge */}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeDasharray: 'none',
        }}
      />

      {/* Scope mode: waveform visualization */}
      {mode === 'scope' && waveformPath && (
        <path
          d={waveformPath}
          fill="none"
          stroke="#00b894"
          strokeWidth="2"
          className="signal-edge-waveform"
        />
      )}

      {/* Meter mode: animated circles */}
      {mode === 'meter' && chunkPositions.map((pos, i) => (
        <circle
          key={i}
          cx={pos.x}
          cy={pos.y}
          r={chunkSizesRef.current[i]}
          fill="#898686ff"
          className="signal-edge-chunk"
        />
      ))}

      {/* Edge label with mode toggle and delete button */}
      <EdgeLabelRenderer>
        <div
          style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}
          className="nodrag nopan absolute pointer-events-auto flex gap-1 items-center"
        >
          <button
            onClick={cycleMode}
            className="bg-neutral-900/90 border border-neutral-700 rounded px-2 py-1 text-neutral-300 text-xs font-mono cursor-pointer min-w-12 flex items-center gap-1 hover:bg-neutral-800/90"
          >
            {mode === 'probe' ? probeValue : mode}
            {/* Audio lines icon */}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <rect x="0" y="4" width="2" height="4" rx="0.5" />
              <rect x="3" y="2" width="2" height="8" rx="0.5" />
              <rect x="6" y="3" width="2" height="6" rx="0.5" />
              <rect x="9" y="1" width="2" height="10" rx="0.5" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="bg-neutral-800/90 border border-neutral-600 rounded-full w-5 h-5 text-neutral-400 text-sm cursor-pointer flex items-center justify-center p-0 leading-none hover:bg-neutral-700/90 hover:text-neutral-300"
          >
            ×
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
