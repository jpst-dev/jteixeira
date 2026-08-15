export interface ProjetoResumo {
  id: string;
  titulo: string;
  resumo: string;
  stack: string[];
}

export function filterProjetos(projetos: ProjetoResumo[], query: string): ProjetoResumo[] {
  const q = query.trim().toLowerCase();
  if (!q) return projetos;

  return projetos.filter((projeto) => {
    const haystack = [projeto.titulo, projeto.resumo, ...projeto.stack].join(' ').toLowerCase();
    return haystack.includes(q);
  });
}
