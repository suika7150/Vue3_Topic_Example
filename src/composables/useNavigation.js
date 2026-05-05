import { useRouter } from 'vue-router'

export function useNavigation() {
  const router = useRouter()

  //跳轉到指定路由
  const goTo = (target, params = {}, query = {}) => {
    if (typeof target === 'string' && target.startsWith('/')) {
      router.push({ path: target, query })
    } else {
      router.push({ name: target, params, query })
    }
  }
  //首頁
  const goHome = () => goTo('home')

  //登入
  const goLogin = () => goTo('login')

  //商品詳情
  const goProductDetail = (id) => goTo('productDetail', { id })

  const goCheckout = () => goTo('checkout')

  // 聯名專區
  const goCrossover = (type) => goTo('crossover', { type })

  // 結帳成功跳轉
  const goCheckoutSuccess = (orderId) => goTo('checkoutSuccess', { orderId })

  // 訂單詳情
  const goOrderDetail = (orderId) => goTo('orderDetail', { orderId })

  return {
    goTo,
    goHome,
    goLogin,
    goProductDetail,
    goCheckout,
    goCheckoutSuccess,
    goOrderDetail,
    goCrossover,
    // goNews,
    // goAbout,

    // goDoubleElevenRewards,
    // goDoubleElevenGifts,

    // goSeasonFeatured,
    // goTravelPicks,
    // goProducts,

    // goOrderList,
    // goShoppingGuide,
    // goQA,
    // goFlashSale,
    // goLuckyWheel,
    // goRegister,
    // goSetting,
    // goNotFound,
  }
}
