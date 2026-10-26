export type FaseDigitacao = 'digitando' | 'pausa' | 'apagando';

export interface EstadoDigitacao {
  indice: number;
  texto: string;
  fase: FaseDigitacao;
}

export const TEMPOS = { digitar: 70, apagar: 35, pausa: 2200, entreFrases: 400 };

export function proximoPasso(
  frases: string[],
  estado: EstadoDigitacao,
): { estado: EstadoDigitacao; espera: number } {
  const { indice, texto, fase } = estado;
  const frase = frases[indice];

  if (fase === 'digitando') {
    if (texto.length < frase.length) {
      return { estado: { indice, texto: frase.slice(0, texto.length + 1), fase }, espera: TEMPOS.digitar };
    }
    return { estado: { indice, texto, fase: 'pausa' }, espera: TEMPOS.pausa };
  }

  if (texto.length > 0) {
    return { estado: { indice, texto: texto.slice(0, -1), fase: 'apagando' }, espera: TEMPOS.apagar };
  }
  return {
    estado: { indice: (indice + 1) % frases.length, texto: '', fase: 'digitando' },
    espera: TEMPOS.entreFrases,
  };
}
