<template>
  <div class="cart-container">
    <el-drawer
      :model-value="drawerVisible"
      @update:model-value="emit('update:drawerVisible', $event)"
      title="🛒 購物車內容"
      :size="drawerSize"
      @close="handleClose"
    >
      <div v-if="cart.length" class="cart-content">
        <el-table :data="cart" style="width: 100%">
          <el-table-column label="操作" width="60" :align="center">
            <template #default="scope">
              <el-button
                type="danger"
                :icon="Delete"
                circle
                plain
                size="small"
                @click="removeItem(scope.row.id)"
              />
            </template>
          </el-table-column>

          <el-table-column label="商品" width="80" :align="center">
            <template #default="scope">
              <el-image
                :src="scope.row.imageBase64"
                style="width: 50px; height: 50px; border-radius: 4px"
                fit="cover"
              />
            </template>
          </el-table-column>

          <el-table-column label="名稱" min-width="80" max-width="150" :align="center">
            <template #default="scope">
              <div class="product-info-cell">
                <span class="product-name">{{ scope.row.name }}</span>
                <span v-if="isMobile" class="mobile-price">{{ scope.row.price }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column v-if="!isMobile" label="價格" width="80" :align="center">
            <template #default="scope">
              <span class="cart-price">${{ scope.row.price }}</span>
            </template>
          </el-table-column>

          <el-table-column label="數量" :width="isMobile ? '100' : '135'" :align="center">
            <template #default="scope">
              <el-input-number
                v-model="scope.row.quantity"
                :min="1"
                size="small"
                :controls-position="isMobile ? 'right' : ''"
                style="width: 70%"
                @change="(e) => handleQuantityChange(e, scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-empty v-else description="購物車目前是空的" />

      <template #footer>
        <div class="cart-footer">
          <div class="cart-total-row">
            <p class="cart-total-label">總計:</p>
            <p class="cart-total-amount">${{ cartStore.totalPrice }}</p>
          </div>

          <el-button
            type="primary"
            class="cart-checkout-btn"
            size="large"
            :disabled="!cart.length"
            @click="handleCheckout"
          >
            <el-icon class="cart-checkout-icon"><ShoppingCart /></el-icon>
            {{ isMobile ? '結帳' : '前往結帳' }} ({{ cartStore.totalQuantity }} 件商品)
          </el-button>
        </div>
      </template>
    </el-drawer>
    <CheckoutConfirmModal v-model="showConfirmModal" title="確認結帳清單">
      <div class="confirm-list-wrapper">
        <div v-for="item in cart" :key="item.id" class="confirm-item">
          <div class="item-info">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-qty">× {{ item.quantity }}</span>
          </div>
          <div class="item-price">NT$ {{ (item.price * item.quantity).toLocaleString() }}</div>
        </div>

        <div class="confirm-summary">
          <div class="total-line">
            <span>應付總額</span>
            <span class="total-amount">NT$ {{ cartStore.totalPrice.toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="showConfirmModal = false">回購物車</el-button>
        <el-button type="primary" class="confirm-pay-btn" @click="proceedToCheckout">
          確認結帳
        </el-button>
      </template>
    </CheckoutConfirmModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { useNavigation } from '@/composables/useNavigation'
import { useCartStore } from '@/store/cartStore'
import { useSidebarStore } from '@/store/sidebarStore'
import CheckoutConfirmModal from '@/components/CheckoutConfirmModal.vue'
import { toast } from '@/utils/message'
import { Delete, ShoppingCart } from '@element-plus/icons-vue'

const { isMobile } = useBreakpoint()
const { goTo } = useNavigation()
const cartStore = useCartStore()
const sidebarStore = useSidebarStore()
const cart = computed(() => cartStore.cart)

const drawerSize = computed(() => {
  return isMobile.value ? '100%' : '450px'
})

const props = defineProps({
  drawerVisible: { type: Boolean, required: true },
})

const emit = defineEmits(['update:drawerVisible', 'removeItem'])

const handleClose = () => {
  emit('update:drawerVisible', false)
}

const handleQuantityChange = (e, product) => {
  toast.success(`${product.name} 數量已更新為 ${e}`)
}

const showConfirmModal = ref(false)

const handleCheckout = async () => {
  if (!cart.value.length) {
    toast.warning('購物車是空的，請先添加商品')
    return
  }

  // 不再調用 ElMessageBox，直接打開組件彈窗
  showConfirmModal.value = true
}

const proceedToCheckout = () => {
  showConfirmModal.value = false // 關閉彈窗
  handleClose() // 關閉 Drawer

  setTimeout(() => {
    goTo('checkout')
    sidebarStore.setCollapse(true)
    toast.success('正在前往結帳頁面...')
  }, 300)
}

const removeItem = (productId) => {
  cartStore.removeProduct(productId)
  toast.success('商品已從購物車移除')
}
</script>

<style scoped>
.cart-content {
  flex-grow: 1;
  /* margin: 0px 10px; */
}

.product-name {
  font-size: 14px;
  line-height: 1.3;
}

.mobile-price {
  font-size: 12px;
  color: #ff4d4f;
  margin-top: 4px;
  font-weight: bold;
}

.cart-price {
  font-weight: 600;
}

.cart-footer {
  padding: 16px;
  border-top: 1px solid #ddd;
}

.cart-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.cart-total-label {
  font-size: 18px;
  font-weight: bold;
}

.cart-total-amount {
  font-size: 20px;
  font-weight: bold;
  color: #e74c3c;
}

.cart-checkout-btn {
  width: 100%;
}

.cart-checkout-icon {
  margin-right: 8px;
}

.confirm-list-wrapper {
  padding: 10px 5px;
}

.confirm-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-name {
  font-weight: 500;
  color: #333;
}

.item-qty {
  font-size: 12px;
  color: #999;
}

.item-price {
  font-weight: bold;
  color: #333;
}

.confirm-summary {
  margin-top: 20px;
  padding-top: 15px;
}

.total-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-amount {
  font-size: 22px;
  font-weight: bold;
  color: #e74c3c;
}

.confirm-pay-btn {
  background-color: #0071e3;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
}
</style>
