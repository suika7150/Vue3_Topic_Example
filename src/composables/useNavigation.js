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

  const goAbout = () => {
    router.push({ name: 'About' })
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
    goAbout,
    goHome,
    goLogin,
    goTo,
    replaceTo,
    goBack,
  }
}
