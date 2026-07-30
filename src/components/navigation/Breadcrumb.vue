<template>
  <div class="breadcrumb-wrapper">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>

      <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path" :to="item.path">
        {{ item.meta.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

//只抓取有標題的路由層級
const breadcrumbs = computed(() => {
  return route.matched.filter((item) => item.meta && item.meta.title && item.path !== '/')
})
</script>

<style scoped>
.breadcrumb-wrapper {
  max-width: 1200px;
  margin: 24px auto 0 auto;
  padding: 0 20px;
}

:deep(.el-breadcrumb) {
  font-size: 16px;
  line-height: 1.5;
}

:deep(.el-breadcrumb__inner.is-link) {
  font-weight: 500;
  color: #606266;
  cursor: pointer !important;
  transition: all 0.2s ease;
}

:deep(.el-breadcrumb__separator) {
  color: #c0c4cc;
  margin: 0 8px;
}
</style>
