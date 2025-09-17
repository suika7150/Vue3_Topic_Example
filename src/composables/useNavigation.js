import { useRouter } from 'vue-router'

export function useNavigation() {
  const router = useRouter()

  const goHome = () => {
    router.push({ name: 'Home' })
  }

  const goLogin = () => {
    router.push({ name: 'Login' })
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
    goHome,
    goLogin,
    goTo,
    replaceTo,
    goBack,
  }
}
