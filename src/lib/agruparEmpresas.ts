type Experiencia = { data: { empresa: string; inicio: string; fim?: string } };

export type Empresa<T> = { empresa: string; inicio: string; fim?: string; cargos: T[] };

// Junta cargos seguidos na mesma empresa (entrada já vem do mais recente para o mais antigo).
export function agruparEmpresas<T extends Experiencia>(experiencias: T[]): Empresa<T>[] {
  const grupos: Empresa<T>[] = [];
  for (const exp of experiencias) {
    const ultimo = grupos.at(-1);
    if (ultimo && ultimo.empresa === exp.data.empresa) ultimo.cargos.push(exp);
    else grupos.push({ empresa: exp.data.empresa, inicio: exp.data.inicio, fim: exp.data.fim, cargos: [exp] });
  }
  for (const grupo of grupos) {
    grupo.inicio = grupo.cargos.map((c) => c.data.inicio).sort()[0];
    const atual = grupo.cargos.some((c) => !c.data.fim);
    grupo.fim = atual ? undefined : grupo.cargos.map((c) => c.data.fim!).sort().at(-1);
  }
  return grupos;
}
