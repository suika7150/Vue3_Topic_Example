import { getCurrentInstance } from 'vue'

export default function useFormat() {
  const instance = getCurrentInstance()
  if (!instance) throw new Error('useFormat must be used inside setup()')
  const global = instance.appContext.config.globalProperties

  return {
    //搭配 plugin\format.js
    $formatPrice: global.$formatPrice,
    $formatDate: global.$formatDate,
  }
}
