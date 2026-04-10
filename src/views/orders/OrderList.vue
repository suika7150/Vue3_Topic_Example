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
                <span class="order-date">{{ order.createTime }}</span>
                <span class="order-id">訂單編號：#{{ order.merchantTradeNo || order.id }}</span>
              </div>
              <div class="order-status-group">
                <el-tag :type="getStatusTag(order.status)" effect="plain" class="status-tag">
                  {{ order.statusText }}
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
              <div class="product-row">
                <div v-for="item in order.items.slice(0, 4)" :key="item.id" class="product-item">
                  <el-image :src="item.productImage" class="product-img" fit="cover" />
                  <div class="item-info">
                    <p class="name">{{ item.productName }}</p>
                    <p class="qty">x {{ item.quantity }}</p>
                  </div>
                </div>
                <div v-if="order.items.length > 4" class="more-items-card">
                  <span class="count">+ {{ order.items.length - 4 }}</span>
                  <span class="label">更多商品...</span>
                </div>
              </div>
            </div>

            <div class="card-footer">
              <div class="summary-group">
                <div class="price-item">
                  <span class="label">商品小計</span>
                  <span class="value">NT$ {{ order.subtotal.toLocaleString() }}</span>
                </div>
                <div class="price-item total">
                  <span class="label">總計</span>
                  <span class="value price">NT$ {{ order.total.toLocaleString() }}</span>
                </div>
              </div>
              <div class="action-buttons">
                <el-button size="large" @click="goOrderDetail(order.id)">查看詳情</el-button>
                <el-button v-if="order.status === 'unpaid'" type="primary" size="large"
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
import { Ship } from '@element-plus/icons-vue'

const { goHome, goProducts, goOrderDetail } = useNavigation()

const activeTab = ref('all')
const loading = ref(false)
const orders = ref([])

// 取得訂單資料 (需配合後端)
const fetchOrders = async (status = 'all') => {
  loading.value = true
  try {
    const response = await api.getOrders({ status })
    orders.value = response.result || []
  } catch (error) {
    console.error('獲取訂單失敗:', error)
    mockData() // 測試環境下 API 未好，先給 mock 資料
  } finally {
    loading.value = false
  }
}

const handleTabChange = (tabName) => {
  fetchOrders(tabName)
}

const getStatusTag = (status) => {
  const statusMap = {
    unpaid: 'danger',
    processing: 'warning',
    shipped: 'info',
    completed: 'success',
  }
  return statusMap[status] || ''
}

// 模擬資料 (開發測試用)
const mockData = () => {
  orders.value = [
    {
      id: 1,
      merchantTradeNo: 'SP2604101430001',
      createTime: '2026-04-10 14:30',
      status: 'completed',
      statusText: '已完成',
      subtotal: 1200,
      total: 1280,
      trackingUrl: '#',
      items: [
        {
          id: 101,
          productName: '太空系列帽T - 時尚黑',
          quantity: 1,
          productImage: 'https://via.placeholder.com/100x120?text=Hoodie',
        },
        {
          id: 102,
          productName: '復古運動鞋 - 紅白藍',
          quantity: 1,
          productImage: 'https://via.placeholder.com/100x120?text=Sneakers',
        },
        {
          id: 103,
          productName: '機能側背包',
          quantity: 1,
          productImage: 'https://via.placeholder.com/100x120?text=Bag',
        },
      ],
    },
    {
      id: 2,
      createTime: '2026-04-09 10:15',
      status: 'shipped',
      statusText: '已出貨',
      subtotal: 800,
      total: 880,
      trackingUrl: 'https://www.t-cat.com.tw/',
      items: [
        {
          id: 104,
          productName: '電競滑鼠墊 - 霓虹',
          quantity: 1,
          productImage: 'https://via.placeholder.com/100x120?text=MousePad',
        },
      ],
    },
  ]
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.order-list-page {
  background-color: #f8f9fa; /* 淺灰背景，襯托白色卡片 */
  min-height: 100vh;
}

.container {
  max-width: 1200px; /* 這裡設定最大寬度，跟詳情頁面對齊 */
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

/* --- 大尺寸狀態標籤 --- */
.modern-tabs :deep(.el-tabs__item) {
  font-size: 16px;
  font-weight: 500;
  height: 50px;
  line-height: 50px;
}

.order-tabs {
  margin-bottom: 30px;
}

/* --- 寬幅訂單卡片 --- */
.wide-order-card {
  background: #fff;
  border-radius: 16px; /* 更圓潤的角 */
  border: 1px solid #e5e7eb;
  margin-bottom: 30px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  transition: box-shadow 0.3s ease;
}

.wide-order-card:hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06); /* 滑過時有浮起感 */
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
  gap: 20px;
  font-size: 15px;
}

.order-date {
  color: #1d1d1f;
  font-weight: 600;
}

.order-id {
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

.product-row {
  display: flex;
  gap: 20px;
  flex-wrap: nowrap; /* 確保商品橫向排列不換行 */
  overflow-x: auto; /* 若商品太多可橫向滾動 */
  padding-bottom: 10px; /* 留給滾動條的空間 */
}

.product-item {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 250px; /* 限制單個商品的最小寬度 */
  flex: 0 0 auto;
}

.product-img {
  width: 100px;
  height: 120px;
  border-radius: 8px;
  border: 1px solid #f0f0f2;
}

.item-info .name {
  font-size: 15px;
  font-weight: 500;
  color: #1d1d1f;
  margin: 0 0 5px 0;
  display: -webkit-box; /* 限制兩行 */
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-info .qty {
  font-size: 13px;
  color: #86868b;
  margin: 0;
}

/* 更多商品卡片 */
.more-items-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 120px;
  border-radius: 8px;
  background-color: #f8f9fa;
  color: #86868b;
  border: 1px solid #e5e7eb;
}

.more-items-card .count {
  font-size: 24px;
  font-weight: 700;
}

.more-items-card .label {
  font-size: 12px;
}

/* 卡片底部 */
.card-footer {
  padding: 25px 30px;
  border-top: 1px solid #f0f0f2;
  display: flex;
  justify-content: space-between;
  align-items: flex-end; /* 對齊按鈕底部 */
}

.summary-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.price-item {
  display: flex;
  justify-content: space-between;
  width: 220px;
  font-size: 14px;
  color: #86868b;
}

.price-item.total {
  font-size: 16px;
  color: #1d1d1f;
  font-weight: 600;
  border-top: 1px solid #e5e7eb;
  padding-top: 10px;
  margin-top: 5px;
}

.price-item .price {
  font-size: 24px;
  color: #f97316;
}

.action-buttons {
  display: flex;
  gap: 15px;
}
</style>
