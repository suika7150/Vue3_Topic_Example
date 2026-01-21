<template>
  <div class="flash-sale-page">
    <div class="header-banner">
      <el-countdown title="⚡ 距離特惠結束還剩" :value="deadline" time-indices format="HH:mm:ss">
        <template #suffix>
          <span> 小時</span>
        </template>
      </el-countdown>
    </div>

    <div class="promo-info">
      <el-tag type="danger" effect="dark" size="large">限時下殺</el-tag>
      <p>每週一中午更新，搶完為止！</p>
    </div>

    <ProductList forced-category="特惠" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ProductList from '@/views/products/ProductList.vue'

// 公式：1000ms * 60s * 60m * 2小時
const deadline = ref(Date.now() + 1000 * 60 * 60 * 10000)
</script>

<style scoped>
.flash-sale-page {
  padding: 20px;
  background: linear-gradient(180deg, #fff5f5 0%, #ffffff 100%);
}
.header-banner {
  background: #f56c6c;
  color: white;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 20px;
}
.header-banner :deep(.el-statistic__title) {
  color: white;
  font-size: 24px;
}
.promo-info {
  text-align: center;
  margin-bottom: 30px;
  font-size: 30px;
}
</style>
