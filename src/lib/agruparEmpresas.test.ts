import { describe, it, expect } from 'vitest';
import { agruparEmpresas } from './agruparEmpresas';

const exp = (empresa: string, inicio: string, fim?: string) => ({ data: { empresa, inicio, fim } });

describe('agruparEmpresas', () => {
  it('groups consecutive roles by company, keeping order', () => {
    const atual = exp('Mercado Eletrônico', '2025-06');
    const antigo = exp('Mercado Eletrônico', '2022-07', '2025-06');
    const via = exp('ViaRondon', '2020-12', '2022-06');
    const grupos = agruparEmpresas([atual, antigo, via]);
    expect(grupos).toHaveLength(2);
    expect(grupos[0]).toEqual({ empresa: 'Mercado Eletrônico', inicio: '2022-07', fim: undefined, cargos: [atual, antigo] });
    expect(grupos[1]).toEqual({ empresa: 'ViaRondon', inicio: '2020-12', fim: '2022-06', cargos: [via] });
  });

  it('uses the latest end when no role is ongoing', () => {
    const [grupo] = agruparEmpresas([exp('X', '2021-01', '2022-03'), exp('X', '2019-05', '2020-12')]);
    expect(grupo.inicio).toBe('2019-05');
    expect(grupo.fim).toBe('2022-03');
  });
});
