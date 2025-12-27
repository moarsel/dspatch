// edgeAnimation.js - Path utilities for edge waveform animation

/**
 * Get point and tangent angle at a given percentage along an SVG path
 * @param {SVGPathElement} pathElement - The path element
 * @param {number} t - Position along path (0 to 1)
 * @returns {{ x: number, y: number, angle: number }}
 */
export function getPointAtPercent(pathElement, t) {
  const length = pathElement.getTotalLength();
  const point = pathElement.getPointAtLength(t * length);

  // Calculate tangent by sampling nearby points
  const delta = 0.01;
  const p1 = pathElement.getPointAtLength(Math.max(0, (t - delta)) * length);
  const p2 = pathElement.getPointAtLength(Math.min(1, (t + delta)) * length);
  const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);

  return { x: point.x, y: point.y, angle };
}

/**
 * Generate positions for N chunks evenly distributed along the path
 * with animation offset based on time
 * @param {SVGPathElement} pathElement
 * @param {number} numChunks
 * @param {number} animationOffset - 0 to 1, cycles over time
 * @returns {Array<{ x: number, y: number, angle: number, t: number }>}
 */
export function getChunkPositions(pathElement, numChunks, animationOffset) {
  if (!pathElement) return [];

  const positions = [];
  const spacing = 1 / numChunks;

  for (let i = 0; i < numChunks; i++) {
    // Calculate t with animation offset, wrapping around 0-1
    const t = (i * spacing + animationOffset) % 1;
    const { x, y, angle } = getPointAtPercent(pathElement, t);
    positions.push({ x, y, angle, t });
  }

  return positions;
}
