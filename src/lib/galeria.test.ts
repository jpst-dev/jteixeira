import { describe, it, expect } from 'vitest';
import { vizinho } from './galeria';

describe('vizinho', () => {
  it('moves to the next or previous image', () => {
    expect(vizinho(1, 4, 1)).toBe(2);
    expect(vizinho(1, 4, -1)).toBe(0);
  });

  it('wraps around at both ends', () => {
    expect(vizinho(3, 4, 1)).toBe(0);
    expect(vizinho(0, 4, -1)).toBe(3);
  });
});
