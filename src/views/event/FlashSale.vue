<template>
  <div class="flash-sale-page">
    <div class="header-banner-container">
      <div class="flip-card">
        <div class="flip-card-inner">
          <div class="flip-card-front green-card">
            <h3>⚡ 距離特惠結束還剩</h3>

            <div class="countdown-box">
              <el-countdown
                :value="deadline"
                format="HH:mm:ss"
                value-style="color: #ffffff; font-size: 40px; font-weight: bold;"
              />
            </div>
            <p class="card-slogan">每日限時，把握時機！</p>
          </div>
          <div class="flip-card-back green-card">
            <h3>🎁 每日隨機禮</h3>
            <p>消費滿額即贈多重好禮！</p>
            <el-button type="warning" plain>立即抽獎</el-button>
          </div>
        </div>
      </div>

      <div class="flip-card">
        <div class="flip-card-inner">
          <div class="flip-card-front orange-card">
            <h3>🔥 每日隨機票券</h3>
            <p>領取一張多重抵薪！</p>
            <el-button type="primary" plain>立即領取</el-button>
          </div>
          <div class="flip-card-back orange-card">
            <h3>✨ 會員專屬</h3>
            <p>登入會員，享更多優惠！</p>
            <el-button type="info" plain>前往登入</el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="promo-info">
      <el-tag type="danger" effect="dark" size="large">限時下殺</el-tag>
      <p>每週一中午更新，搶完為止！</p>
    </div>

    <ProductList forced-category="特惠" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ProductList from '@/views/products/ProductList.vue'

// 公式：1000ms * 60s * 60m * 2小時
const deadline = ref(Date.now() + 1000 * 60 * 60 * 24)
</script>

<style scoped>
.flash-sale-page {
  padding: 20px;
  background: #fdfdfd;
}

.header-banner-container {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 40px;
  perspective: 1000px;
  flex-wrap: warp;
}

.flip-card {
  background-color: transparent;
  width: 45%;
  min-width: 300px;
  height: 250px;
  border: 1px solid #f1f1f1;
  border-radius: 15px;
  cursor: pointer;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  border-radius: 15px;
}

.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

/* 卡片正面與背面 */
.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  color: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* 翻轉 180 度 */
.flip-card-back {
  transform: rotateY(180deg);
}

/* 綠卡樣式 */
.green-card {
  background: linear-gradient(145deg, #4caf50 0%, #388e3c 100%); /* 綠色漸層 */
  box-shadow: 0 5px 15px rgba(76, 175, 80, 0.4);
}

/* 橘卡樣式 */
.orange-card {
  background: linear-gradient(145deg, #ffc107 0%, #ffa000 100%); /* 橘色漸層 */
  box-shadow: 0 5px 15px rgba(255, 193, 7, 0.4);
}

.flip-card h3 {
  font-size: 24px;
  margin-bottom: 10px;
}

.flip-card p {
  font-size: 16px;
  margin-bottom: 20px;
}

.countdown-box {
  background: rgba(0, 0, 0, 0.4);
  padding: 10px 20px;
  border-radius: 8px;
  display: inline-block;
  margin-top: 10px;
  max-width: 90%;
}

:deep(.el-statistic__head) {
  display: none;
}

.promo-info {
  text-align: center;
  margin-bottom: 30px;
}

.promo-info p {
  font-size: 24px;
}

@media (max-width: 1024px) {
  .header-banner-container {
    flex-direction: column; /* 垂直排列 */
    align-items: center;
    gap: 15px;
  }

  .flip-card {
    width: 100%; /* 手機版佔滿寬度 */
    max-width: 400px; /* 但不要太寬，維持美感 */
    height: 220px; /* 高度稍微縮減 */
  }

  .flip-card h3 {
    font-size: 20px; /* 縮小標題 */
  }

  .flip-card p {
    font-size: 14px; /* 縮小內文 */
  }

  .promo-info p {
    font-size: 18px; /* 縮小說明文字 */
  }
}

@media (max-width: 480px) {
  .flip-card {
    height: 200px; /* 極小螢幕再縮減高度 */
  }
}
</style>
