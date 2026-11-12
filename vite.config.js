import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/usuarios': 'http://localhost:3333',
      '/mailer': 'http://localhost:3333',
      '/code': 'http://localhost:3333',
      '/microservices': 'http://localhost:3333',
      '/instances': 'http://localhost:3333',
      '/alerts': 'http://localhost:3333',
      '/lixeira': 'http://localhost:3333',
      '/reports': 'http://localhost:3333',
    },
  },
});