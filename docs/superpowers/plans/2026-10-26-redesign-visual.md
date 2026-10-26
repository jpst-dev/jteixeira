# Redesign visual "Verde Vue refinado" — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesenhar todo o portfólio na direção visual B ("Verde Vue refinado"), adicionando seção Carreira, faixa de stack, menu mobile e animações GSAP, sem mudar o conteúdo atual.

**Architecture:** Mesma base Astro 7 + ilhas Vue + Tailwind 4. Tokens de cor novos em `@theme` (mantendo os nomes `bg/text/muted/accent/border` para não quebrar nada no meio do caminho). Seções viram componentes `.astro` com um `SectionHeading` comum; animações num único módulo `src/scripts/animations.ts` dirigido por atributos `data-*`, carregado pelo `BaseLayout`. Lógica pura vai para `src/lib/*` com testes Vitest.

**Tech Stack:** Astro 7, Vue 3, Tailwind 4, MDX, Vitest 4, GSAP 3.15 (ScrollTrigger, SplitText), `@fontsource-variable/inter`, `@fontsource/jetbrains-mono`.

**Spec:** `docs/superpowers/specs/2026-10-26-redesign-visual-design.md`

## Global Constraints

- Build 100% estático (`npm run build` sem erros); `npm run test` verde ao fim de cada task.
- Única dependência de runtime nova: `gsap` (+ troca de `@fontsource/inter` por `@fontsource-variable/inter`).
- Paleta exata: bg `#09090b`, surface `#18181b`, border `#27272a`, border-strong `#3f3f46`, text `#fafafa`, muted `#a1a1aa`, subtle `#7c7c85`, accent `#42d392`, accent-2 `#2dd4bf`, on-accent `#052e1c`.
- Container `max-w-6xl`, gutter `px-4` mobile / `sm:px-6`. Sem scroll horizontal em 360px.
- Labels de seção: `01 — Sobre`, `02 — Carreira`, `03 — Projetos`, `04 — Skills`, `05 — Contato` (mono, número em `subtle`, nome em `text`).
- Foco visível em todo interativo: `outline: 2px solid accent; outline-offset: 2px` via `:focus-visible`. Nenhum `focus:outline-none` sem substituto.
- Conteúdo visível sem JS; `prefers-reduced-motion: reduce` → sem animação de entrada, marquee parado.
- Contraste AA para todo texto.
- Textos atuais dos componentes/MDX mantidos; dados novos são provisórios do CV.
- Commits pequenos, mensagem em inglês no estilo `feat:`/`refactor:`/`chore:`.

## Review Focus

1. **Sem JS ou GSAP falhando** — todo conteúdo com `data-reveal` precisa aparecer. Pinado na Task 9 (fallback de 3s + checagem com JS desligado).
2. **`prefers-reduced-motion`** — nada se move, nada fica escondido. Pinado na Task 9.
3. **360px de largura** — títulos grandes, marquee e e-mail longo não podem gerar scroll horizontal. Pinado na Task 10 (`scrollWidth === clientWidth`).
4. **Projeto sem `imagens` e sem `linkDemo`** (todos hoje) — card e página precisam do placeholder e não podem renderizar botão vazio. Pinado nas Tasks 6 e 8.
5. **Âncoras sob nav fixa e menu mobile por teclado** — título da seção não pode ficar coberto; menu fecha com Esc e ao clicar num link, foco volta ao botão. Pinado nas Tasks 1 e 2.

---

## File Structure

| Arquivo | Responsabilidade |
|---|---|
| `src/styles/global.css` | tokens, fundo, foco, scroll, regras de reveal |
| `src/layouts/BaseLayout.astro` | head, script inline `js`, Nav, Footer, import do `animations.ts` |
| `src/components/ui/SectionHeading.astro` | label numerado + título de seção |
| `src/components/ui/Icon.astro` | SVGs inline (github, linkedin, mail, arrow-right, arrow-up-right, copy, download) |
| `src/components/Nav.astro` + `src/components/MobileMenu.vue` | nav em pílula + menu mobile |
| `src/components/Hero.astro` | hero |
| `src/components/Sobre.astro`, `src/components/StackMarquee.astro` | sobre + stats, faixa de stack |
| `src/content/carreira.json`, `src/lib/formatPeriodo.ts`, `src/components/Carreira.astro` | carreira |
| `src/lib/separarProjetos.ts`, `src/components/ProjetoCard.astro`, `src/components/Projetos.astro` | projetos (substitui `ProjetosGrid.vue` + `filterProjetos`) |
| `src/components/Skills.astro`, `Contato.astro`, `ContatoForm.vue`, `Footer.astro` | restyle |
| `src/pages/projetos/[...id].astro` | página de projeto |
| `src/scripts/animations.ts` | GSAP |

---

### Task 1: Fundação visual (tokens, fundo, layout base, SectionHeading, Icon)

**Files:**
- Modify: `package.json`, `src/styles/global.css`, `src/layouts/BaseLayout.astro`
- Create: `src/components/ui/SectionHeading.astro`, `src/components/ui/Icon.astro`

**Interfaces:**
- Produces: utilitários Tailwind `bg-bg bg-surface border-border border-border-strong text-text text-muted text-subtle text-accent bg-accent text-on-accent` + `accent-2`; classe `.text-gradient` (gradiente accent→accent-2 com `background-clip:text`); classe `.hero-backdrop` (grade + brilho, com máscara radial); `<SectionHeading numero="01" titulo="Sobre" id?="sobre-titulo" />` renderiza `<p class="font-mono text-sm"><span class="text-subtle">01 —</span> <span class="text-text">Sobre</span></p>`; `<Icon name="github" class? size?=20 />` com `aria-hidden="true"`; `section[id] { scroll-margin-top: 6rem }`.

- [ ] **Step 1:** `npm install` e depois `npm install gsap@3.15.0 @fontsource-variable/inter@5.3.0 && npm uninstall @fontsource/inter`. Expected: `package.json` atualizado.
- [ ] **Step 2:** Reescrever `global.css`: imports (`@fontsource-variable/inter`, jetbrains-mono 400/500), `@theme` com a paleta das Global Constraints (`--color-surface`, `--color-border-strong`, `--color-subtle`, `--color-accent-2`, `--color-on-accent`), `--font-sans: "Inter Variable", system-ui, sans-serif`. Mover `scroll-behavior: smooth` para `html` dentro de `@media (prefers-reduced-motion: no-preference)`. Adicionar `:focus-visible` global, `section[id]{scroll-margin-top:6rem}`, `.text-gradient`, `.hero-backdrop` (grade 32px `rgba(255,255,255,.035)` + radial `rgba(66,211,146,.2)` em 75% 30%, `mask-image: radial-gradient(ellipse at center, #000 40%, transparent 75%)`).
- [ ] **Step 3:** Criar `SectionHeading.astro` e `Icon.astro` (paths SVG de Simple Icons para github/linkedin, Lucide para o resto).
- [ ] **Step 4:** `BaseLayout.astro`: `<html class="no-js">` + script inline `document.documentElement.classList.replace('no-js','js')` no `<head>`; `<main>` sem `pt-20` (o hero cuida do espaço). Trocar `max-w-4xl mx-auto px-6` por `max-w-6xl mx-auto px-4 sm:px-6` em todos os componentes existentes (ajuste mecânico; o redesign real vem nas próximas tasks).
- [ ] **Step 5:** Run `npm run build && npm run test`. Expected: build OK, testes PASS.
- [ ] **Step 6:** `npm run dev`, abrir `/` e clicar em "Projetos" na nav. Expected: fundo `#09090b`, título da seção não fica coberto pela nav, Tab mostra contorno verde nos links.
- [ ] **Step 7:** Commit `feat: new design tokens, base layout and ui primitives`.

### Task 2: Nav em pílula + menu mobile

**Files:**
- Modify: `src/components/Nav.astro`
- Create: `src/components/MobileMenu.vue`

**Interfaces:**
- Consumes: `Icon` (Task 1).
- Produces: `MobileMenu.vue` com props `{ links: { href: string; label: string }[]; cvHref: string }`.

- [ ] **Step 1:** `Nav.astro`: header fixo; à esquerda logo `jpst<span class="text-accent">.</span>dev` (link `#hero`); centro `<ul>` em pílula (`bg-surface/80 backdrop-blur border border-border rounded-full`) visível em `md+`; à direita link "CV" (`/Joao-Pedro-Teixeira-Desenvolvedor-Front-End.pdf`, `download`) em `md+`; `<MobileMenu client:media="(max-width: 767px)" />` em `<md`. Links: Sobre, Carreira, Projetos, Skills, Contato.
- [ ] **Step 2:** Script inline no `Nav.astro`: header ganha classe `is-scrolled` (fundo `bg/80` + borda inferior) quando `scrollY > 16`; IntersectionObserver nas `section[id]` marca o link correspondente com `aria-current="true"` (estilo: `text-text` + `bg-border` na pílula).
- [ ] **Step 3:** `MobileMenu.vue`: botão hambúrguer (`aria-expanded`, `aria-controls`, label "Abrir menu"/"Fechar menu"); painel fixo em tela cheia `bg-bg` com links grandes. Abrir → foco no primeiro link, `document.body.style.overflow='hidden'`; Tab circula dentro do painel; Esc ou clique num link → fecha e devolve foco ao botão.
- [ ] **Step 4:** Run `npm run build`. Expected: OK.
- [ ] **Step 5:** Dev server em 375px: abrir menu, Tab até o fim (volta ao início), Esc fecha e foco volta ao botão; clicar "Projetos" fecha e rola até a seção. Em 1280px: pílula centralizada, link ativo muda ao rolar.
- [ ] **Step 6:** Commit `feat: floating pill nav with accessible mobile menu`.

### Task 3: Hero

**Files:** Modify `src/components/Hero.astro`

**Interfaces:** Consumes `Icon`, `.hero-backdrop`, `.text-gradient`. Produces atributos de animação usados na Task 9: `data-hero-item` em cada bloco do hero (eyebrow, h1, parágrafo, CTAs, foto), `data-split` no `h1`.

- [ ] **Step 1:** Seção `id="hero"` com `.hero-backdrop` absoluto atrás, `min-h-[100svh]`, `pt-28`. Grid `md:grid-cols-[1.4fr_1fr]`, foto abaixo do texto no mobile.
  - Eyebrow mono: bolinha verde com `animate-ping` (desligado em reduced-motion via `motion-safe:`) + `disponível · Lins, SP · remoto`.
  - `<h1 data-split class="text-[clamp(2.75rem,7vw,5rem)] font-extrabold tracking-[-0.03em] leading-[1.02]">Interfaces que <span class="text-gradient">escalam.</span></h1>`
  - Parágrafo `text-muted text-lg max-w-xl`: "Sou João Pedro Teixeira, desenvolvedor front-end com 4+ anos em Vue.js/Nuxt e Design Systems — hoje evoluindo para fullstack com C#/.NET."
  - CTAs: primário `Ver projetos` + `arrow-right` (`#projetos`, `bg-accent text-on-accent`); secundário `Baixar CV` + `download` (borda `border-strong`); ícones GitHub e LinkedIn (`aria-label` em cada link).
  - Foto: `<div>` `aspect-square rounded-3xl bg-surface border border-border shadow-[0_30px_80px_-20px_rgba(66,211,146,.35)]` com iniciais "JP" grandes em `text-subtle` (placeholder até a foto real; deixar comentário `<!-- TODO conteúdo: substituir por <Image> com a foto -->`).
- [ ] **Step 2:** Run `npm run build`. Dev server em 360px e 1280px. Expected: título não estoura a largura em 360px; brilho verde visível atrás do texto, grade some nas bordas.
- [ ] **Step 3:** Commit `feat: redesigned hero`.

### Task 4: Sobre com stats + faixa de stack

**Files:** Modify `src/components/Sobre.astro`, `src/pages/index.astro`; Create `src/components/StackMarquee.astro`

**Interfaces:** Consumes `SectionHeading`. Produces `data-reveal` nos blocos (contrato na Task 9) e `<StackMarquee />` sem props.

- [ ] **Step 1:** `Sobre.astro`: `SectionHeading numero="01" titulo="Sobre"`, grid `lg:grid-cols-[1.5fr_1fr]`: texto atual à esquerda; à direita 3 stat cards (`bg-surface border rounded-2xl p-5`), valor grande + legenda: `4+ anos` / "em front-end"; `Design System` / "em produção"; `Vue · Nuxt · .NET` / "stack principal".
- [ ] **Step 2:** `StackMarquee.astro`: lista `['Vue.js','Nuxt','TypeScript','React','Next.js','Tailwind CSS','Pinia','Vitest','Cypress','Jest','Playwright','C#','.NET','Node.js','Docker','Git']` renderizada 2× dentro de um trilho `flex w-max` com animação CSS `translateX(0 → -50%)` 40s linear infinita; `:hover` pausa; `@media (prefers-reduced-motion: reduce)` → sem animação e `flex-wrap` justificado. Máscara de fade nas bordas. Segunda cópia com `aria-hidden="true"`. Contêiner `overflow-hidden`.
- [ ] **Step 3:** Inserir `<StackMarquee />` entre `<Sobre />` e Carreira no `index.astro`.
- [ ] **Step 4:** Run `npm run build`; dev server: marquee rola, para no hover; com reduced-motion emulado (DevTools → Rendering) fica parado e quebra linha.
- [ ] **Step 5:** Commit `feat: about stats and stack marquee`.

### Task 5: Carreira

**Files:** Create `src/content/carreira.json`, `src/lib/formatPeriodo.ts`, `src/lib/formatPeriodo.test.ts`, `src/components/Carreira.astro`; Modify `src/content.config.ts`, `src/pages/index.astro`

**Interfaces:**
- Produces: `formatPeriodo(inicio: string, fim?: string): string` (entradas `YYYY-MM`); collection `carreira` com schema `{ empresa: string; cargo: string; local: string; inicio: string /^\d{4}-\d{2}$/; fim?: string; bullets: string[]; tags: string[] }`, carregada com `file('src/content/carreira.json')` (array com campo `id`).

- [ ] **Step 1: Teste**

```ts
import { describe, it, expect } from 'vitest';
import { formatPeriodo } from './formatPeriodo';

describe('formatPeriodo', () => {
  it('uses "hoje" when there is no end', () => {
    expect(formatPeriodo('2022-07')).toBe('jul 2022 — hoje');
  });
  it('formats a closed range', () => {
    expect(formatPeriodo('2020-12', '2022-06')).toBe('dez 2020 — jun 2022');
  });
  it('throws on malformed input', () => {
    expect(() => formatPeriodo('2022')).toThrow();
  });
});
```

- [ ] **Step 2:** Run `npx vitest run src/lib/formatPeriodo.test.ts`. Expected: FAIL (módulo não existe).
- [ ] **Step 3:** Implementar `formatPeriodo` com meses abreviados pt-BR fixos (`jan fev mar abr mai jun jul ago set out nov dez`) — sem `Intl`, para saída estável.
- [ ] **Step 4:** Run o mesmo comando. Expected: PASS.
- [ ] **Step 5:** `carreira.json` com dados do CV, ordem mais recente primeiro:
  - `mercado-eletronico`: "Mercado Eletrônico", "Desenvolvedor Front-end", "São Paulo, SP · remoto", inicio `2022-07`, sem fim, bullets = os 5 bullets do CV, tags `["Vue.js","Nuxt","Design System","Cypress","Jest"]`.
  - `viarondon`: "ViaRondon Concessionária de Rodovia", "Aprendiz de TI", "Lins, SP", `2020-12` → `2022-06`, 3 bullets do CV, tags `["SAP","Suporte"]`.
  Registrar a collection em `content.config.ts`.
- [ ] **Step 6:** `Carreira.astro` (`id="carreira"`, `SectionHeading numero="02" titulo="Carreira"`): timeline vertical — linha `border-l border-border` com bolinha `accent` por item (bolinha do item atual com glow); card `bg-surface/85 border rounded-2xl p-6` com empresa (semibold) + período mono `text-subtle` alinhado à direita (abaixo no mobile), cargo `text-muted`, bullets, tags pill. Cada card com `data-reveal`. Inserir após `<StackMarquee />`.
- [ ] **Step 7:** Run `npm run build && npm run test`. Expected: OK/PASS. Visual: "jul 2022 — hoje" no card do ME.
- [ ] **Step 8:** Commit `feat: career timeline from content collection`.

### Task 6: Projetos (destaque + grid, remove filtro)

**Files:** Create `src/lib/separarProjetos.ts`, `src/lib/separarProjetos.test.ts`, `src/components/ProjetoCard.astro`, `src/components/Projetos.astro`; Modify `src/pages/index.astro`; Delete `src/components/ProjetosGrid.vue`, `src/lib/filterProjetos.ts`, `src/lib/filterProjetos.test.ts`

**Interfaces:**
- Produces: `separarProjetos<T extends { destaque: boolean }>(projetos: T[]): { destaque: T | null; demais: T[] }`; `<ProjetoCard projeto={CollectionEntry<'projetos'>} variante="destaque" | "grid" numero={string} />`.

- [ ] **Step 1: Teste**

```ts
import { describe, it, expect } from 'vitest';
import { separarProjetos } from './separarProjetos';

const p = (id: string, destaque = false) => ({ id, destaque });

describe('separarProjetos', () => {
  it('pulls the first featured project out and keeps the rest in order', () => {
    expect(separarProjetos([p('a'), p('b', true), p('c')])).toEqual({ destaque: p('b', true), demais: [p('a'), p('c')] });
  });
  it('extra featured projects stay in the grid', () => {
    expect(separarProjetos([p('a', true), p('b', true)])).toEqual({ destaque: p('a', true), demais: [p('b', true)] });
  });
  it('returns null when nothing is featured', () => {
    expect(separarProjetos([p('a')])).toEqual({ destaque: null, demais: [p('a')] });
  });
});
```

- [ ] **Step 2:** Run `npx vitest run src/lib/separarProjetos.test.ts`. Expected: FAIL.
- [ ] **Step 3:** Implementar. Run de novo. Expected: PASS.
- [ ] **Step 4:** Criar `src/components/ProjetoThumb.astro` (props `{ titulo: string; imagem?: string; class?: string }`): `aspect-video rounded-xl overflow-hidden`; com `imagem` → `<img loading="lazy" alt="Screenshot do projeto {titulo}">`; sem → placeholder `bg-[radial-gradient(...accent/25...),linear-gradient(135deg,#18181b,#0f2a1f)]` com o título em mono `text-muted` centralizado. `ProjetoCard.astro`: `<a>` com card inteiro clicável para `/projetos/{id}/`, thumbnail via `<ProjetoThumb titulo imagem={imagens[0]} />`. Corpo: número mono (`01`), título, resumo, até 4 tags (+N se houver mais), "Ver case" + `arrow-up-right` que desloca 2px no hover. Variante `destaque`: `md:grid md:grid-cols-[1.3fr_1fr]` com thumbnail maior e badge "Destaque". Hover: `border-border-strong` + sombra verde suave.
- [ ] **Step 5:** `Projetos.astro` (`id="projetos"`, `SectionHeading numero="03" titulo="Projetos"`): busca a collection, `separarProjetos`, renderiza destaque em largura total e demais em `sm:grid-cols-2 gap-6`, cada um com `data-reveal`. Em `index.astro`, trocar a seção antiga e o import do `ProjetosGrid` por `<Projetos />`; remover os 3 arquivos do filtro.
- [ ] **Step 6:** Run `npm run build && npm run test`. Expected: OK/PASS, sem referências a `filterProjetos`/`ProjetosGrid` (`grep -r "filterProjetos\|ProjetosGrid" src` vazio). Visual: GameDeals no card largo, 4 cards no grid, todos com placeholder.
- [ ] **Step 7:** Commit `feat: featured project and card grid, drop search filter`.

### Task 7: Skills, Contato, formulário e Footer

**Files:** Modify `src/components/Skills.astro`, `src/components/Contato.astro`, `src/components/ContatoForm.vue`, `src/components/Footer.astro`

**Interfaces:** Consumes `SectionHeading`, `Icon`.

- [ ] **Step 1:** `Skills.astro`: `SectionHeading numero="04" titulo="Skills"`; mesmos grupos em bento grid `md:grid-cols-3` — "Front-end" ocupa `md:col-span-2`; cada card `bg-surface border rounded-2xl p-6` com título + tags pill; `data-reveal`.
- [ ] **Step 2:** `Contato.astro`: `SectionHeading numero="05" titulo="Contato"`; grid `lg:grid-cols-2`. Esquerda: título `text-4xl font-bold` "Vamos <span class="text-gradient">conversar?</span>", frase curta `text-muted`, e-mail em `text-xl sm:text-2xl font-semibold break-all` + botão "Copiar" (`Icon copy`) que usa `navigator.clipboard.writeText` via script inline e troca o texto para "Copiado!" por 2s (anunciado em `aria-live="polite"`); se a API falhar, o botão não faz nada além do `mailto` do e-mail continuar funcionando. Links GitHub/LinkedIn com ícone. Direita: `<ContatoForm client:visible />` dentro de card `bg-surface`.
- [ ] **Step 3:** `ContatoForm.vue`: trocar `focus:outline-none focus:border-accent` por `focus:border-accent` (o `:focus-visible` global cuida do outline); campos `bg-bg border-border rounded-xl px-4 py-3`; botão primário `bg-accent text-on-accent rounded-xl w-full sm:w-auto`. Não mexer na lógica.
- [ ] **Step 4:** `Footer.astro`: `const year = new Date().getFullYear();`, layout `flex justify-between` (empilha no mobile): "© {year} João Pedro Teixeira" + "Feito com Astro, Vue & Tailwind" em `text-subtle`.
- [ ] **Step 5:** Run `npm run build && npm run test`. Visual: botão copiar mostra "Copiado!"; formulário mostra contorno verde ao navegar com Tab; e-mail não estoura em 360px.
- [ ] **Step 6:** Commit `feat: bento skills, contact section and footer restyle`.

### Task 8: Página de projeto

**Files:** Modify `src/pages/projetos/[...id].astro`

**Interfaces:** Consumes `Icon`, `.hero-backdrop`.

- [ ] **Step 1:** Topo com `.hero-backdrop` curto: link "← voltar para projetos" (`/#projetos`), título `text-4xl sm:text-5xl font-extrabold tracking-tight`, `papel` em `text-muted`, tags, e botões logo abaixo — "Repositório" (`Icon github`, secundário) e "Ver demo" (`arrow-up-right`, primário), cada um só se o link existir, ambos `target="_blank" rel="noopener noreferrer"`. Se não houver nenhum link, o contêiner dos botões não é renderizado.
- [ ] **Step 2:** Imagem principal: `<ProjetoThumb titulo imagem={imagens[0]} class="rounded-2xl border border-border" />` (Task 6). Demais imagens (`imagens.slice(1)`) abaixo em grid.
- [ ] **Step 3:** Problema e Solução em dois cards `bg-surface` lado a lado (`md:grid-cols-2`). MDX em `prose prose-invert` com overrides: `prose-a:text-accent prose-headings:tracking-tight prose-strong:text-text prose-code:text-accent`, largura `max-w-3xl`.
- [ ] **Step 4:** Rodapé do artigo: link "Próximo projeto →" para o próximo item da collection (ordem de `getCollection`, circular), via props no `getStaticPaths`.
- [ ] **Step 5:** Run `npm run build`. Visual em `/projetos/gamedeals/` e `/projetos/be-the-hero/`: sem botão vazio, placeholder aparece, link de próximo funciona.
- [ ] **Step 6:** Commit `feat: redesigned project case page`.

### Task 9: Animações GSAP

**Files:** Create `src/scripts/animations.ts`; Modify `src/layouts/BaseLayout.astro`, `src/styles/global.css`

**Interfaces:**
- Consumes: `data-hero-item`, `data-split` (Task 3), `data-reveal` (Tasks 4–7). Contrato: `data-reveal` revela o elemento; `data-reveal-group` num contêiner revela os filhos `[data-reveal]` em stagger.
- Produces: `initAnimations(): void` em `animations.ts`; `window.__animReady = true` quando terminar o setup.

- [ ] **Step 1:** CSS: `.js [data-reveal], .js [data-hero-item] { opacity: 0 }` dentro de `@media (prefers-reduced-motion: no-preference)`. No script inline do `<head>` do `BaseLayout`, além de trocar `no-js→js`: `setTimeout(() => { if (!window.__animReady) document.documentElement.classList.remove('js') }, 3000)`.
- [ ] **Step 2:** `animations.ts`: se `matchMedia('(prefers-reduced-motion: reduce)').matches` → seta `__animReady` e retorna. Senão registra `ScrollTrigger` e `SplitText`; hero: timeline `gsap.fromTo('[data-hero-item]', { opacity:0, y:24 }, { opacity:1, y:0 })`, stagger 0.12, total ~1s, com `SplitText` por palavra no `[data-split]` (`yPercent:100 → 0`, máscara por linha); seções: para cada `[data-reveal]` (ou grupo), `opacity 0→1`, `y 24→0`, `duration .7`, `ease 'power3.out'`, `ScrollTrigger { start: 'top 85%', once: true }`, stagger .08 dentro de `[data-reveal-group]`. No fim seta `window.__animReady = true`.
- [ ] **Step 3:** `BaseLayout.astro`: `<script>import { initAnimations } from '../scripts/animations'; initAnimations();</script>`. Adicionar `data-reveal-group` nos contêineres de cards (Carreira, Projetos grid, Skills, stats do Sobre).
- [ ] **Step 4:** Run `npm run build && npm run test`. Expected: OK/PASS.
- [ ] **Step 5:** Verificar no dev server:
  - normal: hero entra em sequência, seções revelam ao rolar, sem "piscar" antes da animação;
  - DevTools → desabilitar JavaScript: todo conteúdo visível;
  - Rendering → `prefers-reduced-motion: reduce`: nada anima, nada escondido;
  - bloquear a URL do chunk do GSAP (Network → Block request URL): após 3s tudo aparece.
- [ ] **Step 6:** Commit `feat: gsap entrance and scroll reveal animations`.

### Task 10: Verificação final e limpeza

**Files:** Modify `README.md`

- [ ] **Step 1:** README: remover o item obsoleto `exemplo-projeto.mdx` do checklist; adicionar itens "Substituir placeholder da foto no Hero" e "Adicionar `imagens` aos projetos".
- [ ] **Step 2:** Run `npm run test && npm run build && npm run preview`. Expected: PASS, build OK.
- [ ] **Step 3:** No preview, em 360px, 768px e 1280px, rodar no console `document.documentElement.scrollWidth === document.documentElement.clientWidth`. Expected: `true` nas três larguras, na home e em `/projetos/gamedeals/`.
- [ ] **Step 4:** Lighthouse (DevTools, mobile) na home. Expected: Accessibility ≥ 95, Performance ≥ 90; corrigir qualquer falha de contraste apontada.
- [ ] **Step 5:** Commit `chore: update readme checklist after redesign`.
