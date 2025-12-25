// Test setup with custom matchers
import { expect } from 'vitest';

expect.extend({
  toHaveNonZeroRMS(buffer, threshold = 0.001) {
    const rms = Math.sqrt(
      buffer.reduce((sum, sample) => sum + sample * sample, 0) / buffer.length
    );
    const pass = rms > threshold;
    return {
      pass,
      message: () =>
        pass
          ? `Expected RMS to be less than ${threshold}, got ${rms.toFixed(6)}`
          : `Expected RMS to be greater than ${threshold}, got ${rms.toFixed(6)} (silence detected)`,
      actual: rms,
    };
  },

  toBeSilent(buffer, threshold = 0.0001) {
    const maxAbs = Math.max(...buffer.map(Math.abs));
    const pass = maxAbs < threshold;
    return {
      pass,
      message: () =>
        pass
          ? `Expected non-silent buffer, max amplitude: ${maxAbs.toFixed(6)}`
          : `Expected silent buffer, max amplitude: ${maxAbs.toFixed(6)}`,
      actual: maxAbs,
    };
  },
});
