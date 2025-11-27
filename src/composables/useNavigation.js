import { useRouter } from 'vue-router'
import { useSidebarStore } from '@/store/sidebarStore'

export function useNavigation() {
  const router = useRouter()
  // const sidebarStore = useSidebarStore()

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
  const goNews = () => {
    router.push({ name: 'News' })
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
  }
}
