<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>

    <el-breadcrumb-item
      v-for="(item, index) in matchedCrumbs"
      :key="item.path"
      :to="item.clickable ? item.path : undefined"
    >
      {{ item.label }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
  basePath: {
    type: String,
    default: '/category',
  },
})

const route = useRoute()

// 將 path 轉成結構層級
const matchedCrumbs = computed(() => {
  const pathParts = route.path
    .replace(props.basePath, '') // 移除 basePath
    .split('/')
    .filter(Boolean) // 移除空白

  const result = []
  let currentList = props.categories
  let currentPath = props.basePath

  for (const segment of pathParts) {
    const found = currentList.find((item) => item.name === segment)
    if (!found) break

    currentPath += `/${found.name}`
    result.push({
      label: found.label,
      path: currentPath,
      clickable: found.clickable !== false, // 預設可點擊
    })

    currentList = found.subs || [] // 向下一層搜尋
  }

  return result
})
</script>
