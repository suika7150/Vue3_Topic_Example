<template>
  <div class="recommend-column">
    <div class="recommend-card">
      <h2 class="recommend-title">為您推薦</h2>
      <div class="recommend-list">
        <div v-for="product in recommendedProducts" :key="product.id" class="recommend-item">
          <img :src="product.image" class="rec-image" />
          <div class="rec-info">
            <div class="rec-name">{{ product.name }}</div>
            <div class="rec-price">NT$ {{ product.price }}</div>
            <el-button size="small" type="primary" plain @click="addToCart(product)">
              加入購物車
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 這裡可以放模擬資料，或是之後改成從 API 取得
const recommendedProducts = ref([
  { id: 101, name: '質感陶瓷杯', price: 350, image: 'https://via.placeholder.com/60' },
  { id: 102, name: '極簡筆記本', price: 120, image: 'https://via.placeholder.com/60' },
])
</script>

<style scoped>
.recommend-card {
  background-color: #ffffff;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}
.recommend-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}
.recommend-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: center;
}
.rec-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}
.rec-name {
  font-size: 14px;
  font-weight: 500;
}
.rec-price {
  color: #f97316;
  font-size: 14px;
  margin-bottom: 4px;
}
</style>
