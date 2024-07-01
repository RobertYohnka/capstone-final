import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Backend server URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      // Add aliases for modules if necessary
      'safe-buffer': 'safe-buffer/index.js',
    },
  },
});
// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// });
