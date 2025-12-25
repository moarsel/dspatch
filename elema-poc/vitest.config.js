import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
    globals: true,
    setupFiles: ['./src/__tests__/setup.js'],
  },
});
