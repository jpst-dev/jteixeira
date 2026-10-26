// @ts-check
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://jteixeira.dev',
  integrations: [vue(), mdx()],

  vite: {
    plugins: [tailwindcss()]
  }
});