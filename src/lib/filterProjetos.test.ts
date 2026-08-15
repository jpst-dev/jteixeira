import { describe, it, expect } from 'vitest';
import { filterProjetos, type ProjetoResumo } from './filterProjetos';

const projetos: ProjetoResumo[] = [
  { id: 'a', titulo: 'Dashboard Vue', resumo: 'Painel administrativo', stack: ['Vue.js', 'Nuxt'] },
  { id: 'b', titulo: 'Loja React', resumo: 'E-commerce', stack: ['React', 'Next.js'] },
  { id: 'c', titulo: 'API de Pagamentos', resumo: 'Serviço backend', stack: ['C#', '.NET'] },
];

describe('filterProjetos', () => {
  it('returns all projects when query is empty', () => {
    expect(filterProjetos(projetos, '')).toHaveLength(3);
  });

  it('matches by title, case-insensitive', () => {
    const result = filterProjetos(projetos, 'dashboard');
    expect(result.map((p) => p.id)).toEqual(['a']);
  });

  it('matches by stack tag', () => {
    const result = filterProjetos(projetos, 'react');
    expect(result.map((p) => p.id)).toEqual(['b']);
  });

  it('matches by resumo text', () => {
    const result = filterProjetos(projetos, 'backend');
    expect(result.map((p) => p.id)).toEqual(['c']);
  });

  it('returns empty array when nothing matches', () => {
    expect(filterProjetos(projetos, 'inexistente')).toEqual([]);
  });
});
