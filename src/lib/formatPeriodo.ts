const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function formatMes(valor: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(valor);
  const mes = match ? MESES[Number(match[2]) - 1] : undefined;
  if (!match || !mes) throw new Error(`Data inválida (esperado YYYY-MM): ${valor}`);
  return `${mes} ${match[1]}`;
}

export function formatPeriodo(inicio: string, fim?: string): string {
  return `${formatMes(inicio)} — ${fim ? formatMes(fim) : 'hoje'}`;
}
