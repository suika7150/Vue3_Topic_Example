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
  //   host: "0.0.0.0", // 允許用 127.0.0.1 或 IP 連
  //   port: 5173,
  //   hmr: false
  // },

  // server: {
  //     host: "0.0.0.0", // 允許用 127.0.0.1 或 IP 連
  //     port: 5173,
  //     hmr: {
  //       host:'192.168.100.29',
  //       protocol:'ws',
  //     },
  //   },
})
