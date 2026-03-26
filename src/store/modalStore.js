/*-----搭配ModalProvider使用-----*/
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalStore = defineStore('modal', () => {
  const isVisible = ref(false)
  const config = ref({
    title: '提示',
    message: '',
    onConfirm: null,
  })

  function open(options) {
    config.value = {
      title: options.title || '提示',
      message: options.message || '',
      onConfirm: options.onConfirm || null,
    }
    isVisible.value = true
  }

  function close() {
    isVisible.value = false
  }

  function confirm() {
    if (config.value.onConfirm) config.value.onConfirm()
    close()
  }

  return { isVisible, config, open, close, confirm }
})
