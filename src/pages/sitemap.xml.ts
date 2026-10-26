import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Só páginas públicas de conteúdo (/cv e /og são utilitárias e ficam fora).
export const GET: APIRoute = async ({ site }) => {
  const projetos = await getCollection('projetos');
  const caminhos = ['/', ...projetos.map((p) => `/projetos/${p.id}/`)];
  const urls = caminhos.map((c) => `  <url><loc>${new URL(c, site)}</loc></url>`).join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'content-type': 'application/xml; charset=utf-8' } },
  );
};
