import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react({ fastRefresh: true })],
  server: {
    port: 3001,
    strictPort: true,
    hmr: true, // Enable Hot Module Replacement
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'], // Ensures module resolution
  },
});
