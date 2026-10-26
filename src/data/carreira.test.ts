import { describe, it, expect } from 'vitest';
import carreira from '../content/carreira.json';

// Tags da carreira aparecem no /en: nenhuma pode ficar em português.
const PT = /\b(IA|APIs REST|Suporte|Integração)\b/;

describe('carreira.json (en)', () => {
  it('has English tags for every role', () => {
    for (const exp of carreira) {
      const tags = exp.en?.tags ?? exp.tags;
      expect(tags.filter((t) => PT.test(t)), exp.id).toEqual([]);
    }
  });
});
