import { describe, it, expect } from 'vitest';
import { ordenarProjetos } from './ordenarProjetos';

const p = (id: string, ordem: number) => ({ id, data: { ordem } });

describe('ordenarProjetos', () => {
  it('sorts by the ordem field, lowest first', () => {
    expect(ordenarProjetos([p('c', 3), p('a', 1), p('b', 2)]).map((x) => x.id)).toEqual(['a', 'b', 'c']);
  });

  it('breaks ties by id so the order never depends on the file system', () => {
    expect(ordenarProjetos([p('z', 1), p('m', 1)]).map((x) => x.id)).toEqual(['m', 'z']);
  });

  it('does not change the array it receives', () => {
    const lista = [p('b', 2), p('a', 1)];
    ordenarProjetos(lista);
    expect(lista.map((x) => x.id)).toEqual(['b', 'a']);
  });
});
