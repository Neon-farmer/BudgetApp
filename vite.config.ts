import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,         
    strictPort: true,   
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'], // Ensures module resolution
  },
});
