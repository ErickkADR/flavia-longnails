import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// No GitHub Pages o site mora em /flavia-longnails/ (página de projeto); na Vercel
// mora na raiz do domínio. A Vercel define a env var VERCEL automaticamente no build.
const isVercel = Boolean(process.env.VERCEL);

export default defineConfig({
  base: isVercel ? '/' : '/flavia-longnails/',
  plugins: [react()],
});
