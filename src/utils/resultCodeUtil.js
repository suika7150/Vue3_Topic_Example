// 狀態碼定義 (對應後端 ResultCode.java)
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
  EMAIL_EMPTY: '0103',
  USER_NOT_FOUND: '0104',
  PASSWORD_NOT_MATCH: '0105',
  USER_IS_EXIST: '0106',
  USER_IS_NOT_EXIST: '0107',
  USER_IS_NOT_ACTIVE: '0108',
  USER_IS_NOT_AUTHORIZED: '0109',
  USER_IS_NOT_AUTHENTICATED: '0110',
  USER_STATUS_ERROR: '0111',
  OTP_NOT_FOUND: '0112',
  OTP_EXPIRED: '0113',
  OTP_ALREADY_USED: '0114',
  OTP_INVALID: '0115',
}

// 取得狀態碼對應的預設中文訊息
export const ResultMsg = {
  [ResultCode.SUCCESS]: '成功',
  [ResultCode.USER_NOT_FOUND]: '此帳號不存在',
  [ResultCode.USER_IS_NOT_EXIST]: '帳號不存在，請重新輸入',
  [ResultCode.PASSWORD_NOT_MATCH]: '帳號或密碼輸入錯誤',
  [ResultCode.FAIL]: '系統繁忙，請稍後再試',
  [ResultCode.ACCOUNT_IS_EXIST]: '帳號已存在',
  [ResultCode.EMAIL_IS_EXIST]: 'Email 已存在',
  [ResultCode.EMAIL_EMPTY]: '請輸入 Email',
  [ResultCode.OTP_NOT_FOUND]: '驗證碼不存在或已失效',
  [ResultCode.OTP_EXPIRED]: '驗證碼已過期，請重新取得',
  [ResultCode.OTP_ALREADY_USED]: '驗證碼已使用，請重新取得',
  [ResultCode.OTP_INVALID]: '驗證碼錯誤，請重新輸入',
}

// 模擬 Java 的 fromCode 功能
export const getMsgByCode = (code) => {
  if (!code) return '連線異常，請稍後再試'
  return ResultMsg[code] || `發生未知錯誤 (${code})`
}
