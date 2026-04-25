<template>
  <div class="checkout-page">
    <div class="container">
      <div class="step-container">
        <div class="modern-steps">
          <div
            v-for="(step, index) in ['確認商品', '填寫資料', '完成訂單']"
            :key="index"
            class="step-wrapper"
          >
            <div
              :class="[
                'step-item',
                {
                  active: currentStep === index,
                  completed: currentStep > index,
                },
              ]"
            >
              <div class="step-icon">
                <el-icon v-if="currentStep > index"><Check /></el-icon>
                <span v-else>{{ index + 1 }}</span>
              </div>
              <span class="step-text">{{ step }}</span>
            </div>

            <div v-if="index < 2" :class="['step-line', { active: currentStep > index }]"></div>
          </div>
        </div>
      </div>

      <div class="checkout-grid">
        <div class="main-content">
          <div v-if="currentStep === 0" class="checkout-step">
            <h2 class="step-title">商品清單</h2>
            <div class="space-y-4">
              <div v-for="item in cartItems" :key="item.id" class="item-card">
                <img :src="item.imageBase64" :alt="item.name" class="item-image" />
                <div class="item-details">
                  <h3 class="item-name">{{ item.name }}</h3>
                  <p class="item-description">{{ item.description }}</p>
                </div>
                <div class="item-quantity-control">
                  <span class="quantity-label">數量 :</span>
                  <el-input-number
                    v-model="item.quantity"
                    :min="1"
                    @change="(val) => updateStorage(val, item.id)"
                  />
                </div>
                <div class="item-price-info">
                  <div class="item-total-price">
                    NT$ {{ (item.price * item.quantity).toLocaleString() }}
                  </div>
                  <div class="item-unit-price">單價: NT$ {{ item.price.toLocaleString() }}</div>
                </div>
                <el-button
                  type="danger"
                  :icon="Delete"
                  @click="removeItem(item.id)"
                  class="delete-btn"
                >
                  刪除
                </el-button>
              </div>
            </div>
          </div>

          <div v-if="currentStep === 1" class="checkout-step">
            <h2 class="step-title">配送資訊</h2>
            <el-form
              :model="shippingForm"
              :rules="shippingRules"
              ref="shippingFormRef"
              class="minimalist-form"
              label-width="100px"
            >
              <el-form-item label="收件人" prop="name" class="narrow-item">
                <el-input v-model="shippingForm.name" placeholder="請輸入收件人姓名" />
              </el-form-item>

              <el-form-item label="聯絡電話" prop="phone" class="narrow-item">
                <el-input v-model="shippingForm.phone" placeholder="請輸入聯絡電話" />
              </el-form-item>

              <el-form-item label="配送方式">
                <el-radio-group v-model="shippingForm.shippingMethod">
                  <el-radio
                    v-for="opt in shippingOptions"
                    :key="opt.value"
                    :label="opt.value"
                    class="option-card"
                  >
                    <div class="option-content">
                      <div>
                        <span class="option-label">{{ opt.label }}</span>
                        <span class="option-hint">{{ opt.desc }}</span>
                      </div>
                      <span class="option-price">
                        {{ opt.price === 0 ? '免費' : `NT$ ${opt.price}` }}
                      </span>
                    </div>
                  </el-radio>
                </el-radio-group>
              </el-form-item>

              <div class="shipping-detail-box">
                <template v-if="shippingForm.shippingMethod === 'HOME_DELIVERY'">
                  <el-form-item label="配送地址" required>
                    <div class="address-fields">
                      <div class="address-selects">
                        <el-select
                          v-model="shippingForm.city"
                          placeholder="請選擇縣市"
                          class="flex-1"
                        >
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
                          :disabled="!shippingForm.city"
                        >
                          <el-option
                            v-for="district in districts"
                            :key="district.zip"
                            :label="district.label"
                            :value="district.value"
                          />
                        </el-select>
                      </div>

                      <el-input
                        v-model="shippingForm.address"
                        placeholder="請輸詳細地址"
                        type="textarea"
                        :rows="1"
                        class="mt-2"
                      />
                    </div>
                  </el-form-item>
                </template>

                <template
                  v-else-if="['CVS_711', 'CVS_FAMILY'].includes(shippingForm.shippingMethod)"
                >
                  <el-form-item label="超商門市">
                    <el-button type="primary" plain @click="openCvsMap"
                      >開啟電子地圖選取門市</el-button
                    >
                    <div v-if="shippingForm.cvsStore" class="mt-2 text-blue-500">
                      已選門市：{{ shippingForm.cvsStore.storeName }}
                    </div>
                  </el-form-item>
                </template>

                <template v-else-if="shippingForm.shippingMethod === 'STORE_PICKUP'">
                  <el-form-item label="取貨門市">
                    <el-select v-model="shippingForm.pickupStoreId" placeholder="請選擇取貨地點">
                      <el-option label="台北總店" value="001" />
                      <el-option label="台中分店" value="002" />
                    </el-select>
                  </el-form-item>
                </template>
              </div>

              <el-form-item label="備註">
                <el-input
                  v-model="shippingForm.notes"
                  type="textarea"
                  :rows="1"
                  placeholder="有任何特殊需求請在此註明"
                />
              </el-form-item>
            </el-form>
            <h2 class="step-title">付款方式</h2>
            <el-radio-group v-model="paymentMethod">
              <el-radio label="credit_card" class="option-card">
                <div class="option-content">
                  <div>
                    <div class="option-label">信用卡付款</div>
                    <div class="option-hint">支援 Visa、Mastercard、JCB</div>
                  </div>
                </div>
              </el-radio>

              <el-radio label="bank_transfer" class="option-card">
                <div class="option-content">
                  <div>
                    <div class="option-label">銀行轉帳</div>
                    <div class="option-hint">轉帳後請上傳證明</div>
                  </div>
                </div>
              </el-radio>

              <el-radio label="cash_on_delivery" class="option-card">
                <div class="option-content">
                  <div>
                    <div class="option-label">貨到付款</div>
                    <div class="option-hint">需加收 NT$30</div>
                  </div>
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
        </div>

        <div class="sidebar">
          <div class="order-summary-card">
            <h3 class="summary-title">訂單明細</h3>

            <div class="summary-details">
              <div class="summary-line">
                <span>商品小計</span>
                <span>NT$ {{ subtotal.toLocaleString() }}</span>
              </div>

              <div
                v-if="discount > 0"
                class="summary-line"
                style="color: #34c759; font-weight: 500"
              >
                <span>優惠券折扣</span>
                <span>- NT$ {{ discount.toLocaleString() }}</span>
              </div>

              <div class="summary-line">
                <span>運費</span>
                <span v-if="shippingFee === 0" style="color: #34c759; font-weight: 500">免運</span>
                <span v-else>NT$ {{ shippingFee.toLocaleString() }}</span>
              </div>

              <div
                v-if="subtotal < FREE_SHIPPING_THRESHOLD"
                class="coupon-hint"
                style="font-size: 12px; margin-top: 4px"
              >
                再買 NT$ {{ (FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString() }} 即可享免運！
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
              <div class="coupon-hint">
                測試代碼：<code @click="couponCode = 'DOUBLE11'" class="code-tag">DOUBLE11</code>
              </div>
            </div>

            <div class="summary-item-list">
              <h4 class="summary-item-list-title">購買項目</h4>
              <div v-for="item in cartItems" :key="item.id" class="summary-item-line">
                <span>{{ item.name }} × {{ item.quantity }}</span>
                <span>NT$ {{ (item.price * item.quantity).toLocaleString() }}</span>
              </div>
            </div>

            <div class="navigation-buttons">
              <el-button v-if="currentStep > 0" @click="previousStep"> 上一步 </el-button>

              <el-button v-if="currentStep < 2" type="primary" @click="nextStep">
                下一步
              </el-button>

              <el-button v-else type="success" @click="submitOrder" :loading="submitting">
                確認訂單
              </el-button>
            </div>
          </div>
        </div>
        <RecommendSection />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/service/api'
import { Check } from '@element-plus/icons-vue'
import taiwanData from '@/assets/data/AllData.json'
import { toast } from '@/utils/message'
import RecommendSection from '@/components/RecommendSection.vue'
import { useNavigation } from '@/composables/useNavigation'
import { useCartStore } from '@/store/cartStore'
import { useModalStore } from '@/store/modalStore'
import Storage, { CART_KEY } from '@/utils/storageUtil'

const cartStore = useCartStore()

const { goTo, goCheckoutSuccess } = useNavigation()
const modalStore = useModalStore()
const route = useRoute()

const currentStep = ref(0) // 當前步驟
const submitting = ref(false) // 訂單提交狀態

const applyingCoupon = ref(false) // 優惠券套用中狀態
const couponCode = ref('') // 優惠券代碼
const discount = ref(0) // 優惠金額，預設為 0

const FREE_SHIPPING_THRESHOLD = 1000 // 滿額免運門檻

const cartItems = computed(() => cartStore.cart)

const updateStorage = (val, itemId) => {
  cartStore.updateQuantity(itemId, val) // 更新 store 中的數據
  const item = cartItems.value.find((i) => i.id === itemId) // 從購物車中找出該商品以獲取名稱
  toast.success(`${item.name} 數量已更新為 ${val}`)
}

// 配送表單
const shippingForm = ref({
  name: '',
  phone: '',
  shippingMethod: 'HOME_DELIVERY', // 預設宅配

  //基本資料
  city: '',
  district: '',
  address: '',

  // 超商專用
  cvsStore: null, // 儲存選擇的門市資訊
  //自取專用
  pickupStoreId: '',
  notes: '',
})

const shippingOptions = [
  { label: '宅配到府', value: 'HOME_DELIVERY', price: 80, desc: '黑貓宅急便，約 1-3 個工作天送達' },
  { label: '7-11 取貨', value: 'CVS_711', price: 60, desc: '寄出後約 2-3 天到指定門市' },
  { label: '全家取貨', value: 'CVS_FAMILY', price: 60, desc: '寄出後約 2-3 天到指定門市' },
  { label: '到店自取', value: 'STORE_PICKUP', price: 0, desc: '實體門市取貨 免運費' },
]

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

// 取得台灣縣市資料 (JSON 資料在 assets/data/AllData.json)
const cities = computed(() => {
  return taiwanData.map((item) => ({ label: item.CityName, value: item.CityName }))
})

// 根據目前選中的縣市，動態計算該縣市的區域清單
const districts = computed(() => {
  if (!shippingForm.value.city) return []

  // 找出目前選中的縣市資料
  const selectedCity = taiwanData.find((item) => item.CityName === shippingForm.value.city)

  // 回傳該縣市的區域清單
  return selectedCity
    ? selectedCity.AreaList.map((area) => ({
        label: area.AreaName,
        value: area.AreaName,
        zip: area.ZipCode,
      }))
    : []
})

// 縣市切換時，自動重設區域，避免錯誤組合
watch(
  () => shippingForm.value.city,
  () => {
    shippingForm.value.district = ''
  },
)

// 商品小計
const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

// 運費
const shippingFee = computed(() => {
  // 如果總計達到免運門檻，則運費為 0
  if (subtotal.value >= FREE_SHIPPING_THRESHOLD) {
    return 0
  }
  // 根據選擇的配送方式計算運費
  switch (shippingForm.value.shippingMethod) {
    case 'CVS_711':
    case 'CVS_FAMILY':
      return 60
    case 'HOME_DELIVERY':
      return 80
    case 'STORE_PICKUP':
      return 0
    default:
      return shippingForm.value.shippingMethod === 'express' ? 100 : 60
  }
})

// 總計
const total = computed(() => {
  // 計算基礎總額：小計 + 運費 - 優惠折扣
  let totalAmount = subtotal.value + shippingFee.value - discount.value

  // 判斷是否需要外加貨到付款手續費
  if (paymentMethod.value === 'cash_on_delivery') {
    totalAmount += 30 // 貨到付款手續費
  }
  return Math.max(0, totalAmount) // 確保總額不為負數
})

// 結帳
const submitOrder = async () => {
  if (submitting.value) return // 防止重複提交
  submitting.value = true

  try {
    // 根據選擇的配送方式組裝地址
    let finalAddress = ''
    const method = shippingForm.value.shippingMethod
    if (shippingForm.value.shippingMethod === 'HOME_DELIVERY') {
      finalAddress = `${shippingForm.value.city}${shippingForm.value.district}${shippingForm.value.address}`
    } else if (['CVS_711', 'CVS_FAMILY'].includes(method)) {
      finalAddress = `[超商取貨] ${shippingForm.value.cvsStore?.storeName} - ${shippingForm.value.cvsStore?.storeAddress}`
    } else {
      finalAddress = `[門市自取] 門市ID: ${shippingForm.value.pickupStoreId}`
    }
    // 建立訂單資料
    const orderData = {
      name: shippingForm.value.name,
      phone: shippingForm.value.phone,
      address: finalAddress, // 使用組裝的地址
      shippingMethod: shippingForm.value.shippingMethod,
      shippingFee: shippingFee.value, // 運費
      discount: discount.value, // 折扣金額
      couponCode: couponCode.value, // 優惠券代碼
      notes: shippingForm.value.notes,
      paymentMethod: paymentMethod.value,
      total: total.value,
      // 傳遞購物車項目
      items: cartItems.value.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      // 如果是信用卡，可寫備註
      ...(paymentMethod.value === 'credit_card' && {
        paymentStatus: 'paid', // 先設為待付款，等綠界回傳才改為已付款
      }),
    }

    // 呼叫後端建立訂單
    const response = await api.createOrder(orderData)
    const { ecpayParams, merchantTradeNo } = response.result

    if (paymentMethod.value === 'credit_card' && ecpayParams) {
      toast.info('正在導向支付頁面...')
      processEcpayPayment(ecpayParams)
    } else {
      // 如果是貨到付款或轉帳，直接清空並完成訂單
      cartStore.clearCart()
      Storage.remove(CART_KEY)

      toast.success('訂單建立成功！')
      goCheckoutSuccess(merchantTradeNo)
    }
  } catch (error) {
    console.debug('訂單建立失敗:', error)
    toast.error('訂單建立失敗，請稍後再試')
  } finally {
    submitting.value = false
  }
}

// 刪除 & 取消
const removeItem = (id) => {
  modalStore.open({
    title: '提示',
    message: '確定要刪除此項商品嗎?',
    onConfirm: () => {
      cartStore.removeProduct(id) // 呼叫 store 刪除商品
      // Storage.set(CART_KEY, cartStore.cart)  同步 LocalStorage
      toast.success('商品已移除')
      if (cartItems.value.length === 0) {
        goTo('overview')
      }
    },
  })
}
// 點擊後回到頁面頂端
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth', // 平滑滾動效果
  })
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
  scrollToTop() // 置頂
}

const previousStep = () => {
  currentStep.value--
  scrollToTop() // 置頂
}

// 實作跳轉函式
const processEcpayPayment = (params) => {
  // 建立一個隱藏的 form
  const form = document.createElement('form')
  form.method = 'POST'
  // 注意：測試環境網址是 https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5
  // 正式環境網址不同，建議由後端回傳 action 網址或寫在 config
  form.action = 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5'

  // 將所有參數塞入 input
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = key
      input.value = params[key]
      form.appendChild(input)
    }
  }

  // 插入到 body 並執行送出
  document.body.appendChild(form)
  form.submit()
}

const applyCoupon = async () => {
  const code = couponCode.value.trim().toUpperCase()

  if (!code) {
    toast.warning('請輸入優惠券代碼')
    return
  }

  try {
    applyingCoupon.value = true
    const response = await api.validateCoupon(code)

    const data = response.result

    // 測試用
    // 假設後端回傳格式為 { valid: true, discountAmount: 100, message: '成功' }
    if (data && data.valid) {
      discount.value = data.discountAmount //更新折扣金額
      toast.success(response.msg || '優惠券套用成功！')
    } else {
      discount.value = 0 // 清空折扣金額
      toast.error(response.msg || '優惠券無效或已過期')
    }
  } catch (error) {
    toast.error('優惠券驗證失敗', error)
  } finally {
    applyingCoupon.value = false
  }
}

const formatCardNumber = (value) => {
  // 格式化信用卡號：1234 5678 9012 3456
  const formatted = value.replace(/\s/g, '').replace(/[^0-9]/gi, '')
  const matches = formatted.match(/\d{4,16}/g)
  const match = (matches && matches[0]) || ''
  const parts = []

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4))
  }

  // 如果有格式化後的號碼，就更新表單的值
  if (parts.length) {
    creditCardForm.value.cardNumber = parts.join(' ')
  } else {
    creditCardForm.value.cardNumber = formatted
  }
}

const formatExpiryDate = (value) => {
  // 格式化有效期限：MM/YY
  const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2')
  creditCardForm.value.expiryDate = formatted
}

// 生命週期
onMounted(() => {
  // 如果購物車是空的，就回到商品總覽
  if (!cartItems.value || cartItems.value.length === 0) {
    goTo('overview')
    return
  }
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
}

.checkout-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  align-items: start;
}

.main-content {
  grid-column: 1 / 3;
}

/* 進度條外框 */
.modern-steps {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  padding: 12px 30px;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.04),
    0 2px 4px rgba(0, 0, 0, 0.02);
}

.step-container {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  width: 100%;
}

.step-wrapper {
  display: flex;
  align-items: center;
  flex: 1;
}

.step-wrapper:last-child {
  flex: none;
}

.step-item {
  display: flex;
  align-items: center;
  padding: 6px 0px;
  border-radius: 30px;
  transition: all 0.4s ease;
}

/* 進度條文字 */
.step-text {
  margin-left: 5px;
  font-size: 14px;
  color: #86868b;
  white-space: nowrap;
}

/* 進度條圓圈 */
.step-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(145deg, #3a3a3c, #1c1c1e);
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.2, 0, 0, 1);
}

/* 進度條圓圈進行中狀態 */
.step-item.active .step-icon {
  background: #000000;
  transform: scale(1.15);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

/* 已完成狀態 */
.step-item.completed .step-icon {
  background: #34c759;
  color: #fff;
}

.step-item.active .step-text {
  color: #1d1d1f;
  font-weight: 600;
}

/* 連接線 */
.step-line {
  position: relative;
  flex-grow: 1;
  width: auto;
  min-width: 80px;
  height: 2px;
  margin-left: 5px;
  margin-right: 5px;
  background: #e5e5e7;
  overflow: hidden;
  transform: translateY(0px);
}

.step-line::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: #34c759;
  transform: translateX(-100%);
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.step-line.active::after {
  transform: translateX(0);
}

.step-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
}

/* 共用卡片 */
.option-card {
  display: flex;
  align-items: center;
  padding: 50px 50px;
  min-height: 100px;
  border: 2px solid #e5e5e7;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s ease;
  background-color: #fff;
  width: 100%;
}

.option-card:hover {
  background-color: #f5f5f7;
}

/* 卡片選中狀態 */
:deep(.el-radio.is-checked.option-card) {
  border-color: #0071e3;
  background-color: #f5faff;
}

/* 隱藏原生 radio */
:deep(.el-radio__input) {
  display: none;
}

/* 卡片內容 */
.option-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.option-label {
  font-weight: 500;
  color: #1d1d1f;
  display: block;
  margin-bottom: 4px;
}

.option-hint {
  font-size: 13px;
  color: #86868b;
  line-height: 2;
}

.option-price {
  position: absolute;
  top: 12px;
  right: 16px;
}

.checkout-step {
  padding: 32px;
  border-radius: 16px;
  margin-bottom: 24px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 訂單明細 */
.item-card {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 24px;
  padding: 20px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  transition: all 0.3s ease;
}

/* 訂單明細圖片 */
.item-image {
  width: 100px;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
}

.item-details {
  margin-left: 16px;
  flex: 1;
  min-width: 150px;
}

.item-name {
  font-weight: 500;
}

.item-description {
  color: #6b7280;
}

.item-quantity-control {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
  font-size: 14px;
  color: #6b7280;
}

.quantity-label {
  color: #6b7280;
}
/* +-按鈕 */
:deep(.el-input-number) {
  width: 120px;
  height: 30px;
}

/* 訂單明細價格 */
.item-price-info {
  min-width: 120px;
}

.item-total-price {
  font-size: 25px;
  font-weight: 600;
  color: #f97316;
}

.item-unit-price {
  font-size: 14px;
  color: #6b7280;
}

/* 刪除按鈕 */
.delete-btn {
  --el-button-bg-color: #fff1f0;
  --el-button-text-color: #ff4d4f;
  --el-button-border-color: #ffccc7;

  --el-button-hover-bg-color: #ff4d4f;
  --el-button-hover-text-color: #ffffff;
  --el-button-hover-border-color: #ff4d4f;

  justify-self: end;
  border-radius: 10px;
  padding: 8px 15px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.2);
}

:deep(.el-button--danger) {
  background-color: var(--el-button-bg-color);
  color: var(--el-button-text-color);
  border-color: var(--el-button-border-color);
}

.minimalist-form :deep(.el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border-bottom: 1px solid #dcdfe6;
  border-radius: 0;
  padding: 0 4px;
  transition: border-color 0.3s ease;
  width: 100%;
}

/* 統一限制表單項目的寬度，這樣右側邊界就會對齊 */
.minimalist-form :deep(.narrow-item) {
  max-width: 400px;
}

.minimalist-from :deep(.wide-item) {
  max-width: 700px; /* 比較寬的項目可以有更大的寬度 */
}

.minimalist-form :deep(.el-textarea__inner) {
  max-width: 500px;
}

.minimalist-form :deep(.el-input__wrapper:hover) {
  border-bottom-color: #a8abb2;
}

.minimalist-form :deep(.el-input__wrapper.is-focus) {
  border-bottom: 2px solid #0071e3 !important;
}

.minimalist-form :deep(.el-select .el-input__wrapper) {
  padding-right: 0;
}

.minimalist-form :deep(.el-textarea__inner) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none;
  border-bottom: 1px solid #dcdfe6;
  border-radius: 0;
  padding: 8px 4px;
  resize: none;
}

.minimalist-form :deep(.el-textarea__inner:focus) {
  border-bottom: 2px solid #0071e3;
}

.minimalist-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #86868b;
  padding-bottom: 4px;
}

/* 錯誤提示時的底線顏色 */
.minimalist-form :deep(.el-form-item.is-error .el-input__wrapper) {
  border-bottom-color: #f56c6c !important;
}

/* 簡約質感配送/付款選項 */
.modern-selector-group,
.el-radio-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 一排兩個 */
  gap: 16px;
}

/* 配送地址 */
.address-fields {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 30%;
}

.address-selects {
  display: flex;
  gap: 8px;
}

:deep(.el-radio.payment-option-card) {
  margin-right: 0;
}

.payment-option-content {
  display: flex;
  align-items: center;
}

.payment-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px; /* 離開 radio 圓點一點點 */
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

.credit-card-form-container {
  margin-top: 24px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: #ffffff;
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

/* 上一步 & 下一步 & 確認訂單 按鈕*/
.navigation-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
  gap: 12px;
}

.order-summary-card {
  background-color: #fff;
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

.tax-info {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 16px;
}

.coupon-section {
  width: 100%;
  max-width: 280px;
  margin-bottom: 16px;
}

.coupon-section :deep(.el-iput__inner) {
  text-align: center;
}

.coupon-section :deep(.el-input__inner::placeholder) {
  text-align: center;
}

.summary-item-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.summary-item-list-title {
  font-weight: 600;
  font-size: 18px;
  color: #1d1d1f;
  margin-bottom: 4px;
}

.summary-item-line {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

/* 推薦 */
:deep(.recommend-column) {
  position: sticky;
  top: 20px;
}
</style>
