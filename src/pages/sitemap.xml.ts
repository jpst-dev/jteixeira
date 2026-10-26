import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { caminhoAlternativo, home, projeto } from '../i18n/rotas';

// Só páginas públicas de conteúdo (/cv e /og são utilitárias e ficam fora).
// Cada URL lista sua versão no outro idioma (hreflang), como o Google recomenda.
export const GET: APIRoute = async ({ site }) => {
  const projetos = await getCollection('projetos');
  const caminhosPt = [home('pt'), ...projetos.map((p) => projeto('pt', p.id))];
  const caminhos = caminhosPt.flatMap((pt) => [pt, caminhoAlternativo(pt)]);
  const url = (c: string) => new URL(c, site).href;
  const entradas = caminhos.map((c) => {
    const [pt, en] = caminhosPt.includes(c) ? [c, caminhoAlternativo(c)] : [caminhoAlternativo(c), c];
    return [
      `  <url><loc>${url(c)}</loc>`,
      `    <xhtml:link rel="alternate" hreflang="pt-BR" href="${url(pt)}"/>`,
      `    <xhtml:link rel="alternate" hreflang="en" href="${url(en)}"/>`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${url(pt)}"/>`,
      '  </url>',
    ].join('\n');
  });
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entradas.join('\n')}\n</urlset>\n`,
    { headers: { 'content-type': 'application/xml; charset=utf-8' } },
  );
};
