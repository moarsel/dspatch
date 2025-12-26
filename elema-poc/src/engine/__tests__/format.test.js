import { describe, it, expect } from 'vitest';
import { formatValue, formatCompact, formatFixed } from '../format';

describe('formatValue', () => {
  it('returns "0" for zero', () => {
    expect(formatValue(0)).toBe('0');
  });

  it('formats large numbers with exponential notation', () => {
    expect(formatValue(50000)).toBe('5.0e+4');
    expect(formatValue(123456)).toBe('1.2e+5');
  });

  it('formats numbers >= 1000 with toFixed(0)', () => {
    expect(formatValue(1000)).toBe('1000');
    expect(formatValue(5432)).toBe('5432');
    expect(formatValue(9999)).toBe('9999');
  });

  it('formats numbers >= 100 with toFixed(1)', () => {
    expect(formatValue(100)).toBe('100.0');
    expect(formatValue(500)).toBe('500.0');
    expect(formatValue(999)).toBe('999.0');
  });

  it('formats numbers >= 10 with toFixed(2)', () => {
    expect(formatValue(10)).toBe('10.00');
    expect(formatValue(42.5678)).toBe('42.57');
    expect(formatValue(99.99)).toBe('99.99');
  });

  it('formats numbers >= 1 with toFixed(2)', () => {
    expect(formatValue(1)).toBe('1.00');
    expect(formatValue(5.5)).toBe('5.50');
    expect(formatValue(9.999)).toBe('10.00');
  });

  it('formats numbers >= 0.001 with toFixed(3)', () => {
    expect(formatValue(0.001)).toBe('0.001');
    expect(formatValue(0.5)).toBe('0.500');
    expect(formatValue(0.999)).toBe('0.999');
  });

  it('formats very small numbers with exponential notation', () => {
    expect(formatValue(0.0001)).toBe('1.0e-4');
    expect(formatValue(0.00001)).toBe('1.0e-5');
  });

  it('handles negative numbers', () => {
    expect(formatValue(-5000)).toBe('-5000');
    expect(formatValue(-50)).toBe('-50.00');
    expect(formatValue(-0.5)).toBe('-0.500');
    expect(formatValue(-0.0001)).toBe('-1.0e-4');
  });

  it('handles edge cases at boundaries', () => {
    expect(formatValue(10000)).toBe('1.0e+4');
    expect(formatValue(9999.9)).toBe('10000');
    expect(formatValue(0.0009999)).toBe('1.0e-3');
  });
});

describe('formatCompact', () => {
  it('formats numbers >= 100 with toFixed(0)', () => {
    expect(formatCompact(100)).toBe('100');
    expect(formatCompact(500)).toBe('500');
  });

  it('formats numbers >= 10 with toFixed(1)', () => {
    expect(formatCompact(10)).toBe('10.0');
    expect(formatCompact(42.5678)).toBe('42.6');
  });

  it('formats numbers < 10 with toFixed(2)', () => {
    expect(formatCompact(1)).toBe('1.00');
    expect(formatCompact(5.5)).toBe('5.50');
    expect(formatCompact(0.5)).toBe('0.50');
  });

  it('handles negative numbers', () => {
    expect(formatCompact(-100)).toBe('-100');
    expect(formatCompact(-42.5678)).toBe('-42.6');
    expect(formatCompact(-5.5)).toBe('-5.50');
  });
});

describe('formatFixed', () => {
  it('formats with specified decimal places', () => {
    expect(formatFixed(3.14159, 2)).toBe('3.14');
    expect(formatFixed(3.14159, 3)).toBe('3.142');
    expect(formatFixed(3.14159, 0)).toBe('3');
  });

  it('handles negative numbers', () => {
    expect(formatFixed(-3.14159, 2)).toBe('-3.14');
  });

  it('handles zero', () => {
    expect(formatFixed(0, 2)).toBe('0.00');
  });

  it('pads with zeros when needed', () => {
    expect(formatFixed(5, 3)).toBe('5.000');
    expect(formatFixed(0.1, 2)).toBe('0.10');
  });
});
