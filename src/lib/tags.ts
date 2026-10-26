// Em cada card, as primeiras tags marcam o que é central naquele projeto ou cargo;
// a ordem é escolhida no conteúdo. O nível de domínio fica na seção Skills.
const DESTAQUES = 2;

export const ehDestaque = (indice: number): boolean => indice < DESTAQUES;
