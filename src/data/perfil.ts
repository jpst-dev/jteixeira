// Dados compartilhados entre o site e o currículo (/cv), por idioma.
import type { Lang } from '../i18n/rotas';

export const contato = {
  email: 'jteixeira.dev@outlook.com',
  site: 'jteixeira.dev',
  linkedin: 'linkedin.com/in/jpst-dev',
  github: 'github.com/jpst-dev',
  local: { pt: 'Lins, SP · remoto', en: 'Lins, Brazil · remote' } satisfies Record<Lang, string>,
};

// diaADia: o que uso no trabalho hoje; jaUsei: o que já usei em projetos.
type Grupo = { categoria: string; diaADia: string[]; jaUsei: string[] };

export const skills: Record<Lang, Grupo[]> = {
  pt: [
    {
      categoria: 'Front-end',
      diaADia: ['Vue.js', 'Nuxt', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Design System'],
      jaUsei: ['React', 'Next.js', 'Pinia'],
    },
    {
      categoria: 'Backend',
      diaADia: ['C#', '.NET', 'APIs REST', 'Integração front ↔ API'],
      jaUsei: ['Node.js'],
    },
    {
      categoria: 'AI-Assisted Engineering',
      diaADia: ['Claude Code', 'Cursor', 'Agentes de código', 'Refatoração e testes com IA', 'Revisão humana'],
      jaUsei: [],
    },
    {
      categoria: 'Qualidade, testes & entrega',
      diaADia: ['TDD', 'Jest', 'Cypress', 'Playwright', 'Code review', 'CI/CD', 'Docker', 'Acessibilidade', 'Performance web'],
      jaUsei: ['Vitest'],
    },
  ],
  en: [
    {
      categoria: 'Front end',
      diaADia: ['Vue.js', 'Nuxt', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Design System'],
      jaUsei: ['React', 'Next.js', 'Pinia'],
    },
    {
      categoria: 'Back end',
      diaADia: ['C#', '.NET', 'REST APIs', 'Front end ↔ API integration'],
      jaUsei: ['Node.js'],
    },
    {
      categoria: 'AI-Assisted Engineering',
      diaADia: ['Claude Code', 'Cursor', 'Coding agents', 'AI-assisted refactoring and testing', 'Human review'],
      jaUsei: [],
    },
    {
      categoria: 'Quality, testing & delivery',
      diaADia: ['TDD', 'Jest', 'Cypress', 'Playwright', 'Code review', 'CI/CD', 'Docker', 'Accessibility', 'Web performance'],
      jaUsei: ['Vitest'],
    },
  ],
};

type Formacao = { curso: string; instituicao: string; periodo: string };

export const formacao: Record<Lang, Formacao[]> = {
  pt: [
    { curso: 'CST em Tecnologia da Informação', instituicao: 'UNIGRANDE', periodo: '2025 — 2027 · cursando' },
    { curso: 'Tecnólogo em Tecnologia da Informação', instituicao: 'FATEC-SP', periodo: '2020 — 2022 · trancado' },
  ],
  en: [
    { curso: 'Associate Degree in Information Technology', instituicao: 'UNIGRANDE', periodo: '2025 — 2027 · in progress' },
    { curso: 'Associate Degree in Information Technology', instituicao: 'FATEC-SP', periodo: '2020 — 2022 · on hold' },
  ],
};

export const certificacoes: Record<Lang, string[]> = {
  pt: [
    'Formação Engenheiro de IA Generativa 2026: IA na Prática',
    'Engenharia de Prompt: ChatGPT, Gemini, Meta AI, Grok e mais',
    'TDC 2024 São Paulo — Trilhas Web & Front-end, JavaScript & Node.js e UX Design',
    'TDC 2023 Business — Trilha JavaScript e TypeScript',
    'TDC 2022 Business — Trilha Web / Front-end',
    'Performance Web I e II: otimização, Critical Path, HTTP/2 e Resource Hints',
    'Cypress: automação de testes E2E',
    'Desenvolvimento Web Completo 2022',
  ],
  en: [
    'Generative AI Engineer Program 2026: AI in Practice',
    'Prompt Engineering: ChatGPT, Gemini, Meta AI, Grok and more',
    'TDC 2024 São Paulo — Web & Front-end, JavaScript & Node.js and UX Design tracks',
    'TDC 2023 Business — JavaScript and TypeScript track',
    'TDC 2022 Business — Web / Front-end track',
    'Web Performance I and II: optimization, Critical Path, HTTP/2 and Resource Hints',
    'Cypress: E2E test automation',
    'Complete Web Development 2022',
  ],
};

export const idiomas: Record<Lang, string[]> = {
  pt: ['Português — nativo', 'Inglês — avançado (C1)'],
  en: ['Portuguese — native', 'English — advanced (C1)'],
};
