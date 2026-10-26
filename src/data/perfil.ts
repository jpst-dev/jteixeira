// Dados compartilhados entre o site e o currículo (/cv).

export const CV_HREF = '/Joao-Pedro-Teixeira-CV.pdf';

export const contato = {
  email: 'jteixeira.dev@outlook.com',
  site: 'jteixeira.dev',
  linkedin: 'linkedin.com/in/jpst-dev',
  github: 'github.com/jpst-dev',
  local: 'Lins, SP · remoto',
};

export const skills = [
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
];

export const formacao = [
  { curso: 'CST em Tecnologia da Informação', instituicao: 'UNIGRANDE', periodo: '2025 — 2027 · cursando' },
  { curso: 'Tecnólogo em Tecnologia da Informação', instituicao: 'FATEC-SP', periodo: '2020 — 2022 · trancado' },
];

export const certificacoes = [
  'Formação Engenheiro de IA Generativa 2026: IA na Prática',
  'Engenharia de Prompt: ChatGPT, Gemini, Meta AI, Grok e mais',
  'TDC 2024 São Paulo — Trilhas Web & Front-end, JavaScript & Node.js e UX Design',
  'TDC 2023 Business — Trilha JavaScript e TypeScript',
  'TDC 2022 Business — Trilha Web / Front-end',
  'Performance Web I e II: otimização, Critical Path, HTTP/2 e Resource Hints',
  'Cypress: automação de testes E2E',
  'Desenvolvimento Web Completo 2022',
];

export const idiomas = ['Português — nativo', 'Inglês — avançado (C1)'];
