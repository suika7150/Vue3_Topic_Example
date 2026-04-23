import { defineStore } from 'pinia'
import api from '@/service/api.js'
import Storage, {
  TOKEN_KEY,
  USER_KEY, // 目前登入的帳號 (登出會刪)
  REMEMBER_USERNAME_KEY, // 記住帳號功能 (登出不刪)
  REMEMBER_ME_KEY, // 保持登入功能
  USER_ROLE_KEY,
  FULL_NAME_KEY,
} from '@/utils/storageUtil'
import { toast } from '@/utils/message'

let isLoggingOut = false

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: {
      username: '', // 帳號
      fullName: '', // 顯示用名稱
      isLogin: false, // 是否已登入
      rememberMe: false, // 是否勾選了保持登入
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
        Storage.remove(REMEMBER_USERNAME_KEY, userData.username)
      }

      // 存入非敏感的基本資料
      Storage.set(USER_ROLE_KEY, role)
      Storage.set(USER_KEY, userData.username)
      // Storage.set(REMEMBER_ME_KEY, rememberMe)
      Storage.set(FULL_NAME_KEY, userData.fullName)

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
    async logout() {
      if (isLoggingOut) return
      isLoggingOut = true

      try {
        await api.logout().catch(() => {})
      } finally {
        // 清除狀態
        const keys = [USER_KEY, TOKEN_KEY, FULL_NAME_KEY, USER_ROLE_KEY, REMEMBER_ME_KEY]
        Storage.remove(...keys)

        // 重置 Pinia 狀態
        this.user = { username: '', fullName: '', isLogin: false, rememberMe: false }
        this.role = 'GUEST'

        // 非登入頁面才顯示提醒
        if (window.location.pathname !== '/login') {
          toast.warning('您的登入已過期，請重新登入。')
        }

        isLoggingOut = false
      }
    },

    /**
     * 初始化使用者 (主要用於 F5 重新整理時)
     */
    async initUser() {
      try {
        const res = await api.user()
        if (res && res.result) {
          this.user.isLogin = true

          // 從本地緩存先抓基本資料
          this.role = Storage.get(USER_ROLE_KEY)
          this.user.username = Storage.get(USER_KEY)

          // 如果 API 有回傳詳細清單，更新顯示名稱
          const currentUser = res.result.find?.((u) => u.username === this.user.username)
          if (currentUser) {
            this.user.fullName = currentUser.fullName
          }
        }
      } catch (error) {}

      // apiService 的攔截器會處理 401 並自動執行 logout()
      console.debug('[Auth] Session invalid, initialized as Guest.')
    },

    async updateUserInfo(payload) {
      // 更新 Pinia State (觸發 UI 更新)
      this.user = {
        ...this.user,
        ...payload, // 這裡會包含新的 fullName
      }

      // 同步到 LocalStorage (用於頁面重整後恢復顯示)
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

          this.fetchUserInfo() // 同步最新使用者資料
        }
      }
    },
  },

  // 自動新增啟動時自動從Storage載入登入資料
  persist: {
    enabled: true,
    storage: localStorage,
    paths: ['user.username', 'user.rememberMe', 'role'], // 持久化狀態
  },
})
