import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@games': resolve(__dirname, 'src/games'),
      '@ai': resolve(__dirname, 'src/ai'),
      '@audio': resolve(__dirname, 'src/audio'),
      '@effects': resolve(__dirname, 'src/effects'),
      '@utils': resolve(__dirname, 'src/utils')
    }
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei', 'framer-motion']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'ai-vendor': ['@tensorflow/tfjs'],
          'audio-vendor': ['tone']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    host: true,
    port: 3000,
    hmr: {
      overlay: false
    }
  }
});
