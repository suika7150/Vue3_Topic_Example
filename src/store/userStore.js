import { defineStore } from 'pinia'
import { ElMessageBox } from 'element-plus'
import Storage, { TOKEN_KEY, USER_ROLE_KEY } from '@/utils/storageUtil'
import api from '@/service/api.js'

let isLoggingOut = false

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: {
      username: '',
      fullName: '',
      rememberMe: false,
      isLogin: false,
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
     * @param {*} user
     * @returns
     * @description
     * 將用戶資料儲存到狀態中
     * 從後端獲取最新使用者資料
     * 用於同步 DB 狀態到前端畫面
     * */
    async fetchUserInfo() {
      try {
        const res = await api.user()
        const userList = res.result || []
        if (Array.isArray(userList)) {
          const currentUsername = this.user.username || Storage.get('username')

          const currentUser = userList.find((u) => u.username === currentUsername)
          if (currentUser) {
            // 同步資料到 Pinia
            this.user = {
              ...this.user,
              ...currentUser,
              isLogin: true,
            }
            this.role = currentUser.role || this.role

            // 寫入 Storage
            Storage.set('fullName', currentUser.fullName)
            Storage.set('username', currentUser.username)
            return currentUser
          }
          return res
        }
      } catch (error) {
        throw error
      }
    },

    async login(userData, { token, role, rememberMe }) {
      // Token 統一存 Local，解決跨分頁同步問題
      Storage.set(USER_ROLE_KEY, role)
      Storage.set('REMEMBER_ME', rememberMe)
      Storage.set(TOKEN_KEY, token)
      if (!rememberMe) {
        // 如果使用者沒勾選保持登入，就在當前分頁種下生命週期鎖
        Storage.sessionSet('SESSION_ACTIVE', true)
      } else {
        // 如果有勾選，確保清除舊的 Session 標記

        // Storage.remove(TOKEN_KEY)
        // Storage.set('REMEMBER_ME', false)
        // Storage.sessionSet(TOKEN_KEY, token)
        Storage.sessionRemove('SESSION_ACTIVE')
      }

      Storage.set(USER_ROLE_KEY, role) // 權限放 Local

      // 更新State
      // this.token = token
      this.user = {
        username: userData.username,
        fullName: userData.fullName,
        isLogin: true,
        rememberMe: rememberMe,
      }
      this.role = role
    },

    /**
     * 初始化使用者 (主要用於 F5 重新整理時)
     */
    initUser() {
      const token = Storage.get(TOKEN_KEY) || Storage.sessionGet(TOKEN_KEY)
      const rememberMe = Storage.get('REMEMBER_ME')
      const isSessionActive = Storage.sessionGet('SESSION_ACTIVE')

      if (token) {
        // 如果沒勾保持登入且Session 標記消失了
        if (!rememberMe && !isSessionActive) {
          console.log('檢測到非持久登入且 Session 已失效，執行自動登出')
          this.logout()
          return
        }

        // 否則，恢復登入狀態
        this.user.isLogin = true
        this.role = Storage.get(USER_ROLE_KEY) || 'GUEST'
      }
    },

    async updateUserInfo(payload) {
      this.user = {
        ...this.user,
        ...payload, // 這裡會包含新的 fullName
      }

      // 同步到 LocalStorage
      if (payload.fullName) {
        Storage.set('fullName', payload.fullName)
      }
    },

    /**
     * 登出
     */
    logout() {
      if (isLoggingOut) return

      isLoggingOut = true

      // 清除狀態
      this.role = 'GUEST'
      this.user = { username: '', fullName: '', isLogin: false, rememberMe: false }

      const keys = [
        USER_ROLE_KEY,
        TOKEN_KEY,
        'REMEMBER_ME',
        'SESSION_ACTIVE',
        // 'username',
        'fullName',
      ]
      Storage.remove(...keys)
      Storage.sessionRemove(...keys)

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
     * 跨視窗同步狀態
     */
    syncStatus() {
      const token = Storage.get(TOKEN_KEY)
      const rememberMe = Storage.get('REMEMBER_ME')
      const saveUsername = Storage.get('username')
      const saveFullName = Storage.get('fullName')

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
          if (!rememberMe && !Storage.sessionGet('SESSION_ACTIVE')) {
            Storage.sessionSet('SESSION_ACTIVE', true)
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
    paths: ['user', 'role'], // 持久化狀態
  },
})
