<template>
  <div>
    <h2>目前分類路徑：</h2>
    <!-- 開發中-->
    <p>{{ paths.join('/') }}</p>
    {{ $route.params }}
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const paths = computed(() => {
  const p = route.params.paths
  if (Array.isArray(p)) return p
  if (typeof p === 'string') return p ? [p] : []
  return []
})
</script>
