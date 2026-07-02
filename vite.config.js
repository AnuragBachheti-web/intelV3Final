import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [
    react(),
    // Generates stats.html in dist/ after every build — open it to inspect bundle sizes.
    // Only runs during build, not dev server.
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],

  resolve: {
    alias: {
      // Allows: import Foo from '@/components/Foo' instead of '../../components/Foo'
      '@': path.resolve(__dirname, 'src'),
    },
  },

  build: {
    // Warn when any chunk exceeds 500 kB (Vite default is 500, made explicit)
    chunkSizeWarningLimit: 500,

    rollupOptions: {
      output: {
        // Split heavy vendor libraries into separate cacheable chunks.
        // These only re-download when their version changes, not on every app deploy.
        manualChunks(id) {
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3-') || id.includes('node_modules/victory-vendor')) {
            return 'vendor-recharts';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }
          if (id.includes('node_modules/react-router') || id.includes('node_modules/@remix-run')) {
            return 'vendor-router';
          }
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/scheduler')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/zustand')) {
            return 'vendor-zustand';
          }
          if (id.includes('node_modules/axios')) {
            return 'vendor-axios';
          }
        },
      },
    },
  },
}))
