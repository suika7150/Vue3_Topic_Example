// 全域標準日誌工具
export const getErrorMessage = (error) => {
  if (!error) return '未知錯誤'
  return error.msg || error.response?.data?.msg || error.message || '系統網路異常'
}

export const logger = {
  // 預期的系統訊息
  info(moduleName, message) {
    console.info(
      `%c[INFO][${moduleName}] %c${message}`,
      'color: #3b82f6; font-weight: bold;',
      'color: inherit;',
    )
  },

  // 預期的系統錯誤
  warn(moduleName, message, rawError = null) {
    const reason = getErrorMessage(rawError)
    console.warn(`[WARN][${moduleName}] ${message} -> 原因: ${reason}`)
  },

  // 預期外的系統崩潰
  error(moduleName, message, rawError = null) {
    const reason = getErrorMessage(rawError)
    // error 等級會自動抓取 Stack Trace，方便線上環境追查
    console.error(`[ERROR][${moduleName}] ${message} -> 原因: ${reason}`, rawError)
  },

  // 開發者 debug 用
  debug(moduleName, message, data = null) {
    if (data) {
      console.debug(`[DEBUG][${moduleName}] ${message}`, data)
    } else {
      console.debug(`[DEBUG][${moduleName}] ${message}`)
    }
  },
}
