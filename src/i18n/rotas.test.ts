import { describe, it, expect } from 'vitest';
import { caminhoAlternativo, langDe } from './rotas';

describe('caminhoAlternativo', () => {
  it('maps the home pages', () => {
    expect(caminhoAlternativo('/')).toBe('/en/');
    expect(caminhoAlternativo('/en/')).toBe('/');
  });

  it('maps project pages between /projetos and /en/projects', () => {
    expect(caminhoAlternativo('/projetos/gamedeals/')).toBe('/en/projects/gamedeals/');
    expect(caminhoAlternativo('/en/projects/gamedeals/')).toBe('/projetos/gamedeals/');
  });

  it('maps the resume pages', () => {
    expect(caminhoAlternativo('/cv/')).toBe('/en/cv/');
    expect(caminhoAlternativo('/en/cv/')).toBe('/cv/');
  });
});

describe('langDe', () => {
  it('detects the language from the path', () => {
    expect(langDe('/en/projects/x/')).toBe('en');
    expect(langDe('/en')).toBe('en');
    expect(langDe('/projetos/x/')).toBe('pt');
    expect(langDe('/')).toBe('pt');
  });
});
