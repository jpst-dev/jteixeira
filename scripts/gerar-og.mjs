// Gera public/og.png (1200×630, imagem de compartilhamento) a partir da página /og do build.
import { resolve } from 'node:path';
import { comChrome } from './chrome-dist.mjs';

const saida = resolve('public/og.png');
await comChrome((base) => ['--window-size=1200,630', '--virtual-time-budget=5000', `--screenshot=${saida}`, `${base}/og/`]);
console.log(`Imagem OG gerada: ${saida}`);
