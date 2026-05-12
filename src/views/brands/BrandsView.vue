<template>
  <HeroCarousel :banners="configMap" />

  <ProductList :type="type" />
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import HeroCarousel from '@/components/showcase/HeroCarousel.vue'
import ProductList from '@/views/products/ProductList.vue'

const route = useRoute()
const type = computed(() => route.params.type)

const configMap = {
  electronics: {
    tag: 'DIGITAL LIFE',
    title: '3C 數位',
    subtitle: '科技生活新體驗',
    image: 'https://via.placeholder.com/1920x400/007bff/ffffff?text=3C+Digital',
  },
  apparel: {
    tag: 'FASHION & ACCESSORIES',
    title: '服飾配件',
    subtitle: '穿搭風格由你定義',
    image: 'https://via.placeholder.com/1920x400/ff69b4/ffffff?text=Apparel+Fashion',
  },
  food: {
    tag: 'FOOD & BEVERAGE',
    title: '食品飲品',
    subtitle: '品味生活，從美食開始',
    image: 'https://via.placeholder.com/1920x400/28a745/ffffff?text=Food+Drinks',
  },
  vehicle: {
    tag: 'AUTO & MOTO',
    title: '汽機車用品',
    subtitle: '駕馭生活，安全啟程',
    image: 'https://via.placeholder.com/1920x400/6c757d/ffffff?text=Vehicle+Supplies',
  },
  lifeStyle: {
    tag: 'HOME & LIVING',
    title: '居家生活',
    subtitle: '打造你的理想空間',
    image: 'https://via.placeholder.com/1920x400/fd7e14/ffffff?text=Home+Living',
  },
}

// 根據路由參數動態選擇配置，並提供一個預設值（防呆）
const config = computed(() => {
  return configMap[type.value] || configMap.electronics // 預設為 3C 數位
})
</script>

<style scoped>
/* 您可以在這裡添加 BrandsView.vue 特有的樣式 */
</style>
