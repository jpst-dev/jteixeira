type Entrada = { id: string; data: object };

// Projeto EN = campos compartilhados do PT (stack, links, imagens…) + campos traduzidos.
// `traducao` é a entrada EN inteira, usada para renderizar o corpo do case em inglês.
export function mesclarProjeto<P extends Entrada, E extends Entrada>(
  pt: P,
  traducoes: E[],
): P & { data: P['data'] & E['data']; traducao: E } {
  const traducao = traducoes.find((t) => t.id === pt.id);
  if (!traducao) throw new Error(`Projeto "${pt.id}" sem tradução em src/content/projetos-en/${pt.id}.mdx`);
  return { ...pt, data: { ...pt.data, ...traducao.data }, traducao };
}
