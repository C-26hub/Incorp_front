import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/csrf': {
        target: 'https://cmiap.onrender.com',
        changeOrigin: true,
      },
      '/auth': {
        target: 'https://cmiap.onrender.com',
        changeOrigin: true,
      },
      '/users': {
        target: 'https://cmiap.onrender.com',
        changeOrigin: true,
      },
      '/agents': {
        target: 'https://cmiap.onrender.com',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 4173,
    strictPort: true,
  },
})