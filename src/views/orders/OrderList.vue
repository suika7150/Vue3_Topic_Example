<template>
  <div class="order-list-page">
    <div class="container">
      <div class="header-section">
        <h1>📦 我的訂單</h1>
        <p class="subtitle">追蹤您的購買紀錄與物流狀態</p>
      </div>

      <el-tabs v-model="activeTab" class="modern-tabs" @tab-change="handleTabChange">
        <el-tab-pane label="全部訂單" name="all" />
        <el-tab-pane label="待付款" name="unpaid" />
        <el-tab-pane label="處理中" name="processing" />
        <el-tab-pane label="已出貨" name="shipped" />
        <el-tab-pane label="已完成" name="completed" />
      </el-tabs>

      <div v-loading="loading" class="order-content">
        <el-empty v-if="orders.length === 0 && !loading" description="目前沒有相關訂單">
          <el-button type="primary" size="large" @click="goProducts">去逛逛商品</el-button>
        </el-empty>

        <div v-else class="order-cards">
          <div v-for="order in orders" :key="order.id" class="wide-order-card">
            <div class="card-header">
              <div class="order-meta">
                <span class="order-id">訂單編號：#{{ order.merchantTradeNo || order.id }}</span>
              </div>

              <div class="order-time-info">
                <span class="label">訂單時間：</span>
                <span class="time">{{ order.createdAt }}</span>
              </div>
              <div class="order-status-group">
                <el-tag :type="getStatusTag(order.paymentStatus)" effect="plain" class="status-tag">
                  {{ getStatusText(order.paymentStatus) }}
                </el-tag>
                <el-link
                  v-if="order.trackingUrl"
                  :href="order.trackingUrl"
                  target="_blank"
                  type="primary"
                  class="track-link"
                >
                  <el-icon><Ship /></el-icon> 追蹤物流
                </el-link>
              </div>
            </div>

            <div class="card-body">
              <div
                class="delivery-estimate"
                v-if="
                  order.paymentStatus === 'pending' ||
                  order.paymentStatus === 'paid' ||
                  order.paymentStatus === 'shipped'
                "
              ></div>

              <div class="product-row">
                <div
                  v-for="(item, index) in order.items?.slice(0, 4)"
                  :key="index"
                  class="product-item"
                >
                  <el-image :src="item.productImage" fit="cover" class="product-img" lazy>
                    <template #error>
                      <div class="image-slot">
                        <el-icon><Picture /></el-icon>
                      </div>
                    </template>
                  </el-image>
                  <div class="item-info">
                    <p class="name">{{ item.name }}</p>
                    <p class="qty">x {{ item.quantity }}</p>
                  </div>
                </div>

                <div
                  v-if="order.items?.length > 4"
                  class="more-items-card"
                  @click="goOrderDetail(order.id)"
                >
                  <span class="count">+{{ order.items.length - 4 }}</span>
                  <span class="label">查看更多</span>
                </div>
              </div>
            </div>

            <div class="card-footer">
              <div class="info-group">
                <div class="shipping-info">
                  <el-tag
                    size="small"
                    :type="getShippingTagType(order.shippingMethod)"
                    effect="light"
                    >配送方式 :
                    {{ getShippingMethodText(order.shippingMethod) }}
                  </el-tag>
                  <span class="item-count">
                    共 {{ order.items?.reduce((sum, i) => sum + i.quantity, 0) || 0 }} 項商品
                  </span>
                </div>

                <div class="amount-delivery-row">
                  <div class="price-item total">
                    <span class="label">總計</span>
                    <span class="price">NT$ {{ order.total.toLocaleString() }}</span>
                  </div>

                  <div class="delivery-info-inline" v-if="order.paymentStatus !== 'completed'">
                    <el-icon><Calendar /></el-icon>
                    <span>預計到貨日：{{ getEstimatedArrival(order) }}</span>
                  </div>
                </div>
              </div>
              <div class="action-buttons">
                <el-button size="large" @click="goOrderDetail(order.id)">查看詳情</el-button>
                <el-button v-if="order.paymentStatus === 'pending'" type="primary" size="large"
                  >立即付款</el-button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNavigation } from '@/composables/useNavigation'
import api from '@/service/api'
import { formatDate } from '@/utils/format'
import { Ship, Calendar, Picture } from '@element-plus/icons-vue'
import format from '@/plugins/format'

const { goHome, goProducts, goOrderDetail } = useNavigation()

const activeTab = ref('all')
const loading = ref(false)
const orders = ref([])

const statusMap = {
  unpaid: 'pending', // 後端 createOrder 初始狀態
  processing: 'paid', // 處理中
  shipped: 'shipped', // 已出貨
  completed: 'completed', // 已完成
}

// 訂單配送方式 checkout.vue 內定義
const shippingMethodMap = {
  HOME_DELIVERY: '宅配到府',
  CVS_711: '7-11 取貨',
  CVS_FAMILY: '全家取貨',
  STORE_PICKUP: '到店自取',
}

// 轉換配送方式顯示文字
const getShippingMethodText = (method) => {
  return shippingMethodMap[method] || method || '宅配到府'
}

// 取得訂單資料
const fetchOrders = async (tabName = 'all') => {
  loading.value = true
  try {
    const params = {}
    // 如果不是全部訂單，就帶入對應的狀態參數
    if (tabName !== 'all') {
      const backendStatus = statusMap[tabName]
      if (backendStatus) {
        params.status = backendStatus
      } else {
        console.debug(`[訂單] 找不到「${tabName}」`)
      }
    }

    const response = await api.getOrderList(params)

    if (response && response.code === '0000') {
      orders.value = response.result || []
    }
  } catch (error) {
    console.debug('獲取列表失敗:', error)
  } finally {
    loading.value = false
  }
}

const handleTabChange = (tabName) => {
  fetchOrders(tabName)
}

// 訂單配送天數
const deliveryDayMap = {
  HOME_DELIVERY: 5,
  CVS_711: 7,
  CVS_FAMILY: 7,
  STORE_PICKUP: 2,
}

// 預計到貨日
const getEstimatedArrival = (order) => {
  const createdAt = order.createdAt
  if (!createdAt) return '計算中...'

  const date = new Date(createdAt)
  if (Number.isNaN(date.getTime())) return '待確認'

  const deliveryDayDays = deliveryDayMap[order.shippingMethod] || 3
  date.setDate(date.getDate() + deliveryDayDays)

  return formatDate(date)
}

const getStatusTag = (status) => {
  const tagMap = {
    pending: 'danger', // 待付款紅色
    paid: 'success', // 已付款綠色
    shipped: 'warning', // 已出貨黃色
    completed: 'info', // 已完成灰色
    expired: 'info', // 已失效灰色
  }
  return tagMap[status] || ''
}

// 將狀態碼轉換為中文顯示
const getStatusText = (status) => {
  const statusCode = status ? status.toLowerCase() : '' // 先轉小寫
  const textMap = {
    pending: '未付款',
    paid: '已付款',
    shipped: '已出貨',
    completed: '已完成',
    expired: '已失效',
  }
  if (!textMap[statusCode] && statusCode !== '') {
    console.debug(`狀態轉換失敗！收到未知的狀態碼: "${statusCode}"`)
  }
  return textMap[statusCode] || status
}

const getShippingTagType = (method) => {
  const methodMap = {
    超商取貨: 'success',
    宅配到府: 'warning',
    到店取貨: 'danger',
  }
  return methodMap[method] || 'info'
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.order-list-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
}

.header-section {
  margin-bottom: 40px;
}

.header-section h1 {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
}

.subtitle {
  color: #86868b;
  font-size: 16px;
  margin-top: 10px;
}

.modern-tabs :deep(.el-tabs__item) {
  font-size: 16px;
  font-weight: 500;
  height: 50px;
  line-height: 10px;
}

.modern-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.modern-tabs :deep(.el-tabs__active-bar) {
  height: 2px;
  border-radius: 2px;
}

.order-tabs {
  margin-bottom: 30px;
}

/* 訂單卡片 */
.wide-order-card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  margin-bottom: 30px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  transition: box-shadow 0.3s ease;
}

.wide-order-card:hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
}

/* 卡片頭部 */
.card-header {
  padding: 20px 30px;
  background: #fafafa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f2;
}

.order-meta {
  display: flex;
  flex-direction: column;
  gap: 0px;
  font-size: 15px;
}

.order-date {
  color: #1d1d1f;
  font-weight: 600;
  width: 180px;
}

.order-id {
  font-size: 14px;
  color: #86868b;
}

.order-status-group {
  display: flex;
  align-items: center;
  gap: 15px;
}

.status-tag {
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 20px;
}

.track-link {
  font-size: 14px;
}

/* 卡片主體 */
.card-body {
  padding: 30px;
}

.delivery-estimate {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 20px;
}

/* 單個商品項目 */
.product-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: nowrap;
}

/* 單個商品項目 */
.product-item {
  display: flex;
  align-items: center;
  overflow-x: visible;
  gap: 10px;
  min-width: 240px;
  flex: 0 0 auto;
}

/* 商品圖片 */
.product-img {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  flex-shrink: 0;
  object-fit: cover;
  border: 1px solid #eee;
}

/* 商品信息 */
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #a8abb2;
}

/* 商品信息 */
.item-info .name {
  font-size: 15px;
  font-weight: 500;
  color: #1d1d1f;
  margin: 0 0 5px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 商品信息 */
.item-info .qty {
  font-size: 13px;
  color: #86868b;
  margin: 0;
}

/* 查看更多商品 */
.more-items-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 64px;
  border-radius: 8px;
  background-color: #f8f9fa;
  color: #86868b;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s;
}

/* 查看更多商品 */
.more-items-card:hover {
  background-color: #edf2f7;
  border-color: #cbd5e1;
}

/* 查看更多商品 */
.more-items-card .count {
  font-size: 18px;
  font-weight: 700;
}

/* 查看更多商品 */
.more-items-card .label {
  font-size: 12px;
}

/* 卡片底部 */
.card-footer {
  padding: 25px 30px;
  border-top: 1px solid #f0f0f2;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.price-item {
  display: flex;
  width: 220px;
  font-size: 14px;
  color: #86868b;
}

.price-item.total {
  display: flex;
  align-items: baseline;
  justify-content: flex-start;
  width: auto;
  gap: 15px;
  font-size: 16px;
  color: #1d1d1f;
  font-weight: 600;
  border-top: 1px solid #e5e7eb;
  padding-top: 10px;
  margin-top: 5px;
}

.price-item .price {
  transform: none;
  font-size: 24px;
  line-height: 1;
  color: #f97316;
}

/* 預計到貨日 */
.delivery-info-inline {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #0369a1;
  font-size: 16px;
  background-color: #f0f9ff;
  padding: 4px 12px;
  border-radius: 6px;
  margin-bottom: 2px;
}

.action-buttons {
  display: flex;
  gap: 15px;
}
.info-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.shipping-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 配送方式 */
.shipping-info .el-tag {
  font-size: 14px;
  padding: 8px 16px;
  height: auto;
  font-weight: 500;
  border-width: 1.5px;
  border-radius: 8px;
}

/* 配送方式 */
.shipping-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 5px;
}

/* 配送方式 */
.item-count {
  font-size: 15px;
  color: #636e72;
}

.item-count {
  font-size: 14px;
  color: #86868b;
  font-weight: 500;
}

.order-time-info {
  font-size: 14px;
  color: #a1a1a6;
}

.amount-delivery-row {
  display: flex;
  align-items: flex-end;
  gap: 30px;
  margin-top: 10px;
}

.total-amount {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: 4px;
  padding-top: 12px;
  border-top: 1px solid #f2f2f7;
}

.total-amount .label {
  font-size: 14px;
  color: #1d1d1f;
  font-weight: 500;
}

.total-amount .price {
  font-size: 28px;
  font-weight: 700;
  color: #ff3b30;
}

.action-buttons {
  display: flex;
  gap: 12px;
  align-self: flex-end;
}
</style>
