# Design v2 interativo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deixar o portfólio vivo e interativo — constelação tsParticles no fundo, hero com nome grande e digitação, títulos de seção grandes, botões magnéticos, holofote nos cards e faixa de stack com logos — mantendo o verde e a acessibilidade/performance.

**Architecture:** Mesma base Astro + ilhas Vue + Tailwind + GSAP. Lógica pura (estado da digitação, deslocamento magnético) em `src/lib/` com Vitest; efeitos de DOM em módulos `src/scripts/*.ts` inicializados pelo `BaseLayout`, dirigidos por atributos `data-*`. tsParticles carregado sob demanda (import dinâmico em idle) para não pesar no carregamento inicial.

**Tech Stack:** Astro 7, Vue 3, Tailwind 4, GSAP 3.15, `@tsparticles/engine` + `@tsparticles/slim` 4.4.0, Vitest 4.

**Spec:** `docs/superpowers/specs/2026-10-26-design-v2-interativo-design.md`

## Global Constraints

- Nova dependência só `@tsparticles/engine@4.4.0` e `@tsparticles/slim@4.4.0`. Logos: paths SVG copiados do Simple Icons, sem instalar pacote.
- Paleta inalterada (tokens do `global.css`); accent `#42d392`.
- Lighthouse mobile na home **e** em `/projetos/gamedeals/`: Performance ≥ 90, Accessibility 100, Best Practices ≥ 95, SEO 100. tsParticles é fixo — se não bater, ajustar carregamento/quantidade.
- Sem scroll horizontal em 360px; nada escondido sem JS, com reduced-motion, ou com GSAP/tsParticles bloqueados.
- Efeitos de ponteiro (magnético, holofote) só com `(hover: hover) and (pointer: fine)` e sem reduced-motion.
- Anti-cópia: nada de "root@…", "ONLINE", colchetes nos rótulos, roxo/rosa.
- `npm run test` verde e `npm run build` OK ao fim de cada task. Commits em inglês, `feat:`/`refactor:`/`chore:`.

## Review Focus

1. **Canvas da constelação por cima do conteúdo** — cliques em links/botões/formulário precisam continuar funcionando. Pinado na Task 2 (clicar em "Ver projetos" e focar o input do formulário com o fundo ativo).
2. **Digitação mudando a altura da linha** — o conteúdo abaixo não pode pular quando a frase troca ou fica vazia. Pinado na Task 3 (altura do elemento constante em 3 amostras).
3. **Leitor de tela e digitação** — não pode anunciar cada letra. Pinado na Task 3 (texto animado `aria-hidden`, `sr-only` estático presente).
4. **Toque/celular** — magnético e holofote não podem prender estado em touch; constelação com ~25 partículas. Pinado nas Tasks 2 e 5.
5. **tsParticles bloqueado/falhando** — página intacta, sem erro visível. Pinado na Task 7.

---

## File Structure

| Arquivo | Responsabilidade |
|---|---|
| `src/lib/typewriter.ts` (+ test) | máquina de estados da digitação (pura) |
| `src/lib/magnetic.ts` (+ test) | cálculo do deslocamento magnético (puro) |
| `src/scripts/constellation.ts` | carrega e configura tsParticles |
| `src/scripts/typewriter.ts` | liga `src/lib/typewriter` ao DOM (`[data-typewriter]`) |
| `src/scripts/interactions.ts` | `[data-magnetic]` e `[data-spotlight]` |
| `src/components/Hero.astro` | hero novo |
| `src/components/ui/SectionHeading.astro` | rótulo + h2 em duas linhas |
| `src/components/ui/Icon.astro` | + logos da stack |
| `src/components/StackMarquee.astro` | itens com logo |
| `src/styles/global.css` | spotlight, anel, scroll hint, remove grade |
| `src/layouts/BaseLayout.astro` | container da constelação + init dos scripts |

---

### Task 1: Lógica pura — digitação e deslocamento magnético

**Files:** Create `src/lib/typewriter.ts`, `src/lib/typewriter.test.ts`, `src/lib/magnetic.ts`, `src/lib/magnetic.test.ts`

**Interfaces — Produces:**
- `export type FaseDigitacao = 'digitando' | 'pausa' | 'apagando'`
- `export interface EstadoDigitacao { indice: number; texto: string; fase: FaseDigitacao }`
- `export const TEMPOS = { digitar: 70, apagar: 35, pausa: 2200, entreFrases: 400 }`
- `export function proximoPasso(frases: string[], estado: EstadoDigitacao): { estado: EstadoDigitacao; espera: number }`
- `export function deslocamentoMagnetico(px: number, py: number, rect: { left: number; top: number; width: number; height: number }, forca: number, max?: number): { x: number; y: number }` (max padrão 8)

- [ ] **Step 1: Testes**

```ts
// typewriter.test.ts
import { describe, it, expect } from 'vitest';
import { proximoPasso, TEMPOS } from './typewriter';

const frases = ['ab', 'xy'];

describe('proximoPasso', () => {
  it('types one more character', () => {
    expect(proximoPasso(frases, { indice: 0, texto: 'a', fase: 'digitando' }))
      .toEqual({ estado: { indice: 0, texto: 'ab', fase: 'digitando' }, espera: TEMPOS.digitar });
  });
  it('pauses when the phrase is complete, then starts erasing', () => {
    expect(proximoPasso(frases, { indice: 0, texto: 'ab', fase: 'digitando' }))
      .toEqual({ estado: { indice: 0, texto: 'ab', fase: 'pausa' }, espera: TEMPOS.pausa });
    expect(proximoPasso(frases, { indice: 0, texto: 'ab', fase: 'pausa' }))
      .toEqual({ estado: { indice: 0, texto: 'a', fase: 'apagando' }, espera: TEMPOS.apagar });
  });
  it('moves to the next phrase after erasing, wrapping at the end', () => {
    expect(proximoPasso(frases, { indice: 1, texto: '', fase: 'apagando' }))
      .toEqual({ estado: { indice: 0, texto: '', fase: 'digitando' }, espera: TEMPOS.entreFrases });
  });
});

// magnetic.test.ts
import { describe, it, expect } from 'vitest';
import { deslocamentoMagnetico } from './magnetic';

const rect = { left: 0, top: 0, width: 100, height: 40 };

describe('deslocamentoMagnetico', () => {
  it('is zero at the center', () => {
    expect(deslocamentoMagnetico(50, 20, rect, 0.3)).toEqual({ x: 0, y: 0 });
  });
  it('pulls toward the pointer by the given strength', () => {
    expect(deslocamentoMagnetico(60, 30, rect, 0.3)).toEqual({ x: 3, y: 3 });
  });
  it('clamps to max in both directions', () => {
    expect(deslocamentoMagnetico(500, -500, rect, 0.3)).toEqual({ x: 8, y: -8 });
  });
});
```

- [ ] **Step 2:** Run `npx vitest run src/lib/typewriter.test.ts src/lib/magnetic.test.ts`. Expected: FAIL (módulos não existem).
- [ ] **Step 3:** Implementar os dois módulos com as assinaturas acima (arredondar o deslocamento a 2 casas para evitar `-0`/floats feios; `Object.is(-0)` não deve aparecer no resultado).
- [ ] **Step 4:** Mesmo comando. Expected: PASS (6 testes). `npm run test`: PASS geral.
- [ ] **Step 5:** Commit `feat: typewriter state machine and magnetic offset helpers`.

### Task 2: Fundo de constelação (tsParticles)

**Files:** Modify `package.json`, `src/layouts/BaseLayout.astro`, `src/styles/global.css`; Create `src/scripts/constellation.ts`

**Interfaces — Produces:** `export async function initConstellation(container: HTMLElement): Promise<void>`; elemento `<div id="constellation" aria-hidden="true">` no `BaseLayout`.

- [ ] **Step 1:** `npm install @tsparticles/engine@4.4.0 @tsparticles/slim@4.4.0`. Confirmar em `node_modules/@tsparticles/slim` que os interactors `attract` e `repulse` estão incluídos (procurar `external-attract`/`external-repulse` no `package.json` de dependências). Se não estiverem, instalar os pacotes `@tsparticles/interaction-external-attract`/`-repulse` 4.4.0 e registrar — ruling no ledger.
- [ ] **Step 2:** `BaseLayout.astro`: primeiro filho do `<body>`: `<div id="constellation" class="constellation" aria-hidden="true"></div>`. CSS: `.constellation { position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0; transition: opacity 1.2s ease; } .constellation.is-ready { opacity: 1 }`; `header`, `main`, `footer` com `position: relative; z-index: 1` (header já é fixed z-50). Remover as duas camadas de grade do `.hero-backdrop` (fica só o radial verde) e a máscara.
- [ ] **Step 3:** `constellation.ts`: `initConstellation` faz `import('@tsparticles/engine')` + `import('@tsparticles/slim')` dinamicamente, `loadSlim(tsParticles)`, `tsParticles.load({ id: container.id, element: container, options })`, e adiciona `is-ready` ao container. Opções (spec): `fpsLimit: 40`; `background.color: 'transparent'`; `fullScreen.enable: false`; `detectRetina: true`; partículas `color #42d392`, `opacity 0.35`, `size {min:1,max:3}`, `links {enable, color '#ffffff', opacity 0.12, width 1, distance 150}`, `move {enable, speed 0.5, outModes 'bounce'}`, `number.value` = `matchMedia('(max-width: 767px)').matches ? 25 : 60` com `density.enable` no desktop; `interactivity.detectsOn: 'window'`, `events.onHover {enable, mode 'attract'}`, `events.onClick {enable, mode 'repulse'}`, `modes.attract {distance 180, speed 1}`, `modes.repulse {distance 160, duration 0.4}`. Com `prefers-reduced-motion: reduce`: `move.enable false` e eventos desligados. Em ponteiro grosso (touch): `onHover` desligado.
- [ ] **Step 4:** No `<script>` do `BaseLayout`, após `initAnimations()`: agendar `initConstellation(document.getElementById('constellation')!)` em `requestIdleCallback` (fallback `setTimeout(…, 1500)`) depois do evento `load`; erros capturados com `catch` silencioso (o fundo é decorativo).
- [ ] **Step 5:** `npm run build && npm run test`. Expected: OK/PASS; o chunk do tsParticles aparece separado do chunk principal em `dist/_astro/`.
- [ ] **Step 6:** Verificar no preview (puppeteer em `.superpowers/tools`): desktop e 360px — canvas presente e visível após ~3s; clicar "Ver projetos" rola até `#projetos`; `focus()` no primeiro input do formulário funciona com clique por coordenada (`page.mouse.click` no centro do input → `document.activeElement` é o input); `document.elementFromPoint` no centro de um link do hero retorna o link, não o canvas. 360px: `tsParticles.domItem(0).particles.count` ≤ 30.
- [ ] **Step 7:** Commit `feat: tsparticles constellation background`.

### Task 3: Hero — nome grande, digitação, foto decorada, dica de scroll

**Files:** Modify `src/components/Hero.astro`, `src/scripts/animations.ts`, `src/styles/global.css`, `src/layouts/BaseLayout.astro`; Create `src/scripts/typewriter.ts`

**Interfaces:**
- Consumes: `proximoPasso`, `TEMPOS`, `EstadoDigitacao` (Task 1).
- Produces: `export function initTypewriter(): void` — liga cada `[data-typewriter]` (atributo `data-frases` com JSON `string[]`) ao loop; escreve em `[data-typewriter-texto]` filho.

- [ ] **Step 1:** `Hero.astro`:
  - Eyebrow mono: `Lins, SP · remoto` (sem bolinha).
  - `<h1 data-hero-item data-split class="text-[clamp(3rem,9vw,6.5rem)] font-extrabold tracking-[-0.04em] leading-[0.95]"><span class="block">João Pedro</span><span class="block text-gradient">Teixeira.</span></h1>`
  - Linha de digitação (mono, `text-lg sm:text-2xl text-text`, altura fixa `h-[1.5em]`, `whitespace-nowrap overflow-hidden`): `<p data-hero-item data-typewriter data-frases='["Full Stack Developer","Vue.js · Nuxt · TypeScript","React · Next.js · Tailwind","C# · .NET · APIs REST","Claude Code · Cursor · IA"]'><span class="sr-only">Full Stack Developer — Vue.js, Nuxt, TypeScript, React, Next.js, Tailwind, C#, .NET, APIs REST, Claude Code, Cursor e IA</span><span aria-hidden="true"><span class="text-accent">&gt; </span><span data-typewriter-texto>Full Stack Developer</span><span class="typewriter-cursor">|</span></span></p>`
  - Parágrafo: "Construo produtos web do Design System à API — com IA no centro do fluxo e eu no controle da qualidade."
  - CTAs e sociais como hoje (os `data-magnetic` entram na Task 5).
  - Foto: wrapper `relative`; atrás, `.hero-ring` (anel: `inset: -14px`, `border-radius: 2rem`, borda 1px via `conic-gradient` verde→transparente com máscara, `animation: spin 30s linear infinite`, parado em reduced-motion) e `.hero-dots` (grade de pontos `radial-gradient(#42d39233 1px, transparent 1px)` 14px, deslocada `-right-6 -bottom-6`, 60% do tamanho). Selo sobre a foto, canto inferior esquerdo: pill `bg-bg/90 border border-border backdrop-blur` com bolinha ping + "disponível" mono.
  - Dica de scroll: `<a href="#sobre" class="scroll-hint">` absoluta no rodapé central do hero, "scroll" mono `text-subtle text-xs` + linha vertical 40px com traço animado descendo (keyframes; estático em reduced-motion); `hidden` quando `max-height: 700px` (classe `[@media(max-height:700px)]:hidden`).
- [ ] **Step 2:** `typewriter.ts`: para cada `[data-typewriter]`, se reduced-motion → não faz nada (texto inicial fica). Senão começa com estado `{indice:0, texto:'Full Stack Developer', fase:'pausa'}` e agenda `proximoPasso` com `setTimeout`. Pausa enquanto `document.hidden`. Cursor `|` pisca com CSS (`steps(1)` 1s; sem animação em reduced-motion). Inicializar no `BaseLayout` junto de `initAnimations()`.
- [ ] **Step 3:** `animations.ts`: o `SplitText` do `[data-split]` passa a `type: 'words,chars'`, `mask: 'chars'`, anima `split.chars` (`yPercent: 110 → 0`, stagger 0.03); a regra do gradiente passa a aplicar `.text-gradient` em cada **char** cujo ancestral tem `.text-gradient`.
- [ ] **Step 4:** `npm run build && npm run test`. Expected: OK/PASS.
- [ ] **Step 5:** Verificar (puppeteer): 1280 e 360 — nome em duas linhas sem estourar a largura em 360px; "Teixeira." com gradiente visível após a animação (screenshot); altura do `[data-typewriter]` igual em 3 amostras com 1s de intervalo; o texto de `[data-typewriter-texto]` muda entre amostras; o `sr-only` existe; com reduced-motion o texto fica "Full Stack Developer" fixo; sem JS idem.
- [ ] **Step 6:** Commit `feat: hero with big name, typewriter and decorated photo`.

### Task 4: Títulos de seção em duas linhas

**Files:** Modify `src/components/ui/SectionHeading.astro`, `Sobre.astro`, `Carreira.astro`, `Projetos.astro`, `Skills.astro`, `Contato.astro`

**Interfaces — Produces:** `<SectionHeading numero="01" titulo="Sobre" linha1="Um pouco" linha2="sobre mim." />` — renderiza `<p class="font-mono text-sm mb-4">` (rótulo atual) + `<h2 class="text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-tight leading-[1.05] mb-12"><span class="block">{linha1}</span><span class="block text-gradient">{linha2}</span></h2>`; ambos com `data-reveal` no wrapper.

- [ ] **Step 1:** Implementar o novo `SectionHeading` (props `linha1`, `linha2` obrigatórias).
- [ ] **Step 2:** Usar: Sobre "Um pouco"/"sobre mim."; Carreira "Onde venho"/"construindo."; Projetos "Coisas que"/"eu construí."; Skills "Ferramentas do"/"dia a dia."; Contato "Vamos"/"conversar?" — e remover o `<p>` grande "Vamos conversar?" do Contato (o h2 assume).
- [ ] **Step 3:** `npm run build && npm run test`. Verificar no HTML: exatamente um `<h2>` por seção da home (`grep -c "<h2" dist/index.html` = 5) e o `<h1>` único.
- [ ] **Step 4:** Commit `feat: two-line section headlines`.

### Task 5: Botões magnéticos e holofote nos cards

**Files:** Create `src/scripts/interactions.ts`; Modify `src/styles/global.css`, `src/layouts/BaseLayout.astro`, `Hero.astro`, `Contato.astro`, `src/pages/projetos/[...id].astro`, `Carreira.astro`, `ProjetoCard.astro`, `Skills.astro`, `Sobre.astro`

**Interfaces:**
- Consumes: `deslocamentoMagnetico` (Task 1).
- Produces: `export function initInteractions(): void`.

- [ ] **Step 1:** `interactions.ts`: retorna cedo se `!matchMedia('(hover: hover) and (pointer: fine)').matches` ou reduced-motion. `[data-magnetic]`: `pointermove` no elemento → `style.transform = translate(x,y)` via `deslocamentoMagnetico(e.clientX, e.clientY, el.getBoundingClientRect(), Number(el.dataset.magnetic) || 0.3)`; `pointerleave` → `transform = ''`. CSS: `[data-magnetic] { transition: transform .25s cubic-bezier(.2,.8,.2,1) }`. `[data-spotlight]`: `pointermove` → `style.setProperty('--x', …px)` e `--y` relativos ao rect.
- [ ] **Step 2:** CSS do holofote: `[data-spotlight] { position: relative; isolation: isolate }` + `[data-spotlight]::before { content:''; position:absolute; inset:0; border-radius:inherit; pointer-events:none; z-index:-1; opacity:0; transition: opacity .3s; background: radial-gradient(400px circle at var(--x, 50%) var(--y, 50%), rgba(66,211,146,.10), transparent 40%) } [data-spotlight]:hover::before { opacity: 1 }` — o card mantém `bg-surface/85` (o `::before` fica por cima do fundo e abaixo do conteúdo graças ao `isolation`). Conferir que o fundo do card não cobre o `::before` (se cobrir, mover o `bg-surface` para o próprio `::after` ou usar `z-index` positivo no conteúdo — ruling).
- [ ] **Step 3:** Atributos: `data-magnetic` nos CTAs do hero, ícones sociais do hero, botões repo/demo da página de projeto, links LinkedIn/GitHub e botão copiar do Contato, botão do formulário (`ContatoForm.vue`). `data-spotlight` nos cards de carreira, formação, certificações, `ProjetoCard`, cards de skills, stats do Sobre e no card do formulário.
- [ ] **Step 4:** Inicializar `initInteractions()` no `BaseLayout`.
- [ ] **Step 5:** `npm run build && npm run test`. Verificar (puppeteer, 1280): mover o mouse para 10px à direita do centro de "Ver projetos" → `transform` contém `translate(`; mover para fora → `transform` vazio; hover num card de projeto → `getComputedStyle(card,'::before').opacity` = `1`; em viewport 360 com `hasTouch: true, isMobile: true` → após `tap` num CTA, `style.transform` vazio.
- [ ] **Step 6:** Commit `feat: magnetic buttons and card spotlight`.

### Task 6: Faixa da stack com logos

**Files:** Modify `src/components/ui/Icon.astro` (ou Create `src/components/ui/logos.ts` com os paths), `src/components/StackMarquee.astro`

**Interfaces — Produces:** `logos: Record<string, string>` (nome da tech → `d` do path, viewBox 24) em `src/components/ui/logos.ts`.

- [ ] **Step 1:** Baixar os SVGs de `https://cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons/<slug>.svg` para: vuedotjs, nuxt (ou nuxtdotjs), typescript, react, nextdotjs, dotnet, claude, cursor, tailwindcss, pinia (se existir), vitest, jest, cypress, playwright (se existir), nodedotjs, docker, git; C# não existe no Simple Icons — sem logo. Extrair só o `d` de cada um para `logos.ts`. Slug inexistente → item fica só com texto (ruling no ledger com a lista).
- [ ] **Step 2:** `StackMarquee.astro`: cada item vira `<li class="group flex items-center gap-2.5 ...">` com `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d={logos[tech]} /></svg>` (quando existir) + nome; hover do item: `text-text` e logo `text-accent`.
- [ ] **Step 3:** `npm run build && npm run test`. Verificar em 1280: screenshot da faixa mostra logos; 360px sem overflow.
- [ ] **Step 4:** Commit `feat: stack marquee with logos`.

### Task 7: Verificação final

**Files:** Modify `README.md` (se algo do checklist mudar)

- [ ] **Step 1:** `npm run test && npm run build` e `npx astro preview`.
- [ ] **Step 2:** Puppeteer em `/` e `/projetos/gamedeals/`, larguras 360/768/1280: `scrollWidth === clientWidth`; após rolar a página inteira, 0 elementos `[data-reveal]`/`[data-hero-item]` com opacidade < 0.5; nenhum `pageerror`.
- [ ] **Step 3:** Modos: reduced-motion (partículas paradas, digitação fixa, sem magnético), JS desligado (conteúdo todo visível, sem canvas), tsParticles bloqueado (interceptar requests com `tsparticles` no nome → sem erro visível, página intacta, canvas fica `opacity 0`).
- [ ] **Step 4:** Lighthouse mobile (`npx lighthouse@12.6.1`) na home e em `/projetos/gamedeals/`. Expected: Perf ≥ 90, A11y 100, BP ≥ 95, SEO 100. Se Perf < 90: reduzir `number` / adiar mais o init — sem trocar de lib.
- [ ] **Step 5:** Commit `chore: verify interactive redesign` (se houver ajustes).
