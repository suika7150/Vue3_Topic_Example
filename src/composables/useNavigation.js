import { useRouter } from 'vue-router'

export function useNavigation() {
  const router = useRouter()

  const goSetting = () => {
    router.push({ name: 'setting' })
  }

  const goHome = () => {
    router.push({ name: 'home' })
  }

  const goLogin = () => {
    router.push({ name: 'login' })
  }

  const goRegister = () => {
    router.push({ name: 'register' })
  }

  const goAbout = () => {
    router.push({ name: 'about' })
  }

  const goNews = () => {
    router.push({ name: 'news' })
  }

  const goProducts = () => {
    router.push({ name: 'overview' })
  }

  // const goEditProduct = () => {
  //   router.push({ name: 'editProduct' })
  // }

  const goFlashSale = () => {
    router.push({ name: 'flashSale' })
  }

  const goLuckyWheel = () => {
    router.push({ name: 'luckyWheel' })
  }

  const goAnime = () => {
    router.push({ name: 'anime' })
  }

  const goMovie = () => {
    router.push({ name: 'movie' })
  }

  const goDesigner = () => {
    router.push({ name: 'designer' })
  }

  const goLimited = () => {
    router.push({ name: 'limited' })
  }

  const goShoppingGuide = () => {
    router.push({ name: 'shoppingGuide' })
  }

  const goQA = () => {
    router.push({ name: 'qa' })
  }

  const goOrderDetail = () => {
    router.push({ name: 'orderDetail' })
  }

  const goTo = (name, params = {}, query = {}) => {
    // if (router.currentRoute.value.name === name) return
    router.push({ name, params, query })
  }

  const replaceTo = (name, params = {}, query = {}) => {
    router.replace({ name, params, query })
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
  }
}
