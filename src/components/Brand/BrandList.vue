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
import BrandIcon from './BrandIcon.vue'
import { brands } from './brands.js'

const brandsData = ref([])

onMounted(() => {
  brandsData.value = brands
})
</script>

<style scoped>
.brand-list-container {
  width: 100%;
  /* border: 1px solid #eee; */
  border-radius: 8px;
  margin: 20px auto;
  max-width: 1000px;
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
