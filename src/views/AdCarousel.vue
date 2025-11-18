<template>
  <div class="carousel-container">
    <el-carousel height="500px" :indicator-position="outside" arrow="hover" :interval="5000">
      <el-carousel-item v-for="(ad, index) in adBanners" :key="index">
        <a :href="ad.link" target="_self" class="ad-link">
          <img :src="ad.image" :alt="ad.title" class="ad-image" />
        </a>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
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

// const props = defineProps({
//   ads: {
//     type: Array,
//     required: true,
//     default: () => [],
//   },
// })
</script>

<style scoped>
.ad-link {
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
}

.ad-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition:
    transform 0.3s ease,
    filter 0.6s ease; /* 確保模糊切換平滑 */
}

.ad-link:hover .ad-image {
  transform: scale(1.02);
}

.carousel-container {
  padding-top: 100px;
}
</style>
