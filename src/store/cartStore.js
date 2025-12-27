import Storage, { CART_KEY } from '@/utils/storageUtil'
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cartStore', {
  state: () => ({
    cart: Storage.get(CART_KEY) || [],
  }),
  getters: {
    carEmpty: (state) => (!state.cart.length > 0 ? true : false),
    totalQuantity: (state) => {
      return state.cart.reduce((total, item) => total + item.quantity, 0)
    },

    totalPrice: (state) => {
      // 遍歷購物車，計算每個商品的單價 * 數量，並加總
      return state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
  },
  actions: {
    addProduct(product) {
      this.cart.push({ ...product, quantity: 1 })
      Storage.set(CART_KEY, this.cart)
    },
    removeProduct(productId) {
      this.cart = this.cart.filter((item) => item.id !== productId)
      Storage.set(CART_KEY, this.cart)
    },
    clearCart() {
      this.cart = []
      Storage.remove(CART_KEY)
    },
  },
})
