import { ElLoading } from 'element-plus'

// 全域 loading
let loadingInstance = null

export function showLoading(text = 'Loading...') {
  if (!loadingInstance) {
    loadingInstance = ElLoading.service({
      lock: true, // 是否鎖定
      text, // 載入中的文字
      background: 'rgba(0, 0, 0, 0.3)', // 透明度
    })
  }
}

export function hideLoading() {
  if (loadingInstance) {
    loadingInstance.close() // 關閉
    loadingInstance = null
  }
}
