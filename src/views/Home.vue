<template>
  <div class="home-container">
    <AdModal />

    <!-- 圖片輪播 -->
    <div class="carousel-section">
      <HeroCarousel :banners="homeBanners" />
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
import BrandList from '@/components/brand/BrandList.vue'
import HeroCarousel from '@/components/showcase/HeroCarousel.vue'
import ProductList from '@/views/products/ProductList.vue'
import AdModal from '@/components/ad/AdModal.vue'

const homeBanners = [
  {
    title: 'Kawasaki車系大特賣',
    subtitle: '速度與激情',
    tag: 'HOT SALE',
    image: '/banner/kawasaki.jpg',
    link: '/products',
  },
  {
    title: 'Kawasaki Z H2',
    subtitle: '超增壓猛獸來襲',
    tag: 'NEW',
    image: '/banner/kawasaki-z-h2.jpg',
    link: '/products',
  },
  {
    title: 'Kawasaki Z900 RS',
    subtitle: '男子漢的浪漫',
    tag: 'NEW',
    image: '/banner/kawasaki-z900-rs.jpg',
    link: '/products',
  },
  {
    title: 'Kawasaki Ninja 400RR',
    subtitle: '狂放不羈',
    tag: 'NEW',
    image: '/banner/kawasaki-ninja-400rr.jpg',
    link: '/products',
  },
  {
    title: '飲食大放送',
    subtitle: '限時美食優惠',
    tag: 'SALE',
    image: '/banner/double-eleven.jpg',
    link: '/products',
  },
  {
    title: '遊戲機大放送',
    subtitle: '極致遊戲體驗',
    tag: 'SALE',
    image: '/banner/frontend.jpeg',
    link: '/products',
  },
  {
    title: '旅遊景點大放送',
    subtitle: '熱門景點優惠',
    tag: 'SALE',
    image: '/banner/travel.jpeg',
    link: '/products',
  },
]
</script>
<style scoped>
.carousel-section {
  position: relative;
  width: 100%;
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
