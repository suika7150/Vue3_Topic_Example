import { useNavigation } from '@/composables/useNavigation'
import { hideLoading, showLoading } from '@/utils/loadingService'
import Storage, { CART_KEY, TOKEN_KEY } from '@/utils/storageUtil'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { isWhiteListed } from './authWhitelist'

const { goLogin } = useNavigation()

const apiService = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 600000, // 10 分鐘
})

// 請求攔截器：自動加上 Token
apiService.interceptors.request.use(
  (config) => {
    showLoading() // 開啟 loading
    if (!isWhiteListed(config.url, config.baseURL)) {
      const token = Storage.get(TOKEN_KEY)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 回應攔截器：統一錯誤處理（可擴充）
apiService.interceptors.response.use(
  async (response) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)) // 模擬 2 秒延遲
    hideLoading() // 成功後關閉 loading
    const res = response.data // 所有 .then 接收到的是 res.data

    // ❗檢查 code 是否為成功代碼
    if (res.code && res.code !== '0000') {
      ElMessage.error(res.msg || '發生錯誤')
      return Promise.reject(res) // 中止回傳
    }

    return res
  },
  (error) => {
    hideLoading() // 成功後關閉 loading
    Storage.remove(CART_KEY) // 清除購物車
    Storage.remove(TOKEN_KEY) // 清除 token
    // 可自訂錯誤訊息處理
    if (error.response?.status === 401) {
      ElMessage.error('登入已過期，請重新登入')
      goLogin()
    } else {
      ElMessage.error('網路錯誤，請稍後再試')
    }
    return Promise.reject(error)
  },
)

export default apiService
