import { reactive } from 'vue'

export function createAppContext() {
  const context = reactive({
    theme: 'light',
    locale: 'zh',
    toggleTheme() {
      context.theme = context.theme === 'light' ? 'dark' : 'light'
    },
    toggleLocale() {
      context.locale = context.locale === 'zh' ? 'en' : 'zh'
    },
  })

  return context
}
