import { describe, it, expect } from 'vitest';
import { proximoPasso, TEMPOS } from './typewriter';

const frases = ['ab', 'xy'];

describe('proximoPasso', () => {
  it('types one more character', () => {
    expect(proximoPasso(frases, { indice: 0, texto: 'a', fase: 'digitando' })).toEqual({
      estado: { indice: 0, texto: 'ab', fase: 'digitando' },
      espera: TEMPOS.digitar,
    });
  });

  it('pauses when the phrase is complete, then starts erasing', () => {
    expect(proximoPasso(frases, { indice: 0, texto: 'ab', fase: 'digitando' })).toEqual({
      estado: { indice: 0, texto: 'ab', fase: 'pausa' },
      espera: TEMPOS.pausa,
    });
    expect(proximoPasso(frases, { indice: 0, texto: 'ab', fase: 'pausa' })).toEqual({
      estado: { indice: 0, texto: 'a', fase: 'apagando' },
      espera: TEMPOS.apagar,
    });
  });

  it('moves to the next phrase after erasing, wrapping at the end', () => {
    expect(proximoPasso(frases, { indice: 1, texto: '', fase: 'apagando' })).toEqual({
      estado: { indice: 0, texto: '', fase: 'digitando' },
      espera: TEMPOS.entreFrases,
    });
  });
});
