import type { Lang } from '../i18n/rotas';

const meses = (valor: string) => {
  const [ano, mes] = valor.split('-').map(Number);
  return ano * 12 + mes - 1;
};

const UNIDADES: Record<Lang, { ano: [string, string]; mes: [string, string]; e: string }> = {
  pt: { ano: ['ano', 'anos'], mes: ['mês', 'meses'], e: ' e ' },
  en: { ano: ['yr', 'yrs'], mes: ['mo', 'mos'], e: ' ' },
};

/** Tempo entre dois YYYY-MM, contando o mês inicial e o final (sem fim, até `hoje`). */
export function duracao(inicio: string, fim: string | undefined, hoje: string, lang: Lang): string {
  const total = meses(fim ?? hoje) - meses(inicio) + 1;
  const anos = Math.floor(total / 12);
  const resto = total % 12;
  const u = UNIDADES[lang];
  const partes = [
    anos > 0 ? `${anos} ${u.ano[anos === 1 ? 0 : 1]}` : '',
    resto > 0 ? `${resto} ${u.mes[resto === 1 ? 0 : 1]}` : '',
  ].filter(Boolean);
  return partes.join(u.e);
}
