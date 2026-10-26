// Gera o PDF do currículo a partir da página /cv do build.
//   npm run cv                                  → public/Joao-Pedro-Teixeira-CV.pdf (sem telefone, vai para o site)
//   npm run cv -- --telefone "(14) 9...." --saida C:/caminho/cv.pdf   → versão privada com WhatsApp
// Requer `npm run build` antes (o script `cv` já faz) e o Google Chrome instalado (ou CHROME_PATH).
import { resolve } from 'node:path';
import { comChrome, opcao } from './chrome-dist.mjs';

const telefone = opcao('telefone');
const saida = resolve(opcao('saida') ?? 'public/Joao-Pedro-Teixeira-CV.pdf');

await comChrome((base) => [
  '--no-pdf-header-footer',
  '--virtual-time-budget=5000',
  `--print-to-pdf=${saida}`,
  `${base}/cv/${telefone ? `?tel=${encodeURIComponent(telefone)}` : ''}`,
]);
console.log(`CV gerado: ${saida}${telefone ? ' (com telefone)' : ''}`);
