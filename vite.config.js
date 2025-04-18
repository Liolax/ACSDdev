import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },

    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: !isProduction
    },

    // IMPORTANT: Treat all .js files as if they contain JSX syntax.
    esbuild: {
      loader: {
        '.js': 'jsx'
      }
    },

    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: false,
        workbox: {
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\.example\.com\/.*$/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'external-api-cache',
                expiration: { maxEntries: 50, maxAgeSeconds: 86400 }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts',
                expiration: { maxEntries: 20, maxAgeSeconds: 31536000 }
              }
            }
          ]
        }
      })
    ]
  };
});
