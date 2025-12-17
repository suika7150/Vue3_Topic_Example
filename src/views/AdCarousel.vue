<template>
  <div class="carousel-container">
    <!-- 使用 Element Plus 的卡片式輪播 -->
    <el-carousel
      :key="isMobile"
      :interval="4000"
      :type="carouselType"
      :height="carouselHight"
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

const isMobile = ref(false)
const MOBILE_WIDTH = 912 // 定義手機模式的臨界寬度

// 檢查當前視窗寬度
const checkMobile = () => {
  isMobile.value = window.innerWidth <= MOBILE_WIDTH
}
// 手機為標準模式 ('')，PC 為卡片模式 ('card')
const carouselType = computed(() => (isMobile.value ? '' : 'card'))

// 手機 & PC 高度
const carouselHight = computed(() => (isMobile.value ? '215px' : '400px'))

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile) //監聽視窗大小變化
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile) //組件銷毀時移除監聽
})
</script>

<style scoped>
/* ... (PC 模式下的通用和特效樣式保持不變) ... */

.ad-link {
  display: block;
  width: 100%;
  height: 100%;
}
.ad-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.3s ease;
}

/* PC 模式：為卡片加上圓角、陰影 */
.carousel-container :deep(.el-carousel__item) {
  /* border-radius: 12px; */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* PC 模式：為兩側卡片加上模糊和變暗 */
.carousel-container :deep(.el-carousel__item:not(.is-active)) {
  filter: blur(4px) brightness(0.7);
  transform: scale(0.9);
}

/* ⬇️ RWD 調整：只保留外觀調整，移除核心邏輯覆蓋 */
@media (max-width: 912px) {
  /* 確保輪播容器本身沒有任何可能導致間隙的內邊距或外邊距 */
  .carousel-container :deep(.el-carousel__container) {
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    /* 確保寬度是 100% */
    width: 100% !important;
  }

  /* 確保輪播項目本身也沒有左右間距 */
  .carousel-container :deep(.el-carousel__item) {
    margin: 0 !important;
    padding: 0 !important;

    /* 移除手機上的圓角和陰影 (上次的修改保留) */
    border-radius: 0 !important;
    box-shadow: none !important;
  }

  /* 確保輪播項目裡的圖片/連結 (ad-link, ad-image) 也填滿 100% */
  .ad-link {
    width: 100% !important;
    height: 100% !important;
  }
  .ad-image {
    width: 100% !important;
    height: 100% !important;
    /* 使用 cover 是正確的，但如果看到邊框，也可以嘗試 contain
           來確認是否是圖片比例問題造成的空隙 */
    object-fit: cover !important;
  }

  .ad-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: filter 0.3s ease;
  }

  /* ... 保持其他手機樣式不變 (如側邊卡片模糊移除) ... */
}
</style>
