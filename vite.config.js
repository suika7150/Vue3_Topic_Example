import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5173,
    // --- 新增 Proxy 設定 ---
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 指向你的 Spring Boot 後端
        // changeOrigin: true,
        // 如果你的 Spring Boot Controller 本身「沒有」寫 @RequestMapping("/api")
        // 則必須取消下面這行的註解，把 /api 拿掉再轉發
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
})
