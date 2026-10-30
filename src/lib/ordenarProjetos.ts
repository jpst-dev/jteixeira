type Projeto = { id: string; data: { ordem: number } };

// A ordem da seção Projetos, do "próximo projeto" e do currículo vem do campo `ordem` do frontmatter.
export const ordenarProjetos = <T extends Projeto>(projetos: T[]): T[] =>
  [...projetos].sort((a, b) => a.data.ordem - b.data.ordem || a.id.localeCompare(b.id));
