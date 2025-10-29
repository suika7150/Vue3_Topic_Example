<template>
  <div class="checkout-page">
    <div class="container">
      <div class="step-indicator">
        <el-steps :active="currentStep" finish-status="success" align-center>
          <el-step title="確認商品"></el-step>
          <el-step title="配送資訊"></el-step>
          <el-step title="付款方式"></el-step>
          <el-step title="完成訂單"></el-step>
        </el-steps>
      </div>

      <div class="checkout-grid">
        <div class="main-content">
          <div v-if="currentStep === 0" class="checkout-step">
            <h2 class="step-title">確認購買商品</h2>
            <div class="space-y-4">
              <div v-for="item in cartItems" :key="item.id" class="item-card">
                <img :src="item.imageBase64" :alt="item.name" class="item-image" />
                <div class="item-details">
                  <h3 class="item-name">{{ item.name }}</h3>
                  <p class="item-description">{{ item.description }}</p>
                  <div class="item-quantity">
                    <span class="quantity-label">數量:</span>
                    {{ item.quantity }}
                  </div>
                </div>
                <div class="item-price-info">
                  <div class="item-total-price">
                    NT$ {{ (item.price * item.quantity).toLocaleString() }}
                  </div>
                  <div class="item-unit-price">單價: NT$ {{ item.price.toLocaleString() }}</div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="currentStep === 1" class="checkout-step">
            <h2 class="step-title">配送資訊</h2>
            <el-form :model="shippingForm" :rules="shippingRules" ref="shippingFormRef">
              <el-form-item label="收件人" prop="name">
                <el-input v-model="shippingForm.name" placeholder="請輸入收件人姓名" />
              </el-form-item>

              <el-form-item label="聯絡電話" prop="phone">
                <el-input v-model="shippingForm.phone" placeholder="請輸入聯絡電話" />
              </el-form-item>

              <el-form-item label="配送地址" prop="address">
                <div class="address-fields">
                  <div class="address-selects">
                    <el-select v-model="shippingForm.city" placeholder="請選擇縣市" class="flex-1">
                      <el-option
                        v-for="city in cities"
                        :key="city.value"
                        :label="city.label"
                        :value="city.value"
                      />
                    </el-select>
                    <el-select
                      v-model="shippingForm.district"
                      placeholder="請選擇區域"
                      class="flex-1"
                    >
                      <el-option
                        v-for="district in districts"
                        :key="district.value"
                        :label="district.label"
                        :value="district.value"
                      />
                    </el-select>
                  </div>
                  <el-input
                    v-model="shippingForm.address"
                    placeholder="請輸入詳細地址"
                    type="textarea"
                    :rows="2"
                  />
                </div>
              </el-form-item>

              <el-form-item label="配送方式" prop="shippingMethod">
                <el-radio-group v-model="shippingForm.shippingMethod">
                  <el-radio label="standard" class="shipping-radio">
                    <div class="shipping-option">
                      <div class="shipping-name">標準配送 3-5 個工作天</div>
                      <span class="shipping-price">免費</span>
                    </div>
                  </el-radio>
                  <el-radio label="express" class="shipping-radio">
                    <div class="shipping-option">
                      <div class="shipping-name">快速配送 1-2 個工作天</div>
                      <span class="shipping-price">NT$ 100</span>
                    </div>
                  </el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="備註">
                <el-input
                  v-model="shippingForm.notes"
                  type="textarea"
                  :rows="3"
                  placeholder="有任何特殊需求請在此註明"
                />
              </el-form-item>
            </el-form>
          </div>

          <div v-if="currentStep === 2" class="checkout-step">
            <h2 class="step-title">付款方式</h2>
            <el-radio-group v-model="paymentMethod" class="space-y-4">
              <el-radio label="credit_card" class="payment-option-card">
                <div class="payment-option-content">
                  <div class="payment-text">
                    <div class="payment-name">信用卡付款</div>
                    <div class="payment-description">支援 Visa、Mastercard、JCB</div>
                  </div>
                  <div class="card-icons"></div>
                </div>
              </el-radio>

              <el-radio label="bank_transfer" class="payment-option-card">
                <div class="payment-text">
                  <div class="payment-name">銀行轉帳</div>
                  <div class="payment-description">轉帳後請上傳轉帳證明</div>
                </div>
              </el-radio>

              <el-radio label="cash_on_delivery" class="payment-option-card">
                <div class="payment-text">
                  <div class="payment-name">貨到付款</div>
                  <div class="payment-description">收到商品後再付款（需加收手續費 NT$ 30）</div>
                </div>
              </el-radio>
            </el-radio-group>

            <div v-if="paymentMethod === 'credit_card'" class="credit-card-form-container">
              <h3 class="form-title">信用卡資訊</h3>
              <el-form :model="creditCardForm" :rules="creditCardRules" ref="creditCardFormRef">
                <el-form-item label="卡號" prop="cardNumber">
                  <el-input
                    v-model="creditCardForm.cardNumber"
                    placeholder="1234 5678 9012 3456"
                    maxlength="19"
                    @input="formatCardNumber"
                  />
                </el-form-item>

                <div class="card-info-grid">
                  <el-form-item label="有效期限" prop="expiryDate">
                    <el-input
                      v-model="creditCardForm.expiryDate"
                      placeholder="MM/YY"
                      maxlength="5"
                      @input="formatExpiryDate"
                    />
                  </el-form-item>

                  <el-form-item label="安全碼" prop="cvv">
                    <el-input
                      v-model="creditCardForm.cvv"
                      placeholder="123"
                      maxlength="4"
                      type="password"
                    />
                  </el-form-item>
                </div>

                <el-form-item label="持卡人姓名" prop="cardholderName">
                  <el-input v-model="creditCardForm.cardholderName" placeholder="如卡片上所示" />
                </el-form-item>
              </el-form>
            </div>
          </div>

          <div class="navigation-buttons">
            <el-button v-if="currentStep > 0" @click="previousStep"> 上一步 </el-button>
            <div v-else></div>

            <el-button v-if="currentStep < 2" @click="nextStep"> 下一步 </el-button>

            <el-button v-else @click="submitOrder" :loading="submitting"> 確認訂單 </el-button>
          </div>
        </div>

        <div class="sidebar">
          <div class="order-summary-card">
            <h3 class="summary-title">訂單摘要</h3>

            <div class="summary-details">
              <div class="summary-line">
                <span>商品小計</span>
                <span>NT$ {{ subtotal.toLocaleString() }}</span>
              </div>

              <div class="summary-line">
                <span>運費</span>
                <span>NT$ {{ shippingFee.toLocaleString() }}</span>
              </div>

              <div v-if="paymentMethod === 'cash_on_delivery'" class="summary-line">
                <span>貨到付款手續費</span>
                <span>NT$ 30</span>
              </div>

              <div class="summary-total-line">
                <div class="summary-total-label">總計</div>
                <div class="summary-total-price">NT$ {{ total.toLocaleString() }}</div>
              </div>
            </div>

            <div class="tax-info">* 價格已含稅</div>

            <div class="coupon-section">
              <el-input v-model="couponCode" placeholder="輸入優惠券代碼" size="small">
                <template #append>
                  <el-button @click="applyCoupon" :loading="applyingCoupon"> 使用 </el-button>
                </template>
              </el-input>
            </div>

            <div class="summary-item-list">
              <h4 class="summary-item-list-title">購買商品</h4>
              <div v-for="item in cartItems" :key="item.id" class="summary-item-line">
                <span>{{ item.name }} × {{ item.quantity }}</span>
                <span>NT$ {{ (item.price * item.quantity).toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useNavigation } from '@/composables/useNavigation'
import api from '@/service/api'
import { useCartStore } from '@/store/cartStore'
import Storage, { CART_KEY } from '@/utils/storageUtil'
import { ElMessage } from 'element-plus'
import { computed, onMounted, ref } from 'vue'

const cartStore = useCartStore()
const cart = computed(() => cartStore.cart)

const { goTo } = useNavigation()

// 響應式數據
const currentStep = ref(0)
const cartItems = ref([])
const submitting = ref(false)
const applyingCoupon = ref(false)
const couponCode = ref('')

// 配送表單
const shippingForm = ref({
  name: '',
  phone: '',
  city: '',
  district: '',
  address: '',
  shippingMethod: 'standard',
  notes: '',
})

const shippingFormRef = ref()

// 付款方式
const paymentMethod = ref('credit_card')

// 信用卡表單
const creditCardForm = ref({
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardholderName: '',
})

const creditCardFormRef = ref()

// 表單驗證規則
const shippingRules = {
  name: [{ required: true, message: '請輸入收件人姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '請輸入聯絡電話', trigger: 'blur' }],
  address: [{ required: true, message: '請輸入配送地址', trigger: 'blur' }],
  shippingMethod: [{ required: true, message: '請選擇配送方式', trigger: 'change' }],
}

const creditCardRules = {
  cardNumber: [{ required: true, message: '請輸入信用卡號', trigger: 'blur' }],
  expiryDate: [{ required: true, message: '請輸入有效期限', trigger: 'blur' }],
  cvv: [{ required: true, message: '請輸入安全碼', trigger: 'blur' }],
  cardholderName: [{ required: true, message: '請輸入持卡人姓名', trigger: 'blur' }],
}

// 地區數據
const cities = ref([
  { label: '台北市', value: 'taipei' },
  { label: '新北市', value: 'new_taipei' },
  { label: '桃園市', value: 'taoyuan' },
  { label: '基隆市', value: 'keelung' },
  { label: '新竹市', value: 'hsinchu' },
  { label: '新竹縣', value: 'hsinchu_county' },
  { label: '苗栗縣', value: 'miaoli' },
  { label: '彰化縣', value: 'changhua' },
  { label: '南投縣', value: 'nantou' },
  { label: '雲林縣', value: 'yunlin' },
  { label: '嘉義市', value: 'chiayi' },
  { label: '嘉義縣', value: 'chiayi_county' },
  { label: '台中市', value: 'taichung' },
  { label: '高雄市', value: 'kaohsiung' },
  { label: '台南市', value: 'tainan' },
])

const districts = ref([
  { label: '新莊區', value: 'xinzhuang' },
  { label: '樹林區', value: 'shulin' },
  { label: '板橋區', value: 'banqiao' },
  { label: '中和區', value: 'zhonghe' },
  { label: '永和區', value: 'yonghe' },
  { label: '土城區', value: 'tucheng' },
  { label: '樹林區', value: 'shulin' },
])

const handleShippingChange = ({ value, option, additionalCost }) => {
  console.log('配送方式:', option.name)
  console.log('額外費用:', additionalCost)
}
// 計算屬性
const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const shippingFee = computed(() => {
  return shippingForm.value.shippingMethod === 'express' ? 100 : 0
})

const total = computed(() => {
  let total = subtotal.value + shippingFee.value
  if (paymentMethod.value === 'cash_on_delivery') {
    total += 30 // 貨到付款手續費
  }
  return total
})

// 方法
const loadCartItems = () => {
  cartItems.value = cart.value
}

const nextStep = async () => {
  if (currentStep.value === 1) {
    // 驗證配送表單
    const valid = await shippingFormRef.value.validate().catch(() => false)
    if (!valid) return
  }

  if (currentStep.value === 2 && paymentMethod.value === 'credit_card') {
    // 驗證信用卡表單
    const valid = await creditCardFormRef.value.validate().catch(() => false)
    if (!valid) return
  }

  currentStep.value++
}

const previousStep = () => {
  currentStep.value--
}

const submitOrder = async () => {
  try {
    submitting.value = true

    const orderData = {
      name: shippingForm.value.name,
      phone: shippingForm.value.phone,
      address: `${shippingForm.value.city} ${shippingForm.value.district} ${shippingForm.value.address}`,
      shippingMethod: shippingForm.value.shippingMethod,
      notes: shippingForm.value.notes,
      paymentMethod: paymentMethod.value,
      total: total.value,
      ...(paymentMethod.value === 'credit_card' && {
        cardLast4: creditCardForm.value.cardNumber.slice(-4),
        paymentStatus: 'paid',
      }),
      items: cartItems.value.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    }

    const response = await api.createOrder(orderData)

    // 清空購物車
    Storage.remove(CART_KEY)

    // 跳轉到成功頁面
    goTo('CheckoutSuccess')

    ElMessage.success('訂單建立成功！')
  } catch (error) {
    console.error('訂單建立失敗:', error)
    ElMessage.error('訂單建立失敗，請稍後再試')
  } finally {
    submitting.value = false
  }
}

const applyCoupon = async () => {
  if (!couponCode.value.trim()) {
    ElMessage.warning('請輸入優惠券代碼')
    return
  }

  try {
    applyingCoupon.value = true
    const response = await api.coupon.validate(couponCode.value)

    if (response.valid) {
      ElMessage.success('優惠券套用成功！')
      // 應用折扣邏輯
    } else {
      ElMessage.error('優惠券無效或已過期')
    }
  } catch (error) {
    ElMessage.error('優惠券驗證失敗')
  } finally {
    applyingCoupon.value = false
  }
}

const formatCardNumber = (value) => {
  // 格式化信用卡號：1234 5678 9012 3456
  const formatted = value
    .replace(/\s/g, '')
    .replace(/(\d{4})/g, '$1 ')
    .trim()
  creditCardForm.value.cardNumber = formatted
}

const formatExpiryDate = (value) => {
  // 格式化有效期限：MM/YY
  const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2')
  creditCardForm.value.expiryDate = formatted
}

// 生命週期
onMounted(() => {
  loadCartItems()
})
</script>

<style scoped>
.checkout-page {
  padding: 32px 16px;
}

.container {
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding: 32px 16px;
}

.step-indicator {
  margin-bottom: 32px;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
}

@media (min-width: 1024px) {
  .checkout-grid {
    grid-template-columns: 2fr 1fr;
  }
}

.main-content {
  grid-column: 1 / -1;
}

@media (min-width: 1024px) {
  .main-content {
    grid-column: span 2 / span 2;
  }
}

.sidebar {
  grid-column: 1 / -1;
}

@media (min-width: 1024px) {
  .sidebar {
    grid-column: span 1 / span 1;
  }
}

/* Steps */
.checkout-step {
  margin-bottom: 32px;
}

.step-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
}

/* Item Card */
.space-y-4 > * + * {
  margin-top: 16px;
}

.item-card {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.item-image {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 4px;
}

.item-details {
  margin-left: 16px;
  flex: 1;
}

.item-name {
  font-weight: 500;
}

.item-description {
  color: #6b7280;
}

.item-quantity {
  display: flex;
  align-items: center;
  margin-top: 8px;
  font-size: 14px;
  color: #6b7280;
}

.quantity-label {
  margin-right: 8px;
}

.item-price-info {
  text-align: right;
}

.item-total-price {
  font-size: 18px;
  font-weight: 600;
  color: #f97316;
}

.item-unit-price {
  font-size: 14px;
  color: #6b7280;
}

/* Shipping Form */
.address-fields {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 40%;
}

.address-selects {
  display: flex;
  gap: 8px;
}

.shipping-radio {
  display: block;
  margin-bottom: 8px;
}

.shipping-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.shipping-name {
  font-weight: 500;
}

.shipping-price {
  color: #ea580c;
  font-weight: 500;
}

/* Payment Methods */
.payment-option-card {
  display: block;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.payment-option-content {
  display: flex;
  align-items: center;
}

.payment-text {
  flex: 1;
}

.payment-name {
  font-weight: 500;
}

.payment-description {
  font-size: 14px;
  color: #6b7280;
}

.card-icons {
  display: flex;
  gap: 8px;
}

.card-icon {
  height: 24px;
}

.credit-card-form-container {
  margin-top: 24px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: #f9fafb;
}

.form-title {
  font-weight: 500;
  margin-bottom: 16px;
}

.card-info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 640px) {
  .card-info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Navigation Buttons */
.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
}

/* Order Summary */
.sidebar {
  position: sticky;
  top: 16px;
}

.order-summary-card {
  background-color: #f9fafb;
  padding: 24px;
  border-radius: 8px;
}

.summary-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.summary-details {
  margin-bottom: 16px;
}

.summary-details > * + * {
  margin-top: 8px;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.summary-total-line {
  border-top: 1px solid #e5e7eb;
  padding-top: 8px;
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 18px;
}

.summary-total-price {
  color: #f97316;
}

.tax-info {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 16px;
}

.coupon-section {
  margin-bottom: 16px;
}

.summary-item-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.summary-item-list-title {
  font-weight: 500;
  font-size: 14px;
  color: #4b5563;
}

.summary-item-line {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}
</style>
