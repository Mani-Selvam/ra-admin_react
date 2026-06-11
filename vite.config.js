import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/neoticketsystem/",
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['mixed-decls', 'color-functions', 'global-builtin', 'import']
      },
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /.*\.jsx?$/,
    exclude: [],
  },
  build: {
    sourcemap: false,
    outDir: 'dist',
    manualChunks: {
      vendor: ['react-dom/client'],
    },
  },
  optimizeDeps: {
    optimizeDeps: {
      include: [],
    },
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
})