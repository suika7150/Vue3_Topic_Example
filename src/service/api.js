import Storage, { TOKEN_KEY } from '@/utils/storageUtil'
import { API_ROUTES } from './apiRoutes'
import apiService from './apiService'

const api = {
  // 註冊
  register: (data) => apiService.post(API_ROUTES.REGISTER, data),
  // 登入
  login:  (data) =>apiService.post(API_ROUTES.LOGIN, data),
  // 用戶資料
  user: () => apiService.get(API_ROUTES.USER),
  // 查詢個人資料
  findUser: () => apiService.get(API_ROUTES.FINDUSER),
  // 個人資料維護
  updateProfile: (data) => apiService.put(API_ROUTES.PROFILE, data),
  // 登出
  logout: () => apiService.post(API_ROUTES.LOGOUT),
  // 新增產品
  addProduct: (data) => apiService.post(API_ROUTES.PRODUCT_ADD, data),

  // 取得產品列表
  getProducts: () => apiService.get(API_ROUTES.PRODUCT_LIST),

  // 取得產品詳細資料
  getProductById: (id) => apiService.get(API_ROUTES.PRODUCT_DETAIL(id)),
  // 更新產品資料
  updateProduct: (id, data) => apiService.put(API_ROUTES.PRODUCT_UPDATE(id), data),

  // 取得產品管理列表
  getManageProducts: () => apiService.get(API_ROUTES.PRODUCT_MANAGE_LIST),

  // 刪除產品
  deleteProduct: (id) => apiService.put(API_ROUTES.PRODUCT_DELETE(id)),

  // 取得選項列表
  getOptions: () => apiService.get(API_ROUTES.OPTIONS_LIST),
  
  // 新增選項
  addOption: (data) => apiService.post(API_ROUTES.OPTIONS_ADD, data),

  // 更新選項
  updateOption: (id, data) => apiService.put(API_ROUTES.OPTIONS_UPDATE(id), data),

  // 刪除選項
  deleteOption: (id) => apiService.delete(API_ROUTES.OPTIONS_DELETE(id)),

    // 取得選項列表
  getOptionsByListName: (listName) =>
    apiService.get(API_ROUTES.OPTIONS_BY_LISTNAME(), { params: { listName: listName } }),
}

export default api
