import Storage, { CART_KEY, TOKEN_KEY, USER_ROLE_KEY } from '@/utils/storageUtil'
import { defineStore } from 'pinia'

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = atob(base64Url)
    return JSON.parse(base64)
  } catch (e) {
    return null
  }
}

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: {
      username: '',
      password: '',
      rememberMe: false,
      isLogin: false,
    },
    remainingTime: 0, // 剩餘秒數
    timer: null, // 計時器
    role: 'GUEST',
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
     * 將用戶資料儲存到狀態中
     * */
    login(user, { token, role }) {
      this.user = user
      this.role = role
      Storage.set(USER_ROLE_KEY, role)
      Storage.set(TOKEN_KEY, token)
      this.startTokenCountdown(token)
    },
    /**
     * 啟動 Token 倒數
     * @param {*} token
     * @returns
     */
    startTokenCountdown(token) {
      const payload = parseJwt(token)
      if (!payload?.exp) return

      const now = Math.floor(Date.now() / 1000)
      let remaining = payload.exp - now
      if (remaining <= 0) return this.logout()

      this.stopTokenCountdown()
      this.remainingTime = remaining

      this.timer = setInterval(() => {
        this.remainingTime-- // 倒數--
        if (this.remainingTime <= 0) {
          this.logout()
        }
      }, 1000)
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

    initUser() {
      const token = Storage.get(TOKEN_KEY)
      const role = Storage.get(USER_ROLE_KEY)

      if (token) {
        const payload = parseJwt(token)
        const now = Math.floor(Date.now() / 1000)
        const remaining = payload?.exp ? payload.exp - now : 0

        if (remaining > 0) {
          this.user.isLogin = true
          this.role = role || 'USER'
          this.startTokenCountdown(token)
        } else {
          this.logout()
        }
      }
    },

    /**
     * 登出
     */
    logout() {
      this.stopTokenCountdown()
      this.role = 'GUEST'
      this.user.isLogin = false
      Storage.remove(USER_ROLE_KEY)
      Storage.remove(TOKEN_KEY)
      Storage.remove(CART_KEY)
      this.remainingTime = 0
    },
  },
  // // 手動新增啟動時自動從Storage載入登入資料
  // initUser() {
  //   const token = Storage.get(TOKEN_KEY)
  //   const role = Storage.get(USER_ROLE_KEY)
  //   if (token) {
  //     this.user.isLogin = true
  //     this.role = role || 'USER'
  //   }
  // },

  //自動新增啟動時自動從Storage載入登入資料
  persist: {
    enabled: true,
    storage: localStorage, //或sessionStorage(依照需求)
    paths: ['user', 'role'], //持久化狀態
  },
})
