import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

const projetos = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projetos' }),
  schema: z.object({
    titulo: z.string(),
    resumo: z.string(),
    problema: z.string(),
    solucao: z.string(),
    stack: z.array(z.string()),
    papel: z.string(),
    linkRepo: z.string().url().optional(),
    linkDemo: z.string().url().optional(),
    destaque: z.boolean().default(false),
    imagens: z.array(z.string()).default([]),
  }),
});

// Só os campos traduzíveis; o resto vem do projeto PT de mesmo id (ver lib/mesclarProjeto).
const projetosEn = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projetos-en' }),
  schema: z.object({
    titulo: z.string(),
    resumo: z.string(),
    problema: z.string(),
    solucao: z.string(),
    papel: z.string(),
  }),
});

const anoMes = z.string().regex(/^\d{4}-\d{2}$/);

const carreira = defineCollection({
  loader: file('src/content/carreira.json'),
  schema: z.object({
    empresa: z.string(),
    cargo: z.string(),
    local: z.string(),
    inicio: anoMes,
    fim: anoMes.optional(),
    bullets: z.array(z.string()),
    tags: z.array(z.string()),
    en: z.object({ cargo: z.string(), local: z.string(), bullets: z.array(z.string()) }).optional(),
  }),
});

export const collections = { projetos, projetosEn, carreira };
