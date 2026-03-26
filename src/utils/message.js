import { ElMessage } from 'element-plus'

/**
 * toast
 *封裝統一的訊息樣式
 */

export const toast = {
  success(msg) {
    ElMessage({
      message: msg,
      type: 'success',
      plain: true,
      center: true,
      duration: 2000,
      showClose: true, // 讓使用者可以手動點掉，增加掌控感
      grouping: true, // 炫泡重點：瘋狂點擊時訊息會疊加，而不是跳出一排
      offset: 60,
      // 使用自定義類名，等等我們去 CSS 加點特效
      customClass: 'glow-toast-success',
    })
  },
  error(msg) {
    ElMessage({
      message: msg,
      type: 'error',
      plain: true,
      center: true,
      duration: 4000, // 錯誤多停一下
      showClose: true,
      grouping: true,
      customClass: 'glow-toast-error',
    })
  },
  warning(msg) {
    ElMessage({
      message: msg,
      type: 'warning',
      plain: true,
      center: true,
      showClose: true,
      grouping: true,
      customClass: 'glow-toast-warning',
    })
  },
  info(msg) {
    ElMessage({
      message: msg,
      type: 'info',
      plain: true,
      center: true,
      duration: 2000,
      showClose: true,
      grouping: true,
      customClass: 'glow-toast-info',
    })
  },
}
