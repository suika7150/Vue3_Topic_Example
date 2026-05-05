<template>
  <CampaignShell theme="dark" :full="true" bgImage="/layoutImages/campaign-double-eleven.png">
    <template #hero>
      <div class="hero-block">
        <el-tag type="danger" effect="dark" size="large">限時下殺</el-tag>
        <p>每週一中午更新，搶完為止！</p>
      </div>
    </template>

    <div class="flash-sale-main">
      <div class="header-banner-container">
        <div class="flip-card">
          <div class="flip-card-inner">
            <div class="flip-card-front green-card">
              <h3>距離特惠結束還剩</h3>

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
              <h3>每日隨機禮</h3>
              <p>消費滿額即贈多重好禮！</p>
              <el-button type="warning" plain>立即抽獎</el-button>
            </div>
          </div>
        </div>

        <div class="flip-card">
          <div class="flip-card-inner">
            <div class="flip-card-front orange-card">
              <h3>每日隨機票券</h3>
              <p>領取一張多重抵薪！</p>
              <el-button type="primary" plain>立即領取</el-button>
            </div>

            <div class="flip-card-back orange-card">
              <h3>會員專屬</h3>
              <p>登入會員，享更多優惠！</p>
              <el-button type="info" plain>前往登入</el-button>
            </div>
          </div>
        </div>
      </div>

      <ProductList forced-category="特惠" />
    </div>
  </CampaignShell>
</template>

<script setup>
import { ref } from 'vue'
import CampaignShell from '@/layouts/EventLayout.vue'
import ProductList from '@/views/products/ProductList.vue'

// 公式：1000ms * 60s * 60m * 2小時
const deadline = ref(Date.now() + 1000 * 60 * 60 * 24)
</script>

<style scoped>
.flash-sale-main {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 卡片容器 */
.header-banner-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
  flex-wrap: wrap;
  perspective: 1000px;
  width: 100%;
  max-width: 1300px;
}

/* 卡片大小 */
.flip-card {
  width: 45%;
  min-width: 300px;
  height: 250px;
  background-color: transparent;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(6px);
}

/* 卡片翻轉動畫 */
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

.flip-card-front,
.flip-card-back {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  align-items: center;
  border-radius: 15px;
  color: white;
}

/* 卡片翻轉 */
.flip-card-back {
  transform: rotateY(180deg);
}

/* 卡片顏色 */
.green-card {
  background: linear-gradient(135deg, #00c853, #00e676);
}

/* 卡片顏色 */
.orange-card {
  background: linear-gradient(135deg, #ff6f00, #ffca28);
}

.hero-block {
  text-align: center;
  color: white;
  margin-bottom: 30px;
  padding: 20px 0;
}

.hero-block p {
  opacity: 0.8;
  letter-spacing: 1px;
}

@media (max-width: 1024px) {
  .header-banner-container {
    flex-direction: column;
    align-items: center;
  }

  .flip-card {
    width: 100%;
    max-width: 400px;
  }
}
</style>
