// TrashZone.jsx - Drop zone for deleting nodes (mobile only)
import { useState, useEffect, useCallback, useRef } from 'react';
import { useGraph } from '../engine/useGraph';

// Check if device is mobile/touch
const isMobile = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768;
};

export function TrashZone({ isDragging, draggedNodeId }) {
  const [isOver, setIsOver] = useState(false);
  const [mobile, setMobile] = useState(false);
  const zoneRef = useRef(null);
  const deleteNode = useGraph(state => state.deleteNode);

  // Check mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setMobile(isMobile());
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check if pointer is over the trash zone during drag
  const handlePointerMove = useCallback((e) => {
    if (!zoneRef.current || !isDragging) return;

    const rect = zoneRef.current.getBoundingClientRect();
    const over = (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    );
    setIsOver(over);
  }, [isDragging]);

  // Delete node if dropped over trash zone
  const handlePointerUp = useCallback(() => {
    if (isOver && draggedNodeId) {
      deleteNode(draggedNodeId);
    }
    setIsOver(false);
  }, [isOver, draggedNodeId, deleteNode]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [isDragging, handlePointerMove, handlePointerUp]);

  // Only show on mobile devices when dragging
  if (!mobile || !isDragging) return null;

  return (
    <div
      ref={zoneRef}
      className="trash-zone"
      style={{
        position: 'fixed',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: isOver ? 'rgba(200, 50, 50, 0.9)' : 'rgba(80, 30, 30, 0.8)',
        border: isOver ? '3px solid #f55' : '2px solid #633',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: isOver ? '#fff' : '#c66',
        fontSize: '32px',
        transition: 'all 0.15s ease',
        zIndex: 1000,
        pointerEvents: 'none',
        boxShadow: isOver
          ? '0 0 20px rgba(255, 80, 80, 0.5)'
          : '0 4px 12px rgba(0, 0, 0, 0.3)',
      }}
    >
      ×
    </div>
  );
}
