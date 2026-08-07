import { defineStore } from 'pinia'
import { ref } from 'vue'

// 側邊欄的狀態，預設為關閉 (false)
export const useSidebarStore = defineStore('sidebar', () => {
  const isCollapsed = ref(true)

  // 切換狀態的方法 (LoginMenu.vue 會呼叫這個方法)
  const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value
  }

  // 直接設定狀態的方法 (如果需要)
  const setCollapse = (value) => {
    isCollapsed.value = value
  }
  return { isCollapsed, toggleCollapse, setCollapse }
})
