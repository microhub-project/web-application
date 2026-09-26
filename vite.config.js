import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/usuarios': 'http://localhost:3333',
      '/mailer': 'http://localhost:3333',
      '/code': 'http://localhost:3333',
    },
  },
});