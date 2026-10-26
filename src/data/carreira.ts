import { getCollection } from 'astro:content';
import type { Lang } from '../i18n/rotas';

// Experiências, mais recente primeiro (o loader não garante a ordem do JSON).
// No EN, cargo/local/bullets vêm do bloco `en` (obrigatório: nada de PT no /en).
export async function experienciasDoIdioma(lang: Lang) {
  const experiencias = (await getCollection('carreira')).sort((a, b) => b.data.inicio.localeCompare(a.data.inicio));
  return experiencias.map(({ id, data }) => {
    if (lang === 'pt') return { data };
    if (!data.en) throw new Error(`Experiência "${id}" sem bloco "en" em src/content/carreira.json`);
    return { data: { ...data, ...data.en } };
  });
}
