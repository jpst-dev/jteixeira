import { describe, it, expect } from 'vitest';
import { duracao } from './duracao';

describe('duracao', () => {
  it('counts inclusive months up to today when ongoing', () => {
    expect(duracao('2022-07', undefined, '2025-10', 'pt')).toBe('3 anos e 4 meses');
    expect(duracao('2022-07', undefined, '2025-10', 'en')).toBe('3 yrs 4 mos');
  });

  it('handles singular and zero parts', () => {
    expect(duracao('2025-06', '2025-06', '2026-10', 'pt')).toBe('1 mês');
    expect(duracao('2024-01', '2024-12', '2026-10', 'pt')).toBe('1 ano');
    expect(duracao('2024-01', '2024-12', '2026-10', 'en')).toBe('1 yr');
    expect(duracao('2024-01', '2024-11', '2026-10', 'pt')).toBe('11 meses');
    expect(duracao('2020-12', '2022-06', '2026-10', 'en')).toBe('1 yr 7 mos');
    expect(duracao('2020-01', '2021-12', '2026-10', 'pt')).toBe('2 anos');
  });
});
