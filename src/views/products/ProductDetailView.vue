<template>
  <div class="product-detail-view">
    <div v-if="isLoading" class="loading-state">
      <el-skeleton style="width: 1000px" animated>
        <template #template>
          <div class="skeleton-layout">
            <el-skeleton-item variant="image" class="skeleton-image" />
            <div class="skeleton-content">
              <el-skeleton-item variant="h1" style="width: 50%" />
              <el-skeleton-item variant="text" style="width: 30%" />
              <el-skeleton-item variant="text" style="width: 100%" />
              <el-skeleton-item variant="text" style="width: 100%" />
              <el-skeleton-item variant="text" style="width: 80%" />
              <el-skeleton-item variant="h3" style="width: 20%; margin-top: 16px" />
              <el-skeleton-item
                variant="button"
                style="width: 100%; height: 40px; margin-top: 24px"
              />
            </div>
          </div>
        </template>
      </el-skeleton>
    </div>

    <el-card v-else-if="product" class="detail-card">
      <el-row :gutter="40">
        <el-col :span="12">
          <img
            :src="product.imageBase64"
            :alt="product.name"
            class="detail-image"
            @error="handleImageError"
          />
        </el-col>

        <el-col :span="12">
          <h1 class="product-name">{{ product.name }}</h1>
          <p class="product-category">{{ product.category }}</p>

          <el-rate v-model="product.rating" disabled show-score :max="5" class="product-rating" />

          <el-divider />

          <div class="price-section">
            <span class="product-price-label">價格:</span>
            <span class="product-price">$ {{ product.price }}</span>
          </div>

          <p class="product-description-label">商品描述:</p>
          <p class="product-description">{{ product.description }}</p>

          <el-button
            type="primary"
            size="large"
            class="add-to-cart-btn"
            :icon="ShoppingCart"
            @click="addToCart(product)"
          >
            加入購物車
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-empty v-else description="找不到該商品或載入失敗"></el-empty>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import api from '@/service/api'
import { useCartStore } from '@/store/cartStore'
import { ShoppingCart } from '@element-plus/icons-vue' // 引入購物車圖標

const route = useRoute()
const cartStore = useCartStore()

const product = ref(null)
const isLoading = ref(true)

/**
 * 根據路由參數中的 ID 獲取商品詳情
 */
const fetchProductDetail = async () => {
  const productId = route.params.id // 從路由中獲取商品 ID
  if (!productId) {
    ElMessage.error('缺少商品 ID')
    isLoading.value = false
    return
  }

  isLoading.value = true
  try {
    // 假設你的 API 有一個通過 ID 獲取單個商品的接口
    const res = await api.getProductDetail(productId)

    if (res.code === '0000' && res.result) {
      product.value = res.result
    } else {
      product.value = null
      ElMessage.warning(`找不到 ID 為 ${productId} 的商品。`)
    }
  } catch (err) {
    console.error('載入商品詳情失敗:', err)
    ElMessage.error('載入商品詳情失敗，請稍後再試。')
    product.value = null
  } finally {
    isLoading.value = false
  }
}

/**
 * 將商品加入購物車
 */
const addToCart = (productToAdd) => {
  const existingItem = cartStore.cart.find((item) => item.id === productToAdd.id)
  if (existingItem) {
    existingItem.quantity += 1
    ElMessage.success(`${productToAdd.name} 數量已更新為 ${existingItem.quantity}`)
  } else {
    cartStore.addProduct(productToAdd)
    ElMessage.success(`${productToAdd.name} 已加入購物車`)
  }
  // 可以選擇是否打開購物車抽屜
  // openCartDrawer()
}

/**
 * 圖片載入失敗時的處理
 */
const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/600x400?text=無法載入'
}

onMounted(() => {
  fetchProductDetail()
})
</script>

<style scoped>
.product-detail-view {
  max-width: 1000px;
  margin: 40px auto;
  padding: 20px;
}

.loading-state,
.detail-card,
.el-empty {
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 骨架屏樣式 */
.skeleton-layout {
  display: flex;
  gap: 40px;
  width: 100%;
}
.skeleton-image {
  flex: 1;
  height: 400px;
}
.skeleton-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 商品卡片與內容 */
.detail-image {
  width: 100%;
  height: auto;
  max-height: 450px;
  object-fit: contain;
  border-radius: 4px;
}

.product-name {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #303133;
}

.product-category {
  font-size: 16px;
  color: #909399;
  margin-bottom: 16px;
}

.product-rating {
  margin-bottom: 20px;
}

.price-section {
  display: flex;
  align-items: baseline;
  margin-bottom: 20px;
}

.product-price-label {
  font-size: 18px;
  color: #606266;
  margin-right: 10px;
}

.product-price {
  font-size: 36px;
  font-weight: 700;
  color: #cf1322; /* 醒目紅色 */
}

.product-description-label {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-top: 16px;
  margin-bottom: 8px;
}

.product-description {
  font-size: 15px;
  line-height: 1.6;
  color: #606266;
  margin-bottom: 30px;
}

.add-to-cart-btn {
  width: 100%;
  margin-top: 10px;
}
</style>
