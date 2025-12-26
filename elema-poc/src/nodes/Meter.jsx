// Meter.jsx - Peak level meter visualization node
import { el } from '@elemaudio/core';
import { Handle, Position } from 'reactflow';
import { useNodeData } from '../engine/useGraph';
import { subscribe, unsubscribe } from '../engine/audioContext';
import { formatCompact, formatFixed } from '../engine/format';
import { useEffect, useState, useRef } from 'react';

const METER_WIDTH = 20;
const METER_HEIGHT = 60;

export const descriptor = {
  type: 'meter',
  inlets: {
    input: { default: 0 },
  },
  outlets: ['signal'],
  compile: (inputs, nodeId) => {
    const input = inputs.input;

    // If no input connected, pass through silence
    if (typeof input === 'number' && input === 0) {
      return { signal: el.const({ key: `${nodeId}:silence`, value: 0 }) };
    }

    const signalIn = typeof input === 'number'
      ? el.const({ key: `${nodeId}:input`, value: input })
      : input;

    // Wrap signal in meter for visualization, pass through unchanged
    return {
      signal: el.meter({ name: nodeId }, signalIn)
    };
  }
};

export function MeterNode({ id, selected }) {
  useNodeData(id); // Subscribe to node updates
  const [level, setLevel] = useState({ min: 0, max: 0 });
  const [peak, setPeak] = useState(0);
  const [histMinMax, setHistMinMax] = useState({ min: 0, max: 0 });
  const peakHoldRef = useRef(0);
  const peakDecayRef = useRef(null);
  const histMinRef = useRef(0);
  const histMaxRef = useRef(0);

  useEffect(() => {
    // Subscribe to meter events for this node
    subscribe('meter', id, (meterData) => {
      setLevel({ min: meterData.min, max: meterData.max });

      // Track historical min/max
      if (meterData.min < histMinRef.current) {
        histMinRef.current = meterData.min;
      }
      if (meterData.max > histMaxRef.current) {
        histMaxRef.current = meterData.max;
      }
      setHistMinMax({ min: histMinRef.current, max: histMaxRef.current });

      // Peak hold logic
      const absMax = Math.max(Math.abs(meterData.min), Math.abs(meterData.max));
      if (absMax > peakHoldRef.current) {
        peakHoldRef.current = absMax;
        setPeak(absMax);

        // Decay peak after 1 second
        if (peakDecayRef.current) {
          clearTimeout(peakDecayRef.current);
        }
        peakDecayRef.current = setTimeout(() => {
          peakHoldRef.current = 0;
          setPeak(0);
        }, 1000);
      }
    });

    return () => {
      unsubscribe('meter', id);
      if (peakDecayRef.current) {
        clearTimeout(peakDecayRef.current);
      }
    };
  }, [id]);

  // Double-click to reset historical min/max
  const handleReset = () => {
    histMinRef.current = 0;
    histMaxRef.current = 0;
    setHistMinMax({ min: 0, max: 0 });
  };


  // Convert level to height (assuming signal range -1 to 1)
  const absLevel = Math.max(Math.abs(level.min), Math.abs(level.max));
  const levelHeight = Math.min(1, absLevel) * METER_HEIGHT;
  const peakY = METER_HEIGHT - (Math.min(1, peak) * METER_HEIGHT);

  // Color based on level
  const getColor = (lvl) => {
    if (lvl > 0.9) return '#e74c3c'; // Red - clipping
    if (lvl > 0.7) return '#f39c12'; // Orange - hot
    return '#00b894'; // Green - normal
  };

  return (
    <div className={`audio-node meter ${selected ? 'selected' : ''}`}>
      <div className="node-header">Meter</div>
      <div className="node-content nodrag">
        <div className="param-row">
          <Handle
            type="target"
            position={Position.Left}
            id="input"
            className="handle inlet"
          />
          <label>in</label>

          <div className="meter-display" style={{ marginLeft: 'auto', position: 'relative' }} onDoubleClick={handleReset}>
            <svg width={METER_WIDTH} height={METER_HEIGHT}>
              {/* Background */}
              <rect
                x="0"
                y="0"
                width={METER_WIDTH}
                height={METER_HEIGHT}
                fill="#1a1a2e"
                stroke="#333"
              />
              {/* Level bar */}
              <rect
                x="2"
                y={METER_HEIGHT - levelHeight}
                width={METER_WIDTH - 4}
                height={levelHeight}
                fill={getColor(absLevel)}
              />
              {/* Peak indicator */}
              {peak > 0 && (
                <line
                  x1="2"
                  y1={peakY}
                  x2={METER_WIDTH - 2}
                  y2={peakY}
                  stroke="#fff"
                  strokeWidth="2"
                />
              )}
            </svg>
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '9px',
          fontFamily: 'monospace',
          marginTop: '4px'
        }}>
          <span style={{ color: '#74b9ff' }}>{formatCompact(histMinMax.min)}</span>
          <span style={{ color: '#ff7675' }}>{formatCompact(histMinMax.max)}</span>
        </div>

        <div className="meter-value" style={{ textAlign: 'center', fontSize: '9px', color: '#666', marginTop: '2px' }}>
          {formatFixed(20 * Math.log10(Math.max(0.0001, absLevel)), 1)} dB
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="signal"
        className="handle outlet"
      />
    </div>
  );
}
