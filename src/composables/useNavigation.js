// import { name } from '@vue/eslint-config-prettier/skip-formatting'
import { useRouter } from 'vue-router'

export function useNavigation() {
  const router = useRouter()

  //設定
  const goSetting = () => {
    router.push({ name: 'setting' })
  }

  //首頁
  const goHome = () => {
    router.push({ name: 'home' })
  }

  //登入
  const goLogin = () => {
    router.push({ name: 'login' })
  }

  //註冊
  const goRegister = () => {
    router.push({ name: 'register' })
  }

  //關於我們
  const goAbout = () => {
    router.push({ name: 'about' })
  }

  //新聞
  const goNews = () => {
    router.push({ name: 'news' })
  }

  //商品總覽
  const goProducts = () => {
    router.push({ name: 'overview' })
  }

  //本週特惠
  const goFlashSale = () => {
    router.push({ name: 'flashSale' })
  }

  //幸運輪盤
  const goLuckyWheel = () => {
    router.push({ name: 'luckyWheel' })
  }

  //動漫聯名款
  const goAnime = () => {
    router.push({ name: 'anime' })
  }

  //電影大聯盟
  const goMovie = () => {
    router.push({ name: 'movie' })
  }

  //設計師聯名款
  const goDesigner = () => {
    router.push({ name: 'designer' })
  }

  //全球限量版
  const goLimited = () => {
    router.push({ name: 'limited' })
  }

  //購物指南
  const goShoppingGuide = () => {
    router.push({ name: 'shoppingGuide' })
  }

  //常見問題
  const goQA = () => {
    router.push({ name: 'qa' })
  }

  //訂單詳情
  const goOrderDetail = () => {
    router.push({ name: 'orderDetail' })
  }

  //跳轉到指定路由
  const goTo = (target, params = {}, query = {}) => {
    if (typeof target === 'string' && target.startsWith('/')) {
      router.push({ path: target, params, query })
    } else {
      router.push({ name: target, params, query })
    }
  }

  //替換到指定路由
  const replaceTo = (target, params = {}, query = {}) => {
    if (typeof target === 'string' && target.startsWith('/')) {
      router.replace({ path: target, query })
    } else {
      router.replace({ name: target, params, query })
    }
  }

  return {
    goTo,
    replaceTo,
    goNews,
    goAbout,
    goHome,
    goLogin,
    goProducts,
    goShoppingGuide,
    goQA,
    goFlashSale,
    goLuckyWheel,
    goAnime,
    goOrderDetail,
    goMovie,
    goDesigner,
    goLimited,
    goRegister,
    goSetting,
  }
}
