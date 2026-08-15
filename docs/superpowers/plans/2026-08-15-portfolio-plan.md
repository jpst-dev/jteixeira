# Portfólio Pessoal — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page portfolio site (Hero, Sobre, Projetos, Skills, Contato) using Astro + Vue islands + Tailwind, matching the "Dark Developer" visual design validated in `docs/superpowers/specs/2026-08-15-portfolio-design.md`.

**Architecture:** Astro generates fully static HTML/CSS for all non-interactive sections. Two Vue 3 components are hydrated as islands (`client:visible`) for the only interactive behavior on the site: filtering the projects grid and validating/submitting the contact form. Project content lives in an Astro content collection (MDX + Zod schema), and each project gets its own statically-generated detail page.

**Tech Stack:** Astro 5, Vue 3 (`@astrojs/vue`), Tailwind CSS 4 (`@tailwindcss/vite`), `@astrojs/mdx`, Vitest (pure-function unit tests for the two islands' logic), Fontsource (self-hosted Inter + JetBrains Mono), Web3Forms (contact form backend, no server needed).

**Reference data used throughout this plan (already confirmed with the author):**
- Nome exibido: `João P.`
- Título: `Front-End Developer → Fullstack`
- LinkedIn: `https://www.linkedin.com/in/jpst-dev/`
- GitHub: `https://github.com/jpst-dev`
- E-mail de contato: `jteixeira.dev@outlook.com`
- CV: autor vai copiar o PDF para `public/cv.pdf` manualmente (fora do escopo de código)

---

## File Structure

```
astro.config.mjs
package.json
tsconfig.json
vitest.config.mts
.env.example
public/
  favicon.svg
  cv.pdf                      (author-provided, not created by this plan)
src/
  content.config.ts
  content/
    projetos/
      exemplo-projeto.mdx
  lib/
    filterProjetos.ts
    filterProjetos.test.ts
    validateContato.ts
    validateContato.test.ts
  layouts/
    BaseLayout.astro
  components/
    Nav.astro
    Footer.astro
    Hero.astro
    Sobre.astro
    Skills.astro
    ProjetosGrid.vue
    Contato.astro
    ContatoForm.vue
  pages/
    index.astro
    projetos/
      [...id].astro
  styles/
    global.css
```

---

### Task 1: Scaffold Astro project with Vue, MDX, Tailwind and Vitest

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json` (via CLI)
- Create: `vitest.config.mts`

- [ ] **Step 1: Scaffold the Astro project in the current directory**

This directory already has `.git`, `.gitignore` and `docs/` — use `--no-git` since git is already initialized, and run against `.`:

Run: `npm create astro@latest . -- --template minimal --no-git --install --typescript strict`

Expected: prompts are skipped (flags provided), `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro` are created, `node_modules` installed. If the CLI warns about a non-empty directory, confirm/continue — only dotfiles and `docs/` exist, nothing conflicts.

- [ ] **Step 2: Add Vue, MDX and Tailwind integrations**

Run: `npx astro add vue mdx tailwind --yes`

Expected: command installs `@astrojs/vue`, `@astrojs/mdx`, `@tailwindcss/vite` and updates `astro.config.mjs` to include all three (Vue and MDX as integrations, Tailwind as a Vite plugin).

- [ ] **Step 3: Verify `astro.config.mjs` content**

Open `astro.config.mjs` and confirm it looks like this (adjust only if `astro add` produced a different but equivalent shape):

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [vue(), mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 4: Install Vitest and Fontsource fonts**

Run: `npm install -D vitest && npm install @fontsource/inter @fontsource/jetbrains-mono`

Expected: both installs complete with no errors.

- [ ] **Step 5: Add Vitest config**

Create `vitest.config.mts`:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
  },
});
```

- [ ] **Step 6: Add test scripts to `package.json`**

Edit the `"scripts"` block in `package.json` to include:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 7: Verify dev server runs**

Run: `npm run dev`
Expected: server starts on `http://localhost:4321` with no errors (Ctrl+C to stop after confirming).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro project with Vue, MDX, Tailwind and Vitest"
```

---

### Task 2: Global styles and Dark Developer theme tokens

**Files:**
- Create: `src/styles/global.css`
- Modify: `src/layouts/BaseLayout.astro` (created in Task 4, so global.css is just written here and imported later)

- [ ] **Step 1: Create the theme tokens and font imports**

Create `src/styles/global.css`:

```css
@import "tailwindcss";
@import "@fontsource/inter/400.css";
@import "@fontsource/inter/600.css";
@import "@fontsource/inter/700.css";
@import "@fontsource/jetbrains-mono/400.css";
@import "@fontsource/jetbrains-mono/500.css";

@theme {
  --color-bg: #0d1117;
  --color-text: #e6edf3;
  --color-muted: #8b949e;
  --color-accent: #42d392;
  --color-border: #21262d;

  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
}

::selection {
  background-color: var(--color-accent);
  color: var(--color-bg);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/global.css
git commit -m "style: add Dark Developer theme tokens and self-hosted fonts"
```

---

### Task 3: Content collection schema and example project

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/projetos/exemplo-projeto.mdx`

- [ ] **Step 1: Define the `projetos` collection schema**

Create `src/content.config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projetos = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projetos' }),
  schema: z.object({
    titulo: z.string(),
    resumo: z.string(),
    problema: z.string(),
    solucao: z.string(),
    stack: z.array(z.string()),
    papel: z.string(),
    linkRepo: z.string().url().optional(),
    linkDemo: z.string().url().optional(),
    destaque: z.boolean().default(false),
  }),
});

export const collections = { projetos };
```

- [ ] **Step 2: Add one example project entry**

Create `src/content/projetos/exemplo-projeto.mdx` — this is a working example following the schema; replace it with your real projects after the site builds successfully (same file format, one `.mdx` file per project):

```mdx
---
titulo: "Projeto de Exemplo"
resumo: "Substitua este arquivo pelos seus projetos reais, um .mdx por projeto."
problema: "Descreva aqui o problema que o projeto resolvia."
solucao: "Descreva aqui a solução implementada e o motivo das decisões técnicas."
stack: ["Vue.js", "Nuxt", "TypeScript"]
papel: "Seu papel no projeto (ex: desenvolvedor front-end responsável pela migração)."
linkRepo: "https://github.com/jpst-dev/exemplo"
destaque: true
---

Conteúdo adicional em Markdown pode entrar aqui (detalhes técnicos, aprendizados, etc.) e será renderizado na página de detalhe do projeto.
```

- [ ] **Step 3: Verify the collection is picked up by the build**

Run: `npm run build`
Expected: build succeeds with no Zod validation errors. If it fails, the error message will point at the exact field in `exemplo-projeto.mdx` that doesn't match the schema.

- [ ] **Step 4: Commit**

```bash
git add src/content.config.ts src/content/projetos/exemplo-projeto.mdx
git commit -m "feat: add projetos content collection with example entry"
```

---

### Task 4: Base layout, nav and footer

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Nav.astro`
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Create the nav component**

Create `src/components/Nav.astro`:

```astro
---
const links = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#projetos', label: 'Projetos' },
  { href: '#skills', label: 'Skills' },
  { href: '#contato', label: 'Contato' },
];
---

<header class="fixed top-0 inset-x-0 z-50 backdrop-blur bg-bg/80 border-b border-border">
  <nav class="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
    <a href="#" class="font-mono text-accent">jpst-dev</a>
    <ul class="flex gap-6 text-sm text-muted">
      {links.map((link) => (
        <li><a href={link.href} class="hover:text-accent transition-colors">{link.label}</a></li>
      ))}
    </ul>
  </nav>
</header>
```

- [ ] **Step 2: Create the footer component**

Create `src/components/Footer.astro`:

```astro
---
const year = 2026;
---

<footer class="border-t border-border py-8 text-center text-sm text-muted font-mono">
  <p>&copy; {year} João P. — construído com Astro + Vue + Tailwind.</p>
</footer>
```

- [ ] **Step 3: Create the base layout**

Create `src/layouts/BaseLayout.astro`:

```astro
---
import '../styles/global.css';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
---

<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>
  </head>
  <body>
    <Nav />
    <main class="pt-20">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 4: Commit**

```bash
git add src/layouts/BaseLayout.astro src/components/Nav.astro src/components/Footer.astro
git commit -m "feat: add base layout, nav and footer"
```

---

### Task 5: Hero section

**Files:**
- Create: `src/components/Hero.astro`

- [ ] **Step 1: Create the Hero component with real content**

Create `src/components/Hero.astro`:

```astro
---
const tags = ['Vue.js', 'Nuxt', 'React', 'Next.js'];
---

<section id="hero" class="max-w-4xl mx-auto px-6 min-h-[80vh] flex flex-col justify-center gap-6">
  <p class="font-mono text-accent text-sm">&gt; whoami --role=frontend</p>
  <h1 class="text-4xl sm:text-5xl font-bold">João P.</h1>
  <p class="text-lg text-muted">Front-End Developer &rarr; Fullstack</p>
  <ul class="flex flex-wrap gap-2 font-mono text-xs">
    {tags.map((tag) => (
      <li class="border border-border rounded px-2 py-1 text-muted">{tag}</li>
    ))}
  </ul>
  <div class="flex gap-4 pt-4">
    <a href="#projetos" class="bg-accent text-bg font-semibold px-5 py-2 rounded hover:opacity-90 transition-opacity">
      Ver projetos
    </a>
    <a href="/cv.pdf" download class="border border-accent text-accent px-5 py-2 rounded hover:bg-accent/10 transition-colors">
      Baixar CV
    </a>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat: add Hero section"
```

---

### Task 6: Sobre section

**Files:**
- Create: `src/components/Sobre.astro`

- [ ] **Step 1: Create the Sobre component**

Create `src/components/Sobre.astro` with the bio adapted from the author's LinkedIn description (1st person, shortened for web reading):

```astro
<section id="sobre" class="max-w-4xl mx-auto px-6 py-24">
  <h2 class="font-mono text-accent text-sm mb-2">## sobre</h2>
  <div class="space-y-4 text-lg text-text/90 leading-relaxed max-w-2xl">
    <p>
      Sou desenvolvedor front-end há mais de 4 anos, especializado em Vue.js e Nuxt —
      com base sólida também em React e Next.js. Meu foco é construir interfaces
      performáticas, acessíveis e fáceis de manter, aplicando TDD, testes automatizados
      e Design System no dia a dia.
    </p>
    <p>
      Atualmente estou evoluindo para fullstack: aprofundando backend com C#/.NET e
      APIs REST no trabalho, sempre com atenção à arquitetura e à integração entre o
      que o front consome e o que o backend entrega.
    </p>
    <p>
      Uso IA como parte do meu fluxo — para acelerar tarefas repetitivas e ganhar
      produtividade — sempre com revisão humana e foco em qualidade. Acredito que
      tecnologia bem construída simplifica o dia a dia das pessoas, e é assim que
      busco evoluir: da interface à infraestrutura.
    </p>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Sobre.astro
git commit -m "feat: add Sobre section"
```

---

### Task 7: Projects grid with filter (Vue island, TDD)

**Files:**
- Create: `src/lib/filterProjetos.ts`
- Test: `src/lib/filterProjetos.test.ts`
- Create: `src/components/ProjetosGrid.vue`

- [ ] **Step 1: Write the failing test for the filter logic**

Create `src/lib/filterProjetos.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { filterProjetos, type ProjetoResumo } from './filterProjetos';

const projetos: ProjetoResumo[] = [
  { id: 'a', titulo: 'Dashboard Vue', resumo: 'Painel administrativo', stack: ['Vue.js', 'Nuxt'] },
  { id: 'b', titulo: 'Loja React', resumo: 'E-commerce', stack: ['React', 'Next.js'] },
  { id: 'c', titulo: 'API de Pagamentos', resumo: 'Serviço backend', stack: ['C#', '.NET'] },
];

describe('filterProjetos', () => {
  it('returns all projects when query is empty', () => {
    expect(filterProjetos(projetos, '')).toHaveLength(3);
  });

  it('matches by title, case-insensitive', () => {
    const result = filterProjetos(projetos, 'dashboard');
    expect(result.map((p) => p.id)).toEqual(['a']);
  });

  it('matches by stack tag', () => {
    const result = filterProjetos(projetos, 'react');
    expect(result.map((p) => p.id)).toEqual(['b']);
  });

  it('matches by resumo text', () => {
    const result = filterProjetos(projetos, 'backend');
    expect(result.map((p) => p.id)).toEqual(['c']);
  });

  it('returns empty array when nothing matches', () => {
    expect(filterProjetos(projetos, 'inexistente')).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/filterProjetos.test.ts`
Expected: FAIL — `Cannot find module './filterProjetos'` (file doesn't exist yet).

- [ ] **Step 3: Implement the minimal filter function**

Create `src/lib/filterProjetos.ts`:

```typescript
export interface ProjetoResumo {
  id: string;
  titulo: string;
  resumo: string;
  stack: string[];
}

export function filterProjetos(projetos: ProjetoResumo[], query: string): ProjetoResumo[] {
  const q = query.trim().toLowerCase();
  if (!q) return projetos;

  return projetos.filter((projeto) => {
    const haystack = [projeto.titulo, projeto.resumo, ...projeto.stack].join(' ').toLowerCase();
    return haystack.includes(q);
  });
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/filterProjetos.test.ts`
Expected: PASS — 5 tests passing.

- [ ] **Step 5: Create the Vue island that wires the filter to the grid**

Create `src/components/ProjetosGrid.vue`:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { filterProjetos, type ProjetoResumo } from '../lib/filterProjetos';

const props = defineProps<{ projetos: ProjetoResumo[] }>();

const query = ref('');
const filtrados = computed(() => filterProjetos(props.projetos, query.value));
</script>

<template>
  <div>
    <input
      v-model="query"
      type="text"
      placeholder="Filtrar por nome, stack ou descrição..."
      class="w-full mb-8 bg-transparent border border-border rounded px-4 py-2 font-mono text-sm placeholder:text-muted focus:outline-none focus:border-accent"
    />
    <p v-if="filtrados.length === 0" class="text-muted font-mono text-sm">Nenhum projeto encontrado.</p>
    <div class="grid sm:grid-cols-2 gap-4">
      <a
        v-for="projeto in filtrados"
        :key="projeto.id"
        :href="`/projetos/${projeto.id}/`"
        class="block border border-border rounded-lg p-5 hover:border-accent transition-colors"
      >
        <h3 class="font-semibold text-lg mb-2">{{ projeto.titulo }}</h3>
        <p class="text-muted text-sm mb-4">{{ projeto.resumo }}</p>
        <ul class="flex flex-wrap gap-2 font-mono text-xs">
          <li v-for="tech in projeto.stack" :key="tech" class="border border-border rounded px-2 py-0.5 text-muted">
            {{ tech }}
          </li>
        </ul>
      </a>
    </div>
  </div>
</template>
```

- [ ] **Step 6: Run the full test suite**

Run: `npm run test`
Expected: PASS — all tests green.

- [ ] **Step 7: Commit**

```bash
git add src/lib/filterProjetos.ts src/lib/filterProjetos.test.ts src/components/ProjetosGrid.vue
git commit -m "feat: add projects grid with filter (Vue island, TDD)"
```

---

### Task 8: Project detail pages

**Files:**
- Create: `src/pages/projetos/[...id].astro`

- [ ] **Step 1: Create the dynamic route**

Create `src/pages/projetos/[...id].astro`:

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const projetos = await getCollection('projetos');
  return projetos.map((projeto) => ({
    params: { id: projeto.id },
    props: { projeto },
  }));
}

const { projeto } = Astro.props;
const { Content } = await render(projeto);
---

<BaseLayout title={`${projeto.data.titulo} — João P.`} description={projeto.data.resumo}>
  <article class="max-w-3xl mx-auto px-6 py-24">
    <a href="/#projetos" class="font-mono text-accent text-sm">&larr; voltar para projetos</a>
    <h1 class="text-3xl font-bold mt-4 mb-2">{projeto.data.titulo}</h1>
    <p class="text-muted mb-6">{projeto.data.papel}</p>

    <ul class="flex flex-wrap gap-2 font-mono text-xs mb-10">
      {projeto.data.stack.map((tech: string) => (
        <li class="border border-border rounded px-2 py-1 text-muted">{tech}</li>
      ))}
    </ul>

    <div class="space-y-8">
      <div>
        <h2 class="font-mono text-accent text-sm mb-2">## problema</h2>
        <p class="text-text/90 leading-relaxed">{projeto.data.problema}</p>
      </div>
      <div>
        <h2 class="font-mono text-accent text-sm mb-2">## solução</h2>
        <p class="text-text/90 leading-relaxed">{projeto.data.solucao}</p>
      </div>
    </div>

    <div class="prose prose-invert mt-10">
      <Content />
    </div>

    <div class="flex gap-4 mt-10">
      {projeto.data.linkRepo && (
        <a href={projeto.data.linkRepo} class="border border-accent text-accent px-4 py-2 rounded text-sm">Ver repositório</a>
      )}
      {projeto.data.linkDemo && (
        <a href={projeto.data.linkDemo} class="bg-accent text-bg px-4 py-2 rounded text-sm">Ver demo</a>
      )}
    </div>
  </article>
</BaseLayout>
```

- [ ] **Step 2: Verify the route builds**

Run: `npm run build`
Expected: build output lists `/projetos/exemplo-projeto/index.html` generated with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/projetos/
git commit -m "feat: add project detail pages"
```

---

### Task 9: Skills section

**Files:**
- Create: `src/components/Skills.astro`

- [ ] **Step 1: Create the Skills component with grouped categories**

Create `src/components/Skills.astro` (categories derived from the author's own LinkedIn bio):

```astro
---
const grupos = [
  {
    categoria: 'Front-end',
    itens: ['Vue.js', 'Nuxt', 'React', 'Next.js', 'TypeScript', 'Design System'],
  },
  {
    categoria: 'Qualidade & Performance',
    itens: ['TDD', 'Testes automatizados', 'Acessibilidade', 'Performance web'],
  },
  {
    categoria: 'Backend em evolução',
    itens: ['C#', '.NET', 'APIs REST', 'Arquitetura de integração'],
  },
  {
    categoria: 'IA no fluxo de trabalho',
    itens: ['Automação de tarefas repetitivas', 'Produtividade assistida por IA com revisão humana'],
  },
];
---

<section id="skills" class="max-w-4xl mx-auto px-6 py-24">
  <h2 class="font-mono text-accent text-sm mb-8">## skills</h2>
  <div class="grid sm:grid-cols-2 gap-8">
    {grupos.map((grupo) => (
      <div>
        <h3 class="font-semibold mb-3">{grupo.categoria}</h3>
        <ul class="flex flex-wrap gap-2 font-mono text-xs">
          {grupo.itens.map((item) => (
            <li class="border border-border rounded px-2 py-1 text-muted">{item}</li>
          ))}
        </ul>
      </div>
    ))}
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Skills.astro
git commit -m "feat: add Skills section"
```

---

### Task 10: Contact form (Vue island, TDD) and contact section

**Files:**
- Create: `src/lib/validateContato.ts`
- Test: `src/lib/validateContato.test.ts`
- Create: `src/components/ContatoForm.vue`
- Create: `src/components/Contato.astro`
- Create: `.env.example`

- [ ] **Step 1: Write the failing test for validation logic**

Create `src/lib/validateContato.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { validateContato } from './validateContato';

describe('validateContato', () => {
  it('passes with valid data', () => {
    const result = validateContato({ nome: 'Ana Silva', email: 'ana@example.com', mensagem: 'Gostaria de conversar sobre uma vaga.' });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('fails when nome is too short', () => {
    const result = validateContato({ nome: 'A', email: 'ana@example.com', mensagem: 'Gostaria de conversar sobre uma vaga.' });
    expect(result.valid).toBe(false);
    expect(result.errors.nome).toBeDefined();
  });

  it('fails with invalid email', () => {
    const result = validateContato({ nome: 'Ana Silva', email: 'nao-e-email', mensagem: 'Gostaria de conversar sobre uma vaga.' });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeDefined();
  });

  it('fails when mensagem is too short', () => {
    const result = validateContato({ nome: 'Ana Silva', email: 'ana@example.com', mensagem: 'Oi' });
    expect(result.valid).toBe(false);
    expect(result.errors.mensagem).toBeDefined();
  });

  it('reports multiple errors at once', () => {
    const result = validateContato({ nome: '', email: '', mensagem: '' });
    expect(result.valid).toBe(false);
    expect(Object.keys(result.errors)).toEqual(['nome', 'email', 'mensagem']);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/validateContato.test.ts`
Expected: FAIL — `Cannot find module './validateContato'`.

- [ ] **Step 3: Implement the minimal validation function**

Create `src/lib/validateContato.ts`:

```typescript
export interface ContatoData {
  nome: string;
  email: string;
  mensagem: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContatoData, string>>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContato(data: ContatoData): ValidationResult {
  const errors: ValidationResult['errors'] = {};

  if (data.nome.trim().length < 2) {
    errors.nome = 'Informe seu nome completo.';
  }
  if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = 'Informe um e-mail válido.';
  }
  if (data.mensagem.trim().length < 10) {
    errors.mensagem = 'Escreva uma mensagem com pelo menos 10 caracteres.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/validateContato.test.ts`
Expected: PASS — 5 tests passing.

- [ ] **Step 5: Document the Web3Forms access key**

Create `.env.example`:

```
PUBLIC_WEB3FORMS_KEY=your-access-key-from-web3forms.com
```

This key is obtained for free at https://web3forms.com by registering the contact e-mail (`jteixeira.dev@outlook.com`). Copy `.env.example` to `.env` and fill in the real key — `.env` is already gitignored (Task setup in the design spec).

- [ ] **Step 6: Create the contact form Vue island**

Create `src/components/ContatoForm.vue`:

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { validateContato, type ContatoData } from '../lib/validateContato';

const form = reactive<ContatoData>({ nome: '', email: '', mensagem: '' });
const errors = ref<Record<string, string>>({});
const status = ref<'idle' | 'sending' | 'sent' | 'error'>('idle');

async function onSubmit() {
  const result = validateContato(form);
  errors.value = result.errors as Record<string, string>;
  if (!result.valid) return;

  status.value = 'sending';
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: import.meta.env.PUBLIC_WEB3FORMS_KEY,
        name: form.nome,
        email: form.email,
        message: form.mensagem,
      }),
    });
    status.value = response.ok ? 'sent' : 'error';
  } catch {
    status.value = 'error';
  }
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-4 max-w-md">
    <div>
      <input v-model="form.nome" type="text" placeholder="Seu nome"
        class="w-full bg-transparent border border-border rounded px-4 py-2 focus:outline-none focus:border-accent" />
      <p v-if="errors.nome" class="text-red-400 text-sm mt-1">{{ errors.nome }}</p>
    </div>
    <div>
      <input v-model="form.email" type="email" placeholder="Seu e-mail"
        class="w-full bg-transparent border border-border rounded px-4 py-2 focus:outline-none focus:border-accent" />
      <p v-if="errors.email" class="text-red-400 text-sm mt-1">{{ errors.email }}</p>
    </div>
    <div>
      <textarea v-model="form.mensagem" placeholder="Sua mensagem" rows="4"
        class="w-full bg-transparent border border-border rounded px-4 py-2 focus:outline-none focus:border-accent"></textarea>
      <p v-if="errors.mensagem" class="text-red-400 text-sm mt-1">{{ errors.mensagem }}</p>
    </div>
    <button type="submit" :disabled="status === 'sending'"
      class="bg-accent text-bg font-semibold px-5 py-2 rounded hover:opacity-90 transition-opacity disabled:opacity-50">
      {{ status === 'sending' ? 'Enviando...' : 'Enviar mensagem' }}
    </button>
    <p v-if="status === 'sent'" class="text-accent text-sm">Mensagem enviada! Obrigado pelo contato.</p>
    <p v-if="status === 'error'" class="text-red-400 text-sm">Algo deu errado — tente novamente ou use o e-mail direto abaixo.</p>
  </form>
</template>
```

- [ ] **Step 7: Create the contact section wrapper**

Create `src/components/Contato.astro`:

```astro
---
import ContatoForm from './ContatoForm.vue';

const links = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jpst-dev/' },
  { label: 'GitHub', href: 'https://github.com/jpst-dev' },
  { label: 'E-mail', href: 'mailto:jteixeira.dev@outlook.com' },
];
---

<section id="contato" class="max-w-4xl mx-auto px-6 py-24">
  <h2 class="font-mono text-accent text-sm mb-8">## contato</h2>
  <div class="grid sm:grid-cols-2 gap-12">
    <div>
      <p class="text-muted mb-4">Prefere um contato direto?</p>
      <ul class="space-y-2 font-mono text-sm">
        {links.map((link) => (
          <li><a href={link.href} target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">{link.label}</a></li>
        ))}
      </ul>
    </div>
    <ContatoForm client:visible />
  </div>
</section>
```

- [ ] **Step 8: Run the full test suite**

Run: `npm run test`
Expected: PASS — all tests green (filterProjetos + validateContato).

- [ ] **Step 9: Commit**

```bash
git add src/lib/validateContato.ts src/lib/validateContato.test.ts src/components/ContatoForm.vue src/components/Contato.astro .env.example
git commit -m "feat: add contact form (Vue island, TDD) with Web3Forms integration"
```

---

### Task 11: Assemble the homepage

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Compose all sections on the homepage**

Replace the contents of `src/pages/index.astro` (created by the Astro scaffold in Task 1) with:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import Sobre from '../components/Sobre.astro';
import Skills from '../components/Skills.astro';
import Contato from '../components/Contato.astro';
import ProjetosGrid from '../components/ProjetosGrid.vue';
import { getCollection } from 'astro:content';

const projetosRaw = await getCollection('projetos');
const projetos = projetosRaw
  .sort((a, b) => Number(b.data.destaque) - Number(a.data.destaque))
  .map((p) => ({
    id: p.id,
    titulo: p.data.titulo,
    resumo: p.data.resumo,
    stack: p.data.stack,
  }));
---

<BaseLayout
  title="João P. — Front-End Developer → Fullstack"
  description="Desenvolvedor front-end especializado em Vue.js e Nuxt, com sólidos conhecimentos em React e Next.js, evoluindo para fullstack com C#/.NET."
>
  <Hero />
  <Sobre />
  <section id="projetos" class="max-w-4xl mx-auto px-6 py-24">
    <h2 class="font-mono text-accent text-sm mb-8">## projetos</h2>
    <ProjetosGrid projetos={projetos} client:visible />
  </section>
  <Skills />
  <Contato />
</BaseLayout>
```

- [ ] **Step 2: Add a minimal favicon**

Create `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
  <rect width="24" height="24" rx="4" fill="#0d1117"/>
  <text x="12" y="17" font-family="monospace" font-size="14" fill="#42d392" text-anchor="middle">&gt;_</text>
</svg>
```

Add the favicon link in `src/layouts/BaseLayout.astro`, inside `<head>` right after the `<meta name="description">` line:

```astro
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

- [ ] **Step 3: Verify the full build**

Run: `npm run build && npm run preview`
Expected: build succeeds; opening the preview URL shows Hero, Sobre, Projetos (with working filter), Skills and Contato sections in the Dark Developer theme, with the example project card linking to a working detail page.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro public/favicon.svg src/layouts/BaseLayout.astro
git commit -m "feat: assemble homepage from all sections"
```

---

### Task 12: Accessibility and performance check

**Files:**
- No new files — this task verifies Task 1-11 output against the quality bar set in the design spec.

- [ ] **Step 1: Run a production build and preview it**

Run: `npm run build && npm run preview`
Expected: build succeeds with no warnings about accessibility (Astro's built-in dev overlay reports common a11y issues during `npm run dev` too — check the terminal/browser console for any warnings and fix them before continuing).

- [ ] **Step 2: Run a Lighthouse audit**

With the preview server running, open Chrome DevTools on the preview URL → Lighthouse tab → run an audit for Performance and Accessibility (mobile + desktop).
Expected: Performance and Accessibility scores both 90+. If either is below 90, note the specific failing audit (e.g. color contrast, missing alt text, image size) and fix it before moving on — do not proceed to Task 13 with a failing score.

- [ ] **Step 3: Manual keyboard navigation check**

Tab through the whole page (nav links, project cards, filter input, contact form fields, submit button) without using the mouse.
Expected: every interactive element is reachable and has a visible focus outline. If any element is unreachable or has no visible focus state, add `focus:outline` / `focus-visible` Tailwind utility classes to it.

- [ ] **Step 4: Commit any fixes from this task**

```bash
git add -A
git commit -m "fix: address accessibility/performance findings from Lighthouse audit"
```

(Skip this commit if no fixes were needed.)

---

### Task 13: Deploy preparation (local only — no remote push yet)

**Files:**
- Create: `README.md`

- [ ] **Step 1: Document the remaining manual steps**

Create `README.md`:

```markdown
# Portfólio — João P.

Site estático construído com Astro + Vue + Tailwind.

## Desenvolvimento

\`\`\`bash
npm install
npm run dev
\`\`\`

## Testes

\`\`\`bash
npm run test
\`\`\`

## Antes do deploy

- [ ] Copiar o PDF do currículo para `public/cv.pdf`
- [ ] Criar uma conta em https://web3forms.com com o e-mail `jteixeira.dev@outlook.com`, copiar a access key para `.env` (baseado em `.env.example`)
- [ ] Substituir `src/content/projetos/exemplo-projeto.mdx` pelos projetos reais (um arquivo `.mdx` por projeto, seguindo o schema em `src/content.config.ts`)
- [ ] Criar o repositório remoto na conta pessoal do GitHub (não a conta da empresa configurada nesta máquina) e conectar ao Vercel — a ser feito junto com o autor quando chegar a essa etapa
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add README with pre-deploy checklist"
```

---

## Self-Review Notes

- **Spec coverage:** Astro+Vue+Tailwind stack (Task 1-2), content collections (Task 3), Hero/Sobre/Projetos/Skills/Contato sections (Tasks 5-6, 7-8, 9, 10), Dark Developer theme + Vue teal accent (Task 2), Web3Forms contact form (Task 10), Vitest tests for the two islands (Tasks 7, 10), accessibility/performance gate (Task 12), deploy groundwork without touching remote/push (Task 13) — every spec section maps to at least one task.
- Git remote/push to a personal account is explicitly deferred to a future conversation, per the author's note that this machine's git config points at the company's account — no task in this plan touches `git remote` or `git push`.
