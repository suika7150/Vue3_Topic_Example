import { API_ROUTES } from '@/service/apiRoutes'
const { LOGIN, REGISTER, USER } = API_ROUTES
//  定義不需要攜帶 token 的 API 路徑（可自由擴充）
const whiteList = [LOGIN, REGISTER, USER]

/**
 * 判斷 API 路徑是否屬於免驗證白名單
 * @param {string} url - 原始 API 路徑（可為相對或絕對 URL）
 * @param {string} baseURL - 基礎 URL，用來解析相對路徑
 * @returns {boolean}
 */
export function isWhiteListed(url, baseURL) {
  try {
    const pathname = new URL(url, baseURL).pathname
    const isWhiteListed = whiteList.some((path) => pathname.startsWith(path))
    return isWhiteListed
  } catch (e) {
    console.warn('無法解析 URL：', url)
    return false
  }
}
