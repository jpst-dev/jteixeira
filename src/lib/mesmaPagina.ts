// Compara caminhos ignorando a barra final: jteixeira.dev/en e /en/ são a mesma página.
const semBarra = (caminho: string) => caminho.replace(/\/+$/, '') || '/';

export const mesmaPagina = (a: string, b: string): boolean => semBarra(a) === semBarra(b);
