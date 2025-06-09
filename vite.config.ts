import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  },
  css: {
    postcss: './postcss.config.js'
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['@tanstack/react-query', 'wouter']
        }
      }
    }
  },
  publicDir: 'public',
  assetsInclude: ['**/*.mp3'],
  server: {
    fs: {
      strict: false
    },
    middlewareMode: false
  }
})
