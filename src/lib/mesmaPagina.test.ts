import { describe, it, expect } from 'vitest';
import { mesmaPagina } from './mesmaPagina';

describe('mesmaPagina', () => {
  it('ignores a trailing slash (jteixeira.dev/en vs /en/#about)', () => {
    expect(mesmaPagina('/en', '/en/')).toBe(true);
    expect(mesmaPagina('/en/', '/en')).toBe(true);
    expect(mesmaPagina('/', '/')).toBe(true);
  });

  it('tells different pages apart', () => {
    expect(mesmaPagina('/en/', '/')).toBe(false);
    expect(mesmaPagina('/projetos/x/', '/')).toBe(false);
  });
});
