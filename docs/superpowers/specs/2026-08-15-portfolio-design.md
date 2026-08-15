# Portfólio pessoal — Design

**Data:** 2026-08-15
**Autor:** João P.

## Objetivo

Portfólio pessoal para candidaturas a vagas de front-end/fullstack. Público-alvo: recrutadores técnicos e engenheiros avaliando o perfil em poucos minutos. Deve refletir o posicionamento já usado no LinkedIn do autor: front-end especialista em Vue.js/Nuxt, sólido em React/Next.js, foco em performance/acessibilidade/testes, em evolução para fullstack (C#/.NET).

## Stack

- **Astro** — shell principal do site, gera HTML estático, zero JS por padrão.
- **Vue 3** — usado como framework de ilhas (`client:*` directives do Astro) nas partes interativas: filtro/busca de projetos e validação do formulário de contato.
- **Tailwind CSS** — estilização utilitária, com tokens customizados no `tailwind.config` para as cores do tema.
- **Astro Content Collections** — conteúdo dos projetos como Markdown/MDX com schema tipado (Zod), evitando CMS externo.
- **Tipografia** — Inter (corpo/leitura) + JetBrains Mono (detalhes tipo terminal: prompts, tags de skill, labels).

Rationale: Astro entrega a melhor performance possível para um site majoritariamente estático (alinhado ao próprio discurso de performance do autor), enquanto as ilhas em Vue reaproveitam a especialidade principal do autor sem exigir aprender um segundo framework de UI.

## Estrutura do site

Site de página única com seções âncora e navegação fixa com scroll suave:

1. **Hero** — nome, título ("Front-End Developer → Fullstack"), 2-3 tags de stack principais, CTA para seção de projetos, botão de download do CV (PDF estático em `/public`).
2. **Sobre** — adaptação em 1ª pessoa do texto do LinkedIn do autor, reduzido para leitura rápida (não copiar o texto integral, reescrever para o formato web).
3. **Projetos** — grid de 3-5 cards, cada um linkando para um case study completo.
4. **Skills** — agrupadas por categoria: Front-end, Backend em evolução, Práticas/Qualidade, IA no fluxo de trabalho. Não usar barra de progresso/porcentagem (não mensurável e não profissional); usar apenas agrupamento + nível textual opcional (ex: "principal", "sólido", "aprendendo").
5. **Contato** — links diretos (LinkedIn, GitHub, e-mail) + formulário de contato.

Cada projeto do grid abre uma página própria em `/projetos/[slug]`, gerada estaticamente a partir da content collection, com: contexto/problema, solução, stack usada, papel do autor, link para repo/demo, screenshots.

## Conteúdo dos projetos

Schema da collection `projetos` (Zod, em `src/content/config.ts`):

- `titulo: string`
- `resumo: string` (1-2 frases, usado no card do grid)
- `problema: string`
- `solucao: string`
- `stack: string[]`
- `papel: string` (papel do autor no projeto)
- `link_repo: string | optional`
- `link_demo: string | optional`
- `imagens: string[] | optional`
- `destaque: boolean` (define se aparece em posição de destaque no grid)

O autor já tem 3-5 projetos identificados e vai fornecer o conteúdo para popular os arquivos MDX durante a implementação.

## Visual — tema "Dark Developer"

- Fundo: `#0d1117`
- Texto principal: `#e6edf3`
- Texto secundário: `#8b949e`
- Accent (links, botões, bordas de destaque): `#42d392` (verde-água, cor da marca Vue.js — reforço sutil da especialidade do autor)
- Bordas/dividers: `#21262d`
- Cantos levemente arredondados (6-8px), sem gradientes, sem elementos "bold"/coloridos além do accent único.
- Toques de monospace (JetBrains Mono) em: prompts decorativos do hero, tags de skill, labels de categoria.

Essas escolhas foram validadas com o autor via companheiro visual de brainstorming (3 direções comparadas: Minimal Clean, Dark Developer, Bold Modern → Dark Developer escolhido; 4 accent colors comparados → verde-água Vue escolhido).

## Formulário de contato

Sem backend próprio (site 100% estático). Usar **Web3Forms** (serviço gratuito, sem servidor, uma chamada `fetch` a partir do componente Vue do form) para receber as submissões por e-mail. Validação client-side no componente Vue antes do envio.

## Deploy & Infraestrutura

- Repositório Git local já inicializado nesta sessão, com `user.name`/`user.email` configurados localmente (distintos da config global da empresa usada em outros repos desta máquina).
- Repositório remoto e conta usados para o push serão decididos na etapa de deploy (conta pessoal do autor, não a da empresa) — **não iniciar configuração de remote/push até essa etapa ser tratada explicitamente com o autor**.
- Deploy via **Vercel**, build automático a cada push na branch principal.
- Domínio customizado: pode ser configurado depois na Vercel, se o autor tiver um domínio próprio.

## Qualidade

- Lighthouse e axe-core como critério de aceite para performance/acessibilidade — consistente com o próprio posicionamento profissional do autor.
- Testes de componente para as ilhas Vue (filtro de projetos, form de contato) com Vitest + Testing Library.
- Sem e2e (Playwright) na v1; pode ser adicionado depois se o autor quiser.

## Fora de escopo (v1)

- Blog técnico (não foi selecionado como prioridade pelo autor; estrutura de content collections deixa isso fácil de adicionar depois).
- CMS headless — conteúdo gerenciado via arquivos MDX no próprio repo.
- Testes e2e.
- Internacionalização (site em português, sem plano de i18n por ora).
