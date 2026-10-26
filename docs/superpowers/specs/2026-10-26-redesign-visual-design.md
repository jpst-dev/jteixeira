# Redesign visual — "Verde Vue refinado"

**Data:** 2026-10-26
**Autor:** João P.
**Substitui:** a seção "Visual — tema Dark Developer" de `2026-08-15-portfolio-design.md` (estrutura, stack e schema daquele documento continuam valendo, exceto onde este documento diz o contrário).

## Por quê

O autor acha o portfólio atual "muito cru". Diagnóstico: todas as seções têm o mesmo peso visual (coluna estreita de 896px, bordas finas, tags em caixinha, nenhuma imagem), não há elemento focal no hero e o tema "terminal estilo GitHub" é genérico. Objetivo: o site deve parecer **profissional e moderno** nos primeiros 5 segundos para um recrutador técnico, sem perder a identidade de especialista Vue.

Referência citada pelo autor: https://www.alissonlimadev.com/ (seções numeradas, hero com foto e status "disponível", seção de carreira em cards, stack em faixa animada, fundo com brilhos em gradiente).

## Escopo

**Neste trabalho:** linguagem visual nova, todos os componentes redesenhados, nova seção Carreira, espaço para foto e screenshots, menu mobile, animações.

**Fora (fase de conteúdo, depois):** textos definitivos, números de impacto da carreira, prints reais dos projetos, foto real, limpeza do conteúdo dos MDX, versão em inglês, SEO/Open Graph. O conteúdo atual dos componentes e MDX é mantido como está; dados novos (Carreira) entram como provisórios a partir do CV.

**Anti-objetivos:**
- Não pode ficar parecido a ponto de parecer cópia da referência (por isso não usamos o roxo/neon dela).
- Animação não pode atrapalhar a leitura nem a performance: nada de scroll-jacking, conteúdo nunca fica invisível se o JS falhar, `prefers-reduced-motion` desliga tudo que é movimento.
- Não regredir acessibilidade (contraste AA, foco visível, navegação por teclado).

## Abordagens consideradas

1. **Redesenhar sobre a base atual só com CSS** + IntersectionObserver para fade/slide. Zero dependência, animações simples.
2. **Mesma base + biblioteca de animação (GSAP)** — efeitos mais ricos (faixa de stack, revelação de texto, scroll-triggered). ~30-60KB JS a mais. **← escolhida pelo autor.**
3. **Recomeçar do zero com outra stack** (ex.: Nuxt) — o autor aceitaria. Descartada (recomendação do Claude): Astro + ilhas Vue já é a stack ideal para portfólio estático e já exibe Vue; recomeçar jogaria fora testes, collections e formulário sem ganho real.

Escolha de lib (decisão do Claude): **GSAP** (+ ScrollTrigger, SplitText — gratuitos desde 2025) em vez de Motion for Vue, porque funciona em `<script>` de componentes `.astro`, não só dentro de ilhas Vue.

## Linguagem visual

Validada com o autor no companheiro visual (3 direções: violeta neon, verde Vue refinado, sóbrio editorial → **B escolhida**).

**Paleta (tokens em `@theme` do `global.css`):**
| Token | Valor | Uso |
|---|---|---|
| `bg` | `#09090b` | fundo |
| `surface` | `#18181b` (cards com ~85% opacidade) | cards, nav pill |
| `border` | `#27272a` | bordas |
| `border-strong` | `#3f3f46` | botão secundário, hover |
| `text` | `#fafafa` | texto principal |
| `muted` | `#a1a1aa` | texto secundário |
| `subtle` | `#7c7c85` | labels, datas (clareado de `#71717a`, que dá ~4.1:1 — abaixo de AA para texto pequeno; call do Claude) |
| `accent` | `#42d392` | verde Vue — CTA, destaques |
| `accent-2` | `#2dd4bf` | segundo stop do gradiente |
| `on-accent` | `#052e1c` | texto sobre botão verde |

**Fundo:** grade sutil (linhas `rgba(255,255,255,.035)` a cada ~32px) com máscara radial que desvanece nas bordas + brilho radial verde (`rgba(66,211,146,.2)`) atrás do hero. Grade e brilho só no topo/hero; o resto da página fica no `bg` liso para não cansar.

**Tipografia:** Inter (variável) para tudo, JetBrains Mono para eyebrows, labels de seção, datas e tags. Títulos grandes e pesados (hero ~`clamp(2.75rem, 7vw, 5rem)`, weight 800, tracking `-0.03em`). Palavra-chave do título com gradiente `accent → accent-2`.

**Layout:** container mais largo (`max-w-6xl`, ~1152px) com gutter 16px no mobile / 24px+ no desktop. Seções com label numerado em mono: `01 — Sobre`, `02 — Carreira`, etc.

**Componentes base:** card (`surface` + `border`, raio 12-16px, hover eleva borda para `border-strong` e leve brilho verde), tag (pill `surface` + `border`, texto `muted`), botão primário (verde sólido, texto `on-accent`), botão secundário (borda `border-strong`). Foco visível: `outline` 2px `accent` com offset em todos os interativos (remover os `focus:outline-none` atuais).

## Estrutura da página

1. **Nav** — logo `jpst.dev` (ponto verde) à esquerda; links em pílula flutuante (`surface` translúcido + blur) centralizada; à direita link "CV". Fica fixa; ganha fundo mais opaco após rolar. Link da seção ativa destacado. **Mobile:** botão hambúrguer abre painel em tela cheia com os links (ilha Vue pequena ou script inline; foco preso dentro enquanto aberto, fecha com Esc).
2. **Hero** — grid 2 colunas (empilha no mobile, foto acima ou abaixo — call do builder): eyebrow mono `● disponível · Lins, SP · remoto` (bolinha verde pulsando), `<h1>` com tagline como no mockup aprovado ("Interfaces que **escalam.**", palavra final em gradiente — texto provisório, revisado na fase de conteúdo), parágrafo de apresentação começando pelo nome ("Sou João Pedro Teixeira, dev front-end…") e com "Front-End → Fullstack"; o nome continua no `<title>` da página (call do Claude), CTAs "Ver projetos →" e "Baixar CV", ícones GitHub/LinkedIn. Coluna direita: foto em card arredondado (raio ~24px) com borda e sombra verde difusa. Enquanto não houver foto real: placeholder com iniciais "JP".
3. **01 — Sobre** — texto atual à esquerda; à direita 3 "stat cards" (provisórios: `4+ anos` de front-end, `Design System` em produção, `Vue · Nuxt · .NET`).
4. **Faixa de stack** — marquee horizontal infinito com nomes/ícones das tecnologias (pausa no hover; estático com `prefers-reduced-motion`).
5. **02 — Carreira** — timeline vertical com cards: empresa, cargo, período (mono), bullets, tags. Dados provisórios do CV: Mercado Eletrônico (Desenvolvedor Front-end, 2022 – atual, unificando os dois cargos ou listando ambos — call do builder) e ViaRondon (Aprendiz de TI, 2020 – 2022). Conteúdo em uma content collection nova `carreira` (ou arquivo de dados tipado) para editar sem mexer em componente.
6. **03 — Projetos** — o projeto com `destaque: true` em card largo (imagem grande + texto lado a lado); demais em grid de 2 colunas com thumbnail no topo. Thumbnail vem de `imagens[0]`; sem imagem → placeholder gerado (gradiente + título). Remover o campo de busca/filtro (5 projetos não justificam); `filterProjetos` e seus testes podem ser removidos junto. Card inteiro clicável, seta `→` anima no hover.
7. **04 — Skills** — grupos atuais em cards (bento grid), mesmos dados.
8. **05 — Contato** — título chamativo ("Vamos conversar?"), e-mail grande com botão copiar, links sociais, formulário atual reestilizado ao lado.
9. **Footer** — simples, ano dinâmico.

**Página de projeto (`/projetos/[id]`)** — mesma linguagem: hero do projeto com título grande, papel, stack em tags, botões repo/demo no topo (não só no fim), imagem principal grande, blocos problema/solução em cards, `prose-invert` ajustado para a paleta. Links externos com `target="_blank" rel="noopener noreferrer"`.

## Animações (GSAP)

- **Hero:** entrada em sequência (eyebrow → título com SplitText por palavra/linha → parágrafo → CTAs → foto) ~1s no total.
- **Seções:** label + título + conteúdo revelam com fade + translateY curto ao entrar na viewport (ScrollTrigger, `once: true`). Cards em stagger.
- **Marquee** da stack (pode ser CSS puro — call do builder).
- **Micro-interações** (hover de card, seta, botões) em CSS, não GSAP.
- **Regras:** estado inicial "escondido" só é aplicado via JS (classe no `<html>` setada por script inline), então sem JS tudo aparece; `prefers-reduced-motion: reduce` → nenhuma animação de entrada, marquee parado; GSAP carregado só no client, um único módulo de init compartilhado (ex.: `src/scripts/animations.ts`) importado no `BaseLayout`.

## Restrições

- Stack mantida: Astro 7, Vue 3 (ilhas), Tailwind 4, MDX, Vitest. Nova dependência: `gsap`.
- Build continua 100% estático.
- Testes existentes passam (ou são removidos junto com o código que testam, ex.: filtro).
- Contraste AA em todo texto (verificar `subtle` sobre `bg` em textos pequenos).
- Funciona em 360px de largura sem scroll horizontal.

## Deixado para o builder

- Ícones (sugestão: SVG inline de Simple Icons/Lucide, sem lib pesada).
- Posição da foto no mobile, curvas e durações exatas das animações, espaçamentos finos.
- Forma de armazenar dados da Carreira (collection vs `.ts` tipado).
- Se o marquee é CSS ou GSAP.
