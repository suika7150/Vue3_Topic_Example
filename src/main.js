import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import { ElMessageBox } from 'element-plus'
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

    const exp = userStore.expiryTimestamp
    const now = Math.floor(Date.now() / 1000)
    if (userStore.user.isLogin && exp && exp > now) {
      userStore.startTokenCountdown()
    } else if (userStore.user.isLogin) {
      // 如果已經過期了，不要啟動計時器，直接交給攔截器或執行一次換票
      userStore.fetchUserInfo().catch(() => userStore.logout())
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

// 監聽跨分頁的 Storage 變動
window.addEventListener('storage', (event) => {
  // 這裡的 'TOKEN' 對應 storageUtil 裡的 TOKEN_KEY 實際字串
  if (event.key === TOKEN_KEY) {
    if (event.newValue) {
      ElMessageBox.close()

      userStore.initUser() // 重新觸發初始化，捕捉最新的 Token 和時間

      // 如果A頁已登入B頁當前頁面正好在登入頁，自動跳轉至首頁
      if (router.currentRoute.value.path === '/login') {
        router.push('/')
      }
    } else {
      userStore.logout() // Token 過期直接踢出去
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
    console.error('啟動應用失敗:', error)
  }
}

//啟動應用
start()
