import { describe, it, expect } from 'vitest';
import { deslocamentoMagnetico } from './magnetic';

const rect = { left: 0, top: 0, width: 100, height: 40 };

describe('deslocamentoMagnetico', () => {
  it('is zero at the center', () => {
    expect(deslocamentoMagnetico(50, 20, rect, 0.3)).toEqual({ x: 0, y: 0 });
  });

  it('pulls toward the pointer by the given strength', () => {
    expect(deslocamentoMagnetico(60, 30, rect, 0.3)).toEqual({ x: 3, y: 3 });
  });

  it('clamps to max in both directions', () => {
    expect(deslocamentoMagnetico(500, -500, rect, 0.3)).toEqual({ x: 8, y: -8 });
  });
});
