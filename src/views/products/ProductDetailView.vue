<template>
  <div class="product-page-container">
    <div class="breadcrumb-wrapper">
      <Breadcrumb />
    </div>

    <section class="product-main-section">
      <el-row :gutter="60">
        <el-col :md="11" :sm="24">
          <div class="gallery-container">
            <el-image :src="product?.imageBase64" class="product-hero-image" fit="contain" />
          </div>
        </el-col>

        <el-col :md="13" :sm="24">
          <div class="purchase-info">
            <span class="category-tag">{{ product?.category }}</span>
            <h1 class="product-title">{{ product?.name }}</h1>

            <div class="price-wrapper">
              <span class="price-label">NT</span>
              <span class="price-symbol">$</span>
              <span class="price-value">{{ product?.price?.toLocaleString() }}</span>
            </div>

            <div class="shipping-info">
              <Icon icon="lucide:truck" style="vertical-align: middle; margin-right: 8px" />
              <span>滿 $1000 免運費 | 24小時快速到貨</span>
            </div>

            <el-divider />

            <div class="spec-selection">
              <div class="qty-row">
                <span class="spec-label">數量：</span>
                <el-input-number
                  v-model="buyQty"
                  :min="1"
                  :max="product?.stock || 99"
                  controls-position="right"
                  size="large"
                />
                <span class="stock-hint" v-if="product?.stock">
                  (庫存剩餘 {{ product.stock }} 件)</span
                >
              </div>
            </div>

            <div class="button-group">
              <el-button class="btn-add-cart" size="large" @click="addToCart(product)">
                加入購物車
              </el-button>
              <el-button type="danger" class="btn-buy-now" size="large" @click="buyNow">
                立即結帳
              </el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </section>

    <section class="product-tabs-section">
      <el-tabs v-model="activeTab" class="custom-tabs">
        <el-tab-pane label="商品詳情" name="desc">
          <div class="detail-content">
            <div class="text-desc">{{ product?.description }}</div>
            <img v-if="product?.imageBase64" :src="product?.imageBase64" class="promo-image" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="規格參數" name="spec">
          <div class="spec-table">
            <div class="spec-item">
              <span>品牌</span><span>{{ product?.brand || '官方正品' }}</span>
            </div>
            <div class="spec-item">
              <span>型號</span><span>{{ product?.id }}</span>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="售後服務" name="service">
          <p>本商品享有 7 天鑑賞期...</p>
        </el-tab-pane>
      </el-tabs>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Van } from '@element-plus/icons-vue'
import api from '@/service/api'
import Breadcrumb from '@/Navigation/Breadcrumb.vue'
import { useCartStore } from '@/store/cartStore'
import { useNavigation } from '@/composables/useNavigation'
// import { ShoppingCart } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const { goCheckout } = useNavigation()

const product = ref(null)
const isLoading = ref(true)
const buyQty = ref(1)
const activeTab = ref('desc') //預設顯示商品詳情

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
    const res = await api.getProductInfo(productId)
    if (res.code === '0000' && res.result) {
      product.value = res.result
    } else {
      product.value = null
      ElMessage.warning(`找不到 ID 為 ${productId} 的商品。`)
    }
  } catch (err) {
    console.debug('載入商品詳情失敗:', err)
    ElMessage.error('載入商品詳情失敗，請稍後再試。')
    product.value = null
  } finally {
    isLoading.value = false
  }
}

/* 將商品加入購物車 */
const addToCart = (productToAdd) => {
  //檢查是否已經有該商品
  const existingItem = cartStore.cart.find((item) => item.id === productToAdd.id)

  if (existingItem) {
    // 如果存在，加上使用者目前選擇的購買數量
    existingItem.quantity += buyQty.value
    ElMessage.success(`${productToAdd.name} 數量已更新為 ${existingItem.quantity}`)
  } else {
    cartStore.addProduct({
      ...productToAdd,
      quantity: buyQty.value,
    })
    ElMessage.success(`${productToAdd.name} 已加入購物車`)
  }
  cartStore.drawerVisible = true // 開啟購物車抽屜
}

/**
 * 立即結帳：加入目前選擇的數量並跳轉
 */
const buyNow = (productToBuy) => {
  // 檢查商品資料是否存在
  if (!product.value) return

  // 呼叫 Store 把東西塞進購物車
  // 這裡直接用 product.value，不要從 HTML 傳 item 進來
  cartStore.addProduct({
    ...product.value,
    quantity: buyQty.value,
  })

  goCheckout(2)
}

/**
 * 圖片載入失敗時的處理
 */
const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/600x400?text=無法載入'
}

// 在組件掛載時獲取商品詳情
onMounted(() => {
  fetchProductDetail()
})
</script>

<style scoped>
/* 頁面背景與主容器 */
.product-page-container {
  background-color: #f5f5f5;
  padding-bottom: 60px;
}

.breadcrumb-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px 0;
}

/* 主資訊區 */
.product-main-section {
  max-width: 1200px;
  margin: 0 auto 20px;
  background: #fff;
  padding: 40px;
  border-radius: 4px;
}

/* 價格區 */
.price-wrapper {
  background: #fff5f5;
  padding: 15px;
  border-radius: 4px;
  margin: 20px 0;
}

.price-label {
  font-size: 30px;
  font-weight: bold;
  color: #cf1322;
}

.price-symbol {
  font-size: 30px;
  font-weight: bold;
  color: #cf1322;
}

.price-value {
  font-size: 36px;
  font-weight: bold;
  color: #cf1322;
}

/* 按鈕 */
.button-group {
  display: flex;
  gap: 12px;
  margin-top: 30px;
}

.btn-add-cart {
  flex: 1;
  height: 50px;
  font-size: 18px;
  border-color: #cf1322;
  color: #cf1322;
}

.btn-buy-now {
  flex: 1;
  height: 50px;
  font-size: 18px;
  background-color: #cf1322;
}

/* 下方標籤頁 */
.product-tabs-section {
  max-width: 1200px;
  margin: 0 auto;
  background: #fff;
  padding: 20px 40px;
  min-height: 400px;
}
</style>
