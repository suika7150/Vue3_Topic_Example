/** 測試綠界金流 */
<template>
  <form v-if="paymentData" ref="ecpayForm" :action="ecpayUrl" method="POST" style="display: none">
    <input v-for="(val, key) in paymentData" :key="key" :name="key" :value="val" />
  </form>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import api from '@/service/api'

const props = defineProps({
  orderId: { type: String, required: true },
})

const ecpayForm = ref(null)
const paymentData = ref(null)
const ecpayUrl = 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5' // 測試環境地址

// 外部呼叫此方法啟動金流
const processPayment = async () => {
  try {
    // 1. 向後端請求加密後的金流參數 (MerchantID, CheckMacValue 等)
    const res = await api.getEcpayParams(props.orderId)
    paymentData.value = res.data

    // 2. 等 DOM 更新後，自動送出表單
    await nextTick()
    ecpayForm.value.submit()
  } catch (error) {
    console.error('金流啟動失敗', error)
  }
}

// 暴露方法給父元件
defineExpose({ processPayment })
</script>
