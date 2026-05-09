import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://improved-palm-tree-7rxrjxvx65vhr79x-5000.app.github.dev',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
