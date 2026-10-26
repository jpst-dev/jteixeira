// Textos curtos da interface. O PT define a forma; o EN é tipado contra ela,
// então uma chave faltando em qualquer idioma quebra a checagem de tipos.
import type { Lang } from './rotas';

const pt = {
  meta: {
    titulo: 'João Pedro Teixeira — Full Stack Developer · AI-Assisted Engineering',
    descricao:
      'Desenvolvedor full stack com 4+ anos construindo produtos web do Design System à API: Vue/Nuxt, React/Next, TypeScript e C#/.NET, com IA no fluxo e foco em testes e qualidade.',
    locale: 'pt_BR',
    htmlLang: 'pt-BR',
  },
  nav: {
    aria: 'Navegação principal',
    links: { sobre: 'Sobre', carreira: 'Carreira', projetos: 'Projetos', skills: 'Skills', contato: 'Contato' },
    baixarCv: 'Baixar CV',
    abrirMenu: 'Abrir menu',
    fecharMenu: 'Fechar menu',
    menuMobile: 'Menu mobile',
    // Seletor de idioma: aponta para o outro idioma.
    trocarIdioma: 'EN',
    trocarIdiomaAria: 'EN — View in English',
  },
  hero: {
    local: 'Lins, SP · remoto',
    frases: ['Full Stack Developer', 'Vue.js · Nuxt · TypeScript', 'React · Next.js · Tailwind', 'C# · .NET · APIs REST', 'Claude Code · Cursor · IA'],
    frasesSr:
      'Full Stack Developer — Vue.js, Nuxt, TypeScript, React, Next.js, Tailwind, C#, .NET, APIs REST, Claude Code, Cursor e IA',
    pitch: 'Construo produtos web do Design System à API — com IA no centro do fluxo e eu no controle da qualidade.',
    verProjetos: 'Ver projetos',
    baixarCv: 'Baixar CV',
    fotoAlt: 'Foto de João Pedro Teixeira',
    disponivel: 'disponível',
    rolarAria: 'Rolar para a seção Sobre',
  },
  sobre: {
    titulo: 'Sobre',
    linha1: 'Um pouco',
    linha2: 'sobre mim.',
    paragrafos: [
      'Sou desenvolvedor full stack com mais de 4 anos construindo produtos web, do Design System à API. Minha base é front-end — Vue.js, Nuxt, React, Next.js e TypeScript — com foco em performance, acessibilidade e código sustentável, apoiado em TDD e testes automatizados (Jest, Cypress).',
      'Hoje atuo também no backend com C#/.NET e APIs REST, cuidando da integração entre as camadas.',
      'Trabalho com IA como parte central do meu fluxo: agentes de código como Claude Code e Cursor para prototipar, refatorar e gerar testes — sempre comigo no controle da arquitetura, da revisão e da qualidade.',
    ],
    entregasTitulo: 'O que entrego',
    entregas: [
      'Interfaces escaláveis e Design Systems componentizados',
      'APIs REST em .NET integradas ao front',
      'Cobertura de testes e CI desde o início',
      'Ganho real de velocidade com IA, sem abrir mão de boas práticas',
    ],
    stats: [
      { valor: '4+ anos', legenda: 'construindo produtos web' },
      { valor: 'Design System', legenda: 'criado do zero e em evolução' },
      { valor: 'Vue · React · .NET', legenda: 'do front à API' },
    ],
  },
  marquee: { aria: 'Tecnologias com que trabalho' },
  carreira: {
    titulo: 'Carreira',
    linha1: 'Onde venho',
    linha2: 'construindo.',
    formacao: 'Formação',
    certificacoes: 'Certificações',
  },
  projetos: {
    titulo: 'Projetos',
    linha1: 'Coisas que',
    linha2: 'eu construí.',
    destaque: 'Destaque',
    verCase: 'Ver case',
    voltar: 'voltar para projetos',
    verDemo: 'Ver demo',
    repositorio: 'Repositório',
    problema: 'Problema',
    solucao: 'Solução',
    proximo: 'Próximo projeto',
    screenshotAlt: 'Screenshot do projeto',
  },
  skills: { titulo: 'Skills', linha1: 'Ferramentas do', linha2: 'dia a dia.' },
  contato: {
    titulo: 'Contato',
    linha1: 'Vamos',
    linha2: 'conversar?',
    texto:
      'Aberto a oportunidades como Full Stack / AI-Assisted Developer — e a trocar ideia sobre Vue, .NET, Design Systems e IA no desenvolvimento.',
    copiar: 'Copiar',
    copiado: 'Copiado!',
    copiadoStatus: 'E-mail copiado para a área de transferência',
  },
  form: {
    nome: 'Seu nome',
    email: 'Seu e-mail',
    mensagem: 'Sua mensagem',
    enviar: 'Enviar mensagem',
    enviando: 'Enviando...',
    enviado: 'Mensagem enviada! Obrigado pelo contato.',
    erro: 'Algo deu errado — tente novamente ou use o e-mail direto abaixo.',
  },
  rodape: { feitoCom: 'Feito com Astro, Vue & Tailwind' },
  cv: {
    tituloPagina: 'João Pedro Teixeira — Currículo',
    resumoTitulo: 'Resumo',
    resumo:
      'Desenvolvedor full stack com mais de 4 anos construindo produtos web, do Design System à API. Base sólida em front-end com Vue.js, Nuxt, React, Next.js e TypeScript, atuando também no backend com C#/.NET e APIs REST. Uso IA (Claude Code, Cursor) no centro do fluxo para prototipar, refatorar e gerar testes — com revisão humana e foco em qualidade, TDD, acessibilidade e performance.',
    experiencia: 'Experiência',
    projetos: 'Projetos',
    habilidades: 'Habilidades',
    formacao: 'Formação',
    idiomas: 'Idiomas',
    certificacoes: 'Certificações',
  },
};

export type Dicionario = typeof pt;

const en: Dicionario = {
  meta: {
    titulo: 'João Pedro Teixeira — Full Stack Developer · AI-Assisted Engineering',
    descricao:
      'Full stack developer with 4+ years building web products from Design System to API: Vue/Nuxt, React/Next, TypeScript and C#/.NET, with AI in the workflow and a focus on testing and quality.',
    locale: 'en_US',
    htmlLang: 'en',
  },
  nav: {
    aria: 'Main navigation',
    links: { sobre: 'About', carreira: 'Career', projetos: 'Projects', skills: 'Skills', contato: 'Contact' },
    baixarCv: 'Download CV',
    abrirMenu: 'Open menu',
    fecharMenu: 'Close menu',
    menuMobile: 'Mobile menu',
    trocarIdioma: 'PT',
    trocarIdiomaAria: 'PT — Ver em português',
  },
  hero: {
    local: 'Lins, Brazil · remote',
    frases: ['Full Stack Developer', 'Vue.js · Nuxt · TypeScript', 'React · Next.js · Tailwind', 'C# · .NET · REST APIs', 'Claude Code · Cursor · AI'],
    frasesSr:
      'Full Stack Developer — Vue.js, Nuxt, TypeScript, React, Next.js, Tailwind, C#, .NET, REST APIs, Claude Code, Cursor and AI',
    pitch: 'I build web products from Design System to API — with AI at the core of my workflow and me in charge of quality.',
    verProjetos: 'See projects',
    baixarCv: 'Download resume',
    fotoAlt: 'Photo of João Pedro Teixeira',
    disponivel: 'available',
    rolarAria: 'Scroll to the About section',
  },
  sobre: {
    titulo: 'About',
    linha1: 'A little',
    linha2: 'about me.',
    paragrafos: [
      "I'm a full stack developer with 4+ years building web products, from Design System to API. My foundation is front-end — Vue.js, Nuxt, React, Next.js and TypeScript — with a focus on performance, accessibility and maintainable code, backed by TDD and automated testing (Jest, Cypress).",
      'These days I also work on the back end with C#/.NET and REST APIs, owning the integration between the layers.',
      'AI is a core part of my workflow: coding agents like Claude Code and Cursor help me prototype, refactor and generate tests — while I stay in charge of architecture, review and quality.',
    ],
    entregasTitulo: 'What I deliver',
    entregas: [
      'Scalable interfaces and component-based Design Systems',
      '.NET REST APIs integrated with the front end',
      'Test coverage and CI from day one',
      'Real speed gains with AI, without cutting corners',
    ],
    stats: [
      { valor: '4+ years', legenda: 'building web products' },
      { valor: 'Design System', legenda: 'built from scratch, still evolving' },
      { valor: 'Vue · React · .NET', legenda: 'from front end to API' },
    ],
  },
  marquee: { aria: 'Technologies I work with' },
  carreira: {
    titulo: 'Career',
    linha1: "Where I've been",
    linha2: 'building.',
    formacao: 'Education',
    certificacoes: 'Certifications',
  },
  projetos: {
    titulo: 'Projects',
    linha1: 'Things',
    linha2: "I've built.",
    destaque: 'Featured',
    verCase: 'View case study',
    voltar: 'back to projects',
    verDemo: 'Live demo',
    repositorio: 'Repository',
    problema: 'Problem',
    solucao: 'Solution',
    proximo: 'Next project',
    screenshotAlt: 'Screenshot of',
  },
  skills: { titulo: 'Skills', linha1: 'Everyday', linha2: 'toolkit.' },
  contato: {
    titulo: 'Contact',
    linha1: "Let's",
    linha2: 'talk?',
    texto:
      "Open to opportunities as a Full Stack / AI-Assisted Developer — and always happy to talk Vue, .NET, Design Systems and AI in software development.",
    copiar: 'Copy',
    copiado: 'Copied!',
    copiadoStatus: 'Email copied to clipboard',
  },
  form: {
    nome: 'Your name',
    email: 'Your email',
    mensagem: 'Your message',
    enviar: 'Send message',
    enviando: 'Sending...',
    enviado: 'Message sent! Thanks for reaching out.',
    erro: 'Something went wrong — please try again or use the email below.',
  },
  rodape: { feitoCom: 'Built with Astro, Vue & Tailwind' },
  cv: {
    tituloPagina: 'João Pedro Teixeira — Resume',
    resumoTitulo: 'Summary',
    resumo:
      'Full stack developer with 4+ years building web products, from Design System to API. Strong front-end foundation with Vue.js, Nuxt, React, Next.js and TypeScript, also working on the back end with C#/.NET and REST APIs. I use AI (Claude Code, Cursor) at the core of my workflow to prototype, refactor and generate tests — with human review and a focus on quality, TDD, accessibility and performance.',
    experiencia: 'Experience',
    projetos: 'Projects',
    habilidades: 'Skills',
    formacao: 'Education',
    idiomas: 'Languages',
    certificacoes: 'Certifications',
  },
};

export const ui: Record<Lang, Dicionario> = { pt, en };

export const t = (lang: Lang): Dicionario => ui[lang];
