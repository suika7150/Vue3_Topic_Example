/** 測試綠界金流專用 */
<template>
  <form v-if="paymentData" ref="ecpayForm" :action="ecpayUrl" method="POST" style="display: none">
    <input v-for="(val, key) in paymentData" :key="key" :name="key" :value="val" />
  </form>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import api from '@/services/api'

const props = defineProps({
  paymentId: { type: String, required: true },
})

const ecpayForm = ref(null)
const paymentData = ref(null)
const ecpayUrl = 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5' // 綠界測試網址

const processPayment = async () => {
  try {
    const res = await api.getEcpayParams(props.paymentId)
    const data = res.data

    paymentData.value = {
      MerchantID: data.merchantID,
      MerchantTradeNo: data.merchantTradeNo,
      MerchantTradeDate: data.merchantTradeDate,
      PaymentType: data.paymentType || 'aio',
      TotalAmount: String(data.totalAmount),
      TradeDesc: data.tradeDesc,
      ItemName: data.itemName,
      ReturnURL: data.returnURL,
      ChoosePayment: data.choosePayment || 'Credit',
      CheckMacValue: data.checkMacValue,
      EncryptType: data.encryptType || '1',
      ClientBackURL: data.clientBackURL,
    }

    await nextTick()
    ecpayForm.value.submit()
  } catch (error) {
    console.debug('金流啟動失敗', error)
  }
}

defineExpose({ processPayment })
</script>
