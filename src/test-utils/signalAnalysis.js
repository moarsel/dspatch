// signalAnalysis.js - Audio analysis utilities for testing

/**
 * Calculate RMS (Root Mean Square) of a signal buffer
 */
export function calculateRMS(buffer) {
  if (buffer.length === 0) return 0;
  const sumSquares = buffer.reduce((sum, sample) => sum + sample * sample, 0);
  return Math.sqrt(sumSquares / buffer.length);
}

/**
 * Calculate peak amplitude
 */
export function calculatePeak(buffer) {
  if (buffer.length === 0) return 0;
  return Math.max(...buffer.map(Math.abs));
}

/**
 * Check if buffer contains any non-zero samples
 */
export function hasNonZeroSamples(buffer, threshold = 0.0001) {
  return buffer.some(sample => Math.abs(sample) > threshold);
}

/**
 * Estimate fundamental frequency using zero-crossing rate
 */
export function estimateFrequency(buffer, sampleRate = 44100) {
  let zeroCrossings = 0;
  for (let i = 1; i < buffer.length; i++) {
    if ((buffer[i - 1] >= 0 && buffer[i] < 0) ||
        (buffer[i - 1] < 0 && buffer[i] >= 0)) {
      zeroCrossings++;
    }
  }
  const duration = buffer.length / sampleRate;
  return zeroCrossings / (2 * duration);
}

/**
 * Create an audio analysis report
 */
export function analyzeBuffer(buffer, sampleRate = 44100) {
  return {
    rms: calculateRMS(buffer),
    peak: calculatePeak(buffer),
    hasSignal: hasNonZeroSamples(buffer),
    estimatedFrequency: estimateFrequency(buffer, sampleRate),
    sampleCount: buffer.length,
    duration: buffer.length / sampleRate,
  };
}
