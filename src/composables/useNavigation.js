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
    if (router.currentRoute.value.name === name) return
    router.push({ name, params, query })
  }

  const replaceTo = (name, params = {}, query = {}) => {
    router.replace({ name, params, query })
  }

  const goBack = () => {
    router.back()
  }

  return {
    goTo,
    replaceTo,
    goBack,
    goNews,
    goAbout,
    goHome,
    goLogin,
    goShoppingGuide,
    goQA,
    goFlashSale,
    goLuckyWheel,
    goAnime,
    goOrderDetail,
    goMovie,
  }
}
