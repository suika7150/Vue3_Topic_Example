<template>
  <div class="order-detail-wrapper">
    <header class="order-header">
      <div class="header-main">
        <h1 class="page-title">訂單詳情</h1>
        <el-tag effect="plain" size="large" type="success" class="status-badge">付款成功</el-tag>
      </div>
      <p class="order-meta">
        訂單編號：<span>{{ route.params.orderId }}</span> / 下單時間：<span>{{
          orderDetail.createdAt || '讀取中...'
        }}</span>
      </p>
    </header>

    <section class="detail-section steps-box">
      <el-steps :active="activeStep" align-center>
        <el-step title="已下單" />
        <el-step title="已付款" />
        <el-step title="出貨中" />
        <el-step title="已送達" />
      </el-steps>
    </section>

    <div class="main-content-layout">
      <div class="left-column">
        <section class="detail-section items-box card-style">
          <h3 class="list-label">🛒 商品清單</h3>
          <div v-for="item in orderItems" :key="item.name" class="product-item">
            <el-image :src="item.productImage" class="item-img" fit="cover" lazy />
            <div class="item-info">
              <h4 class="item-name">{{ item.name }}</h4>
            </div>
            <div class="item-price-qty">
              <span class="unit-price"
                >${{ item.price?.toLocaleString() }} x {{ item.quantity }}</span
              >
              <span class="item-total">${{ (item.price * item.quantity).toLocaleString() }}</span>
            </div>
          </div>
        </section>
      </div>

      <div class="right-column">
        <section class="info-card card-style">
          <h3 class="list-label">👤 收件資訊</h3>
          <ul class="vertical-clean-list">
            <li>
              <span class="label">收件人</span><span class="value">{{ orderDetail.name }}</span>
            </li>
            <li>
              <span class="label">聯絡電話</span><span class="value">{{ orderDetail.phone }}</span>
            </li>
            <li>
              <span class="label">配送地址</span
              ><span class="value text-right">{{ orderDetail.address }}</span>
            </li>
          </ul>
        </section>

        <section class="info-card card-style">
          <h3 class="list-label">💳 付款資訊</h3>
          <ul class="vertical-clean-list">
            <li>
              <span class="label">付款方式</span
              ><span class="value">{{ getPaymentMethodText(orderDetail.paymentMethod) }}</span>
            </li>
            <li>
              <span class="label">備註事項</span
              ><span class="value">{{ orderDetail.notes || '無' }}</span>
            </li>
          </ul>
        </section>

        <section class="summary-card card-style">
          <div class="summary-item">
            <span>小計</span><span>${{ orderDetail.total?.toLocaleString() }}</span>
          </div>
          <div class="summary-item"><span>運費</span><span>$0</span></div>
          <el-divider />
          <div class="summary-item grand-total">
            <span>總計</span>
            <span class="total-price">NT$ {{ orderDetail.total?.toLocaleString() }}</span>
          </div>
        </section>
      </div>
    </div>

    <footer class="action-bar">
      <el-button size="large" @click="goOrderList">返回訂單列表</el-button>
      <el-button type="primary" size="large">聯繫客服</el-button>
    </footer>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { API_ROUTES } from '@/service/apiRoutes'
import api from '@/service/api'

const route = useRoute()
const orderItems = ref([])
const orderDetail = ref({})

const activeStep = computed(() => {
  const status = orderDetail.value.paymentStatus
  const map = {
    pending: 1, // 已下單，待付款
    paid: 2, // 已付款
    shipped: 3, // 出貨中
    completed: 4, // 已送達/完成
  }
  return map[status] || 1
})

// 付款方式
const paymentMethodMap = {
  credit_card: '信用卡付款',
  bank_transfer: '銀行轉帳',
  cash_on_delivery: '貨到付款',
}

const getPaymentMethodText = (method) => {
  return paymentMethodMap[method] || method || '未提供'
}

onMounted(async () => {
  const id = route.params.orderId // 對應 index.js 的 :orderId

  try {
    const res = await api.getOrderDetail(id)
    if (res && res.code === '0000') {
      orderDetail.value = res.result
      orderItems.value = res.result.items || []
    }
  } catch (err) {
    console.debug('API 呼叫失敗，請檢查 API 定義與後端連線:', err)
  }
})

const goOrderList = () => {
  window.history.back()
}
</script>

<style scoped>
.order-detail-wrapper {
  max-width: 1200px;
  margin: 60px auto;
  padding: 40px 60px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(149, 157, 165, 0.1);
}

/* 頂部樣式 */
.order-header {
  margin-bottom: 40px;
}
.header-main {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
}
.page-title {
  font-size: 32px;
  font-weight: 600;
  margin: 0;
}
.order-meta {
  color: #909399;
  font-size: 16px;
}

/* 通用區塊樣式 */
.detail-section {
  margin-bottom: 50px;
}

/* 左右佈局 */
.main-content-layout {
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  gap: 30px;
  align-items: start;
}

/* 卡片風格 */
.card-style {
  background: #fff;
  border-radius: 12px;
  padding: 25px;
  border: 1px solid #eee;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  margin-bottom: 20px;
}

.vertical-clean-list {
  list-style: none;
  padding: 0;
}
.vertical-clean-list li {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column; /* 改為標題在上內容在下，適合窄空間 */
  gap: 4px;
}
.vertical-clean-list .label {
  font-size: 14px;
  color: #909399;
}
.vertical-clean-list .value {
  font-size: 16px;
  color: #303133;
  font-weight: 500;
}

.text-right {
  text-align: left;
}

.list-label {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #303133;
}

/* 資訊並排清單 */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
}
.clean-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.clean-list li {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px dashed #ebeef5;
  font-size: 17px;
}
.clean-list .label {
  color: #909399;
}
.clean-list .value {
  font-weight: 500;
  color: #303133;
}

/* 商品清單 */
.product-item {
  display: flex;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #f2f6fc;
}

.item-img {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  margin-right: 25px;
}
.item-info {
  flex: 1;
}
.item-name {
  font-size: 20px;
  margin: 0 0 8px 0;
}
.item-spec {
  color: #909399;
  font-size: 15px;
}
.item-price-qty {
  text-align: right;
}
.unit-price {
  display: block;
  color: #909399;
  margin-bottom: 5px;
}
.item-total {
  font-size: 20px;
  font-weight: bold;
}

/* 底部總計 */
.order-footer {
  margin-top: 60px;
  padding-top: 30px;
  border-top: 2px solid #303133;
}
.summary-list {
  width: 350px;
  margin-left: auto;
}
.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-size: 18px;
}
.grand-total {
  margin-top: 15px;
  font-weight: bold;
  font-size: 22px;
}

.total-price {
  font-size: 30px;

  color: #f56c6c;
}

.action-bar {
  margin-top: 50px;
  display: flex;
  justify-content: center;
  gap: 20px;
}
</style>
