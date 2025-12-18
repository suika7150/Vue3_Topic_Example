import { useRouter } from 'vue-router'

export function useNavigation() {
  const router = useRouter()

  const goSetting = () => {
    router.push({ name: 'Setting' })
  }

  const goHome = () => {
    router.push({ name: 'Home' })
  }

  const goLogin = () => {
    router.push({ name: 'Login' })
  }

  const goRegister = () => {
    router.push({ name: 'Register' })
  }

  const goAbout = () => {
    router.push({ name: 'About' })
  }
  const goNews = () => {
    router.push({ name: 'News' })
  }
  const goShoppingGuide = () => {
    router.push({ name: 'ShoppingGuide' })
  }

  const goQA = () => {
    router.push({ name: 'QA' })
  }

  const goTo = (name, params = {}, query = {}) => {
    router.push({ name, params, query })
  }

  const replaceTo = (name, params = {}, query = {}) => {
    router.replace({ name, params, query })
  }

  const goBack = () => {
    router.back()
  }

  return {
    goNews,
    goAbout,
    goHome,
    goLogin,
    goTo,
    replaceTo,
    goBack,
    goShoppingGuide,
    goQA,
  }
}
