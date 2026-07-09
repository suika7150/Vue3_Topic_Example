<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import HeroLayout from '@/layouts/CrossoverLayout.vue'
import ProductList from '@/views/products/ProductList.vue'

const route = useRoute()
const type = computed(() => route.params.type)

const configMap = {
  anime: {
    tag: 'ANIME SERIES',
    title: '動漫聯名',
    subtitle: '二次元的靈魂',
    video: 'https://res.cloudinary.com/qtzuxouj/video/upload/v1783577303/Frieren_cum7gs.mp4',
  },
  movie: {
    tag: 'MOVIE COLLECTION',
    title: '電影大聯盟',
    subtitle: '經典角色重現',
    video: 'https://res.cloudinary.com/qtzuxouj/video/upload/v1783577524/Lion_ilkeqe.mp4',
  },
  designer: {
    tag: 'DESIGNER SERIES',
    title: '設計師聯名',
    subtitle: '風格的極致',
    video: 'https://res.cloudinary.com/qtzuxouj/video/upload/v1783577592/Mechanical_lcuxis.mp4',
  },
  limited: {
    tag: 'LIMITED EDITION',
    title: '全球限量版',
    subtitle: '稀有收藏',
    video: 'https://res.cloudinary.com/qtzuxouj/video/upload/v1783577853/Mushroom_nwccpo.mp4',
  },
}

// 防呆
const config = computed(() => {
  return configMap[type.value] || configMap.anime
})
</script>

<template>
  <HeroLayout v-bind="config" />
  <ProductList :type="type" />
</template>
