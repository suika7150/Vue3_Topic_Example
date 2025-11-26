<template>
  <div class="home-container">
    <div class="carousel-section">
      <AdCarousel />
    </div>

    <div class="brand-list">
      <BrandList />
    </div>

    <div class="product-list-section">
      <ProductList />
    </div>
  </div>
</template>
<script setup>
import BrandList from '@/components/Brand/BrandList.vue'
import AdCarousel from '@/views/AdCarousel.vue'
import ProductList from '@/views/products/ProductList.vue'
</script>
<style scoped>
.carousel-section {
  margin-bottom: 30px; /* 在輪播和商品列表之間增加一些間距 */
  width: 100vw; /* 1. 設定寬度為視窗寬度 */
  position: relative;
  left: 50%;
  transform: translateX(-50%); /* 2. 將其水平置中 */
  margin-bottom: 50px; /* 3. 和下方商品列表的間距 */
}

brand-list {
  width: 100%;
  margin-bottom: 50px; /* 品牌列表和商品列表之間的間距 */
}

@media (max-width: 912px) {
  .carousel-section {
    margin-bottom: 30px; /* 在輪播和商品列表之間增加一些間距 */
    width: 100vw; /* 1. 設定寬度為視窗寬度 */
    position: relative;
    left: 50%;
    transform: translateX(-50%); /* 2. 將其水平置中 */
    margin-bottom: 50px; /* 3. 和下方商品列表的間距 */
  }
}
</style>
