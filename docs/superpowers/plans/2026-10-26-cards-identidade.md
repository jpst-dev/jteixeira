# Cards com identidade + logos — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cards "brilho no topo", badges `#tag`, ícones de Skills em contorno e Carreira agrupada por empresa com logo.

**Architecture:** Utilitários CSS globais (`.card`, `.tag`, `.tag-principal`, `.icone-contorno`) em `global.css`; lógica pura em `src/lib` (principal, duração, agrupamento) com testes; componentes só trocam classes.

**Tech Stack:** Astro 7, Tailwind 4, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-26-cards-identidade-design.md`

## Global Constraints
- Principais: Vue, Nuxt, TypeScript, C#/.NET (e variações: "Vue 3", "Vue.js", "Nuxt 3", "Nuxt.js", "C#", ".NET").
- CV (PDF) não muda. PT e EN iguais. Lighthouse home ≥ 90 / 100 / ≥ 95 / 100. Sem novas dependências.
- Utilitários CSS ficam em `@layer components` (Tailwind ainda sobrescreve quando o componente precisa).

## Review Focus
1. Tag principal falsa-positiva ("Vue Router", "Nuxt UI" não são principais? → **são** variações do ecossistema; regra: começa com Vue/Nuxt/TypeScript/C#/.NET) — pinado no teste de `ehPrincipal`.
2. Duração com meses = 0 ou anos = 0 ("1 ano", "11 meses") em PT/EN — pinado no teste de `duracao`.
3. Empresa com um cargo só (ViaRondon) não mostra linha do tempo vazia — pinado no teste de `agruparEmpresas` + visual.
4. Projetos com fundo de imagem/hover continuam legíveis — visual (Task 3).
5. Overflow em 360px com o cabeçalho logo + nome + duração — visual (Task 3).

---

### Task 1: Lógica pura (principal, duração, agrupamento)
**Files:** Create `src/lib/tags.ts` (+test), `src/lib/duracao.ts` (+test), `src/lib/agruparEmpresas.ts` (+test)

**Produces:**
- `ehPrincipal(tech: string): boolean` — `/^(vue|nuxt|typescript|c#|\.net)\b/i` sobre o texto (aceita "C#/.NET").
- `duracao(inicio: string, fim: string | undefined, hoje: string, lang: Lang): string` — `YYYY-MM`; conta meses inclusivos de inicio até fim (ou hoje). PT: "3 anos e 4 meses", "1 ano", "11 meses", "2 anos"; EN: "3 yrs 4 mos", "1 yr", "11 mos".
- `agruparEmpresas<T extends { data: { empresa: string; inicio: string; fim?: string } }>(exps: T[]): { empresa: string; inicio: string; fim?: string; cargos: T[] }[]` — mantém a ordem de entrada (mais recente primeiro); inicio = mais antigo, fim = undefined se algum cargo é atual, senão o maior.

Testes: `ehPrincipal('Vue 3')`, `('C#/.NET')`, `('.NET')`, `('Nuxt UI')` true; `('React')`, `('Jest')`, `('APIs REST')` false. `duracao('2022-07', undefined, '2025-10', 'pt')` = '3 anos e 4 meses'; `('2025-06','2025-06',_, 'pt')` = '1 mês'; `('2020-12','2022-06',_, 'en')` = '1 yr 7 mos'; `('2024-01','2024-12',_, 'pt')` = '1 ano'. `agruparEmpresas` com 2 ME + 1 ViaRondon → 2 grupos, ME com 2 cargos, fim undefined, inicio '2022-07'.

Commit: `feat(cards): primary tags, tenure and company grouping`

### Task 2: Estilos globais + Carreira com logo
**Files:** Modify `src/styles/global.css`, `src/content.config.ts` (campo `logo` opcional), `src/content/carreira.json`, `src/components/Carreira.astro`, `src/i18n/ui.ts` se precisar; move logos para `public/empresas/`.

- `.card`: fundo degradê (#17171b→#111114) + radial verde 7% no canto sup. direito, borda `--color-border`, sombra inset 1px; `::after` fio 1px `transparent→accent 70%→accent-2 50%→transparent` com inset 24px.
- `.tag`: mono 12px, `rounded-md`, borda `--color-border`, texto muted; `.tag-principal`: texto accent, borda accent/35, `::before '#'` opacity .6.
- `.icone-contorno`: 30px, rounded 9px, borda accent/35, cor accent, fundo transparente.
- Carreira: um card por empresa (logo 44px + nome + local + duração), cargos em linha do tempo interna (ponto verde no atual); empresa com 1 cargo sem a linha interna.

Commit: `feat(cards): glowing cards, #tags and company logos in career`

### Task 3: Aplicar no resto + verificação
**Files:** `Sobre.astro`, `Skills.astro` (+ícones), `ProjetoCard.astro`, `ProjetoPagina.astro`, `Contato.astro`, `Icon.astro` (ícones monitor/server/sparkles/shield-check se faltarem).
- Puppeteer 1280 e 360 em PT e EN: screenshots de cada seção, overflow 0, 0 erros. Lighthouse home.

Commit: `feat(cards): apply card and tag styles site-wide`
