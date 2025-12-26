/**
 * Format a number for display with appropriate precision.
 * Uses different decimal places based on magnitude, with exponential notation for extremes.
 */
export function formatValue(n) {
  if (n === 0) return '0';
  const abs = Math.abs(n);
  if (abs >= 10000) return n.toExponential(1);
  if (abs >= 1000) return n.toFixed(0);
  if (abs >= 100) return n.toFixed(1);
  if (abs >= 10) return n.toFixed(2);
  if (abs >= 1) return n.toFixed(2);
  if (abs >= 0.001) return n.toFixed(3);
  return n.toExponential(1);
}

/**
 * Format a number with adaptive decimal places based on magnitude.
 * Simpler than formatValue, without exponential notation.
 * Useful for compact displays where exponential notation is not needed.
 */
export function formatCompact(n) {
  const abs = Math.abs(n);
  if (abs >= 100) return n.toFixed(0);
  if (abs >= 10) return n.toFixed(1);
  return n.toFixed(2);
}

/**
 * Format a number with a fixed number of decimal places.
 * Convenience function for common formatting needs.
 */
export function formatFixed(n, decimals) {
  return n.toFixed(decimals);
}
