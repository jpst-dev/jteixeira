import { describe, it, expect } from 'vitest';
import { dividirVitrine } from './dividirVitrine';

describe('dividirVitrine', () => {
  it('puts the first three projects in the showcase and the rest below', () => {
    expect(dividirVitrine(['a', 'b', 'c', 'd', 'e'])).toEqual({ vitrine: ['a', 'b', 'c'], outros: ['d', 'e'] });
  });

  it('leaves "outros" empty when there are three or fewer projects', () => {
    expect(dividirVitrine(['a', 'b'])).toEqual({ vitrine: ['a', 'b'], outros: [] });
  });
});
