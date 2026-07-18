import { defineConfig } from 'vite';
import path from 'path';
export default defineConfig({
  root: '.',
  publicDir: 'public',
  resolve: { alias: { '@': path.resolve(__dirname, 'src'), '@modules': path.resolve(__dirname, 'src/modules') } },
  build: { outDir: 'dist', sourcemap: true, rollupOptions: { input: './index.html' } },
  server: { port: 5173, open: true },
});
