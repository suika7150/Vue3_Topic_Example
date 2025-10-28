/**
 * localStorage 集中管理
 *
 * @example
 * import Storage ,{ CART_KEY, USER_KEY} from '@/store/storageStore'
 * Storage.set(CART_KEY, cart)
 * Storage.get(CART_KEY)
 */
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
  remove(...key) {
    key.forEach((item) => {
      localStorage.removeItem(item)
    })
  },
  clear() {
    localStorage.clear()
  },
}

// 定義專用 key，避免硬編碼
export const CART_KEY = 'shopping_cart'
export const USER_KEY = 'username'
export const TOKEN_KEY = 'token'
export const OPTIONS_KEY = 'optionsCache'
export const USER_ROLE_KEY = 'user_role'

export default Storage
