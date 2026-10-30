// Índice da imagem ao lado na galeria ampliada; dá a volta nas pontas.
export const vizinho = (atual: number, total: number, passo: 1 | -1): number => (atual + passo + total) % total;
