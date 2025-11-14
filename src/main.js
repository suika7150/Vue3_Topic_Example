import { createApp, nextTick, provide } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { Icon } from '@iconify/vue'
import App from './App.vue'
import AlertBox from './components/AlertBox.vue'
import FormatPlugin from './plugins/format' // 載入插件
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { formatSecondsToHHMMSS } from './utils/format'
import { getAndCacheOptions } from './utils/optionService'
import { useUserStore } from './store/userStore'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBell as fasBell, faUser } from '@fortawesome/free-solid-svg-icons'
import { faBell as farBell } from '@fortawesome/free-regular-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faMagnifyingGlass, fasBell, farBell, faUser)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)
app.use(pinia)
// 【新增】全域註冊 Font Awesome 元件
app.component('font-awesome-icon', FontAwesomeIcon)

const userStore = useUserStore()
userStore.initUser() //初始化登入狀態並啟動倒數

const start = async () => {
  const res = await getAndCacheOptions()
  app.provide('allOptions', res)
  app.config.globalProperties.$formatSecondsToHHMMSS = formatSecondsToHHMMSS
  app.use(FormatPlugin) // 註冊插件
  app.use(router)
  app.use(ElementPlus)
  app.component('AlertBox', AlertBox)
  app.component('Icon', Icon)
  app.mount('#app')
}
start()

document.title = import.meta.env.VITE_APP_TITLE
