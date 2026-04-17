import { defineStore } from 'pinia'
import { ElMessageBox } from 'element-plus'
import Storage, { TOKEN_KEY, USER_ROLE_KEY } from '@/utils/storageUtil'
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
        throw error
      }
    },

    async login(userData, { token, role, rememberMe }) {
      const payload = parseJwt(token)
      const exp = payload?.exp || 0

      // 將用戶資料儲存到Storage
      Storage.set(TOKEN_KEY, token)
      Storage.set(USER_ROLE_KEY, role)
      Storage.set('EXPIRY_TIME', exp)
      Storage.set('REMEMBER_ME', rememberMe)

      // 更新State
      this.token = token
      this.user = {
        username: userData.username,
        isLogin: true,
        rememberMe: rememberMe,
      }
      this.role = role
      this.expiryTimestamp = exp

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
      const exp =
        this.expiryTimestamp || Storage.get('EXPIRY_TIME') || Storage.sessionGet('EXPIRY_TIME')
      if (!exp) return

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

      update()
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
      const token = Storage.get(TOKEN_KEY) || Storage.sessionGet(TOKEN_KEY)
      const exp = Storage.get('EXPIRY_TIME') || Storage.sessionGet('EXPIRY_TIME')

      if (token && exp) {
        this.expiryTimestamp = exp
        const now = Math.floor(Date.now() / 1000)

        if (exp - now > 0) {
          this.user.isLogin = true
          this.role = Storage.get(USER_ROLE_KEY) || 'USER'
          this.startTokenCountdown()
        } else {
          this.logout()
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

      // 清除狀態
      this.role = 'GUEST'
      this.user = { username: '', isLogin: false, rememberMe: false }

      const keys = [USER_ROLE_KEY, TOKEN_KEY, 'EXPIRY_TIME']
      Storage.remove(...keys)
      Storage.sessionRemove(...keys)
      if (window.location.pathname !== '/login') {
        ElMessageBox.alert('您的登入已過期，請重新登入。', '提示', {
          confirmButtonText: '確定',
          callback: () => {
            isLoggingOut = false
            // window.location.href = '/login'
          },
        })
      } else {
        isLoggingOut = false
      }
    },
    /**
     * 跨視窗同步狀態
     */
    syncStatus() {
      const token = Storage.get(TOKEN_KEY)
      const role = Storage.get(USER_ROLE_KEY)
      const exp = Storage.get('EXPIRY_TIME')

      if (token && exp) {
        if (!this.user.isLogin) {
          this.user.isLogin = true
          this.role = Storage.get(USER_ROLE_KEY) || 'USER'
          this.expiryTimestamp = exp
          this.startTokenCountdown()
        }
      } else if (this.user.isLogin) {
        // 如果 Token 沒了（表示另一個視窗登出了）
        this.logout()
      }
    },
  },

  // 自動新增啟動時自動從Storage載入登入資料
  persist: {
    enabled: true,
    storage: localStorage,
    paths: ['user', 'role', 'expiryTimestamp'], // 持久化狀態
  },
})
