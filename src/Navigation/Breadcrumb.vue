<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>

    <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path" :to="item.path">
      {{ item.meta.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 核心邏輯：只抓取有標題的路由層級
const breadcrumbs = computed(() => {
  return route.matched.filter((item) => item.meta && item.meta.title && item.path !== '/')
})
</script>

<style scoped>
:deep(.el-breadcrumb) {
  font-size: 14px;
  line-height: 1.5;
}

/* 2. 可點擊項目的樣式 (未選中狀態) */
:deep(.el-breadcrumb__inner.is-link) {
  font-weight: 500;
  color: #606266;
  transition: all 0.2s ease;
  cursor: pointer;
}

/* 3. 滑鼠移上去的互動效果 */
:deep(.el-breadcrumb__inner.is-link:hover) {
  color: #409eff; /* Element Plus 主色藍 */
  background-color: rgba(64, 158, 255, 0.1); /* 淡淡的藍色背景，讓點擊感更強 */
}

/* 4. 分隔符號的顏色 (斜線 /) */
:deep(.el-breadcrumb__separator) {
  color: #c0c4cc;
  margin: 0 8px;
}
</style>
