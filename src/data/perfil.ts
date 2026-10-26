// Dados compartilhados entre o site e o currículo (/cv), por idioma.
import type { Lang } from '../i18n/rotas';

export const contato = {
  email: 'jteixeira.dev@outlook.com',
  site: 'jteixeira.dev',
  linkedin: 'linkedin.com/in/jpst-dev',
  github: 'github.com/jpst-dev',
  local: { pt: 'Lins, SP · remoto', en: 'Lins, Brazil · remote' } satisfies Record<Lang, string>,
};

type Grupo = { categoria: string; itens: string[] };

export const skills: Record<Lang, Grupo[]> = {
  pt: [
    {
      categoria: 'Front-end',
      itens: ['Vue.js', 'Nuxt', 'React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Pinia', 'Design System'],
    },
    {
      categoria: 'Backend',
      itens: ['C#', '.NET', 'APIs REST', 'Node.js', 'Integração front ↔ API'],
    },
    {
      categoria: 'AI-Assisted Engineering',
      itens: ['Claude Code', 'Cursor', 'Agentes de código', 'Refatoração e testes com IA', 'Revisão humana'],
    },
    {
      categoria: 'Qualidade, testes & entrega',
      itens: ['TDD', 'Jest', 'Vitest', 'Cypress', 'Playwright', 'Code review', 'CI/CD', 'Docker', 'Acessibilidade', 'Performance web'],
    },
  ],
  en: [
    {
      categoria: 'Front end',
      itens: ['Vue.js', 'Nuxt', 'React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Pinia', 'Design System'],
    },
    {
      categoria: 'Back end',
      itens: ['C#', '.NET', 'REST APIs', 'Node.js', 'Front end ↔ API integration'],
    },
    {
      categoria: 'AI-Assisted Engineering',
      itens: ['Claude Code', 'Cursor', 'Coding agents', 'AI-assisted refactoring and testing', 'Human review'],
    },
    {
      categoria: 'Quality, testing & delivery',
      itens: ['TDD', 'Jest', 'Vitest', 'Cypress', 'Playwright', 'Code review', 'CI/CD', 'Docker', 'Accessibility', 'Web performance'],
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
