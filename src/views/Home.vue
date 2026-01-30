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

    <div>
      <!-- <SideAdBanner
        position="left"
        image="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400&h=1000&auto=format&fit=crop"
        link="/promo/double-11"
        title="年終狂歡節"
      /> -->
    </div>
  </div>
</template>
<script setup>
import BrandList from '@/components/Brand/BrandList.vue'
import AdCarousel from '@/views/AdCarousel.vue'
import ProductList from '@/views/products/ProductList.vue'
import AdModal from '@/components/AdModal.vue'
import SideAdBanner from '@/components/SideAdBanner.vue'
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
