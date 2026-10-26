type Projeto = { data: { destaque: boolean; imagens: string[] } };

// Projetos sem screenshot vão para o fim da grade (o placeholder destoa no meio dos prints).
const comImagemPrimeiro = <T extends Projeto>(projetos: T[]) =>
  [...projetos].sort((a, b) => Number(b.data.imagens.length > 0) - Number(a.data.imagens.length > 0));

export function separarProjetos<T extends Projeto>(projetos: T[]): { destaque: T | null; demais: T[] } {
  const indice = projetos.findIndex((projeto) => projeto.data.destaque);
  if (indice === -1) return { destaque: null, demais: comImagemPrimeiro(projetos) };
  return {
    destaque: projetos[indice],
    demais: comImagemPrimeiro(projetos.filter((_, i) => i !== indice)),
  };
}
