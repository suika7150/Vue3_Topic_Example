export const API_ROUTES = {
  REGISTER: '/api/register',
  SEND_EMAIL_CODE: '/api/send-email-code', // 信箱驗證碼
  VERIFY_EMAIL_CODE: '/api/verify-email-code', // 驗證信箱驗證碼
  LOGIN: '/api/login',
  USER: '/api/user',
  FINDUSER: '/api/finduser',
  PROFILE: '/api/profile',
  LOGOUT: '/api/logout',
  PRODUCT_ADD: '/api/addProducts',
  PRODUCT_LIST: '/api/products',
  PRODUCT_GET: (id) => `/api/products/${id}`,
  PRODUCT_IMAGE: (id) => `/api/products/${id}/image`,
  PRODUCT_DETAIL: (id) => `/api/products/edit/${id}`,
  PRODUCT_UPDATE: (id) => `/api/updateProducts/${id}`,
  PRODUCT_MANAGE_LIST: `/api/products/list`,
  PRODUCT_DELETE: (id) => `/api/deleteProducts/${id}`,
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
