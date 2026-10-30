// Os primeiros projetos (pela `ordem`) ganham a vitrine grande; o resto vai para "Outros projetos".
const NA_VITRINE = 3;

export const dividirVitrine = <T>(projetos: T[]): { vitrine: T[]; outros: T[] } => ({
  vitrine: projetos.slice(0, NA_VITRINE),
  outros: projetos.slice(NA_VITRINE),
});
