<template>
  <div class="brand-list-container">
    <h2>熱門品牌</h2>

    <div class="brand-list-wrapper">
      <BrandIcon v-for="brand in brandsData" :key="brand.id" :brand="brand" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 1. 導入 BrandIcon：使用 `./`，因為在同一個 Brand 資料夾內
import BrandIcon from './BrandIcon.vue'

// 2. 導入 brands 數據：使用 `./`，因為 brands.js 在同一個 Brand 資料夾內
// 注意：我們假設您是使用 'export const brands' 導出的，所以需要大括號 { brands }
import { brands } from './brands.js'

// 3. 數據狀態和載入邏輯
const brandsData = ref([])

onMounted(() => {
  brandsData.value = brands
})
</script>

<style scoped>
/* 樣式保持不變 */
.brand-list-container {
  width: 100%;
  padding: 20px;
  /* background-color: black; */
  border: 1px solid #eee;
  border-radius: 8px;
  margin: 20px auto;
  max-width: 900px;
}

h2 {
  text-align: center;
  color: #555;
  margin-bottom: 25px;
}

.brand-list-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}
</style>
