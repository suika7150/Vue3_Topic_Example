<script setup lang="ts">
import ProductList from '../products/ProductList.vue'
</script>

<template>
  <div class="anime-page">
    <div class="hero-banner">
      <video autoplay muted loop playsinline class="video-background">
        <source src="/Videos/Frieren.mp4" type="video/mp4" />
        您的瀏覽器不支援影片播放。
      </video>

      <div class="hero-content">
        <span class="category-tag">2026 LIMITED EDITION</span>
        <h1 class="main-title">動漫聯名專區</h1>
        <p class="sub-title">將二次元的靈魂，穿戴在現實的每一刻。</p>
        <el-button class="explore-btn" round>探索系列作品</el-button>
      </div>
      <div class="overlay"></div>
    </div>

    <div class="content-wrapper">
      <ProductList />
      <!-- <el-row :gutter="40">
        <el-col :xs="24" :sm="12" :md="12" v-for="item in animeProducts" :key="item.id">
          <div class="large-product-box" @click="goToDetail(item.id)">
            <div class="img-container">
              <img :src="item.image" class="zoom-img" />
              <div v-if="item.isLimited" class="status-badge">LIMITED</div>
            </div>
            <div class="product-info">
              <div class="text-group">
                <h3>{{ item.title }}</h3>
                <p>{{ item.series || '跨界聯名系列' }}</p>
              </div>
              <div class="price-tag">NT$ {{ item.price }}</div>
            </div>
          </div>
        </el-col>
      </el-row> -->
    </div>
  </div>
</template>

<style scoped>
.anime-page {
  background-color: #fff;
}

/* 滿版 Hero 樣式 */
.hero-banner {
  height: 85vh;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-top: -110px;
}

/* 影片背景樣式 */
.video-background {
  position: absolute;
  top: 0px;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* 漸層遮罩，讓底部文字更清楚 */
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6));
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  padding: 0 20px;
}

.main-title {
  font-size: clamp(2.5rem, 8vw, 4.5rem); /* 響應式字體大小 */
  font-weight: 800;
  letter-spacing: 12px;
  margin: 25px 0;
  text-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.sub-title {
  font-size: 1.2rem;
  letter-spacing: 2px;
  opacity: 0.9;
}

.explore-btn {
  margin-top: 40px;
  padding: 25px 50px;
  font-size: 1rem;
  letter-spacing: 2px;
  background: transparent;
  color: white;
  border: 2px solid white;
  transition: all 0.3s;
}

.explore-btn:hover {
  background: white;
  color: black;
}

.category-tag {
  letter-spacing: 5px;
  font-size: 0.9rem;
  border-bottom: 2px solid #1bbfce;
  padding-bottom: 8px;
}

/* 商品內容區 */
.content-wrapper {
  max-width: 100%;
  margin: 0 auto;
}

.large-product-box {
  cursor: pointer;
  margin-bottom: 100px;
}

.img-container {
  width: 100%;
  aspect-ratio: 16/10;
  overflow: hidden;
  border-radius: 8px;
  position: relative;
  background-color: #f5f5f5;
}

.zoom-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.large-product-box:hover .zoom-img {
  transform: scale(1.1);
}

.product-info {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.product-info h3 {
  font-size: 1.6rem;
  margin: 0;
  font-weight: 600;
  color: #1a1a1a;
}

.product-info p {
  color: #666;
  margin: 8px 0 0 0;
  font-size: 1rem;
}

.price-tag {
  font-size: 1.4rem;
  font-weight: 700;
  color: #d44b4b;
}

.status-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  background: #000;
  color: #fff;
  padding: 6px 18px;
  font-weight: bold;
  font-size: 0.75rem;
  letter-spacing: 2px;
  border-radius: 2px;
}

/* 手機版微調 */
@media (max-width: 912px) {
  .hero-banner {
    height: 70vh;
    margin-top: 0px;
    position: relative;
  }
  .main-title {
    letter-spacing: 5px;
  }
  .content-wrapper {
    padding: 0 20px;
  }
}
</style>
