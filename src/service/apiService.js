import axios from 'axios'
import { ElMessage } from 'element-plus'
import { isWhiteListed } from './authWhitelist'
import router from '@/router'
import { hideLoading, showLoading } from '@/utils/loadingService'
import Storage, { CART_KEY, TOKEN_KEY } from '@/utils/storageUtil'

// --- 建立 axios 實例 ---
const apiService = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 600000,
  withCredentials: true,
})

// --- 請求攔截器 ---
apiService.interceptors.request.use(
  (config) => {
    showLoading() // 啟動 Loading

    // 確保即便 token 讀取噴錯也要 hideLoading
    try {
      if (!isWhiteListed(config.url, config.baseURL)) {
        const token = Storage.get(TOKEN_KEY)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
      return config
    } catch (err) {
      hideLoading()
      return Promise.reject(err)
    }
  },
  (error) => {
    hideLoading()
    return Promise.reject(error)
  },
)

// --- 回應攔截器 ---
apiService.interceptors.response.use(
  (response) => {
    hideLoading() // 收到資料立刻關閉

    const res = response.data
    // 檢查代碼是否為成功
    if (res.code && res.code !== '0000') {
      ElMessage.error(res.msg || '發生錯誤')
      return Promise.reject(res)
    }

    return res
  },
  (error) => {
    hideLoading() // 網路錯誤也要關閉

    // 處理 401 登入過期
    if (error.response?.status === 401) {
      Storage.remove(TOKEN_KEY)
      Storage.remove(CART_KEY)
      ElMessage.error('登入已過期，請重新登入')
      router.push('/login')
    } else {
      // 避免某些取消請求噴出錯誤訊息
      if (error.message !== 'canceled') {
        ElMessage.error(error.response?.data?.msg || '網路錯誤，請稍後再試')
      }
    }
    return Promise.reject(error)
  },
)

export default apiService
