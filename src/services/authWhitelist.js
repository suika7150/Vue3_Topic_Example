import { API_ROUTES } from '@/services/apiRoutes'
import { logger } from '@/utils/logger'

const { LOGIN, REGISTER, USER } = API_ROUTES
const whiteList = [LOGIN, REGISTER, USER]

// 判斷 API 路徑是否屬於免驗證白名單
export function isWhiteListed(url, baseURL) {
  try {
    const pathname = new URL(url, baseURL).pathname
    const isWhiteListed = whiteList.some((path) => pathname.startsWith(path))
    return isWhiteListed
  } catch (error) {
    logger.debug('無法解析 URL：', error)
    return false
  }
}
