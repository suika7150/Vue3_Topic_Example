import { formatPrice, formatDate } from '@/utils/format'

export default {
  // install(app)： Vue 執行 app.use(plugin) 時自動呼叫的函式
  install(app) {
    app.config.globalProperties.$formatPrice = formatPrice
    app.config.globalProperties.$formatDate = formatDate
  },
}
