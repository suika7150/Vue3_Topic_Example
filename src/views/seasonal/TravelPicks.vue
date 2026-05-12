<template>
  <HeroCarousel :banners="" position="" />
  <ProductList />
</template>

<script setup>
import HeroCarousel from '@/components/showcase/HeroCarousel.vue'
import ProductList from '@/views/products/ProductList.vue'
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 40px;
}

.card {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 12px;
  backdrop-filter: blur(8px);
  color: white;
}
</style>
