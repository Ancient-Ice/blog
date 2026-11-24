import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ancient-ice.github.io',
  base: '/blog',
  build: { inlineStylesheets: 'always' },
});
