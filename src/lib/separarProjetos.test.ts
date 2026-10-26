import { describe, it, expect } from 'vitest';
import { separarProjetos } from './separarProjetos';

// Mesmo formato das entradas de getCollection('projetos').
const p = (id: string, destaque = false, imagens: string[] = ['/x.webp']) => ({ id, data: { destaque, imagens } });

describe('separarProjetos', () => {
  it('pulls the first featured project out and keeps the rest in order', () => {
    expect(separarProjetos([p('a'), p('b', true), p('c')])).toEqual({ destaque: p('b', true), demais: [p('a'), p('c')] });
  });

  it('extra featured projects stay in the grid', () => {
    expect(separarProjetos([p('a', true), p('b', true)])).toEqual({ destaque: p('a', true), demais: [p('b', true)] });
  });

  it('returns null when nothing is featured', () => {
    expect(separarProjetos([p('a')])).toEqual({ destaque: null, demais: [p('a')] });
  });

  it('moves projects without images to the end, keeping the order otherwise', () => {
    const semImagem = p('a', false, []);
    expect(separarProjetos([semImagem, p('b'), p('c')]).demais).toEqual([p('b'), p('c'), semImagem]);
  });
});
