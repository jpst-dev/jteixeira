import { describe, it, expect } from 'vitest';
import { ehDestaque } from './tags';

describe('ehDestaque', () => {
  it('highlights the first two tags of a card, whatever they are', () => {
    expect(['Astro', 'Vue 3', 'TypeScript', 'GSAP'].map((_, i) => ehDestaque(i))).toEqual([true, true, false, false]);
  });

  it('highlights both tags of a two-tag list', () => {
    expect(['SAP', 'Suporte'].map((_, i) => ehDestaque(i))).toEqual([true, true]);
  });
});

describe('.tag-principal css', () => {
  it('hides the decorative "#" from screen readers (empty alt text)', async () => {
    const { readFileSync } = await import('node:fs');
    const css = readFileSync('src/styles/global.css', 'utf8');
    const regra = css.slice(css.indexOf('.tag-principal::before'));
    expect(regra.slice(0, regra.indexOf('}'))).toMatch(/content:\s*'#'\s*\/\s*''/);
  });
});
