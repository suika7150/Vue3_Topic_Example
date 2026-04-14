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
import { useUserStore } from './store/userStore'

//初始化、Pinia
const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

//執行Store初始化
const userStore = useUserStore()
userStore.initUser() //初始化登入狀態並啟動倒數

let checkTimer = null
const checkTokenStatus = () => {
  // 如果 300ms 內重複觸發，會先清除上一個定時器
  if (checkTimer) clearTimeout(checkTimer)

  checkTimer = setTimeout(() => {
    // 只在登入狀態下才執行校對
    if (userStore.user.isLogin) {
      console.log('檢測到視窗喚醒，重新校對 Token 時間...')
      userStore.startTokenCountdown()
    }
  }, 300)
}

// 監聽分頁切換
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    checkTokenStatus()
  }
})

// 監聽視窗獲得焦點 (例如從別的軟體點回瀏覽器)
window.addEventListener('focus', checkTokenStatus)

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
    console.error('啟動應用失敗:', error)
  }
}

//啟動應用
start()
