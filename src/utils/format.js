import { isNumber } from 'lodash'
import moment from 'moment'

/**
 * 格式化數字
 * @param {Number} value 要格式化的數字
 * @param {Number} dot   小數點位數
 * @param {String} symbol 前缀
 * @returns
 * @example
 * formatNumber(1000) // 1,000
 * formatNumber(1000, 3) // 1,000.000
 * formatNumber(1000, 3, '$') // $1,000.000
 */
function formatPrice(value, dot = 2, symbol) {
  if (!isNumber(value)) return value
  return `${symbol || ''}${value.toFixed(dot).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

/**
 * 格式化日期
 * @param {Date} date 要格式化的日期
 * @param {String} style 格式化样式
 * @returns
 * @example
 * formatDate(new Date()) // 2022-01-01
 * formatDate(new Date(), 'full') // 2022-01-01 00:00:00
 * formatDate(new Date(), 'minute') // 2022-01-01 00:00
 */
function formatDate(date, style) {
  switch (style) {
    case 'full':
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    case 'minute':
      return moment(date).format('YYYY-MM-DD HH:mm')
    default:
      return moment(date).format('YYYY-MM-DD')
  }
}

/**
 * 秒數轉換為時分秒
 *
 * @param {*} totalSeconds 秒數
 * @returns 時分秒
 * @example
 * formatSecondsToHHMMSS(3600) // 01:00:00
 */
function formatSecondsToHHMMSS(totalSeconds) {
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

export { formatPrice, formatDate, formatSecondsToHHMMSS }
