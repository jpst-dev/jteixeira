// Tecnologias principais do perfil (Vue, Nuxt, TypeScript, C#/.NET e variações) ganham destaque nos badges.
const PRINCIPAL = /^(vue|nuxt|typescript|c#|\.net|IA|AI|Design System)(?![a-z-])/i;

export const ehPrincipal = (tech: string): boolean => PRINCIPAL.test(tech.trim());
