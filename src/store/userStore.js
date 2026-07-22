import { defineStore } from 'pinia'
import api from '@/services/api.js'
import router from '@/router'
import Storage, {
  TOKEN_KEY,
  USER_KEY, // 目前登入的帳號
  REMEMBER_USERNAME_KEY, // 記住帳號功能
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
    async login(userData, { token, role, rememberMe, rememberUsername }) {
      if (rememberUsername) {
        Storage.set(REMEMBER_USERNAME_KEY, userData.username)
      } else {
        Storage.remove(REMEMBER_USERNAME_KEY, userData.username)
      }

      Storage.set(USER_KEY, userData.username)
      Storage.set(FULL_NAME_KEY, userData.fullName)

      // 更新State
      this.user = {
        username: userData.username,
        fullName: userData.fullName,
        isLogin: true,
        rememberMe: rememberMe,
      }
      Storage.set(USER_ROLE_KEY, role)
      this.role = role
      await this.fetchUserInfo() // 登入後立即抓取使用者資料
    },

    // 獲取最新使用者資料 (抓取 fullName 用)
    async fetchUserInfo() {
      const currentUsername = this.user.username
      if (!currentUsername || !this.user.isLogin) return

      try {
        const res = await api.user()
        const currentUser = res.result

        if (currentUser) {
          this.user.fullName = currentUser.fullName
          Storage.set(FULL_NAME_KEY, currentUser.fullName)
        }
      } catch (error) {
        throw error
      }
    },

    // 登出
    async logout() {
      if (isLoggingOut) return
      isLoggingOut = true

      try {
        await api.logout().catch(() => {})
      } finally {
        // 清除狀態
        const keys = [USER_KEY, TOKEN_KEY, FULL_NAME_KEY, REMEMBER_ME_KEY]
        Storage.remove(...keys)

        // 重置 Pinia 狀態
        this.user = { username: '', fullName: '', isLogin: false, rememberMe: false }
        this.role = 'GUEST'
        Storage.set(USER_ROLE_KEY, 'GUEST')

        // 只有手動登出且不在登入頁時才提示
        if (router.currentRoute.value.path !== '/login') {
          toast.warning('您已登出，請重新登入。')
        }

        isLoggingOut = false
      }
    },

    // 初始化使用者 (主要用於 F5 重新整理時)
    async initUser() {
      try {
        const res = await api.user()
        if (res && res.result) {
          this.user.isLogin = true

          // 如果 Pinia 本身沒資料，才從 Storage 補
          if (!this.user.username) {
            this.user.username = Storage.get(USER_KEY)
          }

          const currentUser = res.result
          if (currentUser) {
            this.user.fullName = currentUser.fullName
            this.role = currentUser.role || Storage.get(USER_ROLE_KEY) || 'USER'
          }
        }
      } catch (error) {
        console.warn('[權限] 嘗試自動同步身分失敗:', error.response?.status || error.message)

        if (error.response?.status === 401) {
          // this.logout();
        }
      }
    },

    async updateUserInfo(payload) {
      this.user = {
        ...this.user,
        ...payload, // 這裡會包含新的 fullName
      }

      // 同步到 LocalStorage (用於頁面重整後恢復顯示)
      if (payload.fullName) {
        Storage.set(FULL_NAME_KEY, payload.fullName)
      }
    },

    // 跨視窗狀態同步狀態
    syncStatus(newValue) {
      try {
        const parsed = JSON.parse(newValue)

        // 取得同步前的登入狀態，用來比對
        const wasLoggedIn = this.user.isLogin

        if (parsed.user) {
          this.user = { ...this.user, ...parsed.user }
          this.role = parsed.role || 'GUEST'

          // 如果從未登入變已登入
          if (!wasLoggedIn && this.user.isLogin) {
            // 重新執行初始化 API，確保後端認可這個分頁的身份
            this.initUser().then(() => {
              if (router.currentRoute.value.path === '/login') {
                router.push('/')
              }
            })
          }
        }
      } catch (e) {
        console.debug('同步失敗', e)
      }
    },

    // 跨視窗狀態同步監聽
    setupTabSync() {
      window.addEventListener('storage', (event) => {
        // 監聽 Pinia 持久化的 key
        if (event.key === 'userStore') {
          // 如果新值為空，代表另一個分頁執行了登出
          if (!event.newValue) {
            this.handlePassiveLogout()
            return
          }
          // 如果新值存在，嘗試同步資料
          this.syncStatus(event.newValue)
        }

        // 處理 Token 消失（
        if (event.key === 'token-key' && !event.newValue) {
          this.logout()
        }
      })
    },

    // 處理被動登出 (由其他分頁觸發)
    handlePassiveLogout() {
      // 重置狀態
      this.user = { username: '', fullName: '', isLogin: false, rememberMe: false }
      this.role = 'GUEST'

      // 清除相關 Storage (除了記住帳號以外的)
      const keys = [USER_KEY, FULL_NAME_KEY, USER_ROLE_KEY, REMEMBER_ME_KEY]
      Storage.remove(...keys)

      if (router.currentRoute.value.path !== '/login') {
        router.push('/login')
      }
    },
  },

  // 自動新增啟動時自動從Storage載入登入資料
  persist: {
    enabled: true,
    storage: localStorage,
    paths: ['user.username', 'user.rememberMe', 'user.isLogin', 'user.fullName', 'role'],
  },
})
