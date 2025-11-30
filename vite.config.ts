import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor libraries
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // UI library
          heroui: [
            '@heroui/system',
            '@heroui/theme',
            '@heroui/button',
            '@heroui/card',
            '@heroui/chip',
            '@heroui/dropdown',
            '@heroui/progress',
            '@heroui/table',
            '@heroui/switch',
            '@heroui/use-theme'
          ],
          // Internationalization
          i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          // Animation and styling
          animation: ['framer-motion', 'clsx', 'tailwind-variants']
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable source maps for better debugging
    sourcemap: false,
    // Minify for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@heroui/system',
      '@heroui/theme',
      'i18next',
      'react-i18next'
    ]
  }
});
