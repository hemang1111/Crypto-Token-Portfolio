import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    
    proxy: {
      '/api': {
        target: 'https://api.coingecko.com/api/v3',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
    host: true, // binds to 0.0.0.0
    port: 5173, // your dev port,
    
  },
});