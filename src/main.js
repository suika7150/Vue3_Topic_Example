import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import { Icon } from '@iconify/vue'

//樣式、配置
import 'element-plus/dist/index.css'
import './assets/main.css'

//專案內元件、插件
import App from './App.vue'
import router from './router'
import AlertBox from './components/AlertBox.vue'
import FormatPlugin from './plugins/format'
import setupFontAwesome from './plugins/fontawesome'

//工具
import { formatSecondsToHHMMSS } from './utils/format'
import { getAndCacheOptions } from './utils/optionService'
import { TOKEN_KEY } from './utils/storageUtil'
import { useUserStore } from '@/store/userStore'

//初始化、Pinia
const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

//執行Store初始化
const userStore = useUserStore()
userStore.initUser() //初始化登入狀態並啟動倒數

// 跨視窗狀態同步監聽
window.addEventListener('storage', (event) => {
  // 當 userStore 發生變化（代表另一個分頁登入或登出了）
  if (event.key === 'userStore') {
    if (event.oldValue === event.newValue) return

    // 執行同步，把最新的資料從 localStorage 抓回 Pinia
    userStore.syncStatus()
    if (userStore.isLoggedIn && router.currentRoute.value.path === '/login') {
      router.push('/')
    }
  } else if (event.key === TOKEN_KEY && !event.newValue) {
    if (userStore.user.isLogin) {
      userStore.logout()
      if (router.currentRoute.value.path !== '/login') {
        router.push('/')
      }
    }
  }
})

//啟動應用
const start = async () => {
  try {
    //設定標題
    document.title = import.meta.env.VITE_APP_TITLE

    //預先載入選項資料
    const res = await getAndCacheOptions()
    app.provide('allOptions', res)

    //全域方法
    app.config.globalProperties.$formatSecondsToHHMMSS = formatSecondsToHHMMSS
    app.use(FormatPlugin)
    app.use(router)
    app.use(ElementPlus)

    //元件註冊
    setupFontAwesome(app)
    app.component('AlertBox', AlertBox)
    app.component('Icon', Icon)

    //掛載實例
    app.mount('#app')
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('[啟動攔截]:', error)
    }
  }
}
//啟動應用
start()
