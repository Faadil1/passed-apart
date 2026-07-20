import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'github-pages'
    ? '/passed-apart/'
    : '/',
  server: {
    port: 5173,
    open: true,
  },
}))
