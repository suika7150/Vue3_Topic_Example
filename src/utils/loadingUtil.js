import { ElLoading } from 'element-plus'

let loadingInstance = null
let loadingCount = 0
let startTime = 0
const MIN_LOADING_TIME = 1000

const tips = ['正在聯繫快遞小哥...', '包裹正在打包中...', '物流飛奔中，請稍候...']

export function showLoading(text) {
  if (loadingCount === 0) {
    startTime = Date.now()
    const loadingText = text || tips[Math.floor(Math.random() * tips.length)]

    loadingInstance = ElLoading.service({
      lock: true,
      text: loadingText,
      // 不要在 JS 裡傳 spinner ，直接用 CSS 暴力注入
      background: 'transparent',
      customClass: 'rpg-loading-mask',
    })
  }
  loadingCount++
}

export function hideLoading() {
  if (loadingCount <= 0) return
  loadingCount--
  if (loadingCount === 0 && loadingInstance) {
    const delay = Math.max(0, MIN_LOADING_TIME - (Date.now() - startTime))
    setTimeout(() => {
      if (loadingCount === 0 && loadingInstance) {
        loadingInstance.close()
        loadingInstance = null
      }
    }, delay)
  }
}
