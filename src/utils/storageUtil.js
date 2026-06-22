/** localStorage 集中管理  */
const Storage = {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  get(key, defaultValue = null) {
    const item = localStorage.getItem(key)
    try {
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },
  remove(...keys) {
    keys.forEach((key) => {
      localStorage.removeItem(key)
    })
  },
  clear() {
    localStorage.clear()
  },

  sessionSet(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value))
  },
  sessionGet(key, defaultValue = null) {
    const item = sessionStorage.getItem(key)
    try {
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },
  sessionRemove(...keys) {
    keys.forEach((key) => sessionStorage.removeItem(key))
  },
  sessionClear() {
    sessionStorage.clear()
  },
}

export const CART_KEY = 'shopping_cart'
export const USER_KEY = 'username'
export const FULL_NAME_KEY = 'fullName'
export const TOKEN_KEY = 'token'
export const OPTIONS_KEY = 'optionsCache'
export const USER_ROLE_KEY = 'user_role'
export const REMEMBER_USERNAME_KEY = 'ecs_rem_username' // 記住帳號
export const REMEMBER_ME_KEY = 'ecs_remember_me' // 保持登入

export default Storage
