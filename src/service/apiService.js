import axios from 'axios'
import { ElMessage } from 'element-plus'
import { isWhiteListed } from './authWhitelist'
import router from '@/router'
import { useUserStore } from '@/store/userStore'
import { hideLoading, showLoading } from '@/utils/loadingService'
import Storage, { CART_KEY, TOKEN_KEY } from '@/utils/storageUtil'
import { API_ROUTES } from './apiRoutes'
import { ref } from 'vue'

let isRefreshing = false // 標記是否正在刷新中
let requestQueue = [] // 存儲過期期間進來的請求

// --- 建立 axios 實例 ---
const apiService = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 600000,
  withCredentials: true, // 允許跨來源請求
})

// --- 請求攔截器 ---
apiService.interceptors.request.use(
  (config) => {
    console.log(
      '🚀 發送請求至:',
      config.url,
      '| 是否在白名單:',
      isWhiteListed(config.url, config.baseURL),
    )
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
  async (error) => {
    hideLoading()

    const { response, config } = error // 解構出 response 和 config
    const userStore = useUserStore() // 執行 hook 拿到 store 實例

    // 處理 401 登入過期
    if (response?.status === 401) {
      // 如果已經在刷新中了，就把這個請求暫存起來
      if (isRefreshing) {
        return new Promise((resolve) => {
          requestQueue.push((token) => {
            config.headers.Authorization = `Bearer ${token}`
            resolve(apiService(config))
          })
        })
      }
      isRefreshing = true
      try {
        const rfToken = Storage.get('refreshToken')

        if (!rfToken) throw new Error('未刷新憑證')

        const refreshUrl = `${import.meta.env.VITE_API_BASE_URL}${API_ROUTES.TOKEN_REFRESH}`

        const refreshRes = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}${API_ROUTES.TOKEN_REFRESH}`,
          {},
          {
            headers: { 'X-Refresh-Token': rfToken },
          },
        )

        const resData = refreshRes.data.result
        const newToken = resData?.token
        const newRefreshToken = resData?.refreshToken

        if (!newToken) throw new Error('REFRESH_FAILED')

        // 更新 Pinia 與 Storage
        userStore.setToken(newToken)
        Storage.set(TOKEN_KEY, newToken)
        if (newRefreshToken) {
          Storage.set('refreshToken', newRefreshToken) // 同步更新長效 Token
        }
        // 執行刷新後的請求
        requestQueue.forEach((cb) => {
          try {
            cb(newToken)
          } catch (e) {
            console.error('Queue error:', e)
          }
        })
        requestQueue = []

        // 重發當前這個過期的請求
        config.headers.Authorization = `Bearer ${newToken}`
        return apiService(config)
      } catch (refreshError) {
        // 連 Refresh 也失敗才執行登出
        isRefreshing = false // 必須重置狀態
        requestQueue = [] // 清空隊列
        Storage.remove(TOKEN_KEY)
        userStore.logout()

        if (refreshError.message === 'REFRESH_FAILED') {
          ElMessage.error('登入已過期，請重新登入')
          router.push('/login')
        }
      }
    }
    return Promise.reject(error)
  },
)

export default apiService
