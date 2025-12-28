// useEdgeSignal.js - Hook for subscribing to edge meter and scope data
import { useEffect, useState, useRef } from 'react';
import { subscribe, unsubscribe } from '../engine/audioContext';

/**
 * Subscribe to meter and scope events for a specific edge
 * @param {string} edgeId - The edge ID
 * @returns {{ meter: { min: number, max: number }, waveform: number[] }}
 */
export function useEdgeSignal(edgeId) {
  const [data, setData] = useState({ meter: { min: 0, max: 0 }, waveform: [] });
  const meterRef = useRef({ min: 0, max: 0 });
  const waveformRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    const meterName = `${edgeId}:meter`;
    const scopeName = `${edgeId}:scope`;

    subscribe('meter', meterName, (meterData) => {
      if (meterData) {
        meterRef.current = { min: meterData.min, max: meterData.max };
      }
    });

    subscribe('scope', scopeName, (scopeData) => {
      // scopeData is array of blocks, one per channel
      if (scopeData && scopeData[0]) {
        waveformRef.current = scopeData[0];
      }
    });

    // Update display at ~30fps for performance
    const updateLoop = () => {
      setData({
        meter: { ...meterRef.current },
        waveform: waveformRef.current.length > 0 ? [...waveformRef.current] : [],
      });
      rafRef.current = requestAnimationFrame(updateLoop);
    };
    rafRef.current = requestAnimationFrame(updateLoop);

    return () => {
      unsubscribe('meter', meterName);
      unsubscribe('scope', scopeName);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [edgeId]);

  return data;
}
