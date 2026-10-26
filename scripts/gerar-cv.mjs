// Gera o PDF do currículo a partir da página /cv do build.
//   npm run cv                                  → public/Joao-Pedro-Teixeira-CV.pdf (sem telefone, vai para o site)
//   npm run cv -- --telefone "(14) 9...." --saida C:/caminho/cv.pdf   → versão privada com WhatsApp
// Requer `npm run build` antes (o script `cv` já faz) e o Google Chrome instalado (ou CHROME_PATH).
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { extname, join, resolve } from 'node:path';

const args = process.argv.slice(2);
const opcao = (nome) => {
  const i = args.indexOf(`--${nome}`);
  return i === -1 ? undefined : args[i + 1];
};
const telefone = opcao('telefone');
const saida = resolve(opcao('saida') ?? 'public/Joao-Pedro-Teixeira-CV.pdf');

const chrome = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find((p) => p && existsSync(p));
if (!chrome) throw new Error('Chrome não encontrado: defina CHROME_PATH.');

const DIST = resolve('dist');
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const servidor = createServer(async (req, res) => {
  let caminho = join(DIST, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  try {
    if ((await stat(caminho)).isDirectory()) caminho = join(caminho, 'index.html');
    res.writeHead(200, { 'content-type': tipos[extname(caminho)] ?? 'application/octet-stream' });
    res.end(await readFile(caminho));
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((ok) => servidor.listen(0, ok));
const url = `http://localhost:${servidor.address().port}/cv/${telefone ? `?tel=${encodeURIComponent(telefone)}` : ''}`;

try {
  await new Promise((ok, falha) =>
    execFile(
      chrome,
      ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--virtual-time-budget=5000', `--print-to-pdf=${saida}`, url],
      (erro) => (erro ? falha(erro) : ok()),
    ),
  );
  console.log(`CV gerado: ${saida}${telefone ? ' (com telefone)' : ''}`);
} finally {
  servidor.close();
}
