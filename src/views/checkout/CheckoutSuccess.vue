<template>
  <div class="checkout-success-page">
    <div class="container">
      <div class="success-card">
        <h1 class="title">🎉 訂單成立成功！</h1>
        <p class="message">感謝您的購買，我們已收到您的訂單。</p>
        <p class="order-id">
          訂單編號：<strong>{{ orderId }}</strong>
        </p>

        <div class="actions">
          <el-button type="primary" @click="goHome">返回首頁</el-button>
          <el-button type="success" @click="goOrderDetail">查看訂單</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useNavigation } from '@/composables/useNavigation.js'

const route = useRoute()
const { goTo } = useNavigation()
// const router = useRouter()

// 從路由參數拿 orderId
const orderId = route.params.orderId || 'N/A'

const goHome = () => {
  goTo('home')
}

const goOrderDetail = () => {
  goTo('orderDetail', { orderId })
}
</script>

<style scoped>
.checkout-success-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 32px 16px;
}

.success-card {
  text-align: center;
  padding: 32px;
  border-radius: 8px;
  background-color: #f9fafb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 16px;
}

.message {
  font-size: 16px;
  color: #4b5563;
  margin-bottom: 8px;
}

.order-id {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 24px;
}

.actions > * {
  margin: 0 8px;
}
</style>
