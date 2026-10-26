// Utilitários dos scripts de geração (CV e imagem OG): servir o dist/ e rodar o Chrome headless.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { extname, join, resolve } from 'node:path';

export function opcao(nome) {
  const args = process.argv.slice(2);
  const i = args.indexOf(`--${nome}`);
  return i === -1 ? undefined : args[i + 1];
}

const chrome = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find((p) => p && existsSync(p));

const tipos = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
};

/** Sobe um servidor estático do dist/, roda o Chrome headless com `argsChrome(url base)` e encerra. */
export async function comChrome(argsChrome) {
  if (!chrome) throw new Error('Chrome não encontrado: defina CHROME_PATH.');
  const dist = resolve('dist');
  const servidor = createServer(async (req, res) => {
    let caminho = join(dist, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    try {
      if ((await stat(caminho)).isDirectory()) caminho = join(caminho, 'index.html');
      res.writeHead(200, { 'content-type': tipos[extname(caminho)] ?? 'application/octet-stream' });
      res.end(await readFile(caminho));
    } catch {
      res.writeHead(404).end();
    }
  });
  await new Promise((ok) => servidor.listen(0, ok));
  const base = `http://localhost:${servidor.address().port}`;
  try {
    await new Promise((ok, falha) =>
      execFile(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', ...argsChrome(base)], (erro) =>
        erro ? falha(erro) : ok(),
      ),
    );
  } finally {
    servidor.close();
  }
}
