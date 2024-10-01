import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['react-icons/fa'], // Add this line to externalize the react-icons/fa module
    },
  },
});
