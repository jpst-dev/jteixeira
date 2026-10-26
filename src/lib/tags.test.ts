import { describe, it, expect } from 'vitest';
import { ehPrincipal } from './tags';

describe('ehPrincipal', () => {
  it('highlights the core stack and its variations', () => {
    for (const tech of ['Vue.js', 'Vue 3', 'Nuxt', 'Nuxt 3', 'Nuxt UI', 'TypeScript', 'C#', 'C#/.NET', '.NET']) {
      expect(ehPrincipal(tech), tech).toBe(true);
    }
  });

  it('keeps everything else neutral', () => {
    for (const tech of ['React', 'Next.js', 'Jest', 'APIs REST', 'REST APIs', 'Tailwind CSS', 'Design System']) {
      expect(ehPrincipal(tech), tech).toBe(false);
    }
  });
});
