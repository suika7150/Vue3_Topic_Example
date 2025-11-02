<template>
  <div>
    <AdCarousel :ads="adBanners" />
    <ProductList />
  </div>
</template>
<script setup>
import { ref } from 'vue'
import AdCarousel from '@/views/AdCarousel.vue'
import ProductList from '@/views/products/ProductList.vue'

const adBanners = [
  {
    title: 'Kawasaki車系大特賣',
    image: './Banner/Kawasaki.jpg',
    link: '/category/life/travel',
  },
  {
    title: 'Kawasaki Z H2',
    image: './Banner/Kawasaki Z H2.jpg',
    link: '/category/life/travel',
  },
  {
    title: 'Kawasaki Z900 RS',
    image: './Banner/Kwasaki Z900 RS.jpg',
    link: '/category/life/travel',
  },
  {
    title: 'Kawasaki Ninja 400RR',
    image: './Banner/Kawasaki Ninja 400RR.jpg',
    link: '/category/life/food',
  },
  {
    title: '飲食大放送',
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
