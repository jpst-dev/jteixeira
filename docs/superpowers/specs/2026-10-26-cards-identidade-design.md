# Cards com mais identidade + logos das empresas — design (curto)

**Data:** 2026-10-26 · **Autor:** João P.

## Por quê
Os cards e badges estão "apagados": todos no mesmo cinza, sem nenhum verde parado, e as seções parecem iguais. O autor quer **detalhes**, nada chamativo. Logos das empresas dão reconhecimento rápido ao recrutador.

## Escolhido (mockup no navegador)
- **Cards: variação A "Brilho no topo"** — fio verde→turquesa de 1px na borda de cima, leve luz verde no canto superior direito, fundo em degradê sutil (em vez do cinza chapado).
- **Badges: estilo da variação C** — cantos pouco arredondados (6px), mono, borda fina; tecnologias principais em verde com `#` na frente, demais neutras.
- **Ícones dos grupos de Skills: estilo C** — fundo transparente, só ícone e borda em verde.
- **Logos** (arquivos do autor, 100×100) em quadrado arredondado de 44px no card da empresa.
- **Mercado Eletrônico agrupado**: um card com logo e os dois cargos em linha do tempo (atual com ponto verde), deixando a promoção visível.

## Abordagens
1. **Utilitários CSS globais** (`.card`, `.tag`/`.tag-principal`) aplicados nos componentes. ← escolhida: um lugar só, igual em todo o site.
2. Classes Tailwind repetidas em cada componente — fácil de divergir.
3. Componentes `Card`/`Tag` novos — mais estrutura do que o tamanho da mudança pede.

## Decisões (calls do Claude, para conferir)
- **Onde o card novo entra:** todos os cards — Sobre (stats), Carreira, Formação/Certificações, Projetos, Skills, formulário de Contato, Problema/Solução e "Próximo projeto" nas páginas de projeto.
- **Onde o badge novo entra:** todas as listas de tecnologia (carreira, skills, cards de projeto, página de projeto).
- **"Principal" = Vue, Nuxt, TypeScript, C#/.NET** (incluindo variações como "Vue 3", "Nuxt 3", "C#", ".NET"). React/Next ficam neutros — o foco do perfil é Vue + .NET.
- **Ícones das Skills:** front-end = monitor, back-end = servidor, IA = brilho (sparkles), qualidade = escudo com check.
- **Tempo na empresa** calculado das datas (ex.: "3 anos e 4 meses" / "3 yrs 4 mos"), no cabeçalho do card.
- Logos movidas para `public/empresas/<empresa>.jpg`; campo `logo` no `carreira.json`; empresas agrupadas pelo nome.
- **CV (PDF) não muda** — sem logos, cargos continuam separados (formato de currículo).
- Funciona igual em PT e EN; Lighthouse e testes no mesmo patamar.
