import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        presentation: path.resolve(__dirname, 'presentation.html'),
      },
    },
  },
  server: {
    port: 3000,
    host: true,
    allowedHosts: [
      'unhumidified-intercavernous-riley.ngrok-free.dev',
      '.ngrok-free.dev',
    ],
  },
});
