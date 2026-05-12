<template>
  <div class="carousel-container">
    <el-carousel
      :key="isMobile"
      :interval="4000"
      height="100vh"
      width="100%"
      indicator-position=""
      arrow="hover"
    >
      <el-carousel-item v-for="(ad, index) in banners" :key="index">
        <a :href="ad.link" target="_self" class="ad-link">
          <div
            class="hero-image"
            :style="{ backgroundImage: `url(${ad.image})`, backgroundPosition: position }"
          ></div>

          <div class="ad-overlay"></div>
          <div class="ad-content">
            <!-- <span class="ad-tag">{{ ad.tag }}</span> -->
            <h2 class="ad-title">{{ ad.title }}</h2>
            <p class="ad-subtitle">{{ ad.subtitle }}</p>
          </div>
        </a>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { useBreakpoint } from '@/composables/useBreakpoint'

const { isMobile } = useBreakpoint()

defineProps({
  banners: {
    type: Array,
    default: () => [],
  },
  position: {
    type: String,
    default: 'center 20%',
  },
})
</script>

<style scoped>
.carousel-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #000;
}

:deep(.el-carousel__container) {
  height: 100%;
}

:deep(.el-carousel) {
  height: 100vh;
}

.ad-link {
  display: block;
  width: 100%;
  height: 100%;
}

.hero-image {
  position: absolute;
  inset: 0;

  background-size: cover;
  background-repeat: no-repeat;
}

.ad-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 1;
}

/* 內容層 */
.ad-content {
  position: absolute;
  left: 10%;
  bottom: 15%;
  z-index: 2;
  color: white;
  text-align: left;
}

.ad-tag {
  display: inline-block;
  padding: 4px 12px;
  background: #ff4757;
  color: white;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 12px;
  border-radius: 4px;
}

.ad-title {
  font-size: clamp(24px, 5vw, 48px);
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.ad-subtitle {
  font-size: 18px;
  opacity: 0.9;
  letter-spacing: 1px;
}

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

/* active 那顆 */
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
@media (max-width: 1024px) {
  .carousel-container,
  :deep(.el-carousel) {
    height: 40vh !important;
  }

  :deep(.el-carousel__container) {
    height: 40vh !important;
  }

  .ad-image {
    object-position: center center;
  }

  .ad-content {
    bottom: 10%;
  }
}
</style>
