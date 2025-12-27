// WaveformChunk.jsx - SVG component for a single waveform segment

/**
 * Renders a small segment of waveform data as an SVG path,
 * positioned and rotated along the edge path
 */
export function WaveformChunk({
  samples,
  x,
  y,
  rotation,
  width = 20,
  height = 12,
  color = '#650065',
}) {
  // Build SVG path from samples
  const buildPath = () => {
    if (!samples || samples.length === 0) {
      // Draw flat line when no data
      return `M ${-width / 2} 0 L ${width / 2} 0`;
    }

    const step = width / samples.length;
    let d = '';

    for (let i = 0; i < samples.length; i++) {
      const px = i * step - width / 2; // Center horizontally
      const py = -samples[i] * (height / 2); // Map -1..1 to -height/2..height/2

      if (i === 0) {
        d = `M ${px} ${py}`;
      } else {
        d += ` L ${px} ${py}`;
      }
    }

    return d;
  };

  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${rotation})`}
      className="signal-edge-chunk"
    >
      <path
        d={buildPath()}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}
