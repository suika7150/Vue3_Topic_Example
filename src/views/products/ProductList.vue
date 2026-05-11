<template>
  <div class="product-list-container">
    <div class="breadcrumb-strip">
      <Breadcrumb />
    </div>
    <template v-if="isLoading">
      <div class="product-list-header">
        <h2 class="header-title">正在載入商品...</h2>
      </div>
      <el-row :gutter="20">
        <el-col
          v-for="i in 4"
          :key="i"
          :span="6"
          :xs="12"
          :sm="12"
          :md="8"
          :lg="6"
          class="product-col"
        >
          <el-skeleton animated>
            <template #template>
              <el-skeleton-item
                variant="image"
                style="width: 100%; aspect-ratio: 1/1; border-radius: 8px"
              />
              <div style="padding: 14px 0">
                <el-skeleton-item variant="text" style="width: 30%; margin-bottom: 10px" />
                <el-skeleton-item variant="h3" style="width: 80%; height: 24px" />
                <div
                  style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 20px;
                  "
                >
                  <el-skeleton-item variant="text" style="width: 40%; height: 20px" />
                  <el-skeleton-item variant="circle" style="width: 28px; height: 28px" />
                </div>
              </div>
            </template>
          </el-skeleton>
        </el-col>
      </el-row>
    </template>

    <template v-else-if="filteredProducts.length > 0">
      <div class="product-list-header">
        <div class="header-controls">
          <div class="toolbar-wrapper">
            <ProductToolbar v-model="filters" :categories="categories" />
          </div>
        </div>
      </div>

      <el-row :gutter="20">
        <el-col
          v-for="product in visibleProducts"
          :key="product.id"
          :span="6"
          :xs="12"
          :sm="12"
          :md="8"
          :lg="6"
          class="product-col"
        >
          <el-card class="product-card">
            <div class="card-image-wrapper" @click="showProductDetail(product)">
              <img
                :src="API_ROUTES.PRODUCT_IMAGE(product.id)"
                loading="lazy"
                class="card-image"
                @error="handleImageError"
                @click="showProductDetail(product)"
              />
              <div class="image-overlay">
                <div class="overlay-actions">
                  <el-tooltip content="查看詳情" placement="top">
                    <div class="action-icon is-detail" @click.stop="showProductDetail(product)">
                      <el-icon><ZoomIn /></el-icon>
                    </div>
                  </el-tooltip>
                  <el-tooltip content="加入購物車" placement="top">
                    <div class="action-icon is-cart" @click.stop="addToCart(product)">
                      <el-icon><ShoppingCart /></el-icon>
                    </div>
                  </el-tooltip>
                </div>
              </div>
            </div>
            <div class="card-body">
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-category">{{ product.category }}</p>
              <el-rate v-model="product.rating" disabled show-score :max="5" />
              <div class="price-action-row">
                <p class="product-price">$ {{ product.price }}</p>
                <div
                  class="wishlist-icon"
                  :class="{ 'is-active': product.isWishlisted }"
                  @click="toggleWishlist(product)"
                >
                  <el-icon><Star v-if="!product.isWishlisted" /><StarFilled v-else /></el-icon>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <div class="load-more-container">
        <div v-if="isLoadMoreLoading" class="loading-indicator">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>載入中...</span>
        </div>
        <el-button v-else-if="hasMore" @click="loadMore" plain> 載入更多 </el-button>
      </div>
    </template>

    <div v-else class="empty-state">
      <el-empty description="哎呀！找不到相關商品" :image-size="300">
        <el-button type="primary" @click="clearSearch">返回顯示所有商品</el-button>
      </el-empty>
    </div>

    <CartDrawer v-model:drawerVisible="drawerVisible" />
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { API_ROUTES } from '@/services/apiRoutes'
import CartDrawer from '@/components/cart/CartDrawer.vue'
import Breadcrumb from '@/components/navigation/Breadcrumb.vue'
import ProductToolbar from '@/components/navigation/ProductToolbar.vue'
import api from '@/services/api'
import { useNavigation } from '@/composables/useNavigation'
import { useProductFilter } from '@/composables/useProductFilter'
import { useProductPagination } from '@/composables/useProductPagination'
import { useProductSearch } from '@/composables/useProductSearch'
import { useCartStore } from '@/store/cartStore'
import Storage, { CART_KEY } from '@/utils/storageUtil'
import { toast } from '@/utils/message'
import { Loading, Star, StarFilled, ShoppingCart, ZoomIn } from '@element-plus/icons-vue'

const { keyword } = useProductSearch()
const { goTo } = useNavigation()
const cartStore = useCartStore()
const products = ref([])
const isLoading = ref(true)
const drawerVisible = ref(false)
const { filters, categories, filteredProducts, resetFilters } = useProductFilter(products)

// 使用分頁邏輯元件
const {
  visibleItems: visibleProducts,
  loadMore,
  loadingMore: isLoadMoreLoading,
  handleScroll,
  reset,
  hasMore,
} = useProductPagination(filteredProducts)

const props = defineProps({
  forcedCategory: {
    type: String,
    default: '',
  },
})

const showProductDetail = (product) => {
  goTo('productDetail', { id: product.id })
}

const fetchProducts = async () => {
  isLoading.value = true

  try {
    const res = await api.getProducts({
      keyword: keyword.value || undefined,
    })

    if (res?.code === '0000') {
      products.value = res.result
      reset()
    } else {
      products.value = []
    }
  } catch (err) {
    console.error(err)
    products.value = []
  } finally {
    isLoading.value = false
  }
}

watch(keyword, async () => {
  await fetchProducts()
  reset()
})

// 當篩選條件改變時，自動重置分頁
watch(
  filters,
  async () => {
    isLoading.value = true // 手動開啟載入狀態
    reset()
    await new Promise((resolve) => setTimeout(resolve, 1000)) // 模擬短暫的延遲搭配 Skeleton Screen
    isLoading.value = false
  },
  { deep: true },
)

watch(
  () => props.forcedCategory,
  (newVal) => {
    filters.value.category = newVal || ''
    reset()
  },
)

const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/300x200?text=無法載入'
}

const addToCart = (product) => {
  const existingItem = cartStore.cart.find((item) => item.id === product.id)
  if (existingItem) {
    existingItem.quantity += 1
    toast.success(`${product.name} 數量已更新為 ${existingItem.quantity}`)
  } else {
    cartStore.addProduct(product)
    toast.success(`${product.name} 已加入購物車`)
  }
  drawerVisible.value = true
}

const toggleWishlist = (product) => {
  // 切換狀態
  product.isWishlisted = !product.isWishlisted

  if (product.isWishlisted) {
    toast.success('已加入追蹤清單')
  } else {
    toast.info('已從追蹤清單移除')
  }
}

const clearSearch = () => {
  keyword.value = ''
  resetFilters()
  reset()
  goTo('overview')
}

onMounted(async () => {
  await fetchProducts()

  if (props.forcedCategory) {
    filters.value.category = props.forcedCategory
  }

  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.product-list-container {
  max-width: 1200px;
  padding: 60px 20px;
  margin: 0 auto;
  width: 100%; /* 不要拿掉，確保在小螢幕上也能撐滿 */
  box-sizing: border-box;
}

.breadcrumb-strip {
  margin-bottom: 20px;
}

.product-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header-controls {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  gap: 12px;
}

.toolbar-wrapper {
  flex: unset;
}

.product-col {
  margin-bottom: 40px;
  max-width: 25%;
  box-sizing: border-box;
}

.header-title {
  font-size: 24px;
  font-weight: 600;
  color: #1d1d1f;
}

.category-select {
  width: 180px;
  margin-right: 12px;
}

.product-card {
  border: none;
  border-radius: 0;
  overflow: hidden;
  background: transparent;
  box-shadow: none;
  height: 100%;
  transition: all 0.3s ease;
}

/* Skeleton Screen 樣式 */
:deep(.el-skeleton) {
  --el-skeleton-color: #cbd5e1;
  --el-skeleton-to-color: #94a3b8;
  --el-skeleton-animation-duration: 1.8s;
}

:deep(.el-skeleton__item) {
  border-radius: 4px;
  margin-top: 6px;
}

.product-card :deep(.el-card__body) {
  padding: 0;
}

.card-image-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  width: 100%;
  aspect-ratio: 1 / 1;
  cursor: pointer;
  background-color: #fff;
}

.card-image-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.card-image {
  width: calc(100% + 2px);
  height: calc(100% + 2px);
  margin: -1px;
  object-fit: cover;
  display: block;
}

.card-body {
  padding: 20px;
  text-align: left;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card-image-wrapper:hover .image-overlay {
  opacity: 1;
}

.card-image-wrapper:hover .overlay-actions {
  transform: translateY(0);
}

/* 遮罩內的按鈕容器 */
.overlay-actions {
  display: flex;
  gap: 15px;
  transform: translateY(10px);
  transition: transform 0.3s ease;
}

/* 遮罩內的按鈕樣式 */
.action-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 46px;
  height: 46px;
  font-size: 26px;
  border-radius: 6px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* 遮罩內的按鈕(查看詳情) */
.action-icon.is-detail {
  background: rgba(255, 255, 255, 0.9);
  color: #1d1d1f;
}

/* 遮罩內的按鈕(查看詳情) */
.action-icon.is-detail:hover {
  background: #ffffff;
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

/* 遮罩內的按鈕(購物車) */
.action-icon.is-cart {
  background: rgba(29, 29, 31, 0.9);
  color: #ffffff;
}

/* 遮罩內的按鈕(購物車) */
.action-icon.is-cart:hover {
  background: #000000;
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}
.product-category {
  font-size: 12px;
  text-transform: uppercase;
  color: #86868b;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.product-name {
  font-size: 17px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 8px;
  line-height: 1.4;
  height: 48px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  font-size: 19px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0;
}

/* 價格與按鈕 */
.price-action-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 12px 0;
}

/* 星星按鈕 */
.wishlist-icon {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c7c7cc;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  padding: 4px;
  font-size: 25px;
}

.wishlist-icon:hover {
  transform: scale(1.2);
  color: #ffb800;
}

/* 星星點擊後 (變成金色) */
.wishlist-icon.is-active {
  color: #ffb800 !important;
  animation: starBounce 0.4s ease;
}

/* 星星彈跳動畫 */
@keyframes starBounce {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.4);
  }
  100% {
    transform: scale(1);
  }
}

/* 確保價格文字不會擠到星星 */
.product-price {
  font-size: 19px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0;
}

/* 加入購物車按鈕 */
.add-to-cart-button {
  width: 100%;
  height: 40px;
  border-radius: 10px;
  font-weight: 500;
  border: none;
  background: #0071e3;
  transition: background 0.3s ease;
}

.add-to-cart-button:hover {
  background: #0077ed;
}

.load-more-container {
  margin-top: 40px;
  text-align: center;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  color: #86868b;
}

.product-detail-dialog {
  display: flex;
  gap: 30px;
  padding: 20px;
}

.product-detail-image {
  flex: 1;
  max-width: 50%;
  border-radius: 12px;
  object-fit: cover;
}

.product-detail-content {
  flex: 1;
  text-align: left;
}

.detail-price {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 20px;
}

.detail-description {
  font-size: 16px;
  line-height: 1.6;
  color: #424245;
  margin-bottom: 24px;
}

@media (max-width: 1024px) {
  .product-list-container {
    padding: 20px 15px;
    width: 100%;
  }
  .card-image-wrapper {
    height: 180px;
  }
  .product-detail-dialog {
    flex-direction: column;
  }
  .product-detail-image {
    max-width: 100%;
  }
  .product-col {
    flex: 0 0 50%;
    max-width: 50%;
  }
}
</style>
