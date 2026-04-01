<template>
  <div class="home-container">
    <AdModal />

    <!-- 圖片輪播 -->
    <div class="carousel-section">
      <AdCarousel />
    </div>

    <!-- 熱門品牌 -->
    <div class="brand-list">
      <BrandList />
    </div>

    <!-- 商品列表 -->
    <div class="product-list-section">
      <ProductList />
    </div>
  </div>
</template>
<script setup>
import BrandList from '@/components/Brand/BrandList.vue'
import AdCarousel from '@/views/AdCarousel.vue'
import ProductList from '@/views/products/ProductList.vue'
import AdModal from '@/components/AdModal.vue'
</script>
<style scoped>
.carousel-section {
  position: relative;
  width: 100%;
  height: auto;
  overflow: hidden;
}

.brand-list {
  width: 100%;
  margin-bottom: 50px;
}

@media (max-width: 1024px) {
  .carousel-section {
    margin-bottom: 30px;
  }
}
</style>
