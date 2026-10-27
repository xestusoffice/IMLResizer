import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  root: '.',
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        resize20kb: resolve(import.meta.dirname, 'resize-image-to-20kb.html'),
        resize50kb: resolve(import.meta.dirname, 'resize-image-to-50kb.html'),
        resize100kb: resolve(import.meta.dirname, 'resize-image-to-100kb.html'),
        passport: resolve(import.meta.dirname, 'passport-photo-maker.html'),
        signature: resolve(import.meta.dirname, 'signature-resizer.html'),
        compressor: resolve(import.meta.dirname, 'image-compressor.html'),
        topdf: resolve(import.meta.dirname, 'convert-to-pdf.html'),
        contact: resolve(import.meta.dirname, 'contact.html'),
        privacy: resolve(import.meta.dirname, 'privacy-policy.html'),
        terms: resolve(import.meta.dirname, 'terms.html'),
        about: resolve(import.meta.dirname, 'about.html')
      }
    }
  }
});
