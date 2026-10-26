import { getCollection, type CollectionEntry } from 'astro:content';
import { mesclarProjeto } from '../lib/mesclarProjeto';
import type { Lang } from '../i18n/rotas';

/** Entrada a renderizar: o próprio projeto PT ou a tradução EN (corpo do case). */
export type ProjetoIdioma = CollectionEntry<'projetos'> & { conteudo: CollectionEntry<'projetos'> | CollectionEntry<'projetosEn'> };

// Projetos no idioma pedido. No EN, cada projeto PT exige sua tradução (o build falha sem ela).
export async function projetosDoIdioma(lang: Lang): Promise<ProjetoIdioma[]> {
  const projetos = await getCollection('projetos');
  if (lang === 'pt') return projetos.map((p) => ({ ...p, conteudo: p }));
  const traducoes = await getCollection('projetosEn');
  return projetos.map((p) => {
    const mesclado = mesclarProjeto(p, traducoes);
    return { ...mesclado, conteudo: mesclado.traducao };
  });
}

export async function caminhosProjetos(lang: Lang) {
  const projetos = await projetosDoIdioma(lang);
  return projetos.map((projeto, i) => {
    const proximo = projetos[(i + 1) % projetos.length];
    return {
      params: { id: projeto.id },
      props: { projeto, proximo: { id: proximo.id, titulo: proximo.data.titulo } },
    };
  });
}
