// useEdgeSignal.js - Hook for subscribing to edge meter data
import { useEffect, useState, useRef } from 'react';
import { subscribe, unsubscribe } from '../engine/audioContext';

/**
 * Subscribe to meter events for a specific edge and return amplitude data
 * @param {string} edgeId - The edge ID
 * @returns {{ min: number, max: number }} - Amplitude range
 */
export function useEdgeSignal(edgeId) {
  const [amplitude, setAmplitude] = useState({ min: 0, max: 0 });
  const dataRef = useRef({ min: 0, max: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const meterName = edgeId;

    subscribe('meter', meterName, (meterData) => {
      if (meterData) {
        dataRef.current = { min: meterData.min, max: meterData.max };
      }
    });

    // Update display at ~30fps for performance
    const updateLoop = () => {
      setAmplitude({ ...dataRef.current });
      rafRef.current = requestAnimationFrame(updateLoop);
    };
    rafRef.current = requestAnimationFrame(updateLoop);

    return () => {
      unsubscribe('meter', meterName);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [edgeId]);

  return amplitude;
}
