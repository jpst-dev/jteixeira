// Gera os PDFs do currículo a partir das páginas /cv e /en/cv do build.
//   npm run cv   → public/Joao-Pedro-Teixeira-CV.pdf (PT) e public/Joao-Pedro-Teixeira-Resume.pdf (EN), sem telefone
//   npm run cv -- --telefone "(14) 9...." --saida C:/caminho/cv.pdf [--lang en]   → versão privada com WhatsApp
// Requer `npm run build` antes (o script `cv` já faz) e o Google Chrome instalado (ou CHROME_PATH).
import { resolve } from 'node:path';
import { comChrome, opcao } from './chrome-dist.mjs';

const paginas = {
  pt: { caminho: '/cv/', publico: 'public/Joao-Pedro-Teixeira-CV.pdf' },
  en: { caminho: '/en/cv/', publico: 'public/Joao-Pedro-Teixeira-Resume.pdf' },
};

async function gerar(lang, saida, telefone) {
  await comChrome((base) => [
    '--no-pdf-header-footer',
    '--virtual-time-budget=5000',
    `--print-to-pdf=${saida}`,
    `${base}${paginas[lang].caminho}${telefone ? `?tel=${encodeURIComponent(telefone)}` : ''}`,
  ]);
  console.log(`CV gerado (${lang}): ${saida}${telefone ? ' (com telefone)' : ''}`);
}

const telefone = opcao('telefone');
if (telefone) {
  // Versão privada: nunca vai para public/ por padrão.
  const lang = opcao('lang') ?? 'pt';
  if (!paginas[lang]) throw new Error(`--lang deve ser pt ou en (recebido: ${lang})`);
  const saida = opcao('saida');
  if (!saida) throw new Error('Com --telefone, informe --saida (o PDF com telefone não deve ir para public/).');
  await gerar(lang, resolve(saida), telefone);
} else {
  for (const lang of Object.keys(paginas)) await gerar(lang, resolve(paginas[lang].publico));
}
