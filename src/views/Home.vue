<template>
  <div class="home-container">
    <div class="carousel-section">
      <AdCarousel />
    </div>
    <div class="product-list-section">
      <ProductList />
    </div>
  </div>
</template>
<script setup>
import AdCarousel from '@/views/AdCarousel.vue'
import ProductList from '@/views/products/ProductList.vue'
</script>
<style scoped>
.carousel-section {
  margin-bottom: 30px; /* 在輪播和商品列表之間增加一些間距 */
}
</style>
