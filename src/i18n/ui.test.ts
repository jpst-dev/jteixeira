import { describe, it, expect } from 'vitest';
import { ui } from './ui';

// Mesmo formato nos dois idiomas: chaves iguais e listas do mesmo tamanho.
function forma(valor: unknown): unknown {
  if (Array.isArray(valor)) return valor.map(forma);
  if (valor && typeof valor === 'object') return Object.fromEntries(Object.entries(valor).map(([k, v]) => [k, forma(v)]));
  return typeof valor;
}

describe('ui dictionary', () => {
  it('has the same shape in pt and en', () => {
    expect(forma(ui.en)).toEqual(forma(ui.pt));
  });

  it('has no empty strings', () => {
    const vazias = JSON.stringify(ui).match(/""/g);
    expect(vazias).toBeNull();
  });
});
