import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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
  }),
});

export const collections = { projetos };
