export const API_ROUTES = {
  // 使用者、登入、驗證 API
  REGISTER: '/api/v1/auth/register', // 註冊
  SEND_EMAIL_CODE: '/api/v1/auth/email-code/send', // 發送信箱驗證碼
  VERIFY_EMAIL_CODE: '/api/v1/auth/email-code/verify', // 驗證信箱驗證碼
  LOGIN: '/api/v1/auth/login', // 登入
  VERIFY_LOGIN_CODE: '/api/v1/auth/2fa/verify', // 二階段驗證登入信箱驗證碼
  LOGOUT: '/api/v1/auth/logout', // 登出
  USER: '/api/v1/users/me', // 當前登入使用者
  PROFILE: '/api/v1/users/profile', // 使用者個人資料

  // 商品、訂單相關 API
  PRODUCT_CREATE: '/api/v1/products', // 新增商品
  PRODUCT_LIST: '/api/v1/products', // 商品搜尋與列表
  PRODUCT_GET: (id) => `/api/v1/products/${id}`, // 取得單一商品詳情
  PRODUCT_DETAIL: (id) => `/api/v1/products/${id}`, // 編輯商品
  PRODUCT_UPDATE: (id) => `/api/v1/products/${id}`, // 更新商品
  PRODUCT_DELETE: (id) => `/api/v1/products/${id}`, // 刪除商品
  PRODUCT_MANAGE_LIST: '/api/v1/products/list', // 商品維護列表
  PRODUCT_IMAGE: (id) => `/api/v1/products/${id}/image`, // 取得商品圖片
  CATEGORY_LIST: '/api/v1/products/categories', // 篩選商品

  // 優惠券相關 API
  COUPON_VALIDATE: (couponCode) => `/api/v1/coupons/validate/${couponCode}`, // 驗證優惠券

  // 支付相關 API
  PAYMENT_GET_PARAMS: (paymentId) => `/api/v1/payments/ecpay-params/${paymentId}`, // 綠界支付

  // 訂單相關 API
  ORDER_CREATE: '/api/v1/orders', // 新增訂單
  ORDER_LIST: '/api/v1/orders', // 訂單列表
  ORDER_DETAIL: (orderId) => `/api/v1/orders/${orderId}`, // 訂單詳情

  // 選項相關 API
  OPTIONS_LIST: '/api/v1/options', // 選項列表 (支援 listName 查詢)
  OPTIONS_ADD: '/api/v1/options', // 新增選項
  OPTIONS_DETAIL: (id) => `/api/v1/options/${id}`, // 取得單一選項詳情
  OPTIONS_UPDATE: (id) => `/api/v1/options/${id}`, // 更新選項
  OPTIONS_DELETE: (id) => `/api/v1/options/${id}`, // 刪除選項
}
