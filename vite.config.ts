import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
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
    postcss: './postcss.config.js',
    modules: {
      localsConvention: 'camelCase'
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['@tanstack/react-query', 'wouter'],
          ui: ['@radix-ui/react-label', '@radix-ui/react-slider', '@radix-ui/react-slot', '@radix-ui/react-tabs'],
          form: ['react-hook-form', 'zod', '@hookform/resolvers']
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  publicDir: 'public',
  assetsInclude: ['**/*.mp3', '**/*.png', '**/*.jpg', '**/*.svg'],
  server: {
    fs: {
      strict: false
    },
    middlewareMode: false,
    hmr: {
      overlay: true
    }
  }
})
