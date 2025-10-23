import Storage, { CART_KEY, TOKEN_KEY, USER_ROLE_KEY, USER_KEY } from '@/utils/storageUtil'
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
    login(user, { token, role, fullName }) {
      this.user = { ...user, fullName, isLogin: true } // 將用戶資料儲存到狀態中user
      this.role = role || 'USER'
      Storage.set(USER_ROLE_KEY, this.role)
      Storage.set(TOKEN_KEY, token)
      Storage.set(USER_KEY, this.user) //存取 user 物件
      this.startTokenCountdown(token)
    },
    /**
     * 啟動 Token 倒數
     * @param {*} token
     * @returns
     */
    startTokenCountdown(token) {
      // 解析 token
      const payload = parseJwt(token)
      if (!payload?.exp) return
      this.stopTokenCountdown() // 避免多個 interval 重複

      const updateTime = () => {
        const now = Math.floor(Date.now() / 1000)
        const remaining = payload.exp - now
        this.remainingTime = remaining

        if (remaining <= 0) {
          this.logout()
        }
      }

      updateTime()
      this.timer = setInterval(updateTime, 1000)
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

    initUser() {
      const token = Storage.get(TOKEN_KEY)
      const role = Storage.get(USER_ROLE_KEY)
      const user = Storage.get(USER_KEY) //讀取user

      if (token && role && user) {
        this.user = { ...user, isLogin: true }
        this.role = role || 'USER'
        this.startTokenCountdown(token) //重整後重新啟動倒數
      }
    },
  },

  //自動新增啟動時自動從Storage載入登入資料
  persist: {
    enabled: true,
    storage: localStorage, //或sessionStorage(依照需求)
    paths: ['user', 'role'], //持久化狀態
  },
})
