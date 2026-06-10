import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react:    ['react', 'react-dom', 'react-router-dom'],
          charts:   ['recharts'],
          pdf:      ['jspdf', 'jspdf-autotable'],
          excel:    ['xlsx'],
          forms:    ['react-hook-form', '@hookform/resolvers', 'zod']
        }
      }
    }
  }
});
