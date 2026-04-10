<template>
  <div class="order-list-page">
    <h1>📦 我的訂單</h1>
    <p>這裡之後會顯示您的歷史訂單紀錄。</p>
    <el-button type="primary" @click="goHome">返回首頁</el-button>
  </div>
</template>

<script setup>
import { useNavigation } from '@/composables/useNavigation'
const { goHome } = useNavigation()
</script>

<style scoped>
.order-list-page {
  padding: 40px;
  text-align: center;
}
</style>
