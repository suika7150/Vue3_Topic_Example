import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'

export function useProductSearch() {
  const route = useRoute()
  const router = useRouter()

  const keyword = ref(route.query.keyword || '')

  watch(keyword, (val) => {
    router.replace({
      query: {
        ...route.query,
        keyword: val || undefined,
      },
    })
  })

  watch(
    () => route.query.keyword,
    (val) => {
      keyword.value = val || ''
    },
  )

  return { keyword }
}
