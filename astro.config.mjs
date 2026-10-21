import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { unlink, rmdir, readdir } from 'node:fs/promises';
import { loadEnv } from 'vite';
const env = { ...loadEnv(process.env.NODE_ENV || 'production', process.cwd(), ''), ...process.env };
const site = env.SITE_URL;
export default defineConfig({
  ...(site ? { site } : {}),
  integrations: [react(), ...(site ? [sitemap()] : []), {
    name: 'orbit-local-installer-guard',
    hooks: { 'astro:build:done': async ({ dir }) => {
      if (env.PUBLIC_LOCAL_DOWNLOAD !== '1') {
        // Only flat generated download files, inside Astro's verified build output directory.
        const folder = new URL('downloads/', dir);
        const files = await readdir(folder, { withFileTypes: true }).catch(e => { if(e.code === 'ENOENT') return []; throw e; });
        for (const file of files) {
          if (!file.isFile()) throw new Error('Unexpected subdirectory in generated downloads; review before publishing.');
          await unlink(new URL(encodeURIComponent(file.name), folder));
        }
        await rmdir(folder).catch(e => { if(e.code !== 'ENOENT') throw e; });
      }
    } }
  }],
  vite: { plugins: [tailwindcss()] },
  output: 'static',
  devToolbar: { enabled: false },
  server: { port: 4321 }
});
