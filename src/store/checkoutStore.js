import { defineStore } from 'pinia'

const defaultShippingForm = () => ({
  name: '',
  phone: '',
  shippingMethod: 'HOME_DELIVERY',

  // 地址
  city: '',
  district: '',
  address: '',

  // 超商 / 門市
  cvsStore: null,
  pickupStoreId: '',

  // 備註
  notes: '',

  // 發票
  invoiceType: 'DIGITAL',
  invoiceCarrier: 'MEMBER',
  phoneCarrier: '',
  certCarrier: '',
  companyTaxId: '',
  companyTitle: '',
})

export const useCheckoutStore = defineStore('checkoutStore', {
  state: () => ({
    currentStep: 0,
    shippingForm: defaultShippingForm(),

    paymentMethod: 'CREDIT_CARD',

    couponCode: '',
    discount: 0,
  }),

  actions: {
    nextStep() {
      this.currentStep++
    },

    prevStep() {
      this.currentStep--
    },

    reset() {
      this.currentStep = 0
      this.shippingForm = defaultShippingForm()

      this.paymentMethod = 'CREDIT_CARD'
      this.couponCode = ''
      this.discount = 0
    },
  },

  persist: true,
})
