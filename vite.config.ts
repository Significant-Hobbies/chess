import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        faq: 'faq.html',
        changelog: 'changelog.html',
      },
      output: {
        manualChunks(id) {
          if (id.includes('/posthog-js/')) {
            return 'analytics'
          }
          if (id.includes('/react-chessboard/')) {
            return 'chessboard'
          }
          if (id.includes('/react/') || id.includes('/react-dom/')) {
            return 'react-core'
          }
        },
      },
    },
  },
  server: {
    proxy: { '/api': 'http://localhost:3456' },
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
  optimizeDeps: {
    exclude: ['stockfish'],
  },
})
