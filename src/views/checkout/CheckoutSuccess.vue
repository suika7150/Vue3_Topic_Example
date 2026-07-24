<template>
  <div class="success-container">
    <div class="success-card">
      <el-result
        icon="success"
        title="訂單已建立成功！"
        sub-title="感謝您的購買，我們將盡快為您安排出貨。"
      >
        <template #extra>
          <div class="order-info">
            <span class="info-label">訂單編號</span>
            <div class="order-id-badge">
              <strong>{{ orderId }}</strong>
            </div>
          </div>

          <div class="btn-group">
            <el-button type="primary" size="large" class="btn-primary" @click="goOrderList">
              查看我的訂單</el-button
            >
            <el-button size="large" class="btn-secondary" @click="goHome">返回首頁</el-button>
          </div>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/store/cartStore'
import Storage, { CART_KEY } from '@/utils/storageUtil'

const route = useRoute()
const router = useRouter()
const orderId = ref('')
const cartStore = useCartStore()

onMounted(() => {
  orderId.value = route.params.orderId
  cartStore.clearCart()
  Storage.remove(CART_KEY)
})

const goOrderList = () => {
  router.push('/orders/list')
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.success-container {
  padding: 60px 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 40px 60px;
  width: 100%;
  max-width: 600px;
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.04),
    0 2px 8px rgba(0, 0, 0, 0.02);
  border: 1px solid #f0f2f5;
  transition: transform 0.3s ease;
}
.order-info {
  margin: 20px 0 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.info-label {
  font-size: 13px;
  color: #909399;
  letter-spacing: 1px;
}

.order-id-badge {
  background-color: #f4f4f5;
  border: 1px solid #e9e9eb;
  color: #303133;
  padding: 10px 24px;
  border-radius: 30px;
  font-size: 18px;
  font-family: 'Microsoft JhengHei', sans-serif;
  letter-spacing: 0.5px;
}

.btn-group {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.btn-primary {
  padding: 12px 32px;
  font-weight: 500;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.btn-secondary {
  padding: 12px 32px;
  border-radius: 8px;
  color: #606266;
  border: 1px solid #dcdfe6;
}

:deep(.el-result__title p) {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-top: 10px;
}

:deep(.el-result__subtitle p) {
  font-size: 15px;
  color: #73767a;
}

@media (max-width: 1024px) {
  .success-card {
    padding: 30px 20px;
  }

  .btn-group {
    flex-direction: column-reverse;
    gap: 12px;
    width: 100%;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    padding: 12px 0;
    margin: 0;
    box-sizing: border-box;
  }
}
</style>
