import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/userStore'
import { useCartStore } from '@/store/cartStore'
import Storage, { TOKEN_KEY, USER_ROLE_KEY } from '@/utils/storageUtil'
import { showLoading, hideLoading } from '@/utils/loadingService'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首頁' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/users/Login.vue'),
    meta: { title: '登入' },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/users/Register.vue'),
    meta: { title: '註冊' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/About.vue'),
    meta: { title: '關於我們' },
  },
  {
    path: '/news',
    name: 'news',
    component: () => import('@/views/News.vue'),
    meta: { title: '新聞資訊' },
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import('@/views/Setting.vue'),
    meta: { title: '設定' },
  },
  {
    path: '/shoppingguide',
    name: 'shoppingGuide',
    component: () => import('@/views/ShoppingGuide.vue'),
    meta: { title: '購物指南' },
  },
  {
    path: '/qa',
    name: 'qa',
    component: () => import('@/views/QA.vue'),
    meta: { title: '常見問題' },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/users/Profile.vue'),
    meta: { requiresAuth: true, role: ['USER'] },
  },
  {
    path: '/products',
    name: 'overview',
    component: () => import('@/views/products/ProductList.vue'),
    meta: { title: '商品總覽' },
  },
  {
    path: '/products/add',
    name: 'AddProduct',
    component: () => import('@/views/products/AddProduct.vue'),
    meta: { title: '新增商品' },
  },
  {
    path: '/products/manage',
    name: 'productManage',
    component: () => import('@/views/products/ProductManage.vue'),
    meta: {
      title: '商品管理',
      requiresAuth: true,
      role: ['ADMIN', 'USER'],
    },
  },
  {
    path: '/products/edit/:id',
    name: 'editProduct',
    component: () => import('@/views/products/EditProduct.vue'),
    meta: { title: '商品編輯' },
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('@/views/products/ProductDetail.vue'),
    meta: { title: '商品詳情' },
  },
  {
    path: '/settings/options',
    name: 'OptionsManage',
    component: () => import('@/views/settings/OptionsManage.vue'),
    meta: { title: '選項管理', requiresAuth: true, role: ['ADMIN', 'USER'] },
  },
  {
    path: '/doubleeleven/rewards',
    name: 'rewards',
    component: () => import('@/views/doubleeleven/rewards.vue'),
    meta: { title: '年度特選回饋' },
  },
  {
    path: '/doubleeleven/gifts',
    name: 'gifts',
    component: () => import('@/views/doubleeleven/gifts.vue'),
    meta: { title: '滿額加碼驚喜' },
  },
  {
    path: '/event/flashsale',
    name: 'flashSale',
    component: () => import('@/views/event/FlashSale.vue'),
    meta: { title: '本週特惠' },
  },
  {
    path: '/event/luckywheel',
    name: 'luckyWheel',
    component: () => import('@/views/event/LuckyWheel.vue'),
    meta: { title: '活動專區' },
  },
  {
    path: '/crossover/:type',
    name: 'crossover',
    component: () => import('@/views/crossover/CrossoverView.vue'),
    meta: { title: '聯名專區', requiresAuth: false },
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/views/checkout/CheckoutPage.vue'),
    meta: { title: '結帳', requiresAuth: true, role: ['USER', 'ADMIN'] },
    beforeEnter: (to, from, next) => {
      // 檢查「購物車是否有東西」
      const cartStore = useCartStore()

      if (cartStore.cart.length === 0) {
        // 如果購物車是空的，跳轉到商品總覽
        ElMessage.warning('您的購物車是空的，請先挑選商品')
        return next('/products')
      }
      next()
    },
  },
  {
    path: '/checkout/success/:orderId',
    name: 'checkoutSuccess',
    component: () => import('@/views/checkout/CheckoutSuccess.vue'),
    meta: { title: '結帳成功' },
    // 防止直接輸入網址進入結帳成功頁面
    beforeEnter: (to, from, next) => {
      if (from.name === 'checkout') {
        next()
      } else {
        next({ name: 'notFound' })
      }
    },
  },
  {
    path: '/orders/list',
    name: 'orderList',
    component: () => import('@/views/orders/OrderList.vue'),
    meta: { title: '我的訂單', requiresAuth: true, role: ['USER', 'ADMIN'] },
  },
  {
    path: '/orders/detail/:orderId',
    name: 'orderDetail',
    component: () => import('@/views/orders/OrderDetail.vue'),
    meta: { title: '訂單詳情', requiresAuth: true, role: ['USER', 'ADMIN'] },
  },
  {
    path: '/accessDenied',
    name: 'accessDenied',
    component: () => import('@/views/users/AccessDenied.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/views/error/NotFound.vue'),
    meta: { title: '404 - 找不到頁面' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// 路由守衛，權限驗證
router.beforeEach(async (to, from, next) => {
  showLoading()

  const userStore = useUserStore()
  const cartStore = useCartStore()

  const isLoggedIn = userStore.user.isLogin

  // 如果是去登入頁且已經登入，直接回首頁
  if (to.path === '/login' && isLoggedIn) {
    return next('/')
  }

  // 資料同步邏輯
  if ((isLoggedIn && !userStore.user.username) || !userStore.user.fullName) {
    try {
      // 同步使用者資料
      await Promise.all([userStore.fetchUserInfo(), cartStore.fetchCartList()])
    } catch (error) {
      userStore.logout()
      return next('/login')
    } finally {
      hideLoading()
    }
  }

  // 如果 Store 裡有，就用 Store 的；沒有才去抓 Storage 的保底
  const role = userStore.userRole || Storage.get(USER_ROLE_KEY) || Storage.sessionGet(USER_ROLE_KEY)

  // 檢查是否需要登入權限
  if (to.meta.requiresAuth && !isLoggedIn) {
    ElMessage.error('請先登入會員')
    //把當前想去的路徑 (to.fullPath) 傳給登入頁
    return next({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }
  // 如果已登入，檢查角色權限
  if (to.meta.requiresAuth && !to.meta?.role?.includes(role)) {
    return next('/accessDenied')
  }

  next()
})

router.afterEach(() => {
  hideLoading()
})

router.onError(() => {
  hideLoading()
})

export default router
