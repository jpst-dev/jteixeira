import { describe, it, expect } from 'vitest';
import { mesclarProjeto } from './mesclarProjeto';

const pt = { id: 'gamedeals', data: { titulo: 'DealsGamer', resumo: 'Ofertas', stack: ['Nuxt'], linkDemo: 'https://dealsgamer.com' } };
const en = { id: 'gamedeals', data: { titulo: 'DealsGamer', resumo: 'Deals' } };

describe('mesclarProjeto', () => {
  it('overlays the translated fields and keeps the shared ones', () => {
    const projeto = mesclarProjeto(pt, [{ id: 'outro', data: { titulo: 'X', resumo: 'Y' } }, en]);
    expect(projeto.data).toEqual({ titulo: 'DealsGamer', resumo: 'Deals', stack: ['Nuxt'], linkDemo: 'https://dealsgamer.com' });
    expect(projeto.traducao).toBe(en);
    expect(projeto.id).toBe('gamedeals');
  });

  it('throws a clear error when the translation is missing', () => {
    expect(() => mesclarProjeto(pt, [])).toThrow('Projeto "gamedeals" sem tradução em src/content/projetos-en/gamedeals.mdx');
  });
});
