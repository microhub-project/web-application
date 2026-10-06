import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/usuarios': 'http://localhost:3333',
      '/mailer': 'http://localhost:3333',
      '/code': 'http://localhost:3333',
    },
  },
});