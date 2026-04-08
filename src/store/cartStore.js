import { defineStore } from 'pinia'
import Storage, { CART_KEY } from '@/utils/storageUtil'

export const useCartStore = defineStore('cartStore', {
  state: () => ({
    // 初始載入時確保是陣列
    cart: Array.isArray(Storage.get(CART_KEY)) ? Storage.get(CART_KEY) : [],

    // 控制購物車抽屜顯示
    drawerVisible: false,
  }),
  getters: {
    carEmpty: (state) => state.cart.length === 0,
    totalQuantity: (state) => {
      return state.cart.reduce((total, item) => total + item.quantity, 0)
    },

    totalPrice: (state) => {
      // 遍歷購物車，計算每個商品的單價 * 數量，並加總
      return state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
  },
  actions: {
    async fetchCartList() {
      const savedCart = Storage.get(CART_KEY)
      if (Array.isArray(savedCart)) {
        this.cart = savedCart
      }
      return this.cart
    },

    // 控制抽屜顯示
    setDrawerVisible(visible) {
      this.drawerVisible = visible
    },

    // 統一存儲入口
    persist() {
      if (this.cart.length === 0) {
        Storage.remove(CART_KEY)
      } else {
        Storage.set(CART_KEY, this.cart)
      }
    },

    updateQuantity(productId, quantity) {
      //購物車陣列中找到對應 ID 的商品
      const item = this.cart.find((item) => item.id === productId)
      if (item) {
        const newQty = Math.max(1, Math.floor(Number(quantity))) // 確保數量至少為 1
        item.quantity = newQty //更新商品數量
        this.persist() //同步到 localStorage
      }
    },
    addProduct(product) {
      //檢查是否已經有該商品 (比對 ID)
      const existingItem = this.cart.find((item) => item.id === product.id)
      const addQTY = Math.max(1, Math.floor(Number(product.quantity || 1))) //確保新增數量至少為 1
      if (existingItem) {
        existingItem.quantity += addQTY
      } else {
        //如果不存在，才新增商品，且確保有初始數量
        this.cart.push({
          ...product,
          price: Number(product.price),
          quantity: Number(product.quantity || 1),
        })
      }
      this.persist() //同步到 localStorage
    },
    removeProduct(productId) {
      this.cart = this.cart.filter((item) => item.id !== productId)
      this.persist()

      // 開啟購物車
      this.drawerVisible = true
    },
    clearCart() {
      this.cart = []
      this.persist()
    },
  },
})
