<template>
  <div class="carousel-container">
    <!-- 使用 Element Plus 的卡片式輪播 -->
    <el-carousel
      :key="isMobile"
      :interval="4000"
      :type="carouselType"
      :height="carouselHeight"
      width="100%"
      indicator-position="outside"
      arrow="hover"
    >
      <el-carousel-item v-for="(ad, index) in adBanners" :key="index">
        <a :href="ad.link" target="_self" class="ad-link">
          <img :src="ad.image" :alt="ad.title" class="ad-image" />
        </a>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useBreakpoint } from '@/composables/useBreakpoint'
const { isMobile } = useBreakpoint()

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
    image: './Banner/DoubleEleven.jpg',
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

// 手機版使用標準模式 ('')，桌機使用卡片模式 ('card')
const carouselType = computed(() => (isMobile.value ? '' : 'card'))

const carouselHeight = computed(() => (isMobile.value ? 'auto' : '50vh'))
</script>

<style scoped>
/* .carousel-container {
  width: 100%;
  height: 100%;
} */
.ad-link {
  display: block;
  width: 100%;
  height: 100%;
}

.ad-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 桌機卡片模式特有：模糊與縮放 */
:deep(.el-carousel--card .el-carousel__item:not(.is-active)) {
  filter: blur(4px) brightness(0.7);
  transform: scale(0.9);
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .carousel-container :deep(.el-carousel__item) {
    aspect-ratio: 16 / 8;
    width: 100%;
    height: auto;
  }

  .ad-image {
    width: 100%;
    height: 100%;
  }
}
</style>
