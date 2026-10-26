// Endereços e âncoras por idioma. PT fica na raiz (URLs antigas não mudam); EN em /en.
export type Lang = 'pt' | 'en';

export const secoes = {
  pt: { hero: 'hero', sobre: 'sobre', carreira: 'carreira', projetos: 'projetos', skills: 'skills', contato: 'contato' },
  en: { hero: 'hero', sobre: 'about', carreira: 'career', projetos: 'projects', skills: 'skills', contato: 'contact' },
} as const satisfies Record<Lang, Record<string, string>>;

export const home = (lang: Lang) => (lang === 'en' ? '/en/' : '/');
export const projeto = (lang: Lang, id: string) => (lang === 'en' ? `/en/projects/${id}/` : `/projetos/${id}/`);
export const cvPdf = (lang: Lang) => (lang === 'en' ? '/Joao-Pedro-Teixeira-Resume.pdf' : '/Joao-Pedro-Teixeira-CV.pdf');
export const ogImagem = (lang: Lang) => (lang === 'en' ? '/og-en.png' : '/og.png');

export function langDe(pathname: string): Lang {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'pt';
}

/** Mesma página no outro idioma. */
export function caminhoAlternativo(pathname: string): string {
  if (langDe(pathname) === 'en') {
    const resto = pathname.replace(/^\/en\/?/, '/');
    return resto.replace(/^\/projects\//, '/projetos/');
  }
  return `/en${pathname.replace(/^\/projetos\//, '/projects/')}`;
}
