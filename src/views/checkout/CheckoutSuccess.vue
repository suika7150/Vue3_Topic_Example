<template>
  <div class="success-container">
    <el-result
      icon="success"
      title="訂單已建立成功！"
      sub-title="感謝您的購買，我們將盡快為您安排出貨。"
    >
      <template #extra>
        <div class="order-info">
          <p>
            訂單編號：<strong>{{ orderId }}</strong>
          </p>
        </div>

        <div class="btn-group">
          <el-button type="primary" @click="goOrderList">查看我的訂單</el-button>
          <el-button @click="goHome">返回首頁</el-button>
        </div>
      </template>
    </el-result>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const orderId = ref('')

onMounted(() => {
  // 從網址路徑 /checkout/success/:orderId 取得 ID
  orderId.value = route.params.orderId
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
  padding: 80px 0;
  max-width: 800px;
  margin: 0 auto;
}
.order-info {
  margin-bottom: 30px;
  font-size: 18px;
  color: #606266;
}
/*  */
.btn-group {
  display: flex;
  gap: 15px;
  justify-content: center;
}
</style>
