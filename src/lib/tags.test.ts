import { describe, it, expect } from 'vitest';
import { ehPrincipal } from './tags';

describe('ehPrincipal', () => {
  it('highlights the core stack and its variations', () => {
    for (const tech of ['Vue.js', 'Vue 3', 'Nuxt', 'Nuxt 3', 'Nuxt UI', 'TypeScript', 'C#', 'C#/.NET', '.NET', 'IA', 'AI', 'Design System']) {
      expect(ehPrincipal(tech), tech).toBe(true);
    }
  });

  it('keeps everything else neutral', () => {
    for (const tech of ['React', 'Next.js', 'Jest', 'APIs REST', 'REST APIs', 'Tailwind CSS', 'Integração front ↔ API', 'AI-assisted refactoring and testing']) {
      expect(ehPrincipal(tech), tech).toBe(false);
    }
  });
});

describe('.tag-principal css', () => {
  it('hides the decorative "#" from screen readers (empty alt text)', async () => {
    const { readFileSync } = await import('node:fs');
    const css = readFileSync('src/styles/global.css', 'utf8');
    const regra = css.slice(css.indexOf('.tag-principal::before'));
    expect(regra.slice(0, regra.indexOf('}'))).toMatch(/content:\s*'#'\s*\/\s*''/);
  });
});
