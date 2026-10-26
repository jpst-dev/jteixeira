export function separarProjetos<T extends { data: { destaque: boolean } }>(projetos: T[]): { destaque: T | null; demais: T[] } {
  const indice = projetos.findIndex((projeto) => projeto.data.destaque);
  if (indice === -1) return { destaque: null, demais: projetos };
  return {
    destaque: projetos[indice],
    demais: projetos.filter((_, i) => i !== indice),
  };
}
