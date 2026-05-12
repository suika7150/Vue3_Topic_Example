<template>
  <HeroCarousel :banners="banners" position="center top" />
  <ProductList />
</template>

<script setup>
import HeroCarousel from '@/components/showcase/HeroCarousel.vue'
import ProductList from '@/views/products/ProductList.vue'

const banners = [
  {
    image: '/seasonal/seasonal-sale.png',
  },
  {
    image: '/layoutImages/seasonal/spring2.jpg',
  },
  {
    image: '/layoutImages/seasonal/spring3.jpg',
  },
]
</script>
<style scoped>
:deep(.el-carousel__indicators) {
  position: absolute;
  bottom: 20px;
  z-index: 5;
}

/* 每一顆點 */
:deep(.el-carousel__indicator button) {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  border: none;
}

/* active */
:deep(.el-carousel__indicator.is-active button) {
  background-color: #fff;
  transform: scale(1.2);
}

/* 左右箭頭按鈕 */
:deep(.el-carousel__arrow) {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(6px);
  transition: all 0.3s ease;
}

/* 箭頭 icon */
:deep(.el-carousel__arrow i) {
  font-size: 18px;
  color: #fff;
}
</style>
