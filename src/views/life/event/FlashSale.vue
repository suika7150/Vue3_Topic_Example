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
  /* justify-content: center; */
  /* gap: 10px; */
  margin-bottom: 40px;
  perspective: 1000px; /* 創造 3D 視角 */
}

/* 翻轉卡片容器 */
.flip-card {
  background-color: transparent;
  width: 45%; /* 調整卡片寬度 */
  height: 250px; /* 卡片高度 */
  border: 1px solid #f1f1f1;
  border-radius: 15px;
  cursor: pointer;
}

/* 翻轉卡片內層，用於實際翻轉動畫 */
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s; /* 翻轉動畫時長 */
  transform-style: preserve-3d; /* 讓子元素能在 3D 空間中呈現 */
  border-radius: 15px;
}

/* 滑鼠移入時翻轉 */
.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

/* 卡片正面與背面 */
.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* 隱藏背面 */
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  color: white; /* 內部文字為白色 */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* 卡片背面預設翻轉 180 度 */
.flip-card-back {
  transform: rotateY(180deg);
}

/* 綠色卡片樣式 */
.green-card {
  background: linear-gradient(145deg, #4caf50 0%, #388e3c 100%); /* 綠色漸層 */
  box-shadow: 0 5px 15px rgba(76, 175, 80, 0.4);
}

/* 橘色卡片樣式 */
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

/* 倒數計時框的調整，讓它在綠色卡片中看起來更和諧 */
.countdown-box {
  background: rgba(0, 0, 0, 0.4); /* 半透明黑，與綠色背景融合 */
  padding: 10px 20px;
  border-radius: 8px;
  display: inline-block;
  margin-top: 10px;
}

/* 隱藏 Element Plus 預設的標題 */
:deep(.el-statistic__head) {
  display: none;
}

/* 下方促銷資訊 */
.promo-info {
  text-align: center;
  margin-bottom: 30px;
}

.promo-info p {
  font-size: 24px;
}
</style>
