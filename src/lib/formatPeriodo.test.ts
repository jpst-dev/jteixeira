import { describe, it, expect } from 'vitest';
import { formatPeriodo } from './formatPeriodo';

describe('formatPeriodo', () => {
  it('uses "hoje" when there is no end', () => {
    expect(formatPeriodo('2022-07')).toBe('jul 2022 — hoje');
  });

  it('formats a closed range', () => {
    expect(formatPeriodo('2020-12', '2022-06')).toBe('dez 2020 — jun 2022');
  });

  it('throws on malformed input', () => {
    expect(() => formatPeriodo('2022')).toThrow();
  });
});
