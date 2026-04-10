import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base path matches the GitHub Pages subpath (https://<user>.github.io/portfolio/).
// Every asset URL is resolved against this — always use import.meta.env.BASE_URL
// (or leading-slash-free paths in public/) instead of hardcoded absolute paths.
export default defineConfig({
  base: '/portfolio/',
  plugins: [react()],
});
