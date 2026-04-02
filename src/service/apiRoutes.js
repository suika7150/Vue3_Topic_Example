export const API_ROUTES = {
  REGISTER: '/api/register',
  LOGIN: '/api/login',
  USER: '/api/user',
  FINDUSER: '/api/finduser',
  PROFILE: '/api/profile',
  LOGOUT: '/api/logout',
  PRODUCT_ADD: '/api/addProducts',
  PRODUCT_LIST: '/api/products',
  PRODUCT_GET: (id) => `/api/products/${id}`,
  PRODUCT_DETAIL: (id) => `/api/products/edit/${id}`,
  PRODUCT_UPDATE: (id) => `/api/updateProducts/${id}`,
  PRODUCT_MANAGE_LIST: `/api/products/list`,
  PRODUCT_DELETE: (id) => `/api/deleteProduct/${id}`,
  COUPON_VALIDATE: (code) => `/api/coupon/validate/${code}`, // 驗證優惠券
  ORDER_CREATE: '/api/orders', //新增訂單
  OPTIONS_LIST: `/api/options/list`,
  OPTIONS_ADD: `/api/options/add`,
  OPTIONS_UPDATE: (id) => `/api/options/update/${id}`,
  OPTIONS_DELETE: (id) => `/api/options/delete/${id}`,
  OPTIONS_BY_LISTNAME: () => `/api/options/getByListName`,
}
