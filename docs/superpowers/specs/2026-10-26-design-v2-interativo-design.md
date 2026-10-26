# Design v2 — interativo, inspirado no portfólio do Alisson

**Data:** 2026-10-26
**Autor:** João P.
**Base:** `2026-10-26-redesign-visual-design.md` (paleta, tokens, estrutura de seções, regras de acessibilidade e de animação continuam valendo, exceto onde este documento diz o contrário).

## Por quê

Mesmo após o redesign "Verde Vue refinado", o autor acha o site "muito cru". Referência explícita: https://www.alissonlimadev.com/ (código: https://github.com/alissonlimabr/portfolio, Angular). O autor quer **as técnicas dele com a identidade verde atual** — não o roxo/rosa.

Sucesso = o site parece vivo e interativo no primeiro segundo (fundo animado, nome grande, texto digitando), sem perder a performance/acessibilidade já conquistadas (Lighthouse mobile 98/100/100/100).

## Escopo

**Dentro:**
1. Fundo de constelação (tsParticles) em toda a página.
2. Hero novo: nome grande + digitação alternando papel/stack + decoração na foto + dica de scroll.
3. Títulos de seção grandes em duas linhas.
4. Botões magnéticos.
5. Holofote (spotlight) seguindo o mouse nos cards.
6. Faixa da stack com logos.

**Fora:** efeito "buraco negro" no clique (código próprio do Alisson), blog, troca de paleta, novas seções, mudanças de conteúdo (textos atuais ficam).

**Anti-objetivos:**
- Parecer cópia: nada de "root@…:~#", selo "ONLINE", "[ 01 ] SOBRE" em colchetes ou roxo/rosa. Usamos as *técnicas*, com elementos e textos nossos.
- Animação que atrapalha leitura ou trava o celular: constelação sempre atrás do conteúdo, sutil, `pointer-events: none`, com menos partículas no mobile.
- Regredir acessibilidade: tudo continua funcionando com teclado, sem JS e com `prefers-reduced-motion`.

## Abordagens consideradas (fundo)

1. **Constelação própria em canvas** (~2KB) — leve, controle total; código nosso para manter.
2. **tsParticles** (mesma lib do Alisson, pacote `@tsparticles/slim`) — pronto e configurável; ~50KB gz a mais. **← escolhida pelo autor.**

Digitação, botões magnéticos e holofote: scripts pequenos próprios em ambos os casos (decisão do Claude — nenhuma lib justifica o peso).

## Decisões

### Fundo de constelação
- Lib: `@tsparticles/engine` + `@tsparticles/slim` na versão **4.4.0** (call do Claude: 4.5.0 saiu há 1 dia).
- Em **todas as páginas** (montado no `BaseLayout`), para o site inteiro ter a mesma sensação (call do Claude). Canvas `position: fixed; inset: 0; z-index` abaixo do conteúdo; `pointer-events: none`. A detecção de mouse usa `interactivity.detectsOn: 'window'`.
- Visual: partículas `#42d392` com opacidade ~0.35, tamanho aleatório 1–3px; links brancos opacidade ~0.12, largura 1, distância 150; velocidade 0.5; `outModes: 'bounce'`.
- Quantidade: ~60 com densidade por área no desktop; ~25 abaixo de 768px.
- Interação: hover → `attract` (distância ~180, suave); clique → `repulse` (empurra as partículas próximas). `fpsLimit` ~40.
- Carregamento: depois que a página estiver interativa (idle / após `load`), com fade-in do canvas — não pode atrasar o LCP (foto/nome).
- `prefers-reduced-motion: reduce` → partículas renderizadas paradas (`move.enable: false`), sem interação.
- Sem JS → sem fundo (página continua com o brilho verde estático).
- A grade do `.hero-backdrop` sai; o brilho radial verde do hero fica.
- Pausar quando a aba está em segundo plano (tsParticles faz por padrão — confirmar).

### Hero
- Eyebrow sem o status: `Lins, SP · remoto` (mono). O status "● disponível" (com o ping) fica **só** no selo sobre a foto, para não repetir (call do Claude).
- `<h1>`: duas linhas — "João Pedro" (branco) / "Teixeira." (gradiente verde, ponto incluído). Tamanho ~`clamp(3rem, 9vw, 6.5rem)`, weight 800, tracking apertado. **Nome completo** (decisão do Claude, delegada pelo autor): bate com LinkedIn/CV, e as duas linhas ficam equilibradas.
- Abaixo do nome, linha em mono com **digitação** (digita, pausa ~2.2s, apaga, próxima), cursor `|` piscando, em loop:
  1. `Full Stack Developer`
  2. `Vue.js · Nuxt · TypeScript`
  3. `React · Next.js · Tailwind`
  4. `C# · .NET · APIs REST`
  5. `Claude Code · Cursor · IA`
- Acessibilidade da digitação: o texto que anima é `aria-hidden`; um `<span class="sr-only">` estático contém "Full Stack Developer — Vue.js, Nuxt, TypeScript, React, Next.js, Tailwind, C#, .NET, APIs REST, Claude Code, Cursor e IA". Altura reservada (sem layout shift). Sem JS ou com reduced-motion: mostra "Full Stack Developer" fixo.
- Parágrafo curto (substitui o atual): "Construo produtos web do Design System à API — com IA no centro do fluxo e eu no controle da qualidade."
- CTAs e ícones sociais como hoje (agora magnéticos).
- Foto: mantém card arredondado + sombra verde; adicionar **anel** girando lentamente (borda tracejada/gradiente cônico verde, ~30s por volta) e uma **grade de pontos** decorativa deslocada atrás; selo `● disponível` sobreposto no canto inferior da foto. Reduced-motion: anel parado.
- **Dica de scroll** centralizada no rodapé do hero: texto mono "scroll" + linha vertical com um traço descendo em loop; link para `#sobre`; some no mobile se apertar a altura (call do builder).
- A animação de entrada do hero (GSAP) continua; o SplitText passa a dividir o nome por **letras** (efeito mais marcante) — com o fix do gradiente aplicado às letras de "Teixeira.".

### Títulos de seção
- Mantém o rótulo mono `01 — Sobre` e adiciona abaixo um `<h2>` grande (~`clamp(2rem, 5vw, 3.5rem)`, bold) em duas linhas, segunda em gradiente:
  - Sobre: "Um pouco" / "sobre mim."
  - Carreira: "Onde venho" / "construindo."
  - Projetos: "Coisas que" / "eu construí."
  - Skills: "Ferramentas do" / "dia a dia."
  - Contato: o bloco "Vamos conversar?" já cumpre o papel — vira o `<h2>` da seção (rótulo continua acima).
- O rótulo vira texto decorativo (`<p>`), e o `<h2>` real é a frase grande (sem dois h2 por seção).

### Botões magnéticos
- Atributo `data-magnetic` (força opcional `data-magnetic="0.3"`). No `pointermove` dentro de um raio, translada o elemento em direção ao cursor (máx ~8px); no `pointerleave`, volta com transição. Só com ponteiro fino (`(hover: hover) and (pointer: fine)`) e sem reduced-motion.
- Aplicar em: CTAs do hero, ícones sociais do hero, botões de contato, botões da página de projeto.

### Holofote nos cards
- Atributo `data-spotlight`. No `pointermove`, seta `--x`/`--y` no elemento; CSS desenha `radial-gradient(400px circle at var(--x) var(--y), rgba(66,211,146,.10), transparent 40%)` num pseudo-elemento por cima do fundo do card (abaixo do conteúdo). Opcional: borda também ilumina. Só ponteiro fino.
- Aplicar em: cards de carreira, formação/certificações, projetos, skills, stats do Sobre, card do formulário.

### Faixa da stack com logos
- Cada item: logo SVG (Simple Icons, monocromático `currentColor`, ~20px) + nome. Logos: Vue.js, Nuxt, TypeScript, React, Next.js, .NET, C# (se não houver no Simple Icons, usar só texto), Claude, Cursor, Tailwind CSS, Pinia (se houver), Vitest, Jest, Cypress, Playwright, Node.js, Docker, Git.
- Hover no item: logo assume a cor da marca ou o verde accent (call do builder).
- Comportamento atual mantido (pausa no hover, reduced-motion estático).

## Restrições

- Stack: Astro 7, Vue 3, Tailwind 4, GSAP 3.15; nova dependência só `@tsparticles/engine` + `@tsparticles/slim` 4.4.0 (Simple Icons: copiar os paths SVG para `Icon.astro`/arquivo de dados, sem instalar o pacote).
- Lighthouse mobile na home **e** numa página de projeto: Performance ≥ 90, Accessibility 100, Best Practices ≥ 95, SEO 100 (call do Claude: o autor escolheu o tsParticles sabendo do custo; ≥ 90 é a barra, não 98). O tsParticles é fixo — se a barra não for atingida, ajustar carregamento/quantidade, não trocar de lib.
- Sem scroll horizontal em 360px; nada de conteúdo escondido sem JS / com GSAP ou tsParticles bloqueados / com reduced-motion.
- Testes Vitest existentes passam; lógica pura nova (ex.: sequência da digitação, cálculo do deslocamento magnético) vai para `src/lib/` com teste.

## Deixado para o builder

- Durações/curvas exatas, tamanho e estilo do anel, posição da grade de pontos.
- Se a dica de scroll some em telas baixas.
- Cor do logo no hover da faixa.
- Organização dos scripts (um módulo `interactions.ts` ou um por efeito).
