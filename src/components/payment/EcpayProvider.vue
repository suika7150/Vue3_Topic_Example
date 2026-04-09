/** 測試綠界金流專用 */
<template>
  <form v-if="paymentData" ref="ecpayForm" :action="ecpayUrl" method="POST" style="display: none">
    <input v-for="(val, key) in paymentData" :key="key" :name="key" :value="val" />
  </form>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import api from '@/service/api'

const props = defineProps({
  paymentId: { type: String, required: true },
})

const ecpayForm = ref(null)
const paymentData = ref(null)
const ecpayUrl = 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5' // 測試環境地址

// 外部呼叫此方法啟動金流
const processPayment = async () => {
  try {
    // 向後端請求加密後的金流參數 (MerchantID, CheckMacValue 等)
    const res = await api.getEcpayParams(props.paymentId)
    const data = res.data

    // 重新對接欄位名稱，確保符合綠界規範 (左邊是綠界要求，右邊是你後端回傳)
    paymentData.value = {
      MerchantID: data.merchantID,
      MerchantTradeNo: data.merchantTradeNo,
      // 日期建議由後端傳回，若無則前端補，格式須為 yyyy/MM/dd HH:mm:ss
      MerchantTradeDate:
        data.merchantTradeDate ||
        new Date().toLocaleString('zh-TW', { hour12: false }).replace(/-/g, '/'),
      PaymentType: 'aio',
      TotalAmount: data.tradeAmt,
      TradeDesc: 'ECS_Store_Order',
      ItemName: 'ECS商品一批',
      ReturnURL: 'https://palladous-upmost-margaretta.ngrok-free.dev/api/payment/callback',
      ChoosePayment: 'Credit',
      CheckMacValue: data.checkMacValue,
      EncryptType: '1',
      ClientBackURL: 'http://localhost:5173/checkout/success', // 付款完後使用者點「回到商店」的網址
    }

    // 等 DOM 更新後，自動送出表單
    await nextTick()
    ecpayForm.value.submit()
  } catch (error) {
    console.error('金流啟動失敗', error)
  }
}

defineExpose({ processPayment })
</script>
