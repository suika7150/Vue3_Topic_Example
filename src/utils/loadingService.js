import { ElLoading } from 'element-plus'

// 全域 loading
let loadingInstance = null

export function showLoading(text = 'Loading...') {
  if (!loadingInstance) {
    loadingInstance = ElLoading.service({
      lock: true,
      text,
      background: 'rgba(0, 0, 0, 0.3)',
    })
  }
}

export function hideLoading() {
  if (loadingInstance) {
    loadingInstance.close()
    loadingInstance = null
  }
}
