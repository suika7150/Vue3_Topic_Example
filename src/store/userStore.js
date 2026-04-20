import { defineStore } from 'pinia'
import { ElMessageBox } from 'element-plus'
import api from '@/service/api.js'
import Storage, {
  TOKEN_KEY,
  USER_ROLE_KEY,
  USER_KEY, // 目前登入的帳號 (登出會刪)
  REMEMBER_ME_KEY, // 記住帳號功能專用 (登出不刪)
  FULL_NAME_KEY,
  IS_PERSISTENT_KEY,
  SESSION_ACTIVE_KEY,
} from '@/utils/storageUtil'

let isLoggingOut = false

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: {
      username: '', // 帳號
      fullName: '', // 顯示用名稱
      isLogin: false, // 是否已登入
      isPersistent: false, // 是否勾選了「保持登入」
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
     * @param {Object} loginConfig 包含 token, role, isPersistent, rememberMe
     */

    async login(userData, { token, role, isPersistent, rememberMe }) {
      if (rememberMe) {
        Storage.set(REMEMBER_ME_KEY, userData.username)
      } else {
        Storage.remove(REMEMBER_ME_KEY)
      }
      // Token 統一存 Local，解決跨分頁同步問題
      Storage.set(TOKEN_KEY, token)
      Storage.set(USER_ROLE_KEY, role)
      Storage.set(USER_KEY, userData.username)
      Storage.set(IS_PERSISTENT_KEY, isPersistent)
      Storage.set(FULL_NAME_KEY, userData.fullName)

      if (!isPersistent) {
        // 如果使用者沒勾選保持登入，就在當前分頁種下生命週期鎖
        Storage.sessionSet(SESSION_ACTIVE_KEY, true)
      } else {
        // 如果有勾選，確保清除舊的 Session 標記

        // Storage.remove(TOKEN_KEY)
        // Storage.set('REMEMBER_ME', false)
        // Storage.sessionSet(TOKEN_KEY, token)
        Storage.sessionRemove(SESSION_ACTIVE_KEY)
      }

      // 更新State
      // this.token = token
      this.user = {
        username: userData.username,
        fullName: userData.fullName,
        isLogin: true,
        isPersistent: isPersistent,
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
        IS_PERSISTENT_KEY,
        SESSION_ACTIVE_KEY,
      ]
      Storage.remove(...keys)
      Storage.sessionRemove(...keys)

      // 重置 Pinia 狀態
      this.user = { username: '', fullName: '', isLogin: false, isPersistent: false }
      this.role = 'GUEST'

      if (window.location.pathname !== '/login') {
        ElMessageBox.alert('您的登入已過期，請重新登入。', '提示', {
          confirmButtonText: '確定',
          callback: () => {
            isLoggingOut = false
          },
        })
      } else {
        isLoggingOut = false
      }
    },

    /**
     * 初始化使用者 (主要用於 F5 重新整理時)
     */
    initUser() {
      const token = Storage.get(TOKEN_KEY) || Storage.sessionGet(TOKEN_KEY)
      const isPersistent = Storage.get(IS_PERSISTENT_KEY)
      const isSessionActive = Storage.sessionGet(SESSION_ACTIVE_KEY)

      if (!token || (!isPersistent && !isSessionActive)) {
        this.logout()
        return
      }
      // 如果沒勾保持登入且Session 標記消失了
      if (!isPersistent && !isSessionActive) {
        this.logout()
        return
      }
      // 否則，恢復登入狀態
      this.user.isLogin = true
      this.user.isPersistent = !!isPersistent
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
      const isPersistent = Storage.get(IS_PERSISTENT_KEY)
      const saveUsername = Storage.get(USER_KEY)
      const saveFullName = Storage.get(FULL_NAME_KEY)

      if (token) {
        if (!this.user.isLogin) {
          this.user.isLogin = true
          this.user.isPersistent = isPersistent
          this.user.username = saveUsername || ''
          this.user.fullName = saveFullName || ''
          this.role = Storage.get(USER_ROLE_KEY) || 'GUEST'

          // 同步使用者名稱：確保 B 頁面知道是誰登入
          if (saveUsername) {
            this.user.username = saveUsername
          }

          // 如果是非保持登入，B 分頁要自動在自己的 Session 補上生命週期鎖
          if (!isPersistent && !Storage.sessionGet(SESSION_ACTIVE_KEY)) {
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
    paths: ['user.username', 'user.isLogin', 'user.isPersistent', 'role'], // 持久化狀態
  },
})
