// useSignalValue.js - Hook for visualizing signal values in node components
import { useEffect, useState } from 'react';
import { subscribe, unsubscribe } from './audioContext';
import { formatValue } from './format';

/**
 * Hook to get the current value of a metered signal.
 * Use with el.meter({ name: id }, signal) in compile function.
 *
 * @param {string} name - The meter name (usually nodeId or nodeId:suffix)
 * @returns {{ value: number, min: number, max: number, display: string, displayMin: string, displayMax: string }}
 */
export function useSignalValue(name) {
  const [values, setValues] = useState({ value: 0, min: 0, max: 0 });

  useEffect(() => {
    if (!name) return;

    subscribe('meter', name, (meterData) => {
      setValues({
        value: meterData.max, // Use max as "current" value
        min: meterData.min,
        max: meterData.max,
      });
    });

    return () => unsubscribe('meter', name);
  }, [name]);

  return {
    ...values,
    display: formatValue(values.value),
    displayMin: formatValue(values.min),
    displayMax: formatValue(values.max),
  };
}

/**
 * Hook to check if a signal is "high" (above threshold).
 * Useful for gate/trigger visualization.
 *
 * @param {string} name - The meter name
 * @param {number} threshold - Value above which signal is "high" (default 0.5)
 * @returns {boolean}
 */
export function useSignalHigh(name, threshold = 1) {
  const { max } = useSignalValue(name);
  return max >= threshold;
}
