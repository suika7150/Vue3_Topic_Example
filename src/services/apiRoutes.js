export const API_ROUTES = {
  REGISTER: '/api/register', // 註冊
  SEND_EMAIL_CODE: '/api/send-email-code', // 信箱驗證碼
  VERIFY_EMAIL_CODE: '/api/verify-email-code', // 驗證信箱驗證碼
  LOGIN: '/api/login', // 登入
  USER: '/api/user',
  FINDUSER: '/api/finduser', // 找回密碼
  PROFILE: '/api/profile', // 取得使用者資料
  LOGOUT: '/api/logout', // 登出
  VERIFY_LOGIN_CODE: '/api/login/verify-email-code', // 驗證登入信箱驗證碼
  PRODUCT_ADD: '/api/addProducts', // 新增商品
  PRODUCT_LIST: '/api/products', // 商品列表
  PRODUCT_GET: (id) => `/api/products/${id}`, // 取得單一商品
  PRODUCT_IMAGE: (id) => `/api/products/${id}/image`, // 取得商品圖片
  PRODUCT_DETAIL: (id) => `/api/products/edit/${id}`, // 編輯商品
  PRODUCT_UPDATE: (id) => `/api/updateProducts/${id}`, // 更新商品
  PRODUCT_MANAGE_LIST: `/api/products/list`,
  PRODUCT_DELETE: (id) => `/api/deleteProducts/${id}`, // 刪除商品
  CATEGORY_LIST: '/api/categories', // 篩選商品
  COUPON_VALIDATE: (code) => `/api/coupon/validate/${code}`, // 驗證優惠券
  ORDER_CREATE: '/api/orders', // 新增訂單
  ORDER_LIST: '/api/orderList', // 訂單列表
  ORDER_DETAIL: (id) => `/api/orders/${id}`, // 訂單詳情
  PAYMENT_GET_PARAMS: (paymentId) => `/api/payment/params/${paymentId}`, // 綠界支付
  OPTIONS_LIST: `/api/options/list`,
  OPTIONS_ADD: `/api/options/add`,
  OPTIONS_UPDATE: (id) => `/api/options/update/${id}`,
  OPTIONS_DELETE: (id) => `/api/options/delete/${id}`,
  OPTIONS_BY_LISTNAME: () => `/api/options/getByListName`,
}
