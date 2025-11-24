<template>
  <div class="carousel-container">
    <!-- 使用 Element Plus 的卡片式輪播 -->
    <el-carousel
      :interval="4000"
      type="card"
      height="400px"
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

<style scoped>
.carousel-container {
  padding: 40px 0;
}

.ad-link {
  display: block;
  width: 100%;
  height: 100%;
}

.ad-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 將 cover 改為 contain，確保圖片完整顯示不被裁切 */
  transition: filter 0.3s ease; /* 讓模糊效果有過渡動畫 */
}

/*
  :deep() 選擇器可以穿透 scoped 的限制，
  讓我們可以選取到 el-carousel 內部的 class
*/
.carousel-container :deep(.el-carousel__item) {
  /* 讓卡片有圓角和陰影，看起來更立體 */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/*
  選取「不是」當前啟用狀態的卡片，也就是左右兩側的預覽卡片
*/
.carousel-container :deep(.el-carousel__item:not(.is-active)) {
  /* 為兩側的卡片加上模糊和變暗的效果 */
  filter: blur(4px) brightness(0.7);
  transform: scale(0.9); /* 讓兩側卡片稍微小一點 */
}
</style>
