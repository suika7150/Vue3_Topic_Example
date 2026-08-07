import { ref, computed } from 'vue'
import throttle from 'lodash/throttle'

export function useProductPagination(list, options = {}) {
  const pageSize = options.pageSize ?? 4

  const visibleCount = ref(pageSize)
  const loadingMore = ref(false)

  const hasMore = computed(() => {
    return visibleCount.value < list.value.length
  })

  const visibleItems = computed(() => list.value.slice(0, visibleCount.value))

  const loadMore = () => {
    if (loadingMore.value) return

    loadingMore.value = true

    setTimeout(() => {
      visibleCount.value += pageSize
      loadingMore.value = false
    }, 1500)
  }

  // 自動載入更多商品
  const handleScroll = throttle(() => {
    const scrollY = window.scrollY
    const visibleHeight = window.innerHeight
    const pageHeight = document.documentElement.scrollHeight

    const nearBottom = scrollY + visibleHeight >= pageHeight - 200

    if (nearBottom && visibleCount.value < list.value.length) {
      loadMore()
    }
  }, 500)

  const reset = () => {
    visibleCount.value = pageSize
  }

  return {
    visibleCount,
    visibleItems,
    loadMore,
    loadingMore,
    handleScroll,
    reset,
    hasMore,
  }
}
