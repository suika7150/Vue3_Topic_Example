import { inject } from 'vue'
import { AppContextKey } from '../provide/context-key'

export function useAppContext() {
  const context = inject(AppContextKey)
  if (!context) {
    throw new Error('AppContext is not provided')
  }
  return context
}
