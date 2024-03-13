import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
import vuetify from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: './',
  build: {
    rollupOptions: {
      output: {
          entryFileNames: `assets/[name].${process.env.npm_package_version}.js`,
          chunkFileNames: `assets/[name].${process.env.npm_package_version}.js`,
          assetFileNames: `assets/[name].${process.env.npm_package_version}.[ext]`
      }
    }
  },
  server: {
    host: true,
    proxy: {

      '/amr': {
        target: 'ws://localhost:9000/ws/',
        changeOrigin: true,
        ws: true,
        timeout: 3000,
        proxyTimeout: 3000,
      },
      '/ws': {
        target: 'ws://localhost:9000/ws/',
        changeOrigin: true,
        ws: true,
      },
      '/api': {
        target: 'http://localhost:9000',
        changeOrigin: true,
        ws: true,
      },
    }
  }
})
