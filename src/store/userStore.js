import { defineStore } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import Storage, { CART_KEY, TOKEN_KEY, USER_ROLE_KEY } from '@/utils/storageUtil'
import api from '@/service/api.js'

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = atob(base64Url)
    return JSON.parse(base64)
  } catch (e) {
    return null
  }
}

let isLoggingOut = false

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: {
      username: '',
      rememberMe: false,
      isLogin: false,
    },
    remainingTime: 0, // 剩餘秒數
    timer: null, // 計時器
    role: 'GUEST',
    expiryTimestamp: null, // 存儲絕對過期時間
  }),
  getters: {
    userRole: (state) => state.role,
    isLoggedIn: (state) => state.user.isLogin,
  },

  actions: {
    /**
     * 登入
     * @param {*} user
     * @returns
     * @description
     * 將用戶資料儲存到狀態中
     * 啟動 Token 倒數
     * 從後端獲取最新使用者資料
     * 用於同步 DB 狀態到前端畫面
     * */
    async fetchUserInfo() {
      try {
        const res = await api.user()
        if (res) {
          // 同步 DB 狀態到前端畫面
          this.user = {
            ...res,
            isLogin: true,
          }
          this.role = res.role || Storage.get(USER_ROLE_KEY)
          return res
        }
      } catch (error) {
        console.error('同步使用者資料失敗:', error)
        throw error
      }
    },

    async login(userData, { token, role }) {
      const payload = parseJwt(token)
      const exp = payload?.exp || 0

      // 將用戶資料儲存到Storage
      Storage.set(USER_ROLE_KEY, role)
      Storage.set(TOKEN_KEY, token)
      Storage.set('EXPIRY_TIME', exp)
      // this.startTokenCountdown(token)

      // 更新State
      this.user = {
        username: userData.username,
        isLogin: true,
        // rememberMe: loginData.rememberMe || false,
      }
      this.role = role

      // 啟動倒數
      this.startTokenCountdown()
    },
    /**
     * 啟動 Token 倒數
     * @param {*} token
     * @returns
     */
    startTokenCountdown() {
      this.stopTokenCountdown()

      // 取得最新的過期時間
      const exp = this.expiryTimestamp || Storage.get('EXPIRY_TIME')
      if (!exp) return

      // 定義一個更新函數
      const update = () => {
        const now = Math.floor(Date.now() / 1000)
        const diff = exp - now

        if (diff <= 0) {
          this.remainingTime = 0
          this.stopTokenCountdown()
          this.logout()
        } else {
          this.remainingTime = diff
        }
      }

      update() // 先執行一次防止畫面閃爍
      this.timer = setInterval(update, 1000) // 每一秒「比對」一次
    },

    /**
     * 停止 Token 倒數
     */
    stopTokenCountdown() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },

    /**
     * 初始化使用者 (主要用於 F5 重新整理時)
     */
    initUser() {
      const token = Storage.get(TOKEN_KEY)
      const exp = Storage.get('EXPIRY_TIME')

      if (token && exp) {
        this.expiryTimestamp = exp
        const now = Math.floor(Date.now() / 1000)

        if (exp - now > 0) {
          this.user.isLogin = true
          this.role = Storage.get(USER_ROLE_KEY) || 'USER'
          this.startTokenCountdown()
        } else {
          this.logout() // Token 過期直接踢出去
        }
      }
    },

    /**
     * 登出
     */
    logout() {
      if (isLoggingOut) return
      isLoggingOut = true
      this.stopTokenCountdown()
      this.role = 'GUEST'
      this.user.isLogin = false
      Storage.remove(USER_ROLE_KEY)
      Storage.remove(TOKEN_KEY)
      Storage.remove('EXPIRY_TIME')
      this.remainingTime = 0

      ElMessageBox.alert('您的登入已過期，請重新登入。', '提示', {
        confirmButtonText: '確定',
        callback: () => {
          isLogggingOut = false
          window.location.href = '/login' // 強制跳轉，最乾淨
        },
      })
    },
  },

  // 自動新增啟動時自動從Storage載入登入資料
  persist: {
    enabled: true,
    storage: localStorage, // 或sessionStorage(依照需求)
    paths: ['user', 'role', 'expiryTimestamp'], // 持久化狀態
  },
})
