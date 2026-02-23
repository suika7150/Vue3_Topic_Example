<script setup lang="ts">
import ProductList from '@/views/products/ProductList.vue'
</script>

<template>
  <div class="limited-page">
    <div class="hero-banner">
      <img src="/Images/Limited.png" class="hero-image" />

      <div class="hero-content">
        <span class="category-tag">GLOBAL LIMITED EDITION</span>
        <h1 class="main-title">全球限量版</h1>
        <p class="sub-title">錯過，即成絕版。</p>
        <el-button class="explore-btn" round> 立即探索 </el-button>
      </div>

      <div class="overlay"></div>
    </div>

    <div class="content-wrapper">
      <ProductList />
    </div>
  </div>
</template>

<style scoped>
.limited-page {
  background-color: #111;
  color: white;
}

.hero-banner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-height: 110vh;
  width: 100%;
  margin-top: -80px;
}

.hero-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.75));
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
}

.main-title {
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 800;
  letter-spacing: 12px;
  margin: 25px 0;
}

.category-tag {
  font-size: clamp(1.2rem, 1vw, 4.5rem);
  letter-spacing: 2px;
  border-bottom: 2px solid #d4af37;
  padding-bottom: 8px;
}

.sub-title {
  font-size: clamp(1.2rem, 1vw, 4.5rem);
  letter-spacing: 2px;
}

.explore-btn {
  margin-top: 40px;
  padding: 25px 50px;
  font-size: 1rem;
  letter-spacing: 2px;
  background: transparent;
  color: white;
  border: 2px solid #d4af37;
  transition: all 0.3s;
}

.explore-btn:hover {
  background: #d4af37;
  color: black;
}

/* 商品區 */
.content-wrapper {
  background: white;
  color: black;
  margin-top: -120px;
  padding: 60px;
  position: relative;
  z-index: 3;
}

@media (max-width: 1024px) {
  .hero-banner {
    min-height: 55vh;
    margin-top: 0;
  }

  .main-title {
    letter-spacing: 5px;
  }

  .content-wrapper {
    margin-top: -40px;
    padding: 30px 20px;
    border-radius: 20px 20px 0 0;
  }
}
</style>
