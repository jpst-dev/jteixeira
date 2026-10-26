import type { Lang } from '../i18n/rotas';

const MESES: Record<Lang, string[]> = {
  pt: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};
const ATUAL: Record<Lang, string> = { pt: 'hoje', en: 'present' };

function formatMes(valor: string, lang: Lang): string {
  const match = /^(\d{4})-(\d{2})$/.exec(valor);
  const mes = match ? MESES[lang][Number(match[2]) - 1] : undefined;
  if (!match || !mes) throw new Error(`Data inválida (esperado YYYY-MM): ${valor}`);
  return `${mes} ${match[1]}`;
}

export function formatPeriodo(inicio: string, fim?: string, lang: Lang = 'pt'): string {
  return `${formatMes(inicio, lang)} — ${fim ? formatMes(fim, lang) : ATUAL[lang]}`;
}
