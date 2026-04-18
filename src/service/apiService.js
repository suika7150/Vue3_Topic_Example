import axios from 'axios'
import { isWhiteListed } from './authWhitelist'
import router from '@/router'
import { hideLoading, showLoading } from '@/utils/loadingService'
import Storage, { CART_KEY, TOKEN_KEY } from '@/utils/storageUtil'
import { toast } from '@/utils/message'
import { useUserStore } from '@/store/userStore'

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
        const token = Storage.get(TOKEN_KEY) || Storage.sessionGet(TOKEN_KEY)
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
    hideLoading()

    const res = response.data
    // 檢查代碼是否為成功
    if (String(res.code) !== '0000') {
      toast.error(res.msg || '發生錯誤')
      return Promise.reject(res)
    }

    return res
  },
  (error) => {
    hideLoading()

    // 處理 401 登入過期
    if (error.response?.status === 401) {
      const userStore = useUserStore()
      userStore.logout()
    } else if (error.message !== 'canceled') {
      toast.error(error.response?.data?.msg || '網路錯誤，請稍後再試')
    }
    return Promise.reject(error)
  },
)

export default apiService
