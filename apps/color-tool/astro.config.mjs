// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import clerk from '@clerk/astro';

export default defineConfig({
  site: 'https://colorspark.pages.dev',
  integrations: [react(), sitemap(), clerk()],
  adapter: cloudflare(),
  output: 'server',
});
