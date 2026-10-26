# Versão em inglês — design

**Data:** 2026-10-26 · **Autor:** João P.

## Por quê
Recrutadores e empresas de fora precisam ler o portfólio, abrir os cases e baixar um CV em inglês. O autor pediu a versão **completa**: home, páginas de projeto e CV.

## Escopo
- **Dentro:** home, páginas de projeto, CV (página + PDF), imagem de compartilhamento, metadados/SEO, seletor PT/EN, sitemap.
- **Fora:** redirecionamento automático pelo idioma do navegador; traduzir nomes próprios e de tecnologias; conteúdo novo.
- **Anti-objetivos:** inglês "de tradutor automático" (tom deve ser natural, de dev); site em inglês com trechos em português escapando; duplicar layout (cada componente existe uma vez).

## Abordagens (decidida: 1)
1. **Rotas `/en` com o i18n do Astro**, componentes recebem o idioma, dicionário para textos curtos e versão EN dos textos longos. ← escolhida pelo autor.
2. Copiar páginas/componentes em inglês — duplicação de layout.
3. Troca por JS na mesma página — sem SEO e sem no-JS.

## Decisões
- **Rotas:** PT continua na raiz (`/`, `/projetos/<id>/`, `/cv/`); EN em `/en/`, `/en/projects/<id>/`, `/en/cv/` (call do Claude: slug "projects" em inglês). Config `i18n` do Astro com `defaultLocale: 'pt'`, `locales: ['pt','en']`, sem prefixo no padrão.
- **Âncoras das seções** traduzidas no EN: `#about`, `#career`, `#projects`, `#skills`, `#contact` (PT mantém `#sobre`… para não quebrar links já compartilhados).
- **Textos curtos** (navbar, títulos de seção, botões, form, rodapé, aria-labels, typewriter, metadados): dicionário em `src/i18n/` com `t(lang, chave)`; tipagem garante que toda chave existe nos dois idiomas.
- **Carreira:** `carreira.json` ganha um bloco opcional `en: { cargo, local, bullets }` por experiência.
- **Projetos:** os `.mdx` atuais continuam a fonte (PT + campos compartilhados: stack, links, imagens, destaque). Nova coleção `projetosEn` (`src/content/projetos-en/<id>.mdx`) só com os campos traduzíveis (titulo, resumo, problema, solucao, papel) + corpo do case. Função pura mescla PT+EN por id; **projeto sem tradução falha o build** com mensagem clara (call do Claude: evita português vazando no `/en`).
- **Perfil** (`src/data/perfil.ts`): skills, formação, certificações, idiomas viram bilíngues. Títulos de cursos/certificações e nomes de graduação são **traduzidos**; nomes de eventos e instituições (TDC, FATEC-SP, UNIGRANDE) ficam como estão (call do Claude).
- **Datas:** `formatPeriodo(inicio, fim, lang)` com meses em inglês e "present".
- **Seletor PT/EN:** na navbar (desktop) e no menu mobile, leva para a página equivalente no outro idioma (mesma seção não é mantida — vai para o topo da página equivalente).
- **SEO:** `<html lang>`, `og:locale` (`pt_BR`/`en_US`), `hreflang` alternates (pt-BR, en, x-default→PT) em todas as páginas; sitemap com as duas versões; título/descrição traduzidos.
- **OG em inglês:** `/en/og/` → `public/og-en.png`; `npm run og` gera as duas.
- **CV em inglês:** `/en/cv/` → `public/Joao-Pedro-Teixeira-Resume.pdf`; `npm run cv` gera os dois públicos; versão privada com `--lang en` opcional.
- **Tradução:** feita pelo Claude, tom natural de dev. **O autor revisa antes do merge** (preview local / screenshots); nada vai ao ar sem essa revisão (call do Claude).

## Restrições
- Sem novas dependências.
- Lighthouse (PT e EN): Performance ≥ 90, A11y 100, BP ≥ 95, SEO 100.
- Todos os testes passam; lógica pura nova (dicionário, mescla de projetos, datas EN) com teste.
- Animações, smooth scroll e indicador da navbar funcionando nas duas versões.

## Deixado para o builder
- Estrutura interna do dicionário, nomes de chaves.
- Visual exato do seletor PT/EN (discreto, combinando com o `cv` da navbar).
