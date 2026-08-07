import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/userStore'
import { useCartStore } from '@/stores/cartStore'
import Storage, { TOKEN_KEY, USER_ROLE_KEY } from '@/utils/storageUtil'
import { showLoading, hideLoading } from '@/utils/loadingUtil'
import { logger } from '@/utils/loggerUtil'
import { ROLES } from '@/domains/auth/constants/userConstants'

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
    component: () => import('@/domains/auth/views/Login/Login.vue'),
    meta: { title: '登入' },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/domains/auth/views/Register/Register.vue'),
    meta: { title: '註冊' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/About/About.vue'),
    meta: { title: '關於我們' },
  },
  {
    path: '/news',
    name: 'news',
    component: () => import('@/views/News.vue'),
    meta: { title: '最新消息' },
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
    component: () => import('@/views/ShoppingGuide/ShoppingGuide.vue'),
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
    component: () => import('@/domains/auth/views/Profile/Profile.vue'),
    meta: { title: '個人資料', requiresAuth: true, role: [ROLES.USER, ROLES.ADMIN] },
  },
  {
    path: '/products',
    name: 'overview',
    component: () => import('@/domains/product/views/ProductList.vue'),
    meta: { title: '商品總覽' },
  },
  {
    path: '/products/add',
    name: 'addProduct',
    component: () => import('@/domains/product/views/AddProduct.vue'),
    meta: { title: '新增商品', requiresAuth: true, role: [ROLES.USER, ROLES.ADMIN] },
  },
  {
    path: '/products/manage',
    name: 'productManage',
    component: () => import('@/domains/product/views/ProductManage.vue'),
    meta: {
      title: '商品管理',
      requiresAuth: true,
      role: [ROLES.USER, ROLES.ADMIN],
    },
  },
  {
    path: '/products/edit/:id',
    name: 'editProduct',
    component: () => import('@/domains/product/views/EditProduct.vue'),
    meta: { title: '商品編輯', requiresAuth: true, role: [ROLES.USER, ROLES.ADMIN] },
  },
  {
    path: '/product/:id',
    name: 'productDetail',
    component: () => import('@/domains/product/views/ProductDetail.vue'),
    meta: { title: '商品詳情' },
  },
  {
    path: '/settings/options',
    name: 'optionsManage',
    component: () => import('@/domains/system/views/OptionsManage.vue'),
    meta: { title: '選項管理', requiresAuth: true, role: [ROLES.ADMIN] },
  },
  {
    path: '/doubleeleven/rewards',
    name: 'rewards',
    component: () => import('@/domains/marketing/views/Rewards.vue'),
    meta: { title: '年度特選回饋' },
  },
  {
    path: '/doubleeleven/gifts',
    name: 'gifts',
    component: () => import('@/domains/marketing/views/Gifts.vue'),
    meta: { title: '滿額加碼驚喜' },
  },
  {
    path: '/event/flashsale',
    name: 'flashSale',
    component: () => import('@/domains/marketing/views/FlashSale.vue'),
    meta: { title: '本週特惠' },
  },
  {
    path: '/event/luckyslot',
    name: 'luckySlot',
    component: () => import('@/domains/marketing/views/LuckySlot/LuckySlot.vue'),
    meta: { title: '活動專區' },
  },
  {
    path: '/crossover/:type',
    name: 'crossover',
    component: () => import('@/domains/marketing/views/CrossoverView.vue'),
    meta: { title: '聯名專區', requiresAuth: false },
  },
  {
    path: '/brand/:type',
    name: 'brand',
    component: () => import('@/domains/brand/views/BrandsView.vue'),
    meta: { title: '品牌專區', requiresAuth: false },
  },
  {
    path: '/seasonal/featured',
    name: 'seasonalFeatured',
    component: () => import('@/domains/marketing/views/SeasonFeatured.vue'),
    meta: { title: '季節限定' },
  },
  {
    path: '/seasonal/travel',
    name: 'travelPicks',
    component: () => import('@/domains/marketing/views/TravelPicks.vue'),
    meta: { title: '旅遊推薦' },
  },
  {
    path: '/latestNews',
    name: 'latestNews',
    component: () => import('@/views/LatestNews.vue'),
    meta: { title: '最新活動' },
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/domains/checkout/views/CheckoutPage.vue'),
    meta: { title: '結帳', requiresAuth: true, role: [ROLES.USER] },
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
    component: () => import('@/domains/checkout/views/CheckoutSuccess.vue'),
    meta: { title: '結帳成功' },
  },
  {
    path: '/orders/list',
    name: 'orderList',
    component: () => import('@/domains/order/views/OrderList.vue'),
    meta: { title: '我的訂單', requiresAuth: true, role: [ROLES.USER, ROLES.ADMIN] },
  },
  {
    path: '/orders/detail/:orderId',
    name: 'orderDetail',
    component: () => import('@/domains/order/views/OrderDetail.vue'),
    meta: { title: '訂單詳情', requiresAuth: true, role: [ROLES.USER, ROLES.ADMIN] },
  },
  {
    path: '/accessDenied',
    name: 'accessDenied',
    component: () => import('@/domains/auth/views/AccessDenied.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/views/NotFound.vue'),
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
    hideLoading()
    return next('/')
  }

  // 資料同步邏輯
  // 修正：只有在已登入的情況下，且缺少必要資料時才發送 API
  if (isLoggedIn && (!userStore.user?.username || !userStore.user?.fullName)) {
    try {
      // 同步使用者資料
      await Promise.all([userStore.fetchUserInfo(), cartStore.fetchCartList()])
    } catch (error) {
      logger.debug('初始化資料失敗:', error)
    } finally {
      hideLoading()
    }
  }

  // 如果沒有角色，預設是 GUEST
  const role = userStore.userRole || Storage.get(USER_ROLE_KEY) || ROLES.GUEST

  // 檢查是否需要登入權限
  if (to.meta.requiresAuth && !isLoggedIn) {
    ElMessage.error('請先登入會員')
    hideLoading()
    return next({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }

  // 驗證當前角色是否在允許的角色清單中
  if (to.meta.requiresAuth && !to.meta?.role?.includes(role)) {
    hideLoading()
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
