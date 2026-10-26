# Versão em inglês — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Versão completa em inglês do portfólio (home, projetos, CV, OG, SEO) em `/en`, com seletor PT/EN, sem duplicar layout.

**Architecture:** Componentes recebem `lang: Lang`. Textos curtos vêm de um dicionário tipado (`src/i18n/ui.ts`); rotas/âncoras de `src/i18n/rotas.ts`. Textos longos: bloco `en` no `carreira.json`, coleção `projetosEn` mesclada aos projetos PT por id, perfil bilíngue. Cada página vira um componente "de página" (`Home`, `ProjetoPagina`, `CvPagina`, `OgPagina`) usado por rotas finas PT e EN.

**Tech Stack:** Astro 7 (i18n routing), Vue 3, Tailwind 4, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-26-versao-ingles-design.md`

## Global Constraints
- Sem novas dependências.
- PT inalterado: mesmas URLs (`/`, `/projetos/<id>/`, `/cv/`), mesmas âncoras (`#sobre`, `#carreira`, `#projetos`, `#skills`, `#contato`), mesmos textos.
- EN: `/en/`, `/en/projects/<id>/`, `/en/cv/`; âncoras `#about`, `#career`, `#projects`, `#skills`, `#contact`.
- Arquivos: `public/og-en.png`, `public/Joao-Pedro-Teixeira-Resume.pdf`.
- Projeto sem tradução EN → build falha com mensagem clara.
- Lighthouse PT e EN: Perf ≥ 90, A11y 100, BP ≥ 95, SEO 100. Testes verdes, build OK a cada task.
- Tom do inglês: natural, de dev; nomes de tecnologias/eventos/instituições inalterados.

## Review Focus
1. **Português vazando no `/en`** (aria-labels, mensagens do form, datas, rótulos) — pinado na Task 6 (varredura de palavras PT no `dist/en`).
2. **Âncoras e scroll no EN** (navbar, indicador, CTA, scroll hint usam ids EN) — pinado na Task 6 (clicar "Projects" rola até `#projects` e marca o indicador).
3. **Seletor leva à página equivalente** (projeto ↔ project, cv ↔ cv) — pinado na Task 1 (teste de `caminhoAlternativo`) e Task 6.
4. **hreflang/canonical corretos por página** — pinado na Task 6 (grep no dist).
5. **Ilha Vue (form, menu mobile) no idioma certo após hidratação** — pinado na Task 6 (texto do botão e erro de validação no EN).

---

### Task 1: Núcleo i18n (dicionário, rotas, datas, validação)

**Files:** Create `src/i18n/ui.ts`, `src/i18n/rotas.ts`, `src/i18n/rotas.test.ts`; Modify `src/lib/formatPeriodo.ts` (+test), `src/lib/validateContato.ts` (+test), `astro.config.mjs`

**Interfaces — Produces:**
- `export type Lang = 'pt' | 'en'`
- `export const ui: Record<Lang, Dicionario>` e `export function t(lang: Lang): Dicionario` (Dicionario = tipo do objeto PT; EN tipado como `Dicionario`, então chave faltando quebra o `astro check`/tsc).
- `rotas.ts`: `export const secoes: Record<Lang, { sobre: string; carreira: string; projetos: string; skills: string; contato: string }>`; `export function home(lang): string` ('/' | '/en/'); `export function projeto(lang, id): string`; `export function cvPdf(lang): string`; `export function ogImagem(lang): string`; `export function caminhoAlternativo(pathname: string): string` (PT→EN e EN→PT); `export function langDe(pathname: string): Lang`.
- `formatPeriodo(inicio, fim?, lang: Lang = 'pt')` → EN: `Jul 2022 — present`.
- `validateContato(data, lang: Lang = 'pt')` → mensagens EN.

- [ ] **Step 1: Testes**
```ts
// rotas.test.ts
expect(caminhoAlternativo('/')).toBe('/en/');
expect(caminhoAlternativo('/en/')).toBe('/');
expect(caminhoAlternativo('/projetos/gamedeals/')).toBe('/en/projects/gamedeals/');
expect(caminhoAlternativo('/en/projects/gamedeals/')).toBe('/projetos/gamedeals/');
expect(caminhoAlternativo('/cv/')).toBe('/en/cv/');
expect(caminhoAlternativo('/en/cv/')).toBe('/cv/');
expect(langDe('/en/projects/x/')).toBe('en'); expect(langDe('/projetos/x/')).toBe('pt');
// formatPeriodo.test.ts (novo caso)
expect(formatPeriodo('2022-07', undefined, 'en')).toBe('Jul 2022 — present');
expect(formatPeriodo('2020-12', '2022-06', 'en')).toBe('Dec 2020 — Jun 2022');
// validateContato.test.ts (novo caso)
expect(validateContato({ nome: '', email: 'x', mensagem: '' }, 'en').errors).toEqual({
  nome: 'Please enter your full name.', email: 'Please enter a valid email.', mensagem: 'Write a message with at least 10 characters.' });
```
- [ ] **Step 2:** `npx vitest run` → FAIL nos novos.
- [ ] **Step 3:** Implementar. `astro.config.mjs`: `i18n: { defaultLocale: 'pt', locales: ['pt', 'en'], routing: { prefixDefaultLocale: false } }`. Dicionário: todas as strings fixas dos componentes (nav, hero, títulos/linhas de seção, Sobre parágrafos/entregas/stats, marquee aria, carreira rótulos, projetos rótulos "Destaque"/"Ver case"/"Problema"/"Solução"/"Próximo projeto"/"voltar", skills, contato textos/copiar/copiado, form placeholders/botões/status, menu aria, rodapé, metadados title/description da home, typewriter frases + sr-only, seletor "PT"/"EN" + aria "Ver em português"/"View in English").
- [ ] **Step 4:** `npx vitest run` → PASS; `npm run build` OK.
- [ ] **Step 5:** Commit `feat(i18n): dictionary, routes, localized dates and validation`.

### Task 2: Conteúdo bilíngue (carreira, perfil, projetos EN)

**Files:** Modify `src/content.config.ts`, `src/content/carreira.json`, `src/data/perfil.ts`; Create `src/content/projetos-en/{be-the-hero,cinematch,finance-dashboard,gamedeals,veritas-fidei}.mdx`, `src/lib/mesclarProjeto.ts` (+test)

**Interfaces — Produces:**
- Schema carreira: `en: z.object({ cargo, local, bullets }).optional()`.
- Coleção `projetosEn` (glob em `./src/content/projetos-en`), schema `{ titulo, resumo, problema, solucao, papel }`.
- `export function mesclarProjeto<P extends { id: string; data: object }, E extends { id: string; data: object }>(pt: P, traducoes: E[]): P & { traducao: E }` — lança `Error('Projeto "<id>" sem tradução em src/content/projetos-en/<id>.mdx')` se faltar; retorna `{ ...pt, data: { ...pt.data, ...en.data }, traducao: en }` (o `traducao` é passado ao `render()` para o corpo EN).
- `perfil.ts`: `skills`, `formacao`, `certificacoes`, `idiomas` viram `Record<Lang, ...>` (mesma forma interna); `contato.local` vira `Record<Lang,string>` (`Lins, SP · remote`).

- [ ] **Step 1: Teste** `mesclarProjeto`: mescla campos EN por cima mantendo `stack`/`linkDemo`; lança com a mensagem exata quando não há tradução.
- [ ] **Step 2:** FAIL. **Step 3:** Implementar + traduzir (tom natural; nomes próprios mantidos; cursos traduzidos, TDC/FATEC-SP/UNIGRANDE mantidos). Atualizar usos de `perfil` (Carreira, Skills, cv) para `[lang]` com `'pt'` por enquanto.
- [ ] **Step 4:** PASS; build OK; PT idêntico (diff do `dist/index.html` antes/depois só em whitespace — conferir visualmente que nada mudou no PT).
- [ ] **Step 5:** Commit `content(i18n): English career, profile and project translations`.

### Task 3: Componentes com `lang` + home EN

**Files:** Modify todos os componentes de `src/components/` com texto, `BaseLayout.astro`, `Nav.astro` (+ seletor), `MobileMenu.vue` (props `textos`, `alternativo`), `ContatoForm.vue` (prop `lang`), `src/scripts/*` se necessário; Create `src/components/Home.astro`, `src/pages/en/index.astro`; Modify `src/pages/index.astro`.

**Interfaces:**
- Consumes: Task 1 (`t`, `secoes`, `home`, `cvPdf`, `ogImagem`, `caminhoAlternativo`, `langDe`), Task 2 (perfil por lang, carreira `en`).
- Produces: `Home.astro` com prop `lang`; `BaseLayout` props `lang` (default `'pt'`) — gera `<html lang="pt-BR"|"en">`, `og:locale` `pt_BR`|`en_US`, `og:locale:alternate`, `<link rel="alternate" hreflang="pt-BR" href=PT>`, `hreflang="en"`, `hreflang="x-default"`→PT (URLs absolutas via `caminhoAlternativo`), `og:image` default `ogImagem(lang)`.
- Seletor: link `PT`/`EN` (mono, discreto, ao lado do `cv`) para `caminhoAlternativo(Astro.url.pathname)`, `hreflang` e `lang` no link; no menu mobile, ao lado do CV.

- [ ] **Step 1:** Implementar; ids das seções vêm de `secoes[lang]`; nav links/indicador usam esses ids; Hero CTA e scroll hint idem; `ProjetoCard` linka para `projeto(lang, id)`; `Projetos` mescla traduções quando `lang==='en'`.
- [ ] **Step 2:** `npm run build && npx vitest run` → OK. Conferir `dist/en/index.html` existe e `dist/index.html` mantém âncoras PT.
- [ ] **Step 3:** Commit `feat(i18n): localized components and English home`.

### Task 4: Páginas de projeto EN

**Files:** Create `src/components/ProjetoPagina.astro`, `src/pages/en/projects/[...id].astro`; Modify `src/pages/projetos/[...id].astro` (vira rota fina).

- [ ] **Step 1:** Mover o corpo da página para `ProjetoPagina` (props `lang`, `projeto` mesclado, `Content`, `proximo`); EN renderiza o corpo de `traducao`; "voltar" → `home(lang)#<projetos>`; "Próximo projeto" → `projeto(lang, id)`.
- [ ] **Step 2:** Build OK; `dist/en/projects/<id>/index.html` para os 5; build falha se removido um `projetos-en/*.mdx` (testar removendo temporariamente um arquivo e restaurando).
- [ ] **Step 3:** Commit `feat(i18n): English project pages`.

### Task 5: CV, OG e sitemap em inglês

**Files:** Create `src/components/CvPagina.astro`, `src/components/OgPagina.astro`, `src/pages/en/cv.astro`, `src/pages/en/og.astro`; Modify `src/pages/cv.astro`, `src/pages/og.astro`, `src/pages/sitemap.xml.ts`, `scripts/gerar-cv.mjs` (gera PT e EN; `--lang` p/ privado), `scripts/gerar-og.mjs` (gera os dois), `src/data/perfil.ts` (`CV_HREF` → usar `cvPdf(lang)`), `public/robots.txt` (`Disallow: /en/og/`).

- [ ] **Step 1:** Implementar; resumo e rótulos do CV em inglês ("Summary", "Experience", "Projects", "Skills", "Education", "Languages", "Certifications"); título da página EN "João Pedro Teixeira — Resume"; telefone EN `(WhatsApp)`.
- [ ] **Step 2:** `npm run og && npm run cv` → gera `og.png`, `og-en.png`, CV PT e `Joao-Pedro-Teixeira-Resume.pdf`; cada PDF com 1 página (contar `\f` via `pdftotext`); sitemap lista 12 URLs (6 PT + 6 EN).
- [ ] **Step 3:** Commit `feat(i18n): English resume, OG image and sitemap`.

### Task 6: Verificação

- [ ] **Step 1:** Varredura de PT no EN: `grep -oiE "\b(sobre|carreira|projetos|contato|enviar|mensagem|copiar|hoje|voltar|próximo|problema|solução|destaque|anos|remoto|menu mobile|abrir menu|fechar menu|tecnologias)\b"` em `dist/en/**/*.html` (fora de nomes próprios e do seletor "PT") → 0 ocorrências inesperadas.
- [ ] **Step 2:** Puppeteer em `/en/` 1280 e 360: digitação com frases EN; clicar "Projects" rola até `#projects` e o indicador marca o link; seletor EN→PT em `/en/projects/gamedeals/` leva a `/projetos/gamedeals/`; form: enviar vazio mostra "Please enter your full name."; botão "Send message"; overflow 0; 0 pageerror.
- [ ] **Step 3:** hreflang/canonical: `dist/index.html` e `dist/en/index.html` têm canonical próprio e os três `alternate`.
- [ ] **Step 4:** Lighthouse mobile `/en/` e `/en/projects/gamedeals/` (preview em porta livre): metas da Global Constraints.
- [ ] **Step 5:** Screenshots EN (home, um projeto, CV) para o autor revisar a tradução antes do merge.
