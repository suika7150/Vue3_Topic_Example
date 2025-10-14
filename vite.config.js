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
  // server: {
  //   host: 'my-vue-app.local', // 將 localhost 改成自訂域名
  //   port: 5173, // 可保留原本 port，也可以改
  //   strictPort: true, // 如果 port 被占用就直接報錯，不自動換 port
  // },
})
