/**
 * 狀態碼定義 (對應後端 ResultCode.java)
 */
export const ResultCode = {
  SUCCESS: '0000',
  FAIL: '9999',
  UNAUTHORIZED: '0401',
  FORBIDDEN: '0403',
  NOT_FOUND: '0404',
  VALIDATION_ERROR: '0422',
  SERVER_ERROR: '0500',
  BAD_GATEWAY: '0501',
  GATEWAY_TIMEOUT: '0502',
  SERVICE_UNAVAILABLE: '0503',
  INTERNAL_SERVER_ERROR: '0504',
  ACCOUNT_IS_EXIST: '0101',
  EMAIL_IS_EXIST: '0102',
  USER_NOT_FOUND: '0103',
  PASSWORD_NOT_MATCH: '0104',
  USER_IS_EXIST: '0105',
  USER_IS_NOT_EXIST: '0106',
  USER_IS_NOT_ACTIVE: '0107',
  USER_IS_NOT_AUTHORIZED: '0108',
  USER_IS_NOT_AUTHENTICATED: '0109',
}

/**
 * 取得狀態碼對應的預設中文訊息
 */
export const ResultMsg = {
  [ResultCode.SUCCESS]: '成功',
  [ResultCode.USER_NOT_FOUND]: '此帳號不存在',
  [ResultCode.USER_IS_NOT_EXIST]: '帳號不存在，請重新輸入',
  [ResultCode.PASSWORD_NOT_MATCH]: '帳號或密碼輸入錯誤',
  [ResultCode.FAIL]: '系統繁忙，請稍後再試',
  [ResultCode.ACCOUNT_IS_EXIST]: '帳號已存在',
  [ResultCode.EMAIL_IS_EXIST]: 'Email 已存在',
}

/**
 * 模擬 Java 的 fromCode 功能 (非必須，但在 JS 中可以用來做查找)
 * @param {string} code
 * @returns {string} 對應的訊息
 */
export const getMsgByCode = (code) => {
  if (!code) return '連線異常，請稍後再試'
  return ResultMsg[code] || `發生未知錯誤 (${code})`
}
