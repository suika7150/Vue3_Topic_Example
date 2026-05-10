import { ref, computed } from 'vue'

export function useProductFilter(rawData) {
  // 篩選狀態 (即時與進階篩選共用)
  const filters = ref({
    category: '',
    sort: '',
    minPrice: null,
    maxPrice: null,
    keyword: '',
  })

  // 2. 從原始資料提取分類清單
  const categories = computed(() => {
    if (!rawData.value) return []
    return [...new Set(rawData.value.map((p) => p.category))]
  })

  // 過濾邏輯 (包含分類、價格、排序)
  const filteredProducts = computed(() => {
    let list = [...rawData.value]

    // 分類篩選
    if (filters.value.category) {
      list = list.filter((p) => p.category === filters.value.category)
    }

    // 價格區間篩選
    if (filters.value.minPrice !== null) {
      list = list.filter((p) => p.price >= filters.value.minPrice)
    }
    if (filters.value.maxPrice !== null) {
      list = list.filter((p) => p.price <= filters.value.maxPrice)
    }

    // 排序邏輯
    if (filters.value.sort === 'price_asc') {
      list.sort((a, b) => a.price - b.price)
    } else if (filters.value.sort === 'price_desc') {
      list.sort((a, b) => b.price - a.price)
    }

    return list
  })

  const resetFilters = () => {
    filters.value.category = ''
    filters.value.sort = ''
    filters.value.minPrice = null
    filters.value.maxPrice = null
    filters.value.keyword = ''
  }

  return {
    filters,
    categories,
    filteredProducts,
    resetFilters,
  }
}
