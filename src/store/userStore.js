import { defineStore } from 'pinia'
import api from '@/service/api.js'
import Storage, {
  TOKEN_KEY,
  USER_KEY, // 目前登入的帳號 (登出會刪)
  REMEMBER_USERNAME_KEY, // 記住帳號功能 (登出不刪)
  REMEMBER_ME_KEY, // 保持登入功能
  USER_ROLE_KEY,
  FULL_NAME_KEY,
  SESSION_ACTIVE_KEY,
} from '@/utils/storageUtil'
import { toast } from '@/utils/message'

let isLoggingOut = false

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: {
      username: '', // 帳號
      fullName: '', // 顯示用名稱
      isLogin: false, // 是否已登入
      rememberMe: false, // 是否勾選了「保持登入」
    },
    role: 'GUEST',
  }),
  getters: {
    userRole: (state) => state.role,
    isLoggedIn: (state) => state.user.isLogin,
  },

  actions: {
    /**
     * 登入
     * @param {Object} userData 包含 username 等資訊
     * @param {Object} loginConfig 包含 token, role, rememberMe, rememberUsername
     */

    async login(userData, { token, role, rememberMe, rememberUsername }) {
      if (rememberUsername) {
        Storage.set(REMEMBER_USERNAME_KEY, userData.username)
      } else {
        Storage.remove(REMEMBER_USERNAME_KEY)
      }

      // Token 統一存 Local，解決跨分頁同步問題
      Storage.set(TOKEN_KEY, token)
      Storage.set(USER_ROLE_KEY, role)
      Storage.set(USER_KEY, userData.username)
      Storage.set(REMEMBER_ME_KEY, rememberMe)
      Storage.set(FULL_NAME_KEY, userData.fullName)

      // 如果是一般登入，種下一顆「生命種子」在 SessionStorage
      // 關閉瀏覽器時，這顆種子會消失，initUser 就能判斷要登出
      if (!rememberMe) {
        // 一般登入
        Storage.set(SESSION_ACTIVE_KEY, true)
      }

      // 更新State
      this.user = {
        username: userData.username,
        fullName: userData.fullName,
        isLogin: true,
        rememberMe: rememberMe,
      }
      this.role = role
      await this.fetchUserInfo() // 登入後立即抓取使用者資料
    },

    /**
     * 獲取最新使用者資料 (抓取 fullName 用)
     */

    async fetchUserInfo() {
      const currentUsername = this.user.username
      if (!currentUsername || !this.user.isLogin) return

      try {
        const res = await api.user()
        const userList = res.result || []
        const currentUser = userList.find((u) => u.username === currentUsername)

        if (currentUser) {
          this.user.fullName = currentUser.fullName
          // 雖然存進去，但因為 persist paths 沒勾選，重整後也會消失
          Storage.set(FULL_NAME_KEY, currentUser.fullName)
        }
      } catch (error) {
        throw error
      }
    },

    /**
     * 登出
     */
    logout() {
      if (isLoggingOut) return
      isLoggingOut = true

      // 清除狀態
      const keys = [
        USER_KEY,
        TOKEN_KEY,
        FULL_NAME_KEY,
        USER_ROLE_KEY,
        REMEMBER_ME_KEY,
        SESSION_ACTIVE_KEY,
      ]
      Storage.remove(...keys)
      Storage.sessionRemove(...keys)

      // 重置 Pinia 狀態
      this.user = { username: '', fullName: '', isLogin: false, rememberMe: false }
      this.role = 'GUEST'

      if (window.location.pathname !== '/login') {
        toast.warning('您的登入已過期，請重新登入。')

        // 延遲重置，防止短時間內重複觸發
        setTimeout(() => {
          isLoggingOut = false
        }, 500)
      } else {
        isLoggingOut = false
      }
    },

    /**
     * 初始化使用者 (主要用於 F5 重新整理時)
     */
    initUser() {
      const token = Storage.sessionGet(TOKEN_KEY) || Storage.get(TOKEN_KEY)
      const rememberMe = Storage.get(REMEMBER_ME_KEY)
      const isSessionActive = Storage.sessionGet(SESSION_ACTIVE_KEY)

      // 如果沒勾保持登入且Session 標記消失了
      if (!token || (!rememberMe && !isSessionActive)) {
        this.logout()
        return
      }

      // 否則，恢復登入狀態
      this.user.isLogin = true
      this.user.rememberMe = !!rememberMe
      this.role = Storage.get(USER_ROLE_KEY)
      this.user.username = Storage.get(USER_KEY)

      this.fetchUserInfo()
    },

    async updateUserInfo(payload) {
      this.user = {
        ...this.user,
        ...payload, // 這裡會包含新的 fullName
      }

      // 同步到 LocalStorage
      if (payload.fullName) {
        Storage.set(FULL_NAME_KEY, payload.fullName)
      }
    },

    /**
     * 跨視窗同步狀態
     */
    syncStatus() {
      const token = Storage.get(TOKEN_KEY)
      const rememberMe = Storage.get(REMEMBER_ME_KEY)
      const saveUsername = Storage.get(USER_KEY)
      const saveFullName = Storage.get(FULL_NAME_KEY)

      if (this.user.isLogin && saveFullName && saveFullName !== this.user.fullName) {
        this.user.fullName = saveFullName
      }

      if (token) {
        if (!this.user.isLogin) {
          this.user.isLogin = true
          this.user.rememberMe = rememberMe
          this.user.username = saveUsername || ''
          this.user.fullName = saveFullName || ''
          this.role = Storage.get(USER_ROLE_KEY) || 'GUEST'

          // 同步使用者名稱：確保 B 頁面知道是誰登入
          if (saveUsername) {
            this.user.username = saveUsername
          }

          // 如果是非保持登入，B 分頁要自動在自己的 Session 補上生命週期鎖
          if (!rememberMe && !Storage.sessionGet(SESSION_ACTIVE_KEY)) {
            Storage.sessionSet(SESSION_ACTIVE_KEY, true)
          }
          this.fetchUserInfo() // 同步最新使用者資料
        }
      } else if (this.user.isLogin) {
        this.logout()
      }
    },
  },

  // 自動新增啟動時自動從Storage載入登入資料
  persist: {
    enabled: true,
    storage: localStorage,
    paths: ['user.username', 'user.isLogin', 'user.rememberMe', 'role'], // 持久化狀態
  },
})
