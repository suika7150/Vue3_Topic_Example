<template>
  <div>
    <AdCarousel :ads="adBanners" />
  </div>
</template>
<script setup>
import { ref } from 'vue'
import AdCarousel from '@/views/AdCarousel.vue'

const adBanners = [
  {
    title: '暑期特賣 50% OFF',
    image: './Banner/food.jpg',
    link: '/category/life/food',
  },
  {
    title: '前端工程師實戰課程',
    image: './Banner/frontend.jpeg',
    link: '/category/tech/frontend',
  },
  {
    title: '旅遊全攻略大放送',
    image: './Banner/travel.jpeg',
    link: '/category/life/travel',
  },
]
</script>
