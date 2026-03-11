/*
 * RWD斷點邏輯封裝
 * 統一管理視窗寬度與裝置斷點
 */
import { ref, onMounted, onUnmounted, computed } from 'vue'

export function useBreakpoint() {
  const windowWidth = ref(window.innerWidth)
  let timer = null

  const updateWidth = () => {
    //節流邏輯:200ms內只執行一次
    if (timer) return
    timer = setTimeout(() => {
      windowWidth.value = window.innerWidth
      timer = null
    }, 200)
  }

  onMounted(() => {
    window.addEventListener('resize', updateWidth)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateWidth)
    if (timer) clearTimeout(timer)
  })

  //封裝斷點邏輯
  const isMobile = computed(() => windowWidth.value < 768)
  const isPad = computed(() => windowWidth.value >= 768 && windowWidth.value < 1024)
  const isDesktop = computed(() => windowWidth.value >= 1024)

  return {
    windowWidth,
    isMobile,
    isPad,
    isDesktop,
  }
}
