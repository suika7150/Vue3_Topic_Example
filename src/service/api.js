/* 使用 apiService.js 建立 axios 實例 */
import { API_ROUTES } from './apiRoutes'
import apiService from './apiService'

const api = {
  /* ===== 使用者相關 API ===== */

  /** 註冊
   *@param {object} data - 註冊資料{username, password, email}
   *@returns {Promise} API 回傳 Promise
   */
  register: (data) => apiService.post(API_ROUTES.REGISTER, data),

  /** * 發送信箱驗證碼
   * @param {string} email - Email 地址
   */
  sendEmailCode: (email) => apiService.post(API_ROUTES.SEND_EMAIL_CODE, { email: email }),

  /** 登入
   * @param {object} data - 登入資料{username, password}
   */
  login: (data) => apiService.post(API_ROUTES.LOGIN, data),

  /** 取得當前使用者資料 */
  user: () => apiService.get(API_ROUTES.USER),

  /** 查詢用戶資料*/
  findUser: () => apiService.get(API_ROUTES.FINDUSER),

  /** 更新使用者資料
   * @param {object} data - 更新個人資料
   */
  updateProfile: (data) => apiService.put(API_ROUTES.PROFILE, data),

  /** 登出 */
  logout: () => apiService.post(API_ROUTES.LOGOUT),

  /* ===== 商品相關 API ===== */

  /** 新增商品
   *@param {object} data - 新增商品資料
   */
  addProduct: (data) => apiService.post(API_ROUTES.PRODUCT_ADD, data),

  /** 取得產品列表 & 搜尋產品*/
  getProducts: (params) => apiService.get(API_ROUTES.PRODUCT_LIST, { params }),

  /** 取得商品詳細資料(前台展示)*/
  getProductInfo: (id) => apiService.get(API_ROUTES.PRODUCT_GET(id)),

  /** 取得商品詳細資料(後台管理)*/
  getProductById: (id) => apiService.get(API_ROUTES.PRODUCT_DETAIL(id)),

  /**更新商品資料
    @param {number|string} id - 商品id
    @param {object} data - 更新商品資料
    */
  updateProduct: (id, data) => apiService.put(API_ROUTES.PRODUCT_UPDATE(id), data),

  /** 取得商品管理列表*/
  getManageProducts: () => apiService.get(API_ROUTES.PRODUCT_MANAGE_LIST),

  /** 刪除商品*/
  deleteProduct: (id) => apiService.put(API_ROUTES.PRODUCT_DELETE(id)),

  /* ===== 選項相關 API ===== */

  /** 取得選項列表*/
  getOptions: () => apiService.get(API_ROUTES.OPTIONS_LIST),

  /** 新增選項*/
  addOption: (data) => apiService.post(API_ROUTES.OPTIONS_ADD, data),

  /** 更新選項*/
  updateOption: (id, data) => apiService.put(API_ROUTES.OPTIONS_UPDATE(id), data),

  /** 刪除選項*/
  deleteOption: (id) => apiService.delete(API_ROUTES.OPTIONS_DELETE(id)),

  /** 取得選項列表*/
  getOptionsByListName: (listName) =>
    apiService.get(API_ROUTES.OPTIONS_BY_LISTNAME(), { params: { listName: listName } }),

  /* ===== 優惠碼相關 API ===== */

  /** 驗證優惠券*/
  validateCoupon: (code) => apiService.get(API_ROUTES.COUPON_VALIDATE(code)),

  /* ===== 訂單相關 API ===== */

  /** 新增訂單*/
  createOrder: (data) => apiService.post(API_ROUTES.ORDER_CREATE, data),

  /** 獲取所有訂單列表*/
  getOrderList: (params) => apiService.get(API_ROUTES.ORDER_LIST, { params }),

  /** 取得訂單詳情*/
  getOrderDetail: (id) => apiService.get(API_ROUTES.ORDER_DETAIL(id)),

  /* ===== 金流相關 API ===== */
  /** * 取得綠界支付需要的加密參數
   * 注意：因為後端是 @PostMapping，所以這裡要用 axios.post
   */
  getEcpayParams: (paymentId) =>
    // POST 請求如果沒有要傳 Body，可以傳空物件 {} 或 null
    apiService.post(API_ROUTES.PAYMENT_GET_PARAMS(paymentId), {}),
}

export default api
